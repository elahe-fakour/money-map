# MoneyMap

MoneyMap is a responsive personal finance management app built with React,
TypeScript, and Vite. The project will grow step by step into a dashboard for
tracking income, expenses, accounts, budgets, savings goals, and reports.

## Current Step

Step 4 adds the core TypeScript finance models:

- Shared domain types live in `src/types`.
- Finance entities include accounts, categories, transactions, budgets, goals,
  settings, and monthly reports.
- Literal union types define controlled values such as transaction type and
  account type.

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Learning Notes

In this step, focus on these concepts:

- TypeScript models describe the shape of app data before UI code uses it.
- Union types keep allowed values explicit without using runtime enums.
- Shared types help future forms, mock data, and state management stay
  consistent.
- Optional fields, such as transaction notes, model data that may not always be
  present.

See `PROJECT_PLAN.md` for the product plan and `MONEY_MAP_TASKS.md` for the
full roadmap.
