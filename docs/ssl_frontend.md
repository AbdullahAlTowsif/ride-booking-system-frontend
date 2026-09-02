# SSLCommerz Payment Integration — Frontend Implementation Plan

> **Spec file:** `.opencode/specs/01-sslcommerz-payment.md`
> **Branch:** `feature/sslcommerz-payment`
> **Backend reference:** `docs/backend_review_1.md` (§10 SSLCommerz payment integration, §11.3 Payment lifecycle)

---

## Summary

Integrate the existing backend SSLCommerz payment system into the frontend. The backend has fully implemented payment session initiation, IPN handling, signature verification, validation, and settlement. The frontend needs:

1. RTK Query endpoints for payment API calls
2. Reusable payment components (status badge, pay button)
3. Payment initiation flow from ride details
4. SSLCommerz redirect callback pages (success/fail/cancel)
5. Rider payment history page
6. Route registration and sidebar navigation

**No backend changes required.** No new npm dependencies.

---

## Files Overview

| # | Action | File |
|---|--------|------|
| 1 | Create | `src/types/payment.types.ts` |
| 2 | Modify | `src/redux/baseApi.ts` |
| 3 | Create | `src/redux/features/payment/payment.api.ts` |
| 4 | Create | `src/components/modules/Payment/PaymentStatusBadge.tsx` |
| 5 | Create | `src/components/modules/Payment/PayNowButton.tsx` |
| 6 | Modify | `src/pages/Rider/RideDetails.tsx` |
| 7 | Create | `src/pages/Payment/PaymentSuccess.tsx` |
| 8 | Create | `src/pages/Payment/PaymentFail.tsx` |
| 9 | Create | `src/pages/Payment/PaymentCancel.tsx` |
| 10 | Create | `src/pages/Rider/PaymentHistory.tsx` |
| 11 | Modify | `src/routes/riderSidebarItems.tsx` |
| 12 | Modify | `src/routes/routes.tsx` |

**Total:** 7 new files, 4 modified files.

---

## Step 1 — Create Payment Types

**File:** `src/types/payment.types.ts` (new)

Define TypeScript types matching the backend data models. Use `import type` where needed per `verbatimModuleSyntax`.

```typescript
export type PaymentStatus =
  | "INITIATED"
  | "PENDING"
  | "VALID"
  | "FAILED"
  | "CANCELLED"
  | "EXPIRED"
  | "REFUNDED";

export interface IPayment {
  _id: string;
  rider: string;
  ride: string;
  driver: string;
  amount: number;
  currency: "BDT";
  tranId: string;
  valId?: string;
  status: PaymentStatus;
  paidAt?: string;
  ipnReceivedAt?: string;
  verifiedAt?: string;
  raw?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface IPaymentStatusResponse {
  status: PaymentStatus;
  amount: number;
  tranId: string;
  paidAt?: string;
}

export interface IPaymentInitiateResponse {
  gatewayUrl: string;
  tranId: string;
  paymentId: string;
}
```

### Why

All payment-related files need shared type definitions. Placing them in `src/types/` follows the existing convention (`src/types/index.types.ts`).

---

## Step 2 — Add PAYMENT Tag to baseApi

**File:** `src/redux/baseApi.ts` (modify)

Add `"PAYMENT"` to the `tagTypes` array:

```diff
- tagTypes: ["USER", "RIDES", "REPORT", "DRIVER", "ALERT", "SAFETY"],
+ tagTypes: ["USER", "RIDES", "REPORT", "DRIVER", "ALERT", "SAFETY", "PAYMENT"],
```

### Why

Payment queries/mutations need a dedicated tag for cache invalidation. When a payment is initiated, we invalidate `PAYMENT` to refetch payment data. This follows the existing pattern where each domain has its own tag (`USER`, `RIDES`, `DRIVER`, etc.).

---

## Step 3 — Create Payment API Slice

**File:** `src/redux/features/payment/payment.api.ts` (new)

Inject endpoints into the existing `baseApi` following the exact pattern from `rider.api.ts` and `driver.api.ts`.

```typescript
import { baseApi } from "@/redux/baseApi";

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    initiatePayment: builder.mutation({
      query: (rideId: string) => ({
        url: "/payments/initiate",
        method: "POST",
        data: { rideId },
      }),
      invalidatesTags: ["PAYMENT", "RIDES"],
    }),
    getPaymentStatus: builder.query({
      query: (rideId: string) => ({
        url: `/payments/${rideId}/status`,
        method: "GET",
      }),
      providesTags: ["PAYMENT"],
    }),
    getPaymentHistory: builder.query({
      query: () => ({
        url: "/payments/me",
        method: "GET",
      }),
      providesTags: ["PAYMENT"],
    }),
  }),
});

export const {
  useInitiatePaymentMutation,
  useGetPaymentStatusQuery,
  useGetPaymentHistoryQuery,
} = paymentApi;
```

### API Contract Verification

All three endpoints are verified from `docs/backend_review_1.md`:

| Endpoint | Method | Auth | Request | Response |
|----------|--------|------|---------|----------|
| `/payments/initiate` | POST | RIDER | `{ rideId }` | `{ gatewayUrl, tranId, paymentId }` |
| `/payments/:rideId/status` | GET | RIDER (owner) / ADMIN | — | `{ status, amount, tranId, paidAt }` |
| `/payments/me` | GET | RIDER | — | `IPayment[]` |

### Why

- `initiatePayment` invalidates both `PAYMENT` and `RIDES` because payment initiation changes ride payment state
- `getPaymentStatus` and `getPaymentHistory` provide `PAYMENT` tag for cache consistency
- Follows existing pattern: `baseApi.injectEndpoints()` with `builder.mutation` / `builder.query`

---

## Step 4 — Create Reusable Components

### 4a. PaymentStatusBadge

**File:** `src/components/modules/Payment/PaymentStatusBadge.tsx` (new)

Wraps the existing `Badge` component from `@/components/ui/badge`.

```typescript
import { Badge } from "@/components/ui/badge";
import type { PaymentStatus } from "@/types/payment.types";

const statusConfig: Record<
  PaymentStatus,
  { label: string; className: string }
> = {
  VALID: { label: "Paid", className: "bg-green-100 text-green-800 border-green-200" },
  PENDING: { label: "Pending", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  INITIATED: { label: "Initiated", className: "bg-blue-100 text-blue-800 border-blue-200" },
  FAILED: { label: "Failed", className: "bg-red-100 text-red-800 border-red-200" },
  CANCELLED: { label: "Cancelled", className: "bg-red-100 text-red-800 border-red-200" },
  EXPIRED: { label: "Expired", className: "bg-gray-100 text-gray-800 border-gray-200" },
  REFUNDED: { label: "Refunded", className: "bg-purple-100 text-purple-800 border-purple-200" },
};

export default function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const config = statusConfig[status];
  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
}
```

### 4b. PayNowButton

**File:** `src/components/modules/Payment/PayNowButton.tsx` (new)

A self-contained button that handles the full payment initiation flow.

```typescript
import { Button } from "@/components/ui/button";
import { CreditCard, Loader2 } from "lucide-react";
import { useInitiatePaymentMutation } from "@/redux/features/payment/payment.api";
import { toast } from "react-hot-toast";

interface PayNowButtonProps {
  rideId: string;
  isPaid: boolean;
  rideStatus: string;
}

export default function PayNowButton({ rideId, isPaid, rideStatus }: PayNowButtonProps) {
  const [initiatePayment, { isLoading }] = useInitiatePaymentMutation();

  const isDisabled = rideStatus !== "COMPLETED" || isPaid || isLoading;

  const handlePay = async () => {
    try {
      const res = await initiatePayment(rideId).unwrap();
      window.location.href = res.data.gatewayUrl;
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to initiate payment");
    }
  };

  return (
    <Button
      onClick={handlePay}
      disabled={isDisabled}
      className="w-full"
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <CreditCard className="mr-2 h-4 w-4" />
      )}
      {isLoading ? "Initiating Payment..." : "Pay Now"}
    </Button>
  );
}
```

### Why

- `PaymentStatusBadge` is reused in both RideDetails and PaymentHistory pages
- `PayNowButton` encapsulates the full initiate + redirect flow so RideDetails stays clean
- Both follow existing component patterns (functional, props-based, using existing UI primitives)

---

## Step 5 — Modify RideDetails Page

**File:** `src/pages/Rider/RideDetails.tsx` (modify)

### Changes

1. Add imports for `PayNowButton` and `PaymentStatusBadge`
2. Add a **Payment Information** section after the Ride Status Timeline, visible only when `ride.status === "COMPLETED"`

### Exact modifications

**After line 7 (after existing imports), add:**

```typescript
import PayNowButton from "@/components/modules/Payment/PayNowButton";
import PaymentStatusBadge from "@/components/modules/Payment/PaymentStatusBadge";
```

**After the Ride Status Timeline `</div>` (after line 125), before the closing `</CardContent>`, add:**

```tsx
{/* Payment Information */}
{ride.status === "COMPLETED" && (
  <div>
    <h3 className="text-lg font-semibold">Payment Information</h3>
    <Separator className="my-2" />
    <div className="space-y-3">
      <p>
        <span className="font-medium">Payment Status:</span>{" "}
        {ride.isPaid ? (
          <PaymentStatusBadge status="VALID" />
        ) : (
          <PaymentStatusBadge status="INITIATED" />
        )}
      </p>
      {!ride.isPaid && (
        <PayNowButton
          rideId={id!}
          isPaid={ride.isPaid}
          rideStatus={ride.status}
        />
      )}
    </div>
  </div>
)}
```

### Why

- The ride object from `GET /rides/:id` already includes `isPaid` (boolean) from the backend model
- `PayNowButton` only renders when the ride is completed and unpaid
- The SOSButton already conditionally renders based on ride status — this follows the same pattern

---

## Step 6 — Create Payment Callback Pages

These pages handle SSLCommerz redirect callbacks. They are **not** behind `withAuth` because SSLCommerz redirects the browser directly. They read query params and call `GET /payments/:rideId/status` for authoritative data.

The backend redirects to these frontend URLs with query params: `?status=...&tranId=...&rideId=...`

### 6a. PaymentSuccess

**File:** `src/pages/Payment/PaymentSuccess.tsx` (new)

```typescript
import { useSearchParams, Link } from "react-router";
import { useGetPaymentStatusQuery } from "@/redux/features/payment/payment.api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CheckCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const rideId = searchParams.get("rideId") || "";
  const tranIdParam = searchParams.get("tranId") || "";

  const { data, isLoading, isError } = useGetPaymentStatusQuery(rideId, {
    skip: !rideId,
  });

  if (!rideId) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">Invalid payment callback. Missing ride information.</p>
            <Link to="/rider/ride-history">
              <Button className="mt-4">Back to Ride History</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full space-y-4">
          <Skeleton className="h-20 w-20 rounded-full mx-auto" />
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4 mx-auto" />
        </Card>
      </div>
    );
  }

  const payment = data?.data;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
          <CardTitle className="text-2xl">Payment Successful</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isError || !payment ? (
            <p className="text-center text-muted-foreground">
              Unable to verify payment status. Please check your payment history.
            </p>
          ) : (
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Transaction ID:</span>
                <span className="font-mono font-medium">{payment.tranId || tranIdParam}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-medium">৳{payment.amount}</span>
              </div>
              {payment.paidAt && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Paid At:</span>
                  <span>{new Date(payment.paidAt).toLocaleString()}</span>
                </div>
              )}
            </div>
          )}
          <Separator />
          <div className="flex flex-col gap-2">
            <Link to={`/rider/ride-details/${rideId}`}>
              <Button className="w-full">View Ride Details</Button>
            </Link>
            <Link to="/rider/payment-history">
              <Button variant="outline" className="w-full">Payment History</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

### 6b. PaymentFail

**File:** `src/pages/Payment/PaymentFail.tsx` (new)

Same structural pattern as success, but with failure messaging:

```typescript
import { useSearchParams, Link } from "react-router";
import { useGetPaymentStatusQuery } from "@/redux/features/payment/payment.api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { XCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function PaymentFail() {
  const [searchParams] = useSearchParams();
  const rideId = searchParams.get("rideId") || "";
  const tranIdParam = searchParams.get("tranId") || "";

  const { data, isLoading, isError } = useGetPaymentStatusQuery(rideId, {
    skip: !rideId,
  });

  if (!rideId) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">Invalid callback. Missing ride information.</p>
            <Link to="/rider/ride-history">
              <Button className="mt-4">Back to Ride History</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full space-y-4">
          <Skeleton className="h-20 w-20 rounded-full mx-auto" />
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="h-4 w-full" />
        </Card>
      </div>
    );
  }

  const payment = data?.data;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto" />
          <CardTitle className="text-2xl">Payment Failed</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            Your payment could not be processed. Your card was not charged.
          </p>
          {(isError || !payment) && tranIdParam && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Transaction ID:</span>
              <span className="font-mono">{tranIdParam}</span>
            </div>
          )}
          <Separator />
          <div className="flex flex-col gap-2">
            <Link to={`/rider/ride-details/${rideId}`}>
              <Button className="w-full">Retry Payment</Button>
            </Link>
            <Link to="/rider/ride-history">
              <Button variant="outline" className="w-full">Back to Ride History</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

### 6c. PaymentCancel

**File:** `src/pages/Payment/PaymentCancel.tsx` (new)

Same pattern with cancellation messaging:

```typescript
import { useSearchParams, Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle } from "lucide-react";

export default function PaymentCancel() {
  const [searchParams] = useSearchParams();
  const rideId = searchParams.get("rideId") || "";

  if (!rideId) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">Invalid callback. Missing ride information.</p>
            <Link to="/rider/ride-history">
              <Button className="mt-4">Back to Ride History</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto" />
          <CardTitle className="text-2xl">Payment Cancelled</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            You cancelled the payment. No charges were made.
          </p>
          <Separator />
          <div className="flex flex-col gap-2">
            <Link to={`/rider/ride-details/${rideId}`}>
              <Button className="w-full">Try Again</Button>
            </Link>
            <Link to="/rider/ride-history">
              <Button variant="outline" className="w-full">Back to Ride History</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

### Why these pages are NOT behind withAuth

The backend's `/payments/success`, `/payments/fail`, and `/payments/cancel` endpoints receive POST requests from SSLCommerz and then **302-redirect** the browser to the frontend URLs with query params. This redirect happens as a plain browser navigation — no cookies or auth headers are sent. Therefore these pages must be publicly accessible. They still fetch payment status via RTK Query which will use the existing `withCredentials: true` Axios instance.

---

## Step 7 — Create PaymentHistory Page

**File:** `src/pages/Rider/PaymentHistory.tsx` (new)

Follows the same pattern as `src/pages/Rider/RideHistory.tsx`: fetch data, client-side filter, paginate locally.

```typescript
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetPaymentHistoryQuery } from "@/redux/features/payment/payment.api";
import PaymentStatusBadge from "@/components/modules/Payment/PaymentStatusBadge";
import type { PaymentStatus } from "@/types/payment.types";

export default function PaymentHistory() {
  const { data, isLoading } = useGetPaymentHistoryQuery(undefined);
  const payments = data?.data || [];

  const [status, setStatus] = useState<string>("all");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [minAmount, setMinAmount] = useState<string>("");
  const [maxAmount, setMaxAmount] = useState<string>("");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  if (isLoading) return <p className="text-center">Loading payment history...</p>;

  const filtered = payments.filter((p) => {
    const date = new Date(p.createdAt);
    const afterStart = startDate ? date >= new Date(startDate) : true;
    const beforeEnd = endDate ? date <= new Date(endDate) : true;
    const minOk = minAmount ? p.amount >= parseFloat(minAmount) : true;
    const maxOk = maxAmount ? p.amount <= parseFloat(maxAmount) : true;
    const statusOk = status === "all" ? true : p.status === status;
    return afterStart && beforeEnd && minOk && maxOk && statusOk;
  });

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Payment History</h2>

      {/* Filters */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} placeholder="Start Date" />
        <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} placeholder="End Date" />
        <Input type="number" placeholder="Min Amount" value={minAmount} onChange={(e) => setMinAmount(e.target.value)} />
        <Input type="number" placeholder="Max Amount" value={maxAmount} onChange={(e) => setMaxAmount(e.target.value)} />
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="VALID">Paid</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="INITIATED">Initiated</SelectItem>
            <SelectItem value="FAILED">Failed</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Transaction ID</TableHead>
            <TableHead>Ride ID</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Paid At</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginated.length > 0 ? (
            paginated.map((p) => (
              <TableRow key={p._id}>
                <TableCell className="font-mono text-sm">{p.tranId}</TableCell>
                <TableCell className="font-mono text-sm">{p.ride}</TableCell>
                <TableCell>৳{p.amount}</TableCell>
                <TableCell><PaymentStatusBadge status={p.status} /></TableCell>
                <TableCell>{p.paidAt ? new Date(p.paidAt).toLocaleDateString() : "—"}</TableCell>
                <TableCell>{new Date(p.createdAt).toLocaleDateString()}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center">No payment history found.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex justify-between items-center pt-4">
        <Button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}>Previous</Button>
        <p>Page {page} of {totalPages || 1}</p>
        <Button onClick={() => setPage((p) => Math.min(p + 1, totalPages))} disabled={page === totalPages}>Next</Button>
      </div>
    </div>
  );
}
```

### Why

- Mirrors `RideHistory.tsx` for consistency (same filter, pagination, table patterns)
- Uses `PaymentStatusBadge` component from Step 4a
- Client-side filtering because the `GET /payments/me` endpoint returns all payments without QueryBuilder support

---

## Step 8 — Add Payment History to Rider Sidebar

**File:** `src/routes/riderSidebarItems.tsx` (modify)

### Changes

1. Add lazy import at top:
```typescript
const PaymentHistory = lazy(() => import("@/pages/Rider/PaymentHistory"));
```

2. Add new item in the "Dashboard" section, after "Ride History":
```typescript
{
  title: "Payment History",
  url: "/rider/payment-history",
  component: PaymentHistory,
},
```

### Why

- `generateSidebarRoutes()` flattens sidebar items into route definitions automatically
- Lazy loading follows the exact pattern used by all other sidebar page imports
- No manual route registration needed for dashboard pages

---

## Step 9 — Register Payment Callback Routes

**File:** `src/routes/routes.tsx` (modify)

### Changes

1. Add eager imports for the three callback pages (they're lightweight, no lazy needed):
```typescript
import PaymentSuccess from "@/pages/Payment/PaymentSuccess";
import PaymentFail from "@/pages/Payment/PaymentFail";
import PaymentCancel from "@/pages/Payment/PaymentCancel";
```

2. Add three route objects inside the `createBrowserRouter` array, **before** the wildcard `*` route:
```typescript
{
  path: "/payment/success",
  Component: PaymentSuccess,
},
{
  path: "/payment/fail",
  Component: PaymentFail,
},
{
  path: "/payment/cancel",
  Component: PaymentCancel,
},
```

### Why

- These routes are **not** inside the `/rider` dashboard section because they must be accessible without auth (SSLCommerz redirect)
- They sit as top-level routes alongside `/login`, `/register`, etc.
- Must be placed before the `*` catch-all to avoid being swallowed by ErrorPage
- The backend's `SSL_SUCCESS_FRONTEND_URL`, `SSL_FAIL_FRONTEND_URL`, `SSL_CANCEL_FRONTEND_URL` env vars point to these paths (e.g., `https://ride-booking-system-frontend.vercel.app/payment/success`)

---

## Step 10 — Build and Lint Verification

```bash
bun run build
bun run lint
```

Both must pass with zero errors before the implementation is considered complete.

---

## Backend Contract Reference

For coordination with the backend team, here are the exact endpoints the frontend will call:

| # | Method | Endpoint | Auth | Body | Response | Notes |
|---|--------|----------|------|------|----------|-------|
| 1 | `POST` | `/payments/initiate` | RIDER (cookie/header) | `{ rideId: string }` | `{ success, data: { gatewayUrl, tranId, paymentId } }` | Frontend redirects to `gatewayUrl` |
| 2 | `GET` | `/payments/:rideId/status` | RIDER (owner) or ADMIN | — | `{ success, data: { status, amount, tranId, paidAt } }` | Authoritative payment state |
| 3 | `GET` | `/payments/me` | RIDER | — | `{ success, data: IPayment[] }` | Full payment docs incl. `raw` |

The following backend endpoints are **not called by the frontend** but trigger redirects to the frontend:

| Backend Endpoint | Redirects To | Query Params |
|---|---|---|
| `POST /payments/success` | `/payment/success` | `?status=...&tranId=...&rideId=...` |
| `POST /payments/fail` | `/payment/fail` | `?status=...&tranId=...&rideId=...` |
| `POST /payments/cancel` | `/payment/cancel` | `?status=...&tranId=...&rideId=...` |

**Important:** The callback pages must NOT trust the `status` query param alone — they call `GET /payments/:rideId/status` for the authoritative state, as documented in `docs/backend_review_1.md` §10.3.

---

## Implementation Order

Execute steps 1-10 in order. Each step depends on the previous:

1. Types (no dependencies)
2. baseApi tag (no dependencies)
3. Payment API (depends on 1 + 2)
4. Components (depends on 1 + 3)
5. RideDetails modification (depends on 3 + 4)
6. Callback pages (depends on 3)
7. PaymentHistory (depends on 3 + 4)
8. Sidebar update (depends on 7)
9. Route registration (depends on 6)
10. Build verification (depends on all above)

---

## Conventions to Follow

- All new components use functional components with TypeScript
- Use `import type` for type-only imports (`verbatimModuleSyntax` is on)
- Use `@/` path alias for all imports from `src/`
- Use `react-hot-toast` for success/error notifications (existing pattern)
- Use `lucide-react` for icons (existing pattern)
- Use shadcn/ui components from `@/components/ui/` (Card, Button, Badge, Table, etc.)
- RTK Query for all server state, React `useState` for local UI state
- Error handling: `err?.data?.message || "fallback"` pattern (existing pattern)
- Lazy loading for sidebar pages via `React.lazy()` + dynamic import
- Callback pages use eager imports (lightweight, need to load fast for redirect UX)
