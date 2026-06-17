# MoneyMap

MoneyMap is a responsive personal finance management app built with React,
TypeScript, and Vite. The project will grow step by step into a dashboard for
tracking income, expenses, accounts, budgets, savings goals, and reports.

## Current Step

Step 13 adds transaction editing and deletion:

- The transaction form can add new records to the page state.
- Existing transactions can be loaded into the form and edited.
- Deleting a transaction requires a confirmation panel.
- Updates are local to the transactions page until shared state management is
  added.

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Learning Notes

In this step, focus on these concepts:

- Array state updates should return new arrays instead of mutating old ones.
- Editing reuses the same form by resetting it with selected record values.
- Confirmation UI protects users before destructive actions.
- Local page state is useful, but shared state will be needed across routes.

See `PROJECT_PLAN.md` for the product plan and `MONEY_MAP_TASKS.md` for the
full roadmap.
