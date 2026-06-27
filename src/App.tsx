import { useEffect } from 'react'
import {
  BarChart3,
  CreditCard,
  Gauge,
  Goal,
  Landmark,
  PieChart,
  ReceiptText,
  Settings,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'
import { useFinance } from './hooks/useFinance'
import type { AppLocale } from './types'
import './App.css'

const navigationItems = {
  en: [
    { to: '/', label: 'Dashboard', shortLabel: 'Home', Icon: Gauge, end: true },
    {
      to: '/transactions',
      label: 'Transactions',
      shortLabel: 'Txn',
      Icon: ReceiptText,
    },
    { to: '/budgets', label: 'Budgets', shortLabel: 'Budget', Icon: PieChart },
    {
      to: '/accounts',
      label: 'Accounts',
      shortLabel: 'Accounts',
      Icon: CreditCard,
    },
    { to: '/reports', label: 'Reports', shortLabel: 'Reports', Icon: BarChart3 },
    { to: '/goals', label: 'Goals', shortLabel: 'Goals', Icon: Goal },
    {
      to: '/settings',
      label: 'Settings',
      shortLabel: 'Settings',
      Icon: Settings,
    },
  ],
  fa: [
    { to: '/', label: 'داشبورد', shortLabel: 'خانه', Icon: Gauge, end: true },
    {
      to: '/transactions',
      label: 'تراکنش‌ها',
      shortLabel: 'تراکنش',
      Icon: ReceiptText,
    },
    { to: '/budgets', label: 'بودجه‌ها', shortLabel: 'بودجه', Icon: PieChart },
    { to: '/accounts', label: 'حساب‌ها', shortLabel: 'حساب', Icon: CreditCard },
    { to: '/reports', label: 'گزارش‌ها', shortLabel: 'گزارش', Icon: BarChart3 },
    { to: '/goals', label: 'اهداف', shortLabel: 'اهداف', Icon: Goal },
    {
      to: '/settings',
      label: 'تنظیمات',
      shortLabel: 'تنظیم',
      Icon: Settings,
    },
  ],
} satisfies Record<AppLocale, Array<{
  Icon: LucideIcon
  end?: boolean
  label: string
  shortLabel: string
  to: string
}>>

const shellCopy: Record<
  AppLocale,
  {
    brandName: string
    brandSubtitle: string
    eyebrow: string
    headerTitle: string
    localeLabel: string
    mobileNavLabel: string
    quickSettingsLabel: string
    sidebarLabel: string
  }
> = {
  en: {
    brandName: 'MoneyMap',
    brandSubtitle: 'Personal finance manager',
    eyebrow: 'Product preview',
    headerTitle: 'Responsive personal finance dashboard',
    localeLabel: 'English',
    mobileNavLabel: 'Mobile navigation',
    quickSettingsLabel: 'Quick settings',
    sidebarLabel: 'Main navigation',
  },
  fa: {
    brandName: 'مانی‌مپ',
    brandSubtitle: 'مدیریت مالی شخصی',
    eyebrow: 'نسخه آزمایشی محصول',
    headerTitle: 'داشبورد مالی فارسی و واکنش‌گرا',
    localeLabel: 'فارسی',
    mobileNavLabel: 'ناوبری موبایل',
    quickSettingsLabel: 'تنظیمات سریع',
    sidebarLabel: 'ناوبری اصلی',
  },
}

function App() {
  const { settings } = useFinance()
  const items = navigationItems[settings.locale]
  const copy = shellCopy[settings.locale]

  useEffect(() => {
    const root = document.documentElement

    root.lang = settings.locale
    root.dir = settings.direction
    root.dataset.theme = settings.themeMode
  }, [settings.direction, settings.locale, settings.themeMode])

  return (
    <div className="app-shell">
      <aside className="app-sidebar" aria-label={copy.sidebarLabel}>
        <div className="brand-block">
          <span className="brand-mark" aria-hidden="true">
            <Landmark size={24} strokeWidth={2.4} />
          </span>
          <div>
            <p className="brand-name">{copy.brandName}</p>
            <p className="brand-subtitle">{copy.brandSubtitle}</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {items.map((item) => (
            <NavLink
              className={({ isActive }) =>
                isActive ? 'nav-link nav-link-active' : 'nav-link'
              }
              end={item.end}
              key={item.to}
              to={item.to}
            >
              <span className="nav-symbol" aria-hidden="true">
                <item.Icon size={18} strokeWidth={2.25} />
              </span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="app-content">
        <header className="app-header">
          <div>
            <p className="eyebrow">{copy.eyebrow}</p>
            <h2>{copy.headerTitle}</h2>
          </div>
          <div className="header-actions" aria-label={copy.quickSettingsLabel}>
            <span className="locale-chip">{copy.localeLabel}</span>
            <span className="currency-chip">{settings.currency}</span>
          </div>
        </header>

        <main className="page-content">
          <Outlet />
        </main>
      </div>

      <nav className="mobile-nav" aria-label={copy.mobileNavLabel}>
        {items.map((item) => (
          <NavLink
            className={({ isActive }) =>
              isActive ? 'mobile-nav-link mobile-nav-link-active' : 'mobile-nav-link'
            }
            end={item.end}
            key={item.to}
            to={item.to}
          >
            <span className="mobile-nav-symbol" aria-hidden="true">
              <item.Icon size={17} strokeWidth={2.4} />
            </span>
            <span>{item.shortLabel}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

export default App
