import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <section className="intro-panel" aria-labelledby="page-title">
      <p className="eyebrow">404</p>
      <h1 id="page-title">صفحه پیدا نشد</h1>
      <p className="intro-copy">
        این مسیر هنوز وجود ندارد. برای ادامه به داشبورد برگرد.
      </p>
      <Link className="text-link" to="/">
        بازگشت به داشبورد
      </Link>
    </section>
  )
}
