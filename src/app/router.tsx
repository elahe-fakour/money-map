import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import { AccountsPage } from '../features/accounts/AccountsPage'
import { BudgetsPage } from '../features/budgets/BudgetsPage'
import { DashboardPage } from '../features/dashboard/DashboardPage'
import { GoalsPage } from '../features/goals/GoalsPage'
import { NotFoundPage } from '../features/not-found/NotFoundPage'
import { ReportsPage } from '../features/reports/ReportsPage'
import { SettingsPage } from '../features/settings/SettingsPage'
import { TransactionsPage } from '../features/transactions/TransactionsPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'transactions',
        element: <TransactionsPage />,
      },
      {
        path: 'budgets',
        element: <BudgetsPage />,
      },
      {
        path: 'accounts',
        element: <AccountsPage />,
      },
      {
        path: 'reports',
        element: <ReportsPage />,
      },
      {
        path: 'goals',
        element: <GoalsPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
])
