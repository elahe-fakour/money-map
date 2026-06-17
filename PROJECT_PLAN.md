# MoneyMap Product Plan

MoneyMap is a responsive personal finance management web app for people who
want a clear monthly view of their money. The product should feel like a small
but realistic SaaS dashboard, with enough polish and structure to demonstrate
professional React frontend skills.

## Product Goal

Help users understand where their money comes from, where it goes, and whether
they are staying within their monthly plan.

The app should make common personal finance tasks easy:

- See a quick financial summary.
- Track income and expenses.
- Organize spending by category.
- Monitor account balances.
- Compare budgets with actual spending.
- Review simple monthly reports.

## Primary User

The primary user is an individual who wants to manage personal finances without
using a complex accounting tool.

They need:

- Fast access to the current month status.
- Simple transaction entry and filtering.
- Clear visual feedback for budgets and spending patterns.
- A responsive interface that works well on desktop and mobile.

## MVP Features

The MVP should focus on the core experience before advanced tooling.

- Dashboard with balance, income, expenses, savings rate, and recent activity.
- Transactions page with list, search, filters, sorting, and empty states.
- Categories for organizing income and expenses.
- Budgets per category with spent, remaining, warning, and over-budget states.
- Accounts overview with account balances.
- Basic reports for monthly income, expenses, and category breakdown.
- Responsive layout with desktop navigation and mobile-friendly navigation.
- Basic tests for important UI flows.
- README documentation for setup, scripts, and project structure.

## Future Features

These features can be added after the MVP is stable:

- Savings goals with target amount, deadline, progress, and contributions.
- CSV export and optional CSV import.
- End-to-end tests with Playwright.
- Storybook stories for reusable UI components.
- Performance optimization and Lighthouse checks.
- Dark mode and currency settings.
- Mock API layer with MSW or another local mock service.

## Frontend Skills Covered

MoneyMap is designed to show skills that are common in React developer job
descriptions.

| Skill | Where It Appears |
| --- | --- |
| React component design | Dashboard cards, forms, tables, navigation, charts |
| TypeScript | Finance models, props, state, form values, API shapes |
| Routing | Pages for dashboard, transactions, budgets, accounts, reports, settings |
| State management | Transactions, accounts, budgets, filters, derived totals |
| Forms and validation | Add/edit transactions, budgets, accounts, savings goals |
| Data visualization | Cash flow and category breakdown charts |
| Responsive UI | Desktop sidebar, mobile navigation, adaptive tables/cards |
| Accessibility | Semantic HTML, labels, focus states, validation messages |
| Testing | Rendering states, user flows, form behavior, filtering |
| Documentation | README, roadmap, product plan, learning notes |

## Learning Focus

Build the project in small steps. Each task should answer two questions:

- What user-facing capability did we add?
- What frontend concept did we practice?

For this planning step, the concept is product scope. A clear scope helps us
avoid building random screens and gives every future component a reason to
exist.
