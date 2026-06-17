# MoneyMap

MoneyMap is a responsive personal finance management app built with React,
TypeScript, and Vite. The project will grow step by step into a dashboard for
tracking income, expenses, accounts, budgets, savings goals, and reports.

## Current Step

Step 5 adds design tokens and global styles:

- CSS custom properties define shared colors, spacing, radius, shadows, and
  focus states.
- Light and dark theme foundations use the same semantic token names.
- Global element styles keep typography, sizing, and focus behavior consistent.

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Learning Notes

In this step, focus on these concepts:

- Design tokens are reusable decisions, not one-off CSS values.
- Semantic names like `--color-surface` are easier to reuse than raw color names.
- Global styles should set foundations without over-controlling every component.
- Dark mode is easier when components read from tokens instead of hard-coded
  values.

See `PROJECT_PLAN.md` for the product plan and `MONEY_MAP_TASKS.md` for the
full roadmap.
