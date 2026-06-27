import { lazy } from 'react'

export const AccountsPage = lazy(() =>
  import('../features/accounts/AccountsPage').then((module) => ({
    default: module.AccountsPage,
  })),
)

export const BudgetsPage = lazy(() =>
  import('../features/budgets/BudgetsPage').then((module) => ({
    default: module.BudgetsPage,
  })),
)

export const DashboardPage = lazy(() =>
  import('../features/dashboard/DashboardPage').then((module) => ({
    default: module.DashboardPage,
  })),
)

export const GoalsPage = lazy(() =>
  import('../features/goals/GoalsPage').then((module) => ({
    default: module.GoalsPage,
  })),
)

export const NotFoundPage = lazy(() =>
  import('../features/not-found/NotFoundPage').then((module) => ({
    default: module.NotFoundPage,
  })),
)

export const ReportsPage = lazy(() =>
  import('../features/reports/ReportsPage').then((module) => ({
    default: module.ReportsPage,
  })),
)

export const SettingsPage = lazy(() =>
  import('../features/settings/SettingsPage').then((module) => ({
    default: module.SettingsPage,
  })),
)

export const TransactionsPage = lazy(() =>
  import('../features/transactions/TransactionsPage').then((module) => ({
    default: module.TransactionsPage,
  })),
)

export function RouteFallback() {
  return (
    <section className="route-loading" aria-label="در حال بارگذاری صفحه">
      در حال بارگذاری...
    </section>
  )
}
