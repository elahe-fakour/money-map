# MoneyMap

MoneyMap is a responsive personal finance management app built with React,
TypeScript, and Vite. The project will grow step by step into a dashboard for
tracking income, expenses, accounts, budgets, savings goals, and reports.

## Current Step

Step 12 adds the validated transaction form:

- `react-hook-form` manages transaction form state.
- `zod` defines validation rules for amount, date, category, account, and
  transfer destination.
- Form errors are shown next to the related field.
- The submit flow validates a transaction preview before future state
  management connects it to the list.

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Learning Notes

In this step, focus on these concepts:

- Form libraries reduce repetitive input state code.
- Schema validation keeps form rules explicit and reusable.
- Conditional fields, such as transfer destination, need conditional validation.
- UI can validate data now and persist it later when state management is ready.

See `PROJECT_PLAN.md` for the product plan and `MONEY_MAP_TASKS.md` for the
full roadmap.
