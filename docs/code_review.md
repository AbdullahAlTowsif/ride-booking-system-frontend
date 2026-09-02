# Code Review Report — Ride Booking System Frontend

**Date:** 2026-09-02
**Scope:** Full project review of `ride-booking-system-frontend`

---

## Summary

| Severity | Count | Description |
|----------|-------|-------------|
| **Critical** | 8 | Data corruption, crashes, security, broken features |
| **High** | 10 | Race conditions, broken UX, invalid HTML, stale state |
| **Medium** | 12 | Anti-patterns, unsafe error handling, accessibility, copy-paste bugs |
| **Low** | 10 | Dead code, console.logs, inconsistent naming, polish |

---

## Critical Issues

### C1. Contacts and police number share the same localStorage key — data corruption
**File:** `src/lib/safety.ts:8-9`

```ts
const LS_KEY = "999";
const POLICE_KEY = "999";
```

Both `loadContacts()` (stored under `LS_KEY`) and `loadPoliceNumber()` (stored under `POLICE_KEY`) use **the same key `"999"`**. Saving contacts overwrites the police number, and vice versa. This silently corrupts emergency safety data — the most critical data in the app.

**Fix:** Use distinct keys, e.g. `"safety.contacts"` and `"safety.police"`.

---

### C2. Alert mutation sends `body` instead of `data` — alert payload silently dropped
**File:** `src/redux/features/alert/alert.api.ts:10`

```ts
createAlert: builder.mutation({
  query: (data) => ({
    url: "/alerts",
    method: "POST",
    body: data,   // WRONG: axiosBaseQuery reads `data`, not `body`
  }),
```

The custom `axiosBaseQuery` (in `src/redux/axiosBaseQuery.ts`) only reads `data`. `body` is a `fetchBaseQuery` concept. The SOS "Share Live Location" feature sends a POST with **no body** — emergency alerts never reach the server with the contact/location payload.

**Fix:** Change `body: data` to `data`.

---

### C3. Rides render with no loading/error handling and null-crash in RideDetails
**File:** `src/pages/Rider/RideDetails.tsx:49,64,128`

```tsx
{new Date(ride?.createdAt).toLocaleString()}   // "Invalid Date" if ride is undefined
{ride.status === "ACCEPTED" ? ...}             // CRASH if ride is undefined
ride.status !== "COMPLETED"                    // CRASH if ride is undefined
```

`ride = data?.data` can be `undefined` when the query errors or returns empty. Lines 64 and 128 access `ride.status` **without optional chaining**, causing a runtime TypeError that crashes the entire ride detail page.

**Fix:** Guard with `if (!ride) return <p>Ride not found</p>;` after the loading check.

---

### C4. Missing AbortController support — memory leaks and stale state updates
**File:** `src/redux/axiosBaseQuery.ts`

The custom base query never uses RTK Query's `signal` (AbortController). RTK Query automatically passes a signal to cancel in-flight requests when a component unmounts. Without it, requests complete after the component is gone, causing `setState` on unmounted components, memory leaks, and stale data races.

**Fix:** Accept `signal` from the `queryFn` args, pass it to axios, and set up abort listeners.

---

### C5. Axios interceptor crashes on network errors — breaks JWT refresh
**File:** `src/lib/axios.ts:50-53`

```ts
if (
  error.response.status === 500 &&      // <-- error.response can be undefined
  error.response.data.message === "jwt expired" && ...
```

When the server is unreachable, `error.response` is `undefined`, and `.status` throws `TypeError`. This crashes the *entire response interceptor* — meaning **no request error returns cleanly** in network-failure scenarios.

**Fix:** Add optional chaining: `error.response?.status === 500 && error.response?.data?.message === ...`

---

### C6. `WithAuth` renders protected content during loading — flash of protected UI
**File:** `src/utils/WithAuth.tsx:11-22`

```tsx
if(!isLoading && !data?.data?.email) { return <Navigate to="/login" /> }
...
return <Component />;   // Fires when isLoading === true!
```

While `isLoading` is true, none of the guards trigger, so `<Component />` (the protected dashboard) renders. An unauthenticated user briefly sees the dashboard with a flash before being redirected. Dashboard layout and sidebar make API calls before auth is confirmed.

**Fix:** `if (isLoading) return <LoadingSpinner />;` before the guards.

---

### C7. `updateRideStatus` never sends the status value — status changes silently ignored
**File:** `src/redux/features/driver/driver.api.ts:48-54` and `src/pages/driver/UpdateRideStatus.tsx:30-32`

```ts
// API slice:
updateRideStatus: builder.mutation({
  query: (id) => ({
    url: `/driver/rides/${id}/status`,
    method: "PATCH",          // no status in body!
  }),
```

```tsx
// Component:
const handleStatusChange = async (id: string, newStatus: string) => {
  await updateRideStatus(id).unwrap();   // newStatus is never passed
```

The `newStatus` parameter (e.g. `"COMPLETED"`, `"CANCELLED"`) is never sent to the API. The PATCH request has an empty body. The driver selects a new status, gets a toast "updated successfully", but the status never changes server-side.

**Fix:** Change the mutation to accept `{ id, status }` and pass `data: { status }`.

---

### C8. `console.log` leaks auth state and sensitive data in production
**Files:**
- `src/lib/axios.ts:55,69` — `console.log("Your token is expired")`, `console.log("New token arrived", res)` — leaks auth state/timing.
- `src/components/modules/AuthForm/RegisterForm.tsx:77` — `console.log(result)` — logs full register response (potentially user data).
- `src/pages/driver/DriverAvailability.tsx:37` — `console.log("res", res)`.
- `src/pages/Contact.tsx:37` — `console.log("Form submitted:", data)` — logs user contact data.
- Various commented-out `console.log` traces in `WithAuth.tsx:9`, `UpdateRideStatus.tsx:25`, `RideDetails.tsx:12`, `SafetySettings.tsx:42`, etc.

---

## High Issues

### H1. JWT refresh race condition — `isRefreshing` reset too early
**File:** `src/lib/axios.ts:66-79`

```ts
isRefreshing = true;
try {
  const res = await axiosInstance.post("/auth/refresh-token");
  processQueue(null);
  return axiosInstance(originalRequest);  // still in-flight
} finally {
  isRefreshing = false;   // runs BEFORE the retried request completes
}
```

If the retried request triggers another 401/500+jwt-expired, a second refresh starts while the first is still processing. The queue-and-refresh mechanism should track the full lifecycle of the retry, not just the refresh call.

### H2. No null-check on error response in multiple toast handlers — component crash
**Files (all use the same unsafe pattern):**
- `src/components/modules/AuthForm/LoginForm.tsx:36` — `toast.error(err.data.message)`
- `src/components/modules/AuthForm/RegisterForm.tsx:80-82` — `console.error(error.data.message)`
- `src/pages/Auth/ChangePassword.tsx:66` — `toast.error(err.data.message)`
- `src/pages/Admin/UpdateAdminProfile.tsx:65` — `toast.error(err.data.message)`
- `src/pages/Rider/UpdateRiderProfile.tsx:64` — `toast.error(err.data.message)`
- `src/pages/driver/UpdateDriverProfile.tsx:69` — `toast.error(err.data.message)`
- `src/pages/driver/DriverAvailability.tsx:42` — `toast.error(error.data.message)`

When a request fails with a network error (no response), `err.data` is `undefined`, and `.message` throws `TypeError`. These should all use `err?.data?.message || "Something went wrong"`.

### H3. Lazy-loaded routes have no `<Suspense>` boundary — runtime crash on first navigation
**Files:** `src/routes/routes.tsx`, `src/utils/generateSidebarRoutes.ts`

All dashboard pages are loaded with `React.lazy()`. The routes generated by `generateSidebarRoutes()` render `Component` directly with no `<Suspense fallback>` wrapper. In react-router v7, rendering a lazy component without Suspense throws an uncaught promise error on navigation. **Every lazy dashboard page will crash on first load.**

**Fix:** Wrap children in `<Suspense fallback={<LoadingSpinner />}>` in `DashboardLayout` or `generateSidebarRoutes`.

### H4. Stale `defaultValues` in profile update forms — empty fields shown even after data loads
**Files:** `src/pages/Admin/UpdateAdminProfile.tsx:38-45`, `src/pages/Rider/UpdateRiderProfile.tsx:38-44`, `src/pages/driver/UpdateDriverProfile.tsx:44-53`

```ts
const form = useForm({
  defaultValues: {
    name: userInfo?.data?.name || "",   // userInfo is undefined on first render
  },
});
```

React Hook Form captures `defaultValues` only at initialization. Since `useUserInfoQuery` resolves asynchronously *after* mount, the form always has empty defaults. Users see blank fields, and the "Loading..." guard doesn't return (see H5).

**Fix:** Use `useEffect` + `form.reset()` when data arrives, or react-hook-form's `values` prop.

### H5. Missing `return` in loading guard — form flashes with empty fields
**Files:** `src/pages/Admin/UpdateAdminProfile.tsx:70-72`, `src/pages/Rider/UpdateRiderProfile.tsx:69-71`, `src/pages/driver/UpdateDriverProfile.tsx:74-76`

```tsx
if (isLoading) {
    <p>Loading...</p>;   // bare expression — does nothing
}
```

No `return` — the form still renders while data is loading. Combined with H4, users see an empty form flash.

### H6. `<Link>` nested inside `<Button>` without `asChild` — invalid nested interactive HTML
**File:** `src/components/modules/Home/CallToAction.tsx:20-26`

```tsx
<Button ...>
  <Link to="/rider/ride-request">Book a Ride</Link>
</Button>
```

A `<button>` wrapping an `<a>` is invalid HTML and can trigger double-firing events, browser warnings, and inconsistencies. Should be `<Button asChild><Link>...</Link></Button>` (as correctly done in `LoginForm.tsx:100-108`).

### H7. Contact form shows success but sends nothing
**File:** `src/pages/Contact.tsx:36-40`

```tsx
const onSubmit = (data) => {
  console.log("Form submitted:", data);
  toast.success("Message sent successfully!");   // LIES to the user
  form.reset();
};
```

The contact form only logs to console. Users see "Message sent successfully!" but the message never reaches anyone. Either connect to a backend API or remove the success toast.

### H8. RegisterForm error handling gives no user feedback
**File:** `src/components/modules/AuthForm/RegisterForm.tsx:80-82`

```tsx
} catch (error: any) {
  console.error(error.data.message);   // No toast — user sees nothing
}
```

On registration failure, the only indication is a console message. The user's form stays identical with no feedback. Also `error.data.message` crashes on network errors (see H2).

### H9. Tag invalidation mismatch — driver ride updates don't refresh rider/admin views
**Files:** `src/redux/features/driver/driver.api.ts`, `src/redux/features/rider/rider.api.ts`, `src/redux/features/admin/admin.api.ts`

- `acceptRide`, `rejectRide`, `updateRideStatus` (driver) invalidate `"DRIVER"` only.
- `getMyRides` (rider, provides `"RIDES"`) and `getAllRides` (admin, provides `"RIDES"`) are **not** invalidated by driver actions.
- When a driver accepts/rejects/updates a ride, the rider's ride list and admin's ride list show stale data until manual refresh.

### H10. Navbar logo uses `<a href="#">` instead of router `<Link>`, breaks SPA navigation
**File:** `src/components/modules/Common/Navbar.tsx:108`

```tsx
<a href="#" className="text-primary hover:text-primary/90">
  <Logo />
</a>
```

Clicked logo triggers a full page reload instead of SPA navigation, scrolling to top and losing app state. The sidebar version (line 30 in `app-sidebar.tsx`) correctly uses `<Link to="/">`.

---

## Medium Issues

### M1. Double `form.reset()` — form cleared on failure
**Files:** `src/pages/Rider/RideRequestForm.tsx:59,63`, `src/pages/Rider/ApplyDriver.tsx:50,54`, `src/components/safety/SafetySettings.tsx:64,68`

```tsx
if (res.success) {
  toast.success("...");
  form.reset();        // First reset
} else { ... }
form.reset();          // Runs unconditionally — clears on error too
```

On failed requests, the form is still cleared, forcing users to retype everything.

### M2. `config/baseUrl` has no fallback — silent failure if env var missing
**File:** `src/config/index.ts:2`

```ts
baseUrl: import.meta.env.VITE_BASE_URL,   // undefined if not set
```

Axios receives `undefined` as baseURL and makes requests to relative URLs, producing confusing `404`/`ERR_NAME_NOT_RESOLVED` errors.

### M3. `SafetySettings` crashes on empty contact list
**File:** `src/components/safety/SafetySettings.tsx:88-99`

```tsx
] : (
  <Table>...</Table>   // When contacts array is EMPTY, but ...
    {contacts.data?.[0].contacts.map((c: any) => ...)}
```

The `contacts.length === 0` check (line 88) is on `contacts` (the query result object), not on `contacts.data?.[0].contacts`. If the API returns an empty structure, `contacts.data?.[0]` is `undefined` and `.contacts` throws. The check doesn't match what it's guarding.

### M4. Wrong validation messages — copy-paste from the ride form
**File:** `src/components/safety/SafetySettings.tsx:121,135`

```tsx
rules={{ required: "Pickup location is required" }}   // for the "name" field
rules={{ required: "Destination location is required" }}  // for the "phone" field
```

Error messages come from a ride form, not a safety form. Should say "Name is required" and "Phone is required".

### M5. "Login with Google" shown on register page
**File:** `src/components/modules/AuthForm/RegisterForm.tsx:183`

Should say "Register with Google" since this is the registration form.

### M6. Copy-paste `FormDescription` on every field — incorrect for screen readers
**Files:** `src/components/modules/AuthForm/RegisterForm.tsx:106-108,126-128,142-144,158-160`, `src/pages/Auth/ChangePassword.tsx:94-96,110-112`

Every field (name, email, password, confirmPassword, oldPassword, newPassword) has the same `sr-only` description: "This is your public display name." Screen readers announce wrong info.

### M7. `aria-controls="password"` doesn't match the dynamic input `id`
**File:** `src/components/ui/Password.tsx:28`

```tsx
const id = useId()          // dynamic id
<Input id={id} ... />
<button aria-controls="password" ...>   // hardcoded — broken ARIA
```

Should be `aria-controls={id}`.

### M8. `String.replace` only replaces first underscore in status labels
**Files:** `src/components/modules/Admin/RidesFilter.tsx:112`, `src/pages/driver/AvailableRides.tsx:102`, `src/pages/Admin/AllRides.tsx:84`

```tsx
{ride.status.replace("_", " ")}
```

For statuses like `"IN_TRANSIT"` this works (only one underscore), but it fails for multi-underscore strings. Should use `.replaceAll("_", " ")` or `replace(/_/g, " ")`.

### M9. `colSpan` count mismatch in empty-state rows
**Files:**
- `src/pages/Rider/RideHistory.tsx:159` — `colSpan={6}` but table has **7** columns
- `src/pages/driver/AvailableRides.tsx:132` — `colSpan={5}` but table has **7** columns

Empty-state "No rides found" rows don't span the full table width.

### M10. Redundant `as TRole` cast in routes
**File:** `src/routes/routes.tsx:34,45,60`

```tsx
withAuth(DashboardLayout, role.ADMIN as TRole)
```

Since `role.ADMIN = "ADMIN"`, the cast is unnecessary. Adding `as const` to `src/constants/role.ts` would make the type precise and remove the need for the cast.

### M11. `Anonymous user` access to whole dashboard — poor error state in WithAuth
**File:** `src/utils/WithAuth.tsx:8`

`useUserInfoQuery` errors (e.g., network failure) are silently treated as "not logged in", redirecting to `/login`. Distinguish "not authenticated" (401) from "network error" (redirect vs. retry).

### M12. Client-side filtering of all data — performance and correctness risk
**Files:** `src/pages/Admin/AllUsers.tsx:47`, `src/pages/Rider/RideHistory.tsx:58`, `src/pages/driver/DriverRideHistory.tsx:58`

All data is fetched unconditionally (or with `limit: 1000`), then filtered in the browser. For large datasets this is slow and uses excessive bandwidth. Should move filtering to server-side query params.

---

## Low Issues

### L1. Dead commented-out code
- `src/routes/adminSidebarItems.tsx:2-8`, `src/routes/riderSidebarItems.tsx:11-15`, `src/routes/driverSidebarItems.tsx:12-18` — commented-out imports.
- `src/redux/features/auth/auth.api.ts:10,25` — commented-out `body` from `fetchBaseQuery` era.
- `src/components/safety/SOSButton.tsx:78-100` — large commented-out `onNotifyContact` function.

### L2. `any` types and blanket eslint-disable
Over 10 files disable `@typescript-eslint/no-explicit-any`. This hides type errors. Files include `AllUsers.tsx`, `AllRides.tsx`, `ApproveSuspendDriver.tsx`, `BlockUnblockRiders.tsx`, `RideRequestForm.tsx`, `ApplyDriver.tsx`, `UpdateRiderProfile.tsx`, `AvailableRides.tsx`, `UpdateRideStatus.tsx`, `EarningsDashboard.tsx`, `UpdateDriverProfile.tsx`, `SafetySettings.tsx`, `SOSButton.tsx`, `RegisterForm.tsx`, `RidesFilter.tsx`.

### L3. No-op axios request interceptor
**File:** `src/lib/axios.ts:10-19` — does nothing. Remove it.

### L4. No logout redirect after cache reset
**File:** `src/components/modules/Common/Navbar.tsx:42-45`

After logout, the user stays on the current page. Should navigate to `/login` or `/`.

### L5. `Relative pricing` no periodic `refetchOnReconnect` / `refetchOnFocus` config
`setupListeners` is present (good), but no query/refetch policies are configured on individual endpoints. Consider `refetchOnFocus`/`refetchOnReconnect` for real-time ride data.

### L6. `Features.tsx` and `AboutUs.tsx`/`Contact.tsx` render their own `<Navbar>`
These pages are routed through `CommonLayout` (which already renders `<Navbar>`), but `AboutUs.tsx:31` and `Contact.tsx:44` also render Navbar, resulting in **duplicate navbars**.

Wait — looking closer: `AboutUs`, `Contact`, `Features` are all children of the `App` route which wraps in `CommonLayout`. However `App.tsx` doesn't actually use `Outlet` inside the DashboardLayout path — it's a separate route branch. Let me verify: routes for `/about`, `/features`, `/contact` are top-level routes NOT wrapped by `CommonLayout`. They render `Navbar` themselves. So this is actually fine — the duplication is not present since these pages only render their own Navbar. **Not a bug.**

### L7. `colSpan={6}` in DriverRideHistory empty state
**File:** `src/pages/driver/DriverRideHistory.tsx:151` — table has 6 columns, `colSpan={6}` is correct here. Not a bug.

### L8. Theme provider dead guard
**File:** `src/components/theme-provider.tsx:70` — `context === undefined` can never be true since the context has a default value. Dead code.

### L9. `RideRequestForm` fake coordinates
**File:** `src/pages/Rider/RideRequestForm.tsx:45,49` — sends `{ lat: 0, lng: 0 }` hardcoded coordinates. Real geolocation should be captured.

### L10. `AvailableRides` loading indicator renders as spinning text
**File:** `src/pages/driver/AvailableRides.tsx:36` — `<span className="animate-spin text-primary">Loading...</span>` — text won't visually spin. Same in `AllRides.tsx:40`.

---

## Positive Findings

- **Redux Toolkit + RTK Query** is well-structured with proper tag types and `setupListeners`.
- **Safety features** (`SOSButton`, `SafetySettings`, `safety.ts`) are thoughtfully designed (deep links to call/sms/whatsapp/email, geolocation, alert message building).
- **shadcn/ui** components are used extensively and consistently with `new-york` style.
- **Theme provider** with system/light/dark is clean.
- **Recharts** usage in `EarningsDashboard` renders responsively with `ResponsiveContainer`.
- **Zone-based routing** with sidebar items generates routes cleanly.
- **Axios interceptor** attempts JWT refresh with queue-based dedup — a solid pattern (despite the edge-case bugs).

---

## Recommended Fix Priority

| Priority | Issue | Effort |
|----------|-------|--------|
| 1 | C1: localStorage key collision | 5 min |
| 2 | C2: `body` -> `data` in alert API | 1 min |
| 3 | C3: Guard `RideDetails` against null ride | 5 min |
| 4 | C5: Axios null-check on `error.response` | 5 min |
| 5 | C6: Add loading guard in `WithAuth` | 2 min |
| 6 | C7: Send status to `updateRideStatus` | 5 min |
| 7 | H3: Add `<Suspense>` for lazy routes | 10 min |
| 8 | H5: Add `return` in loading guards (3 files) | 3 min |
| 9 | H2: Fix unsafe `err.data.message` (7 files) | 10 min |
| 10 | C4: Add AbortController support | 15 min |
| 11 | H4: Fix stale form defaults (3 files) | 15 min |

---

## Conclusion

The project is a well-structured ride-booking SPA with solid architectural choices (RTK Query, shadcn/ui, React Router v7). However, it shows signs of rapid development with minimal review: **8 critical bugs**, several affecting the emergency safety system (C1, C2) and core ride operations (C7), plus the JWT refresh and lazy-loading issues that can crash the app on network failures and first navigation.

The highest-value fixes are the 30-minutes-of-work items in priority 1-6 above, which address data corruption, emergency alert failures, crashes, and the auth flash-of-content issue.
