# MoneyMap

MoneyMap is a responsive personal finance management app built with React,
TypeScript, and Vite. The project will grow step by step into a dashboard for
tracking income, expenses, accounts, budgets, savings goals, and reports.

## Current Step

Step 8 adds the mock finance data layer:

- `src/data` contains realistic Persian mock finance data.
- `src/utils` contains reusable finance calculation helpers.
- `src/services` exposes a mock finance snapshot for future UI screens.
- Mock data follows the shared TypeScript models in `src/types`.

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Learning Notes

In this step, focus on these concepts:

- Mock data lets us build UI before a real backend exists.
- Services keep components from depending directly on raw data files.
- Utility functions keep repeated calculations out of components.
- TypeScript catches mismatches between fake data and real app models.

See `PROJECT_PLAN.md` for the product plan and `MONEY_MAP_TASKS.md` for the
full roadmap.
