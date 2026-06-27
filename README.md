# MoneyMap

MoneyMap is a responsive Persian personal finance management app built with
React, TypeScript, and Vite. It includes a dashboard, transactions, accounts,
budgets, savings goals, and reports backed by shared mock finance state.

## Features

- Persian RTL interface
- Responsive app shell with desktop sidebar and mobile bottom navigation
- Dashboard summary cards and charts
- Transactions list with search, filters, sorting, add, edit, and delete flows
- Accounts page with account creation and transfers
- Monthly budgets with progress and warning states
- Savings goals with contribution flow
- Financial reports with charts and insights
- Shared finance state with Context and `useReducer`
- Unit, integration, end-to-end, and Storybook foundations

## Tech Stack

- React + TypeScript
- Vite
- React Router
- Context + `useReducer`
- React Hook Form + Zod
- Recharts
- Lucide React
- Vitest + React Testing Library
- Playwright
- Storybook

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm test
npm run test:watch
npm run test:e2e
npm run storybook
npm run storybook:build
npm run preview
```

## Getting Started

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Testing

```bash
npm test
npm run lint
npm run build
```

For Playwright, install browsers once:

```bash
npx playwright install chromium
```

Then run:

```bash
npm run test:e2e
```

If browser download is blocked by network/location restrictions, run the install
command from a network that can access the Playwright CDN.

## Storybook

```bash
npm run storybook
```

Build static Storybook:

```bash
npm run storybook:build
```

## Deployment

The app is a Vite static frontend and can be deployed to Vercel, Netlify, or any
static host.

Recommended deployment settings:

- Build command: `npm run build`
- Output directory: `dist`
- Node version: use an active LTS version such as Node 22 or Node 24

See `PROJECT_PLAN.md` for the product plan and `MONEY_MAP_TASKS.md` for the
full roadmap.
