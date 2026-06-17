import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <section className="intro-panel" aria-labelledby="page-title">
      <p className="eyebrow">404</p>
      <h1 id="page-title">Page not found</h1>
      <p className="intro-copy">
        This route does not exist yet. Go back to the dashboard to continue.
      </p>
      <Link className="text-link" to="/">
        Back to dashboard
      </Link>
    </section>
  )
}
