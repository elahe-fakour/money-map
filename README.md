# MoneyMap

MoneyMap is a responsive personal finance management app built with React,
TypeScript, and Vite. The project will grow step by step into a dashboard for
tracking income, expenses, accounts, budgets, savings goals, and reports.

## Current Step

Step 11 builds the transactions list:

- The transactions page now uses mock finance data.
- Users can search by note, category, account, or transaction type.
- Transactions can be filtered by type and sorted by date or amount.
- The list adapts from a desktop table layout to mobile-friendly cards.

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Learning Notes

In this step, focus on these concepts:

- Controlled inputs store UI state with `useState`.
- `useMemo` keeps derived filtered lists predictable.
- Filtering and sorting are client-side data transformations.
- Empty states explain what happened when filters return no results.

See `PROJECT_PLAN.md` for the product plan and `MONEY_MAP_TASKS.md` for the
full roadmap.
