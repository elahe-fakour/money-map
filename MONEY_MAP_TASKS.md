# MoneyMap Roadmap

MoneyMap is a responsive personal finance management app for tracking income, expenses, accounts, budgets, savings goals, and reports. We will build it step by step, with one focused commit after each task.

## 1. Project Infrastructure

- Confirm the React + TypeScript + Vite setup works.
- Initialize Git if needed.
- Review `package.json`, scripts, and existing starter files.
- Clean unused starter assets and prepare the app for development.
- Suggested commit: `chore: set up project infrastructure`

## 2. Product Plan And Scope

- Add a short product plan for MoneyMap.
- Define the MVP features.
- Define future features.
- Map project features to frontend job requirements.
- Suggested commit: `docs: add product plan and project scope`

## 3. App Folder Architecture

- Create the main folder structure under `src`.
- Add folders for app setup, components, features, hooks, services, types, utils, and data.
- Keep the architecture simple but scalable.
- Suggested commit: `chore: add frontend folder architecture`

## 4. Core TypeScript Models

- Define finance domain types.
- Add models for transactions, accounts, categories, budgets, goals, and settings.
- Use strict and reusable TypeScript types.
- Suggested commit: `feat: add core finance types`

## 5. Design Tokens And Global Styles

- Set up global CSS variables.
- Add base typography, color, spacing, and responsive rules.
- Prepare light and dark theme foundations.
- Suggested commit: `style: add global design tokens`

## 6. Routing Setup

- Install and configure React Router.
- Add routes for dashboard, transactions, budgets, accounts, reports, goals, and settings.
- Add a fallback not found page.
- Suggested commit: `feat: configure app routing`

## 7. Responsive App Layout

- Build desktop sidebar navigation.
- Build mobile navigation.
- Add top bar and main content layout.
- Make the shell responsive across mobile, tablet, and desktop.
- Suggested commit: `feat: build responsive app layout`

## 8. Mock Data Layer

- Add realistic mock accounts, categories, transactions, budgets, and goals.
- Create reusable data helpers.
- Prepare the project for a future mock API.
- Suggested commit: `feat: add finance mock data`

## 9. Dashboard Summary

- Build dashboard cards for total balance, income, expenses, and savings rate.
- Show recent transactions.
- Add simple budget progress preview.
- Suggested commit: `feat: build dashboard summary`

## 10. Dashboard Charts

- Install and configure a chart library.
- Add expense breakdown chart.
- Add monthly cash flow chart.
- Make charts responsive and accessible.
- Suggested commit: `feat: add dashboard charts`

## 11. Transactions List

- Build transaction list/table.
- Add mobile-friendly transaction cards.
- Add search, filters, sorting, empty states, and loading states.
- Suggested commit: `feat: build transactions list`

## 12. Transaction Form

- Install and configure React Hook Form and Zod.
- Build add transaction form.
- Add validation for amount, date, category, account, and transfer rules.
- Suggested commit: `feat: add validated transaction form`

## 13. Transaction Editing

- Add edit transaction flow.
- Add delete transaction flow.
- Add confirmation UI for destructive actions.
- Keep state updates predictable.
- Suggested commit: `feat: support editing transactions`

## 14. State Management

- Add Redux Toolkit or Context with `useReducer`.
- Move finance data into central state.
- Add selectors for totals, filtered transactions, and reports.
- Suggested commit: `feat: add finance state management`

## 15. Accounts Page

- Build accounts overview page.
- Add account cards and balances.
- Add account creation form.
- Add transfer support between accounts.
- Suggested commit: `feat: build accounts management`

## 16. Budgets Page

- Build monthly budget page.
- Add category budget cards.
- Show spent, remaining, warning, and over-budget states.
- Add budget creation/editing form.
- Suggested commit: `feat: build monthly budgets`

## 17. Savings Goals Page

- Build savings goals page.
- Add goal progress.
- Add target amount and deadline.
- Add contribution flow.
- Suggested commit: `feat: build savings goals`

## 18. Reports Page

- Build monthly financial reports.
- Add income vs expense chart.
- Add category breakdown.
- Add comparison with previous month.
- Add simple financial insights.
- Suggested commit: `feat: build financial reports`

## 19. Testing And Storybook

- Add unit and integration tests with React Testing Library.
- Add end-to-end tests with Playwright.
- Add Storybook stories for reusable components.
- Suggested commit: `test: add tests and component stories`

## 20. Performance, Documentation, And Deployment

- Add route-level lazy loading where useful.
- Check responsive behavior and Lighthouse performance.
- Complete the README.
- Prepare the app for deployment on Vercel or Netlify.
- Suggested commit: `docs: finalize project documentation`
