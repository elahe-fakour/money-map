# MoneyMap

MoneyMap is a responsive personal finance management app built with React,
TypeScript, and Vite. The project will grow step by step into a dashboard for
tracking income, expenses, accounts, budgets, savings goals, and reports.

## Current Step

Step 3 adds the frontend folder architecture:

- `src/app` for app-level setup such as routing and state providers.
- `src/components` for reusable UI, layout, chart, and form components.
- `src/features` for product areas such as dashboard and transactions.
- `src/hooks` for custom React hooks.
- `src/services` for API and data access logic.
- `src/types` for shared TypeScript models.
- `src/utils` for general helper functions.
- `src/data` for mock or seed data.

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Learning Notes

In this step, focus on these concepts:

- Folder structure is a communication tool for future developers.
- Feature folders keep product-specific code close together.
- Shared folders should stay reusable and avoid depending on one feature.
- Empty folders need placeholder files because Git does not track directories
  by themselves.

See `PROJECT_PLAN.md` for the product plan and `MONEY_MAP_TASKS.md` for the
full roadmap.
