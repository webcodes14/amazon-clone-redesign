# Amazon Clone Redesign

A modern e-commerce storefront inspired by Amazon's shopping experience, built with Next.js, React, TypeScript, and Supabase. The project focuses on a cleaner redesign, shopping flow, and responsive storefront UX while still being in active development.

## Overview

This project is a redesign and prototype of an Amazon-like online shop. It is intended as a frontend-focused commerce application with mocked and future data integration, user-facing pages for browsing, authentication, cart, wishlist, and support, and a responsive dark/light theme.

The current codebase already includes the foundation for:

- shopping layout and navigation
- user/auth pages
- cart and wishlist flows
- theme switching
- product data access through Supabase
- Redux store setup for app state management

## Current status

This project is still in early development and should be treated as a work in progress. Some sections are scaffolded or intentionally left as placeholders while the UI and functionality are being expanded.

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
│   └── (shop)/
│       ├── auth/
│       ├── cart/
│       ├── contact/
│       ├── support/
│       ├── wishlist/
│       ├── layout.tsx
│       └── page.tsx
├── components/
│   ├── navigation/
│   └── theme/
├── context/
├── lib/
│   ├── auth.ts
│   ├── products.ts
│   └── supabase.ts
├── providers/
├── public/
├── redux/
├── types/
├── .env.local
├── package.json
├── next.config.ts
├── tsconfig.json
├── eslint.config.mjs
├── README.md
└── README_CZ.md
```

## Features

- responsive shopping interface
- Amazon-inspired navigation and search bar
- dark/light theme switching
- user profile and notification dropdowns
- product data integration via Supabase
- cart, wishlist, support, and contact pages
- modular frontend architecture for future expansion

## Routing overview

The app currently includes these main routes under the shop layout:

- `/` – home page
- `/auth` – authentication area
- `/cart` – shopping cart
- `/wishlist` – saved products
- `/support` – customer support
- `/contact` – contact information

## Getting started

### Prerequisites

- Node.js 20+
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
```

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
```

## Notes

This repository is intentionally in a prototype phase. The architecture is in place, but not all screens, business logic, and data flows are fully complete. The project is best viewed as a redesign foundation and ongoing frontend build.

## License

This project is currently a personal prototype and does not include a formal production license unless added later.

## Development status

Status: active development

The project is still evolving, and the app structure, design system, and integrations may change as features are added.
