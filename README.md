# MoneyMap

MoneyMap is a responsive personal finance management app built with React,
TypeScript, and Vite. The project will grow step by step into a dashboard for
tracking income, expenses, accounts, budgets, savings goals, and reports.

## Current Step

Step 9 builds the dashboard summary:

- Dashboard cards show total balance, monthly income, monthly expenses, and
  savings rate.
- Recent transactions use the mock data service.
- Budget progress previews show spent amount, limit, and status color.
- Currency and dates are formatted for the Persian locale.

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Learning Notes

In this step, focus on these concepts:

- Derived data turns raw transactions and accounts into useful UI summaries.
- Components should format values before showing them to users.
- Feature-specific CSS keeps dashboard styles close to dashboard code.
- Lists need stable keys and responsive layouts from the start.

See `PROJECT_PLAN.md` for the product plan and `MONEY_MAP_TASKS.md` for the
full roadmap.
