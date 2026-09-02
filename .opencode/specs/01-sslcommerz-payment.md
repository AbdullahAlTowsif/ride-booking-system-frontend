# Spec: SSLCommerz Payment Integration

## Overview

This frontend feature integrates the existing backend SSLCommerz payment system into the Ride Booking System frontend. It enables riders to pay for completed rides via the SSLCommerz payment gateway, view payment status, and access payment history. The backend has already implemented the complete payment lifecycle including session initiation, IPN (Instant Payment Notification) handling, signature verification, and settlement. The frontend needs to implement the UI flows to trigger payment initiation, handle redirect callbacks from SSLCommerz, display payment status, and show payment history.

## Depends on

- **Authentication (Rider)**: Riders must be logged in to initiate payments and view payment history. The payment initiation endpoint requires RIDER role authentication.
- **Ride Completion**: Payments are only allowed for rides with status `COMPLETED`. The ride request, driver acceptance, and ride completion workflows must be functional first.

## User Roles

- **RIDER**: Allowed to initiate payment for their own completed rides, view payment status, and access payment history.
- **DRIVER**: Not directly involved in payment initiation, but earnings are updated when payments are validated.
- **ADMIN**: Can view payment status for any ride via the status endpoint.

## User Experience

### Payment Initiation Flow

1. **Entry Point**: Rider views a completed ride in ride details page or ride history.
2. **Action**: Rider clicks "Pay Now" button on a completed, unpaid ride.
3. **Loading State**: Button shows loading spinner while initiating payment session.
4. **API Call**: Frontend calls `POST /payments/initiate` with `{ rideId }`.
5. **Success**: Backend returns `{ gatewayUrl, tranId, paymentId }`. Frontend redirects browser to `gatewayUrl` (SSLCommerz hosted payment page).
6. **Error**: If ride is not completed, already paid, or has active payment, show error toast.

### Payment Gateway Flow

1. Rider completes payment on SSLCommerz hosted page (card/bank/mobile).
2. SSLCommerz processes payment and sends IPN to backend.
3. Backend verifies signature, validates transaction, and settles payment.
4. SSLCommerz redirects browser to success/fail/cancel URL with query params.

### Payment Callback Handling

1. **Success Page**: Rider is redirected to `/payment/success?status=...&tranId=...&rideId=...`.
2. **Fail Page**: Rider is redirected to `/payment/fail?status=...&tranId=...&rideId=...`.
3. **Cancel Page**: Rider is redirected to `/payment/cancel?status=...&tranId=...&rideId=...`.
4. Each page calls `GET /payments/:rideId/status` to get authoritative payment status.
5. Display appropriate success/failure/cancellation message with payment details.

### Payment History Flow

1. **Entry Point**: Rider navigates to "Payment History" in sidebar.
2. **API Call**: Frontend calls `GET /payments/me`.
3. **Display**: Show table of all payments with status, amount, transaction ID, date.
4. **Filtering**: Client-side filtering by status, date range, amount range.

## Routes

### New Routes

- `PAGE /payment/success` — Payment success callback page — RIDER (public access for redirect)
- `PAGE /payment/fail` — Payment failure callback page — RIDER (public access for redirect)
- `PAGE /payment/cancel` — Payment cancellation callback page — RIDER (public access for redirect)
- `PAGE /rider/payment-history` — Rider payment history dashboard — RIDER

### Modified Routes

- `PAGE /rider/ride-details/:id` — Add "Pay Now" button for completed unpaid rides — RIDER

## Pages

### Create

#### Payment Success Page (`src/pages/Payment/PaymentSuccess.tsx`)
- **Purpose**: Handle SSLCommerz success redirect and display payment confirmation.
- **User Role**: RIDER (accessed via redirect, no auth guard needed for the page itself).
- **Main Sections**:
  - Payment status indicator (success icon)
  - Payment details (transaction ID, amount, date)
  - Ride details summary
  - Navigation buttons (back to ride history, view ride details)
- **API Dependencies**: `GET /payments/:rideId/status`

#### Payment Fail Page (`src/pages/Payment/PaymentFail.tsx`)
- **Purpose**: Handle SSLCommerz failure redirect and display failure message.
- **User Role**: RIDER.
- **Main Sections**:
  - Payment status indicator (failure icon)
  - Error message
  - Retry payment button
  - Navigation back to ride details

#### Payment Cancel Page (`src/pages/Payment/PaymentCancel.tsx`)
- **Purpose**: Handle SSLCommerz cancellation redirect.
- **User Role**: RIDER.
- **Main Sections**:
  - Cancellation message
  - Retry payment button
  - Navigation back to ride details

#### Payment History Page (`src/pages/Rider/PaymentHistory.tsx`)
- **Purpose**: Display all rider's payment transactions.
- **User Role**: RIDER.
- **Main Sections**:
  - Payment history table (transaction ID, ride ID, amount, status, date)
  - Status filter dropdown
  - Date range filter
  - Pagination

### Modify

#### Ride Details Page (`src/pages/Rider/RideDetails.tsx`)
- **Changes**: Add "Pay Now" button for rides with status `COMPLETED` and `isPaid: false`.
- **Button Behavior**: Call payment initiation API, redirect to gateway.

## Components

### Create

#### Payment Status Badge (`src/components/modules/Payment/PaymentStatusBadge.tsx`)
- **Purpose**: Reusable badge component displaying payment status with appropriate color coding.
- **Props**: `status: PaymentStatus`
- **Behavior**: Shows colored badge (green for VALID, yellow for PENDING, red for FAILED/CANCELLED, gray for INITIATED).

#### Pay Now Button (`src/components/modules/Payment/PayNowButton.tsx`)
- **Purpose**: Button component that initiates payment flow.
- **Props**: `rideId: string, isPaid: boolean, rideStatus: string`
- **Behavior**: Disabled if ride not completed or already paid. Shows loading state during API call. On success, redirects to gateway URL.

### Modify

#### Rider Sidebar Items (`src/routes/riderSidebarItems.tsx`)
- **Changes**: Add "Payment History" menu item.

## Hooks / State

### New API Endpoints (RTK Query)

```typescript
// In src/redux/features/payment/payment.api.ts
initiatePayment: builder.mutation({
  query: (rideId) => ({
    url: "/payments/initiate",
    method: "POST",
    data: { rideId },
  }),
  invalidatesTags: ["RIDES"],
}),

getPaymentStatus: builder.query({
  query: (rideId) => ({
    url: `/payments/${rideId}/status`,
    method: "GET",
  }),
  providesTags: ["RIDES"],
}),

getPaymentHistory: builder.query({
  query: () => ({
    url: "/payments/me",
    method: "GET",
  }),
  providesTags: ["RIDES"],
}),
```

### Cache Invalidation

- `initiatePayment` invalidates `RIDES` tag to refresh ride data after payment.
- Payment status queries provide `RIDES` tag for cache consistency.

## API Integration

### 1. Initiate Payment

- **Method**: `POST`
- **Endpoint**: `/payments/initiate`
- **Authentication**: Required (RIDER role)
- **Request**: `{ rideId: string }`
- **Response**: `{ gatewayUrl: string, tranId: string, paymentId: string }`
- **Error Behavior**: Show error toast with backend message (e.g., "Ride not completed", "Already paid").

### 2. Get Payment Status

- **Method**: `GET`
- **Endpoint**: `/payments/:rideId/status`
- **Authentication**: Required (RIDER owner or ADMIN)
- **Response**: `{ status: PaymentStatus, amount: number, tranId: string, paidAt: string }`
- **Error Behavior**: Show error if ride not found or unauthorized.

### 3. Get Payment History

- **Method**: `GET`
- **Endpoint**: `/payments/me`
- **Authentication**: Required (RIDER)
- **Response**: Array of Payment objects with raw data.
- **Error Behavior**: Show empty state if no payments.

## Types

### New Types (`src/types/payment.types.ts`)

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

### Modified Types

- Add `isPaid: boolean` to ride interface (already exists in backend response).

## Forms and Validation

### Payment Initiation

- **No form required**: Single button click with ride ID.
- **Validation**: Check ride status is `COMPLETED` and `isPaid` is `false` before enabling button.

### Payment History Filters

- **Status Filter**: Select dropdown with all PaymentStatus values.
- **Date Range**: Two date inputs (start/end).
- **Amount Range**: Two number inputs (min/max).
- **Client-side filtering**: Apply filters to fetched data.

## UI States

### Payment Initiation

- **Initial**: "Pay Now" button enabled for completed unpaid rides.
- **Loading**: Button shows spinner, disabled during API call.
- **Success**: Redirect to SSLCommerz gateway (full page navigation).
- **Error**: Toast notification with error message.

### Payment Callback Pages

- **Loading**: Skeleton loader while fetching payment status.
- **Success**: Green checkmark, payment details, ride summary.
- **Failed**: Red X, error message, retry button.
- **Cancelled**: Yellow warning, cancellation message, retry button.
- **Error**: Error state if payment status fetch fails.

### Payment History

- **Loading**: Skeleton table rows.
- **Empty**: "No payment history found" message.
- **Data**: Table with payment records, pagination controls.
- **Error**: Error message with retry option.

## Responsive Design

### Payment Callback Pages

- **Mobile**: Full-width card layout, stacked elements.
- **Tablet/Desktop**: Centered card with max-width constraint.

### Payment History Table

- **Mobile**: Horizontal scrollable table or card layout.
- **Tablet/Desktop**: Full table with all columns visible.

## Accessibility

- **Keyboard Navigation**: All interactive elements focusable and operable via keyboard.
- **Focus Management**: After payment initiation, focus moves to gateway redirect.
- **ARIA Labels**: "Pay Now" button has descriptive label.
- **Color Contrast**: Payment status badges meet WCAG AA standards.
- **Screen Reader**: Status changes announced via aria-live regions.

## Authentication and Authorization

- **Login Required**: Yes for payment initiation and history.
- **Route Protection**: Payment pages use `withAuth` HOC with RIDER role.
- **Callback Pages**: Public access (no auth guard) since they're redirect targets from SSLCommerz.
- **Redirect**: Unauthenticated users redirected to `/login`.
- **Authorization**: Only ride owners can initiate payment for their rides.

## Realtime / Async Behavior

- **No realtime required**: Payment status is polled via API call on callback pages.
- **No WebSocket**: Payment updates are not real-time.
- **Cache Invalidation**: RTK Query cache invalidated after payment initiation.

## Backend Changes Required

No backend changes required. The backend payment system is fully implemented:

- `POST /payments/initiate` - Creates SSLCommerz session
- `POST /payments/ipn` - Handles IPN callback
- `POST /payments/success` - Success redirect handler
- `POST /payments/fail` - Failure redirect handler
- `POST /payments/cancel` - Cancellation redirect handler
- `GET /payments/:rideId/status` - Get payment status
- `GET /payments/me` - Get rider payment history

## Files to Change

### Modify

- `src/pages/Rider/RideDetails.tsx` - Add Pay Now button
- `src/routes/riderSidebarItems.tsx` - Add Payment History menu item
- `src/redux/baseApi.ts` - Add PAYMENT tag type

## Files to Create

### Pages

- `src/pages/Payment/PaymentSuccess.tsx`
- `src/pages/Payment/PaymentFail.tsx`
- `src/pages/Payment/PaymentCancel.tsx`
- `src/pages/Rider/PaymentHistory.tsx`

### Components

- `src/components/modules/Payment/PaymentStatusBadge.tsx`
- `src/components/modules/Payment/PayNowButton.tsx`

### Redux

- `src/redux/features/payment/payment.api.ts`

### Types

- `src/types/payment.types.ts`

## New Dependencies

No new dependencies. Uses existing:
- `react-router` for routing
- `@reduxjs/toolkit` for state management
- `react-hot-toast` for notifications
- `lucide-react` for icons
- `@/components/ui/*` for UI components

## Rules for Implementation

1. **Reuse existing frontend architecture and patterns** - Follow RTK Query conventions, component structure, and styling patterns.
2. **Reuse existing components** - Use existing shadcn/ui components (Button, Card, Table, Badge, etc.).
3. **Do not invent backend endpoints** - Use only verified endpoints from backend review document.
4. **Do not put business/security authorization logic only in the frontend** - Backend handles all payment validation.
5. **Keep API calls out of presentational components** - Use RTK Query hooks in page components.
6. **Keep server state separate from local UI state** - Use RTK Query for server data, React state for UI.
7. **Follow existing TypeScript, naming, routing, styling, validation, and error-handling conventions**.
8. **Do not modify backend files**.
9. **Do not expose secrets or private environment-variable values in frontend code**.
10. **Use environment variables only according to the project's existing convention**.
11. **Handle loading, empty, error, and success states** for all API-dependent UI.
12. **Ensure responsive behavior** on mobile, tablet, and desktop.
13. **Ensure accessible interactions** with keyboard navigation and screen reader support.
14. **Avoid unnecessary dependencies**.
15. **Do not duplicate existing functionality**.

## Definition of Done

- [ ] Payment initiation flow works end-to-end (click Pay Now → redirect to gateway).
- [ ] SSLCommerz success callback page displays correct payment status.
- [ ] SSLCommerz failure callback page displays error and retry option.
- [ ] SSLCommerz cancellation callback page displays cancellation message.
- [ ] Payment history page shows all rider's payments with correct status.
- [ ] Payment history filtering works (status, date, amount).
- [ ] "Pay Now" button only appears for completed unpaid rides.
- [ ] Loading states display correctly during API calls.
- [ ] Error states display correctly for failed operations.
- [ ] Empty states display correctly when no payments exist.
- [ ] Navigation works correctly after successful/failed operations.
- [ ] Existing functionality remains unaffected.
- [ ] No unnecessary dependency was introduced.
- [ ] TypeScript/build/lint checks pass according to project conventions.
- [ ] Responsive design works on mobile, tablet, and desktop.
- [ ] Keyboard navigation works for all interactive elements.
- [ ] Payment status badges display correct colors for each status.
- [ ] Cache invalidation works correctly after payment initiation.
- [ ] Redirect pages handle missing/invalid query params gracefully.