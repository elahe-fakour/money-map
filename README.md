# MoneyMap

MoneyMap is a responsive personal finance management app built with React,
TypeScript, and Vite. The project will grow step by step into a dashboard for
tracking income, expenses, accounts, budgets, savings goals, and reports.

## Current Step

Step 14 adds finance state management:

- `FinanceProvider` stores the shared finance data with `useReducer`.
- `useFinance` gives routes access to accounts, categories, budgets, settings,
  goals, and transactions.
- Transaction add, update, and delete actions now update shared app state.
- Dashboard and Transactions read from the same state source.

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Learning Notes

In this step, focus on these concepts:

- Context makes shared state available across route components.
- Reducers centralize how state changes happen.
- Actions describe state changes in a predictable way.
- Derived UI, such as dashboard totals, should read from shared state.

See `PROJECT_PLAN.md` for the product plan and `MONEY_MAP_TASKS.md` for the
full roadmap.
