# Amazon Clone Redesign

A modern e-commerce storefront inspired by Amazon's shopping experience, built with Next.js, React, TypeScript, and Supabase. The project focuses on a cleaner redesign, shopping flow, and responsive storefront UX while still being in active development.

## Overview

This project is a portfolio prototype of an Amazon-like storefront with product browsing, cart, wishlist, support, and a responsive dark/light theme. Supabase provides product data and authentication; payments and real fulfillment are intentionally out of scope.

The current codebase includes:

- shopping layout and navigation
- Supabase Auth registration, sign-in, password recovery, and isolated anonymous demo sessions
- cart and wishlist flows
- theme switching
- product data access through Supabase
- Redux store setup for app state management

## Current status

This is a portfolio demo, not a production storefront. It does not collect payments or arrange real shipping; orders are demo records.

## Tech stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Redux Toolkit
- Supabase
- GSAP
- React Icons

## Project structure

```bash
.
├── app/
│   ├── (shop)/          # storefront routes and layout
│   ├── api/             # product search endpoint
│   ├── global-error.tsx
│   └── not-found.tsx
├── components/          # storefront UI by feature
├── context/             # theme context
├── lib/                 # data access and shared logic
├── providers/           # app and auth providers
├── public/              # static assets
├── redux/               # client-side state
├── supabase/migrations/ # database setup
├── tests/               # unit tests
├── types/               # shared TypeScript types
├── package.json
├── next.config.ts
├── tsconfig.json
└── vitest.config.mts
```

## Features

- responsive shopping interface
- Amazon-inspired navigation and search bar
- dark/light theme switching
- user profile and notification dropdowns
- product data integration via Supabase
- cart, wishlist, support, and contact pages
- cart order summary with $4.99 shipping (free from $50), category-based recommendations, and a demo checkout
- Supabase Auth with email confirmation, password recovery, and anonymous demo access
- demo order history stored in Supabase and visible only to its owner
- grouped informational notifications for current discounts, low stock (five or fewer), and free-shipping progress; read status is saved in the browser
- modular frontend architecture for future expansion
- custom error and not-found pages, plus an offline notice while the app is open

The offline notice reflects the browser's connection status; it does not guarantee that the server is reachable. A fresh page load without a connection still requires network access because the app does not cache an offline page.

## Routing overview

The app currently includes these main routes under the shop layout:

- `/` – home page
- `/all-products` – all products
- `/<category>` – products in the selected category
- `/auth` – sign-in, registration, anonymous demo access, and password recovery
- `/account` – current user's account
- `/orders` – the current user's demo order history and sample statuses
- `/cart` – shopping cart
- `/checkout` – creates a demo order for a signed-in user; no payment or real shipment is involved
- `/wishlist` – saved products
- `/support` – customer support
- `/faq` – frequently asked questions
- `/contact` – demo contact form; no messages are sent

The contact form is client-side only: it does not transmit or store submitted fields. Basic field limits and a honeypot deter simple automated submissions; they are not a substitute for server-side validation or rate limiting if a real endpoint is added.

Each demo session creates a separate anonymous Supabase user. Visitors can browse products, place demo orders, and cancel their own orders in the Received state. Cancelled orders remain in the history; visitors cannot edit the catalog or other order details. Order prices are calculated in the database from current product data. Demo orders are not purchases and remain available only to the same account. Visitors can convert an anonymous session to a confirmed email account without losing its demo order history.

Signing out ends the anonymous session in the browser but does not delete the Auth user in Supabase. Add monitoring and a safe cleanup process before exposing the demo to significant public traffic.

## Getting started

### Prerequisites

- Node.js 22.12+ (22.x), 24.x, or 26+
- npm

### Install dependencies

```bash
npm install
```

### Environment variables

Create a `.env.local` file in the project root and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
# Optional; configure before enabling CAPTCHA in Supabase
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_turnstile_site_key
```

### Supabase Auth and database setup

1. Enable email sign-in and email confirmation in Supabase Auth.
2. Enable anonymous sign-ins for the **Try demo** button. Each visitor receives an isolated account; converting it to a confirmed email account preserves its demo orders.
3. Configure the local and deployed app URLs in Auth URL Configuration. Add allowed redirect URLs such as `http://localhost:3000/auth/callback` and the matching production URL.
4. Set the minimum password length to at least 12 characters and keep Supabase Auth rate limits enabled. For a public deployment, configure custom SMTP for reliable confirmation and password-recovery emails.
5. Run [`supabase/migrations/20261122150000_demo_orders.sql`](./supabase/migrations/20261122150000_demo_orders.sql) in the Supabase SQL Editor. It makes products read-only to client roles, applies RLS to demo orders, and adds a database function that calculates order prices from current product data.
6. Run [`supabase/migrations/20261122160500_cancel_demo_order.sql`](./supabase/migrations/20261122160500_cancel_demo_order.sql) after the first migration. It permits authenticated users to cancel only their own Received orders. If the first migration was already applied, only the new migration needs to be run.
7. Run [`supabase/migrations/20261122190000_delete_own_account.sql`](./supabase/migrations/20261122190000_delete_own_account.sql) to enable account deletion. The function checks the caller's active session and deletes only their own Auth user; associated demo orders and items are permanently deleted by cascade. Browser-local cart and wishlist data remain.

Account deletion also removes the user's Auth sessions and refresh tokens. Existing access tokens can remain valid until expiry; the deletion function checks the session against `auth.sessions` to reject revoked sessions. Supabase cannot delete users who own Storage objects until those objects are removed or reassigned.

The public Supabase key is intended for client-side use and is safe only with correctly configured permissions and RLS. Never put a `service_role` key in client code. Real payments and admin features are not included.

### Cloudflare Turnstile

Create a Managed Turnstile widget, configure the app's hostname, and set its public site key as `NEXT_PUBLIC_TURNSTILE_SITE_KEY`. Restart the dev server or rebuild after changing this variable. For production, configure the deployed hostname and environment variable; Cloudflare recommends a separate production widget without local hostnames.

Verify the widget appears for sign-in, anonymous demo access, registration, and password recovery before enabling CAPTCHA in Supabase Authentication's Bot and Abuse Protection settings. Select Turnstile and enter its secret key there only, never in the app, `NEXT_PUBLIC_*`, or the repository. Test each flow after enabling it. Setting only the site key does not enable server-side CAPTCHA enforcement; enabling Supabase CAPTCHA without a working widget prevents protected requests.

Supabase's `updateUser` endpoint used to convert an existing anonymous account does not accept a CAPTCHA token. Keep Auth rate limits enabled; CAPTCHA does not replace RLS, monitoring, or anonymous-user cleanup.

After sign-in or demo access, the app returns to the requested page, or home if no destination was specified. Registration requiring email confirmation shows a separate confirmation screen instead of leaving the completed form visible; the email link returns to the requested destination.
Password recovery also shows a separate confirmation screen. Open its email link in the same browser and device that requested it: the PKCE verifier is stored there. The link opens the new-password form after the callback exchanges its code.

### Run the app locally

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

## Available scripts

```bash
npm run dev     # start the development server
npm run build   # build the production app
npm run start   # run the built app
npm run lint    # run ESLint checks
npm test        # run unit tests
```

The unit tests run locally without Supabase credentials. They cover pricing, cart and wishlist state, redirects, auth rate-limit messages, and search validation. They do not replace end-to-end testing against a deployed app and Supabase project.

## Notes

This repository is intentionally in a prototype phase. The architecture is in place, but not all screens, business logic, and data flows are fully complete. The project is best viewed as a redesign foundation and ongoing frontend build.

## License

This project is currently a personal prototype and does not include a formal production license unless added later.

## Development status

Status: active development

The project is still evolving, and the app structure, design system, and integrations may change as features are added.
