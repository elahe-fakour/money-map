import { createBrowserRouter } from 'react-router-dom'
import { type ReactNode, Suspense } from 'react'
import App from '../App'
import {
  AccountsPage,
  BudgetsPage,
  DashboardPage,
  GoalsPage,
  NotFoundPage,
  ReportsPage,
  RouteFallback,
  SettingsPage,
  TransactionsPage,
} from './LazyPages'

const withRouteFallback = (page: ReactNode) => (
  <Suspense fallback={<RouteFallback />}>
    {page}
  </Suspense>
)

const routerBasename = import.meta.env.BASE_URL.replace(/\/$/, '')

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <App />,
      children: [
        {
          index: true,
          element: withRouteFallback(<DashboardPage />),
        },
        {
          path: 'transactions',
          element: withRouteFallback(<TransactionsPage />),
        },
        {
          path: 'budgets',
          element: withRouteFallback(<BudgetsPage />),
        },
        {
          path: 'accounts',
          element: withRouteFallback(<AccountsPage />),
        },
        {
          path: 'reports',
          element: withRouteFallback(<ReportsPage />),
        },
        {
          path: 'goals',
          element: withRouteFallback(<GoalsPage />),
        },
        {
          path: 'settings',
          element: withRouteFallback(<SettingsPage />),
        },
        {
          path: '*',
          element: withRouteFallback(<NotFoundPage />),
        },
      ],
    },
  ],
  {
    basename: routerBasename,
  },
)
