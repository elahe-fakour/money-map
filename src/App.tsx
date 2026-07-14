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
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
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
    skipToContentLabel: string
    localeLabel: string
    mobileNavLabel: string
    currentPageLabel: string
    quickSettingsLabel: string
    settingsActionLabel: string
    sidebarLabel: string
  }
> = {
  en: {
    brandName: 'MoneyMap',
    brandSubtitle: 'Personal finance manager',
    eyebrow: 'Product preview',
    headerTitle: 'Everyday financial planning',
    skipToContentLabel: 'Skip to main content',
    localeLabel: 'English',
    mobileNavLabel: 'Mobile navigation',
    currentPageLabel: 'Current page',
    quickSettingsLabel: 'Quick settings',
    settingsActionLabel: 'Open settings',
    sidebarLabel: 'Main navigation',
  },
  fa: {
    brandName: 'مانی‌مپ',
    brandSubtitle: 'مدیریت مالی شخصی',
    eyebrow: 'نسخه آزمایشی محصول',
    headerTitle: 'برنامه‌ریزی مالی روزمره',
    skipToContentLabel: 'پرش به محتوای اصلی',
    localeLabel: 'فارسی',
    mobileNavLabel: 'ناوبری موبایل',
    currentPageLabel: 'صفحه فعلی',
    quickSettingsLabel: 'تنظیمات سریع',
    settingsActionLabel: 'رفتن به تنظیمات',
    sidebarLabel: 'ناوبری اصلی',
  },
}

function App() {
  const { settings } = useFinance()
  const location = useLocation()
  const items = navigationItems[settings.locale]
  const copy = shellCopy[settings.locale]
  const currentItem =
    items
      .filter((item) =>
        item.end ? location.pathname === item.to : location.pathname.startsWith(item.to),
      )
      .sort((first, second) => second.to.length - first.to.length)[0] ?? items[0]

  useEffect(() => {
    const root = document.documentElement

    root.lang = settings.locale
    root.dir = settings.direction
    root.dataset.theme = settings.themeMode
  }, [settings.direction, settings.locale, settings.themeMode])

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        {copy.skipToContentLabel}
      </a>

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
            <p className="current-page-pill">
              {copy.currentPageLabel}: {currentItem.label}
            </p>
          </div>
          <Link
            className="header-actions"
            to="/settings"
            aria-label={copy.quickSettingsLabel}
          >
            <span className="locale-chip">{copy.localeLabel}</span>
            <span className="currency-chip">{settings.currency}</span>
            <span className="settings-link-label">
              <Settings aria-hidden="true" size={17} />
              {copy.settingsActionLabel}
            </span>
          </Link>
        </header>

        <main className="page-content" id="main-content" tabIndex={-1}>
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
            title={item.label}
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
