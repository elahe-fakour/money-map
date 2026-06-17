import './App.css'

function App() {
  return (
    <main className="app-shell">
      <section className="intro-panel" aria-labelledby="page-title">
        <p className="eyebrow">Personal finance dashboard</p>
        <h1 id="page-title">MoneyMap</h1>
        <p className="intro-copy">
          A React and TypeScript app for tracking income, expenses, budgets,
          accounts, and reports.
        </p>
      </section>

      <section className="status-panel" aria-labelledby="status-title">
        <h2 id="status-title">Project infrastructure is ready</h2>
        <p>
          Vite, React, TypeScript, and ESLint are set up. The next step is to
          document the product plan and MVP scope.
        </p>
      </section>
    </main>
  )
}

export default App
