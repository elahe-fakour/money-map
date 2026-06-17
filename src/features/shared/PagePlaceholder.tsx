type PagePlaceholderProps = {
  title: string
  eyebrow: string
  description: string
}

export function PagePlaceholder({
  title,
  eyebrow,
  description,
}: PagePlaceholderProps) {
  return (
    <section className="intro-panel" aria-labelledby="page-title">
      <p className="eyebrow">{eyebrow}</p>
      <h1 id="page-title">{title}</h1>
      <p className="intro-copy">{description}</p>
    </section>
  )
}
