# MoneyMap

MoneyMap is a responsive personal finance management app built with React,
TypeScript, and Vite. The project will grow step by step into a dashboard for
tracking income, expenses, accounts, budgets, savings goals, and reports.

## Current Step

Step 6 configures app routing:

- `react-router-dom` provides browser routing.
- `src/app/router.tsx` defines the central route map.
- Feature folders contain the first page components for each route.
- A fallback not found page handles unknown URLs.

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Learning Notes

In this step, focus on these concepts:

- A route maps a URL path to a React component.
- Layout routes can render shared UI and place child pages with `Outlet`.
- `NavLink` can style links differently when their route is active.
- A catch-all route keeps unknown URLs from becoming a blank page.

See `PROJECT_PLAN.md` for the product plan and `MONEY_MAP_TASKS.md` for the
full roadmap.
