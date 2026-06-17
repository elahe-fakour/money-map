# MoneyMap

MoneyMap is a responsive personal finance management app built with React,
TypeScript, and Vite. The project will grow step by step into a dashboard for
tracking income, expenses, accounts, budgets, savings goals, and reports.

## Current Step

Step 15 builds accounts management:

- The accounts page shows account cards and total balance.
- Users can add a new account with type, balance, and color.
- Users can transfer money between accounts.
- Transfers update account balances and add a transfer transaction to shared
  state.

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Learning Notes

In this step, focus on these concepts:

- Shared state lets account changes affect other pages.
- Reducer actions can update multiple related data collections.
- Forms can start simple when browser validation is enough.
- Financial transfers need careful source and destination rules.

See `PROJECT_PLAN.md` for the product plan and `MONEY_MAP_TASKS.md` for the
full roadmap.
