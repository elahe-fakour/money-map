import { NavLink, Outlet } from 'react-router-dom'
import './App.css'

const navigationItems = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/transactions', label: 'Transactions' },
  { to: '/budgets', label: 'Budgets' },
  { to: '/accounts', label: 'Accounts' },
  { to: '/reports', label: 'Reports' },
  { to: '/goals', label: 'Goals' },
  { to: '/settings', label: 'Settings' },
]

function App() {
  return (
    <main className="app-shell">
      <nav className="top-nav" aria-label="Primary navigation">
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
        <h2 id="status-title">Project infrastructure is ready</h2>
        <p>
          Routing is configured with React Router. Use the navigation to move
          between the first MoneyMap pages.
        </p>
      </section>

      <Outlet />
    </main>
  )
}

export default App
