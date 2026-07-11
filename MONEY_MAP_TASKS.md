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
- Keep styles ready for both left-to-right and right-to-left layouts.
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
- Make the layout work for both English and Persian text direction.
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
- Add basic tests for language and direction switching.
- Suggested commit: `test: add tests and component stories`

## 20. Performance, Documentation, And Deployment

- Add route-level lazy loading where useful.
- Check responsive behavior and Lighthouse performance.
- Complete the README.
- Prepare the app for deployment on Vercel or Netlify.
- Suggested commit: `docs: finalize project documentation`

## 21. Settings Page Polish

- Build a real settings page instead of a placeholder.
- Add controls for language, text direction, currency, and theme mode.
- Store settings changes in shared finance state.
- Keep data import/export as a documented future feature.
- Suggested commit: `feat: build app settings page`

## 22. Local Storage Persistence

- Load finance state from browser localStorage when the app starts.
- Save finance state changes back to localStorage automatically.
- Add a settings action to reset the app to sample data.
- Cover persisted state behavior with provider tests.
- Suggested commit: `feat: persist finance state locally`

## 23. Apply App Preferences

- Apply saved language, direction, and theme settings to the document.
- Localize the app shell navigation and header between Persian and English.
- Show the selected currency in the global header.
- Make explicit light, dark, and system theme modes work through CSS tokens.
- Suggested commit: `feat: apply app preferences`

## 24. Data Backup And Restore

- Add a JSON export action for the current finance state.
- Add a JSON import action that validates the backup before replacing state.
- Keep reset-to-sample-data available from settings.
- Reuse the same finance-state validation for localStorage and imported backups.
- Suggested commit: `feat: add data backup and restore`

## 25. Accurate Dashboard Month Metrics

- Pick the dashboard reporting month from the latest transaction.
- Filter monthly income, expenses, recent activity, budget preview, and expense breakdown by that month.
- Replace the hard-coded month label with a formatted dynamic month.
- Add tests for month selection and month-based transaction filtering.
- Suggested commit: `fix: align dashboard metrics with report month`

## 26. Dashboard Month Switcher

- Extract available reporting months from transaction data.
- Add a dashboard month switcher for reviewing previous months.
- Keep all dashboard summary cards, recent activity, budgets, and charts tied to the selected month.
- Add tests for transaction month extraction.
- Suggested commit: `feat: add dashboard month switcher`

## 27. Dashboard Empty States

- Show useful empty states for months without recent activity, budgets, or expense breakdown data.
- Avoid rendering blank chart and list panels when a selected month has partial data.
- Keep dashboard panels visually consistent across populated and empty states.
- Suggested commit: `style: add dashboard empty states`

## 28. Transaction Form Defaults

- Replace the hard-coded transaction form date with today's date.
- Keep the date fresh when the form resets after adding or canceling edits.
- Update stale form helper text to match the current persisted state behavior.
- Suggested commit: `fix: use current date for transaction form`

## 29. Account Balance Sync

- Update account balances when transactions are added.
- Reverse balance effects when transactions are deleted.
- Recalculate balance effects correctly when transactions are edited.
- Cover account balance sync with provider tests.
- Suggested commit: `fix: sync account balances with transactions`

## 30. Shared Budget Spending Calculation

- Add a shared helper for calculating category spending by month.
- Use the shared helper in the budgets page.
- Use the same live spending calculation in the dashboard budget preview.
- Add unit coverage for category-month spending.
- Suggested commit: `fix: share budget spending calculation`

## 31. Reports Month Switcher

- Reuse shared transaction-month helpers on the reports page.
- Add a month switcher for reviewing historical reports.
- Keep summary cards, category breakdown, insights, and previous-month comparison tied to the selected month.
- Keep the comparison chart ordered from older to newer months.
- Suggested commit: `feat: add reports month switcher`

## 32. Savings Goal Contribution Validation

- Replace the hard-coded default savings goal deadline with a date based on today.
- Prevent contributions that exceed the remaining goal amount.
- Add a max value to the contribution amount input based on the selected goal.
- Suggested commit: `fix: validate savings goal contributions`

## 33. Account Transfer Validation

- Prevent transfers that exceed the source account balance.
- Add a dynamic max value to the transfer amount input.
- Show the available transferable balance near the transfer form.
- Suggested commit: `fix: validate account transfers`

## 34. Transaction Balance Validation

- Prevent expense and transfer transactions from exceeding the selected account balance.
- Show the available balance in the transaction form.
- Keep edit mode accurate by accounting for the transaction currently being edited.
- Suggested commit: `fix: validate transaction balance`

## 35. GitHub Showcase README

- Rewrite the README for portfolio presentation.
- Document the core features, tech stack, project structure, persistence, tests, and deployment notes.
- Leave clear placeholders for live demo and screenshots.
- Suggested commit: `docs: improve portfolio README`

## 36. README Screenshots

- Capture desktop screenshots for dashboard, transactions, and reports.
- Capture a mobile dashboard screenshot.
- Add screenshots to the README portfolio presentation.
- Suggested commit: `docs: add portfolio screenshots`

## 37. Deployment Configuration

- Add Vercel SPA fallback configuration.
- Add Netlify build and redirect configuration.
- Document the deployment config files in the README.
- Suggested commit: `chore: add deployment configuration`

## 38. Portfolio Metadata

- Improve the document title and meta description for portfolio presentation.
- Add theme color metadata.
- Add Open Graph and Twitter summary metadata for shared links.
- Suggested commit: `docs: add portfolio metadata`

## 39. Repository Metadata

- Add package description, keywords, license, and Node engine metadata.
- Add `.nvmrc` for a consistent local Node version.
- Add an MIT license file.
- Document the license in README.
- Suggested commit: `chore: add repository metadata`

## 40. Final Release Audit

- Verify generated build and test output directories are ignored.
- Confirm portfolio screenshots are tracked under docs.
- Run lint, tests, and production build one final time.
- Update README status for the GitHub release point.
- Suggested commit: `chore: complete release audit`

## 41. GitHub Pages Deployment

- Add a GitHub Actions workflow that builds and deploys MoneyMap to GitHub Pages.
- Configure the Vite base path for the `money-map` repository URL.
- Configure React Router to respect the deployed base path.
- Document the GitHub Pages setup steps in README.
- Suggested commit: `chore: add github pages deployment`
