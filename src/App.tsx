import { NavLink, Outlet } from 'react-router-dom'
import './App.css'

const navigationItems = [
  { to: '/', label: 'داشبورد', end: true },
  { to: '/transactions', label: 'تراکنش‌ها' },
  { to: '/budgets', label: 'بودجه‌ها' },
  { to: '/accounts', label: 'حساب‌ها' },
  { to: '/reports', label: 'گزارش‌ها' },
  { to: '/goals', label: 'اهداف' },
  { to: '/settings', label: 'تنظیمات' },
]

function App() {
  return (
    <main className="app-shell">
      <nav className="top-nav" aria-label="ناوبری اصلی">
        {navigationItems.map((item) => (
          <NavLink
            className={({ isActive }) =>
              isActive ? 'nav-link nav-link-active' : 'nav-link'
            }
            end={item.end}
            key={item.to}
            to={item.to}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <section className="status-panel" aria-labelledby="status-title">
        <h2 id="status-title">مسیریابی پروژه آماده است</h2>
        <p>
          مسیریابی با React Router تنظیم شده است. از منوی بالا می‌توانی بین
          صفحه‌های اولیه مانی‌مپ جابه‌جا شوی.
        </p>
      </section>

      <Outlet />
    </main>
  )
}

export default App
