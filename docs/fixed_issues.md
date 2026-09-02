# Fixed Issues — Ride Booking System Frontend

**Date:** 2026-09-02
**Status:** Proposed for review (NOT yet implemented)
**Source:** Findings from `docs/code_review.md`

This document contains all fixes planned in plan-mode, organized by phase. Each fix shows the **current code**, the **proposed replacement**, and any **open questions** the developer must confirm before approval.

---

## Table of Contents

1. [Phase 1 — Critical Issues](#phase-1--critical-issues)
2. [Phase 2 — High Issues](#phase-2--high-issues)
3. [Phase 3 — Medium Issues](#phase-3--medium-issues)
4. [Phase 4 — Low Issues](#phase-4--low-issues)
5. [Execution Order](#execution-order)
6. [Open Questions Before Implementation](#open-questions-before-implementation)

---

## Phase 1 — Critical Issues

### C1. Contacts and police number share the same localStorage key (data corruption)

**File:** `src/lib/safety.ts:8-9`

**Problem:** Both `LS_KEY` and `POLICE_KEY` are `"999"`. Saving contacts overwrites the police number and vice versa — silently corrupting emergency safety data.

**Current code:**
```ts
const LS_KEY = "999";
const POLICE_KEY = "999";
```

**Proposed replacement:**
```ts
const LS_KEY = "safety.contacts";
const POLICE_KEY = "safety.police";
const LEGACY_KEY = "999";

function migrateLegacyKey() {
  try {
    if (!localStorage.getItem(LS_KEY) && localStorage.getItem(LEGACY_KEY)) {
      localStorage.setItem(LS_KEY, localStorage.getItem(LEGACY_KEY)!);
    }
  } catch {
    // ignore migration errors
  }
}

export function loadContacts(): EmergencyContact[] {
  migrateLegacyKey();
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveContacts(contacts: EmergencyContact[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(contacts));
}

export function loadPoliceNumber(): string {
  return localStorage.getItem(POLICE_KEY) || "999"; // change default to your region
}

export function savePoliceNumber(num: string) {
  localStorage.setItem(POLICE_KEY, num);
}
```

**Changes:**
- Distinct keys (`safety.contacts` / `safety.police`).
- Optional one-time migration from legacy `"999"` key (contacts only).

---

### C2. Alert API sends `body` instead of `data` (alert payload silently dropped)

**File:** `src/redux/features/alert/alert.api.ts:10`

**Problem:** The custom `axiosBaseQuery` reads `data`, not `body`. The SOS alert fires a POST with an empty body — the emergency payload (contacts, location, message) never reaches the server.

**Current code:**
```ts
createAlert: builder.mutation({
  query: (data) => ({
    url: "/alerts",
    method: "POST",
    body: data,
  }),
  invalidatesTags: ["ALERT"],
}),
```

**Proposed replacement:**
```ts
createAlert: builder.mutation({
  query: (data) => ({
    url: "/alerts",
    method: "POST",
    data,
  }),
  invalidatesTags: ["ALERT"],
}),
```

**Change:** `body: data` → `data`.

---

### C3. RideDetails crashes on null/undefined ride

**File:** `src/pages/Rider/RideDetails.tsx`

**Problem:** `ride = data?.data` can be `undefined` on error. Lines 64 and 128 access `ride.status` without optional chaining (runtime TypeError), and line 49 produces `Invalid Date`.

**Current code:**
```tsx
const { data, isLoading } = useGetSingleRideQuery(id);
// console.log(data);

if (isLoading) return <p className="text-center">Loading...</p>;
const ride = data?.data;
```

**Proposed replacement:**
```tsx
const { data, isLoading, isError } = useGetSingleRideQuery(id);

if (isLoading) return <p className="text-center">Loading...</p>;
const ride = data?.data;

if (isError || !ride) return <p className="text-center">Ride not found</p>;
```

**Changes:** destructure `isError`; add a not-found guard so `ride` is non-optional. Removes dead `// console.log(data);`.

---

### C4. Missing AbortController support (memory leaks / stale updates)

**File:** `src/redux/axiosBaseQuery.ts`

**Problem:** The custom base query never uses RTK Query's `signal`. Requests complete after a component unmounts, causing `setState` on unmounted components and stale data.

**Current code:**
```ts
const axiosBaseQuery =
  (): BaseQueryFn<{ url; method?; data?; params?; headers? }, unknown, unknown> =>
  async ({ url, method, data, params, headers }) => {
    try {
      const result = await axiosInstance({ url, method, data, params, headers });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      return { error: { status: err.response?.status, data: err.response?.data || err.message } };
    }
  };
```

**Proposed replacement:**
```ts
import { axiosInstance } from "@/lib/axios";
import axios, { type AxiosError, type AxiosRequestConfig } from "axios";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";

type AxiosQueryArgs = {
  url: string;
  method?: AxiosRequestConfig["method"];
  data?: AxiosRequestConfig["data"];
  params?: AxiosRequestConfig["params"];
  headers?: AxiosRequestConfig["headers"];
};

const axiosBaseQuery =
  (): BaseQueryFn<AxiosQueryArgs, unknown, unknown> =>
  async (args, { signal }) => {
    const { url, method, data, params, headers } = args;
    try {
      const result = await axiosInstance({ url, method, data, params, headers, signal });
      return { data: result.data };
    } catch (axiosError) {
      if (axios.isCancel(axiosError)) {
        return { error: { status: "CANCELLED", data: undefined } };
      }
      const err = axiosError as AxiosError;
      return { error: { status: err.response?.status, data: err.response?.data || err.message } };
    }
  };

export default axiosBaseQuery;
```

**Changes:**
- Type the args.
- Pull `signal` from the 2nd base-query arg, pass to axios.
- Handle axios cancellation explicitly.

**⚠ Note:** The JWT refresh interceptor re-issues `originalRequest`, which retains its `signal`; if the user aborts after refresh, the retry aborts too — acceptable.

---

### C5. Axios interceptor crashes on network errors (breaks JWT refresh)

**File:** `src/lib/axios.ts:50-53`

**Problem:** `error.response.status` throws `TypeError` when `error.response` is `undefined` (server unreachable).

**Current code:**
```ts
if (
  error.response.status === 500 &&
  error.response.data.message === "jwt expired" &&
  !originalRequest._retry
) {
```

**Proposed replacement (part of the C5+C8+L3 combined rewrite below):**
```ts
if (
  error.response?.status === 500 &&
  error.response?.data?.message === "jwt expired" &&
  !error.config?._retry
) {
```

---

### C6. WithAuth renders protected UI while loading (flash of protected content)

**File:** `src/utils/WithAuth.tsx`

**Problem:** While `isLoading` is true, none of the guards fire, so `<Component />` (the protected dashboard) renders.

**Current code:**
```tsx
const { data, isLoading } = useUserInfoQuery(undefined);
// console.log("withauth", data);

if(!isLoading && !data?.data?.email) { return <Navigate to="/login" /> }
if(!isLoading && data?.data?.isBlock === "BLOCK") { return <Navigate to="/" /> }
if(requiredRole && !isLoading && requiredRole !== data?.data?.role) { return <Navigate to="/unauthorized" />; }
return <Component />;
```

**Proposed replacement:**
```tsx
const { data, isLoading } = useUserInfoQuery(undefined);

if (isLoading) return null;

if (!data?.data?.email) {
    return <Navigate to="/login" />
}

if (data?.data?.isBlock === "BLOCK") {
    return <Navigate to="/" />
}

if (requiredRole && requiredRole !== data?.data?.role) {
    return <Navigate to="/unauthorized" />;
}
return <Component />;
```

**Changes:** added loading guard; removed now-redundant `!isLoading &&` prefixes; removed dead comment.

---

### C7. `updateRideStatus` never sends the status value

**Files:** `src/redux/features/driver/driver.api.ts:48-54`, `src/pages/driver/UpdateRideStatus.tsx:30-38`

**Problem:** The mutation only sends the ride ID; the new status the driver selects is never sent to the server.

**Current code (API slice):**
```ts
updateRideStatus: builder.mutation({
  query: (id) => ({
    url: `/driver/rides/${id}/status`,
    method: "PATCH",
  }),
  invalidatesTags: ["DRIVER"],
}),
```

**Proposed replacement (API slice):**
```ts
updateRideStatus: builder.mutation({
  query: ({ id, status }) => ({
    url: `/driver/rides/${id}/status`,
    method: "PATCH",
    data: { status },
  }),
  invalidatesTags: ["DRIVER"],
}),
```

**Current code (component):**
```tsx
const handleStatusChange = async (id: string, newStatus: string) => {
  try {
    await updateRideStatus(id).unwrap();
    toast.success(`Ride status updated to ${newStatus}`);
  } catch (error: any) {
    toast.error(error?.data?.message || "Failed to update status");
  }
};
```

**Proposed replacement (component):**
```tsx
const handleStatusChange = async (id: string, newStatus: string) => {
  try {
    await updateRideStatus({ id, status: newStatus }).unwrap();
    toast.success(`Ride status updated to ${newStatus}`);
  } catch (error: any) {
    toast.error(error?.data?.message || "Failed to update status");
  }
};
```

**⚠ Open question:** confirm the backend reads `{ status }` in the PATCH body.

---

### C8. Sensitive console.logs in production

**Problem:** Auth state, register responses, and user data leak to the browser console.

**Proposed changes:**

| File | Line | Change |
|------|------|--------|
| `src/components/modules/AuthForm/RegisterForm.tsx` | 77 | delete `console.log(result);` |
| `src/pages/driver/DriverAvailability.tsx` | 37 | delete `console.log("res", res);` |
| `src/pages/Contact.tsx` | 37 | delete `console.log("Form submitted:", data);` |

Also strip commented-out `console.log` traces opportunistically in: `WithAuth.tsx`, `UpdateRideStatus.tsx`, `RideDetails.tsx`, `SafetySettings.tsx`, `DriverRideHistory.tsx`, `AvailableRides.tsx`, `UpdateDriverProfile.tsx`, `RideHistory.tsx`, `AllRides.tsx`, `AllUsers.tsx`.

---

### Combined rewrite — `src/lib/axios.ts` (C5 + C8 + L3)

```ts
import config from "@/config";
import axios, { type AxiosRequestConfig } from "axios";

export const axiosInstance = axios.create({
  baseURL: config.baseUrl,
  withCredentials: true,
});

let isRefreshing = false;
let pendingQueue: {
  resolve: (value: unknown) => void;
  reject: (value: unknown) => void;
}[] = [];

const processQueue = (error: unknown) => {
  pendingQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(null);
    }
  });

  pendingQueue = [];
};

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (
      error.response?.status === 500 &&
      error.response?.data?.message === "jwt expired" &&
      !error.config?._retry
    ) {
      const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push({ resolve, reject });
        })
          .then(() => axiosInstance(originalRequest))
          .catch((err) => Promise.reject(err));
      }
      isRefreshing = true;
      try {
        await axiosInstance.post("/auth/refresh-token");

        processQueue(null);

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);
```

**Changes vs original:**
- Removed the no-op request interceptor (L3).
- Optional chaining on `error.response` (C5).
- Moved `originalRequest` declaration inside the guarded block (avoids dereferencing `error.config` on network errors).
- Removed `console.log` auth leaks (C8).

---

## Phase 2 — High Issues

### H1. JWT refresh race condition (`isRefreshing` reset too early)

**File:** `src/lib/axios.ts:66-79`

**Problem:** `isRefreshing = false` runs in `finally` before the retried request completes.

**Current code:**
```ts
isRefreshing = true;
try {
  const res = await axiosInstance.post("/auth/refresh-token");
  processQueue(null);
  return axiosInstance(originalRequest);
} catch (error) {
  processQueue(error);
  return Promise.reject(error);
} finally {
  isRefreshing = false;
}
```

**Proposed replacement:**
```ts
isRefreshing = true;
try {
  await axiosInstance.post("/auth/refresh-token");
  processQueue(null);
} catch (refreshError) {
  processQueue(refreshError);
  return Promise.reject(refreshError);
} finally {
  isRefreshing = false;
}
return axiosInstance(originalRequest);
```

**Note:** resets the flag right after the refresh resolves, so a second concurrent refresh of the retried request is handled via the queue instead of a duplicated refresh.

---

### H2. Unsafe `err.data.message` in 7 files

**Problem:** When a request fails with a network error (no response), `err.data` is `undefined` and `.message` throws.

**Files to fix:**
- `src/components/modules/AuthForm/LoginForm.tsx:36`
- `src/components/modules/AuthForm/RegisterForm.tsx:81`
- `src/pages/Auth/ChangePassword.tsx:66`
- `src/pages/Admin/UpdateAdminProfile.tsx:65`
- `src/pages/Rider/UpdateRiderProfile.tsx:64`
- `src/pages/driver/UpdateDriverProfile.tsx:69`
- `src/pages/driver/DriverAvailability.tsx:42`

**Standard replacement:**
```ts
} catch (err: any) {
  toast.error(err?.data?.message || "Something went wrong");
}
```

For `RegisterForm.tsx`, additionally show user-visible feedback (H8):
```ts
} catch (error: any) {
  console.error(error);
  toast.error(error?.data?.message || "Registration failed");
}
```

---

### H3. No `<Suspense>` for lazy routes (crash on first navigation)

**File:** `src/components/layouts/DashboardLayout.tsx`

**Problem:** All dashboard pages load via `React.lazy()` but there's no `<Suspense>` wrapper, causing an uncaught promise on navigation.

**Proposed replacement:**
```tsx
import { Suspense } from "react";
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Outlet } from "react-router"

export default function DashboardLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <Suspense fallback={<p className="text-center text-muted-foreground py-8">Loading...</p>}>
            <Outlet />
          </Suspense>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
```

---

### H4 + H5. Stale form defaults + missing `return` in profile forms

**Files:** `src/pages/Admin/UpdateAdminProfile.tsx`, `src/pages/Rider/UpdateRiderProfile.tsx`, `src/pages/driver/UpdateDriverProfile.tsx`

**Problems:**
- H4: `useForm` captures `defaultValues` at init time; async data loads *after* mount, so fields stay empty.
- H5: The loading guard is a bare expression with no `return`, so the form renders while loading.

**Proposed addition (per profile form, fields vary — show for Admin):**
```tsx
useEffect(() => {
  if (userInfo?.data) {
    form.reset({
      name: userInfo.data.name || "",
      phone: userInfo.data.phone || "",
      address: userInfo.data.address || "",
    });
  }
}, [userInfo]);
```

**Proposed loading guard fix:**
```tsx
if (isLoading) return <p>Loading...</p>;
```

Remove now-unused `defaultValues` (or keep as empty strings; the effect populates them on load).

---

### H6. `<Link>` nested inside `<Button>` without `asChild`

**File:** `src/components/modules/Home/CallToAction.tsx:20-26`

**Problem:** A `<button>` wrapping an `<a>` is invalid HTML.

**Current code:**
```tsx
<Button size="lg" className="...">
  <Car className="mr-2 h-5 w-5" />{" "}
  <Link to="/rider/ride-request">Book a Ride</Link>
</Button>
```

**Proposed replacement:**
```tsx
<Button
  asChild
  size="lg"
  className="bg-white text-blue-600 hover:bg-gray-100 font-semibold dark:bg-blue-500 dark:text-white dark:hover:bg-blue-600"
>
  <Link to="/rider/ride-request">
    <Car className="mr-2 h-5 w-5" /> Book a Ride
  </Link>
</Button>
```

---

### H7. Contact form shows success but sends nothing

**File:** `src/pages/Contact.tsx:36-40`

**Problem:** Users see "Message sent successfully!" but no request is made.

**Current code:**
```tsx
const onSubmit: SubmitHandler<ContactFormValues> = (data) => {
  console.log("Form submitted:", data);
  toast.success("Message sent successfully!");
  form.reset();
};
```

**Recommended replacement (no backend available):**
```tsx
const onSubmit: SubmitHandler<ContactFormValues> = (data) => {
  // TODO: wire to a backend endpoint
  toast.error("Contact form is not yet connected to a backend.");
};
```

**⚠ Open question:** Is there a backend endpoint for contact messages? If yes, we add an RTK mutation instead.

---

### H9. Tag invalidation mismatch (driver actions don't refresh rider/admin views)

**File:** `src/redux/features/driver/driver.api.ts`

**Problem:** Driver mutations only invalidate `"DRIVER"`, so rider and admin ride lists go stale.

**Proposed changes:**
```ts
acceptRide: builder.mutation({
  query: (id) => ({ url: `/driver/rides/${id}/accept`, method: "PATCH" }),
  invalidatesTags: ["DRIVER", "RIDES"],
}),
rejectRide: builder.mutation({
  query: (id) => ({ url: `/driver/rides/${id}/reject`, method: "PATCH" }),
  invalidatesTags: ["DRIVER", "RIDES"],
}),
updateRideStatus: builder.mutation({
  query: ({ id, status }) => ({ url: `/driver/rides/${id}/status`, method: "PATCH", data: { status } }),
  invalidatesTags: ["DRIVER", "RIDES"],
}),
```

**⚠ Open question:** broad `["RIDES"]` invalidation refetches many queries. Ride-ID-scoped tags would be more targeted but require a larger refactor.

---

### H10. Navbar logo uses `<a href="#">` instead of router `<Link>`

**File:** `src/components/modules/Common/Navbar.tsx:108`

**Current code:**
```tsx
<a href="#" className="text-primary hover:text-primary/90">
  <Logo />
</a>
```

**Proposed replacement:**
```tsx
<Link to="/" className="text-primary hover:text-primary/90">
  <Logo />
</Link>
```

---

## Phase 3 — Medium Issues

| # | Description | File(s) | Proposed change |
|---|-------------|---------|-----------------|
| M1 | Double `form.reset()` clears form on failure | `RideRequestForm.tsx`, `ApplyDriver.tsx`, `SafetySettings.tsx` | Remove the trailing unconditional `form.reset()`; keep only inside the `success` branch. |
| M2 | No env fallback | `src/config/index.ts:2` | `baseUrl: import.meta.env.VITE_BASE_URL \|\| "https://ride-booking-system-backend.vercel.app/api"` |
| M3 | `SafetySettings` crashes on empty list | `SafetySettings.tsx:99` | `contacts.data?.[0]?.contacts?.map(...)` + fix empty-state check to `contacts.data?.[0]?.contacts?.length`. |
| M4 | Wrong validation messages | `SafetySettings.tsx:121,135` | "Name is required", "Phone is required". |
| M5 | "Login with Google" on register page | `RegisterForm.tsx:183` | → "Register with Google". Also recommend a dedicated `VITE_GOOGLE_AUTH_URL` env var for OAuth links. |
| M6 | Repeated wrong `sr-only` FormDescription | `RegisterForm.tsx`, `ChangePassword.tsx` | Remove the repeated identical descriptions. |
| M7 | `aria-controls="password"` mismatched | `src/components/ui/Password.tsx:28` | `aria-controls={id}`. |
| M8 | `String.replace` only replaces first `_` | `RidesFilter.tsx:112`, `AvailableRides.tsx:102`, `AllRides.tsx:84` | `.replaceAll("_", " ")`. |
| M9 | `colSpan` count mismatch | `RideHistory.tsx:159`, `AvailableRides.tsx:132` | `colSpan={7}` (tables have 7 columns). |
| M10 | Redundant `as TRole` casts | `routes.tsx:34,45,60`, `role.ts` | Add `as const` to `role.ts`; drop `as TRole`. |
| M11 | WithAuth no error-state distinction | `WithAuth.tsx` | Read `isError` from the query; redirect to login only on 401, stay/retry on network error. |
| M12 | Client-side filtering of all data | `AllUsers.tsx`, `RideHistory.tsx`, `DriverRideHistory.tsx` | Move to server-side query params (recommend as follow-up, larger change). |

---

## Phase 4 — Low Issues

| # | Description | File(s) | Proposed change |
|---|-------------|---------|-----------------|
| L1 | Dead commented-out code | `adminSidebarItems.tsx:2-8`, `riderSidebarItems.tsx:11-15`, `driverSidebarItems.tsx:12-18`, `auth.api.ts:10,25`, `SOSButton.tsx:78-100` | Delete commented blocks. |
| L2 | `any` types + blanket eslint-disable | ~15 files | Replace with proper response interfaces; remove blanket disables incrementally. |
| L3 | No-op axios request interceptor | `lib/axios.ts:10-19` | Removed in the C5 combined rewrite. |
| L4 | No logout redirect | `Navbar.tsx:42-45` | After `dispatch(authApi.util.resetApiState())`, call `navigate("/login")`. |
| L5 | No refetch-on-focus/reconnect | `baseApi.ts` / query endpoints | Add `refetchOnFocus: true, refetchOnReconnect: true` to ride/availability queries. |
| L8 | Dead guard in theme-provider | `theme-provider.tsx:70` | Optional — leave as-is to avoid churn, or change context default to `null`. |
| L9 | Hardcoded `{lat:0,lng:0}` coordinates | `RideRequestForm.tsx:45,49` | Use `getCurrentPosition()` from `lib/safety.ts` to fill real coordinates. |
| L10 | Spinning-text loading indicators | `AvailableRides.tsx:36`, `AllRides.tsx:40` | Replace with `Loader2`/`Loader` icons. |

---

## Execution Order

1. **Files with multiple batched fixes:** `lib/axios.ts` (C5+C8+L3, then H1 separately), `axiosBaseQuery.ts` (C4), `safety.ts` (C1), `WithAuth.tsx` (C6+M11), `driver.api.ts` (C7+H9).
2. **Safety/alert one-liners:** `alert.api.ts` (C2), `SafetySettings.tsx` (M3, M4).
3. **Page-level fixes:** `RideDetails.tsx` (C3), profile forms (H4+H5), `CallToAction.tsx` (H6), `RegisterForm.tsx` (H8), `Navbar.tsx` (H10), M1.
4. **Low-hanging L items:** L1, L3, L4, L5, L9, L10.
5. **Verify:** `bun run build` (runs `tsc -b && vite build`) and `bun run lint` after each batch.

---

## Open Questions Before Implementation

1. **C7 / H9 backend contract:** Does `PUT/PATCH /driver/rides/:id/status` expect the new status in the body as `{ status }`?
2. **H7 Contact form:** No backend available — connect to a new endpoint, or show "not yet available"?
3. **H9 tag scope:** OK with broad `["RIDES"]` invalidation, or prefer ride-ID-scoped tags (larger refactor)?

---

*Nothing in this document has been applied to the codebase yet. Awaiting developer review and approval.*
