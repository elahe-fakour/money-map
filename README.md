# MoneyMap

MoneyMap is a responsive personal finance management app built with React,
TypeScript, and Vite. The project will grow step by step into a dashboard for
tracking income, expenses, accounts, budgets, savings goals, and reports.

## Current Step

Step 17 builds savings goals:

- The savings goals page shows target amount, current amount, deadline, and
  progress.
- Users can create new savings goals.
- Users can add contributions from an account to a goal.
- Contributions update the goal, reduce the selected account balance, and add a
  transaction to shared state.

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Learning Notes

In this step, focus on these concepts:

- Goal progress is derived from current amount divided by target amount.
- A single user action can update multiple pieces of state.
- Contribution flows should keep accounts and transaction history aligned.
- Small feature pages can still reuse the same shared finance state.

See `PROJECT_PLAN.md` for the product plan and `MONEY_MAP_TASKS.md` for the
full roadmap.
