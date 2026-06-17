import { NavLink, Outlet } from 'react-router-dom'
import './App.css'

const navigationItems = [
  { to: '/', label: 'داشبورد', shortLabel: 'خانه', symbol: 'خانه', end: true },
  {
    to: '/transactions',
    label: 'تراکنش‌ها',
    shortLabel: 'تراکنش',
    symbol: 'ترا',
  },
  { to: '/budgets', label: 'بودجه‌ها', shortLabel: 'بودجه', symbol: 'بود' },
  { to: '/accounts', label: 'حساب‌ها', shortLabel: 'حساب', symbol: 'حس' },
  { to: '/reports', label: 'گزارش‌ها', shortLabel: 'گزارش', symbol: 'گزا' },
  { to: '/goals', label: 'اهداف', shortLabel: 'اهداف', symbol: 'هدف' },
  {
    to: '/settings',
    label: 'تنظیمات',
    shortLabel: 'تنظیم',
    symbol: 'تنظ',
  },
]

function App() {
  return (
    <div className="app-shell">
      <aside className="app-sidebar" aria-label="ناوبری اصلی">
        <div className="brand-block">
          <span className="brand-mark" aria-hidden="true">
            م
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
                {item.symbol}
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
              {item.symbol}
            </span>
            <span>{item.shortLabel}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

export default App
