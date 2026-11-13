# Hotel Booking Platform

A hotel reservation application source tree with a TypeScript backend, TypeScript frontend, hotel and booking models, account/admin access middleware, and Playwright end-to-end test sources.

## Main flows represented in source

- Hotel search and filtering, hotel detail, and review pages.
- Booking creation, booking history, cancellation, and business/analytics routes.
- Account and administrator routes with separate authorization middleware.
- Seed and maintenance scripts under the backend.

## Architecture and layout

- `hotel-booking-frontend/src/` — React/TypeScript application and API client.
- `hotel-booking-backend/src/routes/` — auth, hotels, bookings, reviews, analytics, and related route groups.
- `hotel-booking-backend/src/models/` — users, hotels, bookings, reviews, and analytics.
- `e2e-tests/` — browser test source and test fixtures.
- `data/` and `report-assets/` — project data and documentation assets.

## Setup limitation

The tracked checkout has no package manifests or dependency lockfiles for the frontend, backend, or E2E suite. Consequently, exact install/run commands cannot be verified. A database and provider configuration are required by backend source; no `.env.example` is provided.

## API and next steps

Route definitions are in `hotel-booking-backend/src/routes/`; Swagger setup is in `src/swagger.ts`. Add package manifests, a root setup guide, database seed instructions, a safe configuration template, and documented Playwright prerequisites. No deployment configuration or repository-level `LICENSE` file was found; reuse terms for project code are unspecified.
