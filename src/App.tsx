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
import { NavLink, Outlet } from 'react-router-dom'
import './App.css'

const navigationItems = [
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
]

function App() {
  return (
    <div className="app-shell">
      <aside className="app-sidebar" aria-label="ناوبری اصلی">
        <div className="brand-block">
          <span className="brand-mark" aria-hidden="true">
            <Landmark size={24} strokeWidth={2.4} />
          </span>
          <div>
            <p className="brand-name">مانی‌مپ</p>
            <p className="brand-subtitle">مدیریت مالی شخصی</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navigationItems.map((item) => (
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
            <p className="eyebrow">نسخه آزمایشی محصول</p>
            <h2>داشبورد مالی فارسی و واکنش‌گرا</h2>
          </div>
          <div className="header-actions" aria-label="تنظیمات سریع">
            <span className="locale-chip">فارسی</span>
            <span className="currency-chip">IRR</span>
          </div>
        </header>

        <section className="status-panel" aria-labelledby="status-title">
          <h2 id="status-title">چیدمان واکنش‌گرا آماده است</h2>
          <p>
            در دسکتاپ از سایدبار استفاده می‌کنیم و در موبایل ناوبری پایین صفحه
            نمایش داده می‌شود.
          </p>
        </section>

        <main className="page-content">
          <Outlet />
        </main>
      </div>

      <nav className="mobile-nav" aria-label="ناوبری موبایل">
        {navigationItems.map((item) => (
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
