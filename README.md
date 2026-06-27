# MoneyMap

MoneyMap is a responsive personal finance management app built with React,
TypeScript, and Vite. The project will grow step by step into a dashboard for
tracking income, expenses, accounts, budgets, savings goals, and reports.

## Current Step

Step 18 builds financial reports:

- The reports page summarizes income, expenses, and savings rate for the latest
  month.
- Charts compare income and expenses across months.
- Expense breakdown shows category-level spending.
- Simple insights highlight the highest spending category and savings-rate
  change.

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Learning Notes

In this step, focus on these concepts:

- Reports are built from derived data, not separate hard-coded numbers.
- Month grouping is a common frontend data transformation.
- Comparisons need a current period and a previous period.
- Insights turn raw totals into useful user-facing explanations.

See `PROJECT_PLAN.md` for the product plan and `MONEY_MAP_TASKS.md` for the
full roadmap.
