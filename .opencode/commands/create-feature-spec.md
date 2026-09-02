---
description: Create a production-ready feature specification and Git feature branch for the Ride Booking System frontend
argument-hint: "Step number and feature name, e.g. 2 registration or 5 ride-request"
allowed-tools: Read, Write, Glob, Bash(git:*)
---

You are a senior frontend/full-stack developer responsible for planning frontend features for the **Ride Booking System**.

Your primary responsibility is to create a clear, implementation-ready frontend specification for the requested roadmap feature based on the actual frontend codebase and the backend API contract.

This command is executed from the **ride-booking-system-frontend** repository.

The backend is maintained in a separate repository and may be open in another VS Code window. Therefore:

- Do NOT assume backend source files exist in this repository.
- Do NOT modify backend files.
- Do NOT create backend branches.
- Do NOT attempt to inspect backend files unless they are explicitly available in this repository.
- When backend behavior is required, inspect existing frontend API clients, types, documentation, environment variables, and any available API contract.
- Do NOT invent backend endpoints, request bodies, response fields, authentication behavior, roles, or business rules.
- If the required backend contract cannot be verified from the frontend repository, clearly mark the missing information as a backend dependency or contract requirement in the specification.
- When a feature requires backend changes, document the required backend/API contract for coordination with the backend repository.

Always follow `AGENTS.md` as the project's source of truth.

User input:

$ARGUMENTS

---

# Step 1 — Parse the arguments

From `$ARGUMENTS`, extract the following values.

## 1. step_number

Extract the roadmap step number.

Convert it to exactly two digits:

- `1` → `01`
- `2` → `02`
- `9` → `09`
- `10` → `10`
- `25` → `25`

## 2. feature_title

Convert the feature name into a human-readable Title Case title.

Examples:

- `2 registration` → `Registration`
- `3 login logout` → `Login and Logout`
- `4 driver registration` → `Driver Registration`
- `5 ride request` → `Ride Request`
- `6 driver accept ride` → `Driver Accept Ride`
- `7 ride cancellation` → `Ride Cancellation`
- `8 sslcommerz payment` → `SSLCommerz Payment`

Preserve important Ride Booking and technology terminology such as:

- Ride
- Rider
- Driver
- Admin
- JWT
- API
- SSLCommerz
- WebSocket
- Socket.IO

## 3. feature_slug

Create a Git-safe and file-safe slug.

Rules:

- lowercase
- kebab-case
- only `a-z`, `0-9`, and `-`
- maximum 40 characters
- remove unnecessary words
- no spaces
- no underscores
- no special characters

Examples:

- `Registration` → `registration`
- `Login and Logout` → `login-logout`
- `Driver Registration` → `driver-registration`
- `Driver Accept Ride` → `driver-accept-ride`
- `SSLCommerz Payment` → `sslcommerz-payment`

## 4. branch_name

The branch must use:

`feature/<feature_slug>`

Examples:

- `feature/registration`
- `feature/login-logout`
- `feature/ride-request`
- `feature/driver-accept-ride`
- `feature/sslcommerz-payment`

If the step number or feature name cannot be determined confidently, ask the user for clarification and STOP.

---

# Step 2 — Validate the repository

Before researching the feature, verify that the current repository is the frontend repository.

Inspect:

- current working directory
- repository structure
- Git status
- `package.json`
- frontend source directory such as `src/`, `app/`, or another actual source directory
- `AGENTS.md`

The command must operate only on the current frontend repository.

Do not assume a specific framework, router, state-management library, styling system, component library, API client, or authentication mechanism unless confirmed by the repository.

If the repository does not appear to be the Ride Booking System frontend, warn the user and STOP.

---

# Step 3 — Read project rules

Read:

`AGENTS.md`

Treat `AGENTS.md` as the highest-priority project-specific source of truth.

Extract and follow:

- project architecture
- roadmap
- coding conventions
- naming conventions
- folder structure
- routing conventions
- component conventions
- styling conventions
- UI/component-library conventions
- API conventions
- state-management conventions
- authentication rules
- authorization/UI permission rules
- form and validation conventions
- error-handling conventions
- testing requirements
- environment-variable conventions
- completed roadmap steps
- branch conventions
- implementation constraints

Do not contradict `AGENTS.md`.

If this specification conflicts with `AGENTS.md`, `AGENTS.md` takes precedence.

---

# Step 4 — Research the frontend codebase

Before writing the specification, inspect the existing frontend implementation.

Research the areas relevant to the requested feature.

## Project structure

Inspect actual directories such as:

- `src/`
- `app/`
- `pages/`
- `components/`
- `features/`
- `layouts/`
- `hooks/`
- `lib/`
- `services/`
- `api/`
- `store/`
- `context/`
- `types/`
- `utils/`
- `validators/`
- `public/`
- tests
- documentation

Use the actual paths discovered in the repository.

Do not invent paths.

## Framework and rendering architecture

Determine:

- frontend framework
- routing system
- rendering model
- server/client component boundaries if applicable
- layout structure
- loading patterns
- error boundaries
- data-fetching strategy
- state-management strategy

Reuse existing project patterns.

## UI architecture

Determine:

- component organization
- reusable component conventions
- design system
- UI component library
- form components
- modal/dialog conventions
- table conventions
- toast/notification conventions
- loading/skeleton conventions
- empty-state conventions
- responsive-design conventions

If the project uses shadcn/ui, follow the existing shadcn/ui implementation and do not introduce another UI library unnecessarily.

## Styling

Determine:

- Tailwind CSS or other styling approach
- theme conventions
- responsive breakpoints
- dark/light mode if present
- spacing conventions
- typography conventions
- reusable design tokens

Reuse existing styling patterns.

## API integration

Determine:

- API client implementation
- base URL configuration
- Axios/fetch/custom client usage
- interceptors
- authentication headers
- credential/cookie handling
- request helpers
- response transformation
- error transformation
- API types
- query/mutation conventions
- caching and invalidation strategy

Use the existing API architecture.

## Authentication

Inspect the existing frontend authentication implementation.

Determine:

- login flow
- registration flow
- logout flow
- current-user retrieval
- token handling
- cookie handling
- refresh-token behavior if visible
- protected routes
- authentication guards
- auth context/store
- redirect behavior
- unauthenticated behavior

Do not introduce another authentication mechanism unless explicitly required.

## Authorization and roles

Determine:

- available roles from frontend/backend contracts that are actually known
- role-aware routing
- role-aware navigation
- protected pages
- UI permission checks
- ownership-related UI restrictions

Remember:

Frontend permission checks improve UX but are NOT a replacement for backend authorization.

---

# Step 5 — Research backend API contracts available to the frontend

The backend is a separate repository.

Do not assume its source code is available.

Use only backend information that is actually available through:

- existing frontend API services
- API types/interfaces
- generated API clients
- frontend documentation
- README files
- OpenAPI/Swagger files if present
- API contract files
- environment configuration
- existing frontend usage of endpoints

For the requested feature, determine:

- endpoint
- HTTP method
- URL/path
- authentication requirement
- role requirement
- request body
- query parameters
- path parameters
- response structure
- error structure
- status codes
- pagination behavior if applicable

If any required backend contract is unavailable, explicitly write:

`Backend contract verification required`

and describe exactly what information is needed.

Never invent an endpoint or response structure.

---

# Step 6 — Check roadmap and existing specifications

Check:

- `AGENTS.md`
- `.opencode/specs/`

Determine whether the requested step:

1. is already completed
2. already has a specification
3. is planned but not completed
4. is a new roadmap step

## If already completed

Warn the user:

"The requested roadmap step is already marked as complete."

Then STOP.

Do not:

- create another spec
- overwrite an existing spec
- create a new branch

## If a specification already exists

Warn the user:

"A specification already exists for this roadmap step."

Provide the existing specification path if available.

Do not overwrite it.

Do not create a duplicate branch.

STOP unless the user explicitly asks to update the existing specification.

---

# Step 7 — Analyze feature dependencies

Determine which previous frontend features are required for the requested feature.

Consider relevant Ride Booking System dependencies such as:

- application shell
- routing
- registration
- authentication
- role-based routing
- rider dashboard
- driver dashboard
- admin dashboard
- rider profile
- driver profile
- vehicle management
- ride request UI
- driver matching UI
- driver acceptance UI
- ride status UI
- location/map UI
- fare display
- payment UI
- cancellation UI
- ride history
- ratings and reviews
- notifications
- admin management

Only identify dependencies supported by the existing roadmap and codebase.

Do not invent dependencies.

For each dependency, explain why it is required.

---

# Step 8 — Analyze the user experience and frontend workflow

Before writing the specification, understand the feature as a complete frontend user experience.

Consider:

- which user starts the action
- which page/view they are on
- what UI they interact with
- what information they enter
- what API request is triggered
- what loading state is shown
- what happens on success
- what happens on validation failure
- what happens on API failure
- what happens on authentication failure
- what happens on authorization failure
- what page/state the user sees next
- whether the UI needs polling, WebSocket, or Socket.IO updates
- whether the UI needs optimistic updates
- whether cached data must be invalidated
- whether the user can retry
- whether the browser can be refreshed safely
- what empty states are required
- what responsive behavior is required

For stateful features such as rides, explicitly map backend states to frontend UI states.

Example:

```text
REQUESTED
    ↓
Show "Finding a Driver"

ACCEPTED
    ↓
Show Driver Information

DRIVER_ARRIVING
    ↓
Show Driver En Route

IN_PROGRESS
    ↓
Show Active Ride

COMPLETED
    ↓
Show Payment / Rating
```

Use the actual backend states that can be verified.

---

# Step 9 — Analyze API state, server state, and UI state

For every data-driven feature, distinguish:

## Server state

Data obtained from the backend, such as:

- user
- driver
- ride
- vehicle
- payment
- notification

## Client/UI state

Local interface state, such as:

- modal open/closed
- selected vehicle
- form values
- active tab
- map view
- loading indicator
- confirmation dialog

## Derived state

Values calculated from server/client data, such as:

- fare summary
- ride progress
- whether an action is allowed
- formatted status
- remaining steps

Do not duplicate server state unnecessarily in local state.

Follow the project's existing data-fetching/state-management conventions.

---

# Step 10 — Analyze responsive and accessibility requirements

For every new or modified UI, consider:

- desktop
- tablet
- mobile
- keyboard navigation
- focus management
- semantic HTML
- accessible labels
- form errors
- dialogs/modals
- loading announcements where appropriate
- color contrast
- disabled states
- touch-friendly controls

Follow existing project conventions.

Do not add unnecessary accessibility abstractions if the project already has established components that handle them.

---

# Step 11 — Analyze frontend/backend coordination

If the feature requires backend changes, explicitly document them.

Include:

## Backend dependency

- required backend endpoint(s)
- required request contract
- required response contract
- required authentication/role behavior
- required error behavior
- required database/business behavior if relevant

## Frontend responsibility

- pages
- components
- API functions
- hooks
- types
- state management
- UI states
- navigation
- user feedback

Do not modify backend code from this frontend command.

Do not create backend branches.

---

# Step 12 — Write the specification

Create the specification using exactly the following structure.

# Spec: <feature_title>

## Overview

One paragraph explaining:

- what this frontend feature does
- which user needs it solves
- why it exists at this stage of the Ride Booking System roadmap
- how it connects to the backend

## Depends on

List required previous steps.

For each dependency, explain why it is required.

## User Roles

List the roles that can access/use this feature.

Clearly distinguish:

- allowed
- restricted
- public

## User Experience

Describe the complete user journey.

Include:

- entry point
- main actions
- success state
- loading state
- empty state
- validation state
- error state
- retry behavior
- navigation after success/failure

## Routes

Every new frontend route:

- `PAGE /path` — description — access level

If no new routes:

`No new routes`

Also list existing routes that need modification.

## Pages

### Create

List every new page/screen and its actual path.

For each page explain:

- purpose
- user role
- main sections
- primary actions
- API dependencies

### Modify

List existing pages and exactly what changes.

## Components

### Create

List every new reusable or feature-specific component.

Use actual project paths.

### Modify

List existing components and required changes.

Do not create components that duplicate existing reusable components.

## Hooks / State

List:

- new hooks
- modified hooks
- new state
- modified state
- server-state queries
- mutations
- cache invalidation
- subscriptions/realtime behavior if applicable

## API Integration

For every API interaction include:

- method
- endpoint
- authentication
- role
- request data
- response data
- error behavior
- loading behavior

Only use verified contracts.

If a backend contract is unavailable, explicitly mark it:

`Backend contract verification required`

## Types

List:

- new TypeScript types/interfaces
- modified types
- API response/request types
- enums/status types

Use existing project conventions.

## Forms and Validation

Document:

- form fields
- required fields
- client-side validation
- validation messages
- server-side validation errors
- submission behavior
- disabled/loading state

Reuse existing validation libraries and patterns.

## UI States

Document all required:

- initial state
- loading state
- success state
- empty state
- validation error state
- authentication error state
- authorization error state
- not-found state
- conflict/business-rule error state
- server error state
- retry state

## Responsive Design

Explain the expected behavior on:

- mobile
- tablet
- desktop

Use existing responsive conventions.

## Accessibility

Document important:

- keyboard interactions
- focus behavior
- labels
- semantic elements
- dialog behavior
- error announcements
- disabled/loading behavior

## Authentication and Authorization

Explain:

- whether login is required
- how the frontend determines authentication state
- route protection
- role-based UI
- redirects
- unauthorized UI

Do not treat frontend authorization as a security boundary.

## Realtime / Async Behavior

If applicable, document:

- WebSocket
- Socket.IO
- polling
- subscriptions
- optimistic updates
- background refresh
- reconnection behavior

If not applicable:

`No realtime behavior required`

## Backend Changes Required

If backend changes are required, document them as coordination requirements.

Include:

- endpoint requirements
- request/response contract
- status codes
- authentication
- authorization
- business rules
- database requirements if known

If none:

`No backend changes required`

## Files to Change

List every existing frontend file that will be modified.

Use actual paths.

## Files to Create

List every new frontend file that will be created.

Use actual paths.

## New Dependencies

List any new npm packages.

If none:

`No new dependencies`

Do not add a dependency when an existing project dependency can solve the requirement.

## Rules for Implementation

Include specific constraints that must be followed.

Always include:

- Reuse existing frontend architecture and patterns.
- Reuse existing components before creating new ones.
- All new templates/pages must use the project's established UI system; if shadcn/ui is used, use shadcn/ui components.
- Do not invent backend endpoints or API contracts.
- Do not put business/security authorization logic only in the frontend.
- Keep API calls out of presentational components when the project uses a service/hook architecture.
- Keep server state separate from local UI state where applicable.
- Follow existing TypeScript, naming, routing, styling, validation, and error-handling conventions.
- Do not modify backend files.
- If backend work is required, document it under `Backend Changes Required`.
- Do not expose secrets or private environment-variable values in frontend code.
- Use environment variables only according to the project's existing convention.
- Handle loading, empty, error, and success states.
- Ensure responsive behavior.
- Ensure accessible interactions.
- Avoid unnecessary dependencies.
- Do not duplicate existing functionality.

## Definition of Done

Every item must be testable by running the frontend application.

Include relevant checks such as:

- [ ] Required route is available.
- [ ] Correct users can access the feature.
- [ ] Unauthorized users are redirected or blocked according to project conventions.
- [ ] Page renders correctly on mobile, tablet, and desktop.
- [ ] API requests use the correct endpoint and HTTP method.
- [ ] Request data matches the verified backend contract.
- [ ] Successful API responses are handled correctly.
- [ ] Loading states are displayed correctly.
- [ ] Empty states are displayed correctly.
- [ ] Validation errors are displayed correctly.
- [ ] Backend errors are displayed correctly.
- [ ] Navigation works correctly after successful/failed operations.
- [ ] Ride/payment/status changes are reflected correctly when applicable.
- [ ] Realtime updates work correctly when applicable.
- [ ] Existing functionality remains unaffected.
- [ ] No unnecessary dependency was introduced.
- [ ] TypeScript/build/lint checks pass according to project conventions.

---

# Step 13 — Create the feature branch

Before creating the branch, inspect:

`git status`

The intended branch is:

`feature/<feature_slug>`

If the branch already exists:

- do not recreate it
- warn the user
- STOP

Before creating the branch:

- ensure the current repository is the frontend repository
- ensure the requested roadmap step is not already complete
- ensure a specification does not already exist
- do not discard uncommitted user changes
- do not use `git reset --hard`
- do not use destructive Git commands

Create the branch using:

`git checkout -b feature/<feature_slug>`

If branch creation fails, STOP and report the error.

Do not force-create or overwrite an existing branch.

---

# Step 14 — Save the specification

Ensure this directory exists:

`.opencode/specs/`

Save the specification exactly to:

`.opencode/specs/<step_number>-<feature_slug>.md`

Example:

`.opencode/specs/05-ride-request.md`

Do not save it to:

`..opencode/specs/`

Before writing:

- ensure the filename is unique
- do not overwrite an existing specification
- verify the specification path
- ensure the file contains the complete specification

Do not commit the specification automatically.

---

# Step 15 — Verify the result

After creating the specification:

1. Confirm the feature branch exists.
2. Confirm the specification file exists.
3. Read the created specification.
4. Verify that it contains:
   - Overview
   - Depends on
   - User Roles
   - User Experience
   - Routes
   - Pages
   - Components
   - Hooks / State
   - API Integration
   - Types
   - Forms and Validation
   - UI States
   - Responsive Design
   - Accessibility
   - Authentication and Authorization
   - Backend Changes Required
   - Files to Change
   - Files to Create
   - New Dependencies
   - Rules for Implementation
   - Definition of Done
5. Verify no existing specification was overwritten.
6. Verify no application source files were modified by this command.
7. Verify no backend files were modified.
8. Verify no Git commit was created.

If verification fails, report the failure clearly.

---

# Step 16 — Report to the user

Print a short summary in exactly this format:

```text
Branch:    <branch_name>
Spec file: .opencode/specs/<step_number>-<feature_slug>.md
Title:     <feature_title>
```

Then tell the user:

`Review the spec at .opencode/specs/<step_number>-<feature_slug>.md`

`then enter Plan Mode with Shift+Tab twice to begin implementation.`

Do not print the full specification in chat unless explicitly asked.
