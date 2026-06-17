import {
  ArrowDownRight,
  ArrowUpRight,
  BadgePercent,
  Landmark,
  WalletCards,
} from 'lucide-react'
import { getMockFinanceSnapshot } from '../../services'
import {
  formatMoney,
  formatShortDate,
  getSavingsRate,
  getTotalBalance,
  getTotalByTransactionType,
} from '../../utils'
import './DashboardPage.css'

const { accounts, budgets, categories, transactions } = getMockFinanceSnapshot()

const categoryById = new Map(
  categories.map((category) => [category.id, category]),
)

const totalBalance = getTotalBalance(accounts)
const monthlyIncome = getTotalByTransactionType(transactions, 'income')
const monthlyExpenses = getTotalByTransactionType(transactions, 'expense')
const savingsRate = getSavingsRate(monthlyIncome, monthlyExpenses)

const recentTransactions = [...transactions]
  .sort((first, second) => second.date.localeCompare(first.date))
  .slice(0, 4)

const summaryCards = [
  {
    title: 'موجودی کل',
    value: formatMoney(totalBalance),
    helper: `${accounts.length} حساب فعال`,
    Icon: WalletCards,
  },
  {
    title: 'درآمد ماه',
    value: formatMoney(monthlyIncome),
    helper: 'شامل حقوق و پروژه آزاد',
    Icon: ArrowUpRight,
  },
  {
    title: 'هزینه ماه',
    value: formatMoney(monthlyExpenses),
    helper: 'بدون احتساب انتقال بین حساب‌ها',
    Icon: ArrowDownRight,
  },
  {
    title: 'نرخ پس‌انداز',
    value: `${savingsRate}%`,
    helper: 'درآمد پس از کسر هزینه‌ها',
    Icon: BadgePercent,
  },
]

export function DashboardPage() {
  return (
    <div className="dashboard-page">
      <section className="dashboard-hero" aria-labelledby="dashboard-title">
        <div>
          <p className="eyebrow">خلاصه ماه جاری</p>
          <h1 id="dashboard-title">داشبورد</h1>
          <p className="intro-copy">
            وضعیت کلی پول، تراکنش‌های اخیر و بودجه‌های مهم این ماه را در یک
            نگاه ببین.
          </p>
        </div>
        <div className="dashboard-hero-badge" aria-label="ماه گزارش">
          خرداد ۱۴۰۵
        </div>
      </section>

      <section className="summary-grid" aria-label="خلاصه مالی">
        {summaryCards.map((card) => (
          <article className="summary-card" key={card.title}>
            <span className="summary-icon" aria-hidden="true">
              <card.Icon size={20} strokeWidth={2.3} />
            </span>
            <div>
              <p className="summary-title">{card.title}</p>
              <strong className="summary-value">{card.value}</strong>
              <p className="summary-helper">{card.helper}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="dashboard-sections">
        <article className="dashboard-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">فعالیت اخیر</p>
              <h2>آخرین تراکنش‌ها</h2>
            </div>
            <Landmark aria-hidden="true" size={22} />
          </div>

          <div className="transaction-list">
            {recentTransactions.map((transaction) => {
              const category = categoryById.get(transaction.categoryId)
              const isExpense = transaction.type === 'expense'

              return (
                <div className="transaction-row" key={transaction.id}>
                  <span
                    className="transaction-dot"
                    style={{ background: category?.color }}
                    aria-hidden="true"
                  />
                  <div className="transaction-main">
                    <strong>{transaction.note ?? category?.name}</strong>
                    <span>
                      {category?.name} · {formatShortDate(transaction.date)}
                    </span>
                  </div>
                  <strong
                    className={
                      isExpense ? 'transaction-amount expense' : 'transaction-amount'
                    }
                  >
                    {isExpense ? '-' : '+'}
                    {formatMoney(transaction.amount)}
                  </strong>
                </div>
              )
            })}
          </div>
        </article>

        <article className="dashboard-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">بودجه‌ها</p>
              <h2>پیشرفت بودجه ماهانه</h2>
            </div>
            <BadgePercent aria-hidden="true" size={22} />
          </div>

          <div className="budget-list">
            {budgets.map((budget) => {
              const category = categoryById.get(budget.categoryId)
              const progress = Math.round(
                (budget.spent.amount / budget.limit.amount) * 100,
              )
              const cappedProgress = Math.min(progress, 100)

              return (
                <div className="budget-item" key={budget.id}>
                  <div className="budget-heading">
                    <strong>{category?.name}</strong>
                    <span>{progress}%</span>
                  </div>
                  <div className="budget-track" aria-hidden="true">
                    <span
                      className={`budget-fill ${budget.status}`}
                      style={{ inlineSize: `${cappedProgress}%` }}
                    />
                  </div>
                  <p>
                    {formatMoney(budget.spent)} از {formatMoney(budget.limit)}
                  </p>
                </div>
              )
            })}
          </div>
        </article>
      </section>
    </div>
  )
}
