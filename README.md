# MoneyMap

MoneyMap is a responsive personal finance management app built with React,
TypeScript, and Vite. The project will grow step by step into a dashboard for
tracking income, expenses, accounts, budgets, savings goals, and reports.

## Current Step

Step 16 builds monthly budgets:

- The budgets page shows monthly category budgets.
- Budget cards show spent amount, remaining amount, progress, and status.
- Users can create and edit category budgets.
- Budget progress is derived from expense transactions in shared state.

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Learning Notes

In this step, focus on these concepts:

- Derived data keeps budgets aligned with real transaction activity.
- Status labels make thresholds visible to users.
- Editing can reuse the same form by loading selected budget values.
- Duplicate prevention protects data quality before a backend exists.

See `PROJECT_PLAN.md` for the product plan and `MONEY_MAP_TASKS.md` for the
full roadmap.
