import {
  ArrowDownRight,
  ArrowUpRight,
  BadgePercent,
  Landmark,
  WalletCards,
} from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useState } from 'react'
import { useFinance } from '../../hooks/useFinance'
import {
  formatMoney,
  formatMonthLabel,
  formatShortDate,
  getLatestTransactionMonth,
  getSavingsRate,
  getTransactionMonths,
  getTransactionsByMonth,
  getTotalBalance,
  getTotalByTransactionType,
} from '../../utils'
import './DashboardPage.css'

export function DashboardPage() {
  const { accounts, budgets, categories, transactions } = useFinance()
  const categoryById = new Map(
    categories.map((category) => [category.id, category]),
  )
  const availableMonths = getTransactionMonths(transactions)
  const latestMonth = getLatestTransactionMonth(transactions)
  const [selectedMonth, setSelectedMonth] = useState(latestMonth)
  const reportMonth = availableMonths.includes(selectedMonth)
    ? selectedMonth
    : latestMonth
  const monthlyTransactions = getTransactionsByMonth(transactions, reportMonth)
  const monthlyBudgets = budgets.filter((budget) => budget.month === reportMonth)
  const totalBalance = getTotalBalance(accounts)
  const monthlyIncome = getTotalByTransactionType(monthlyTransactions, 'income')
  const monthlyExpenses = getTotalByTransactionType(monthlyTransactions, 'expense')
  const savingsRate = getSavingsRate(monthlyIncome, monthlyExpenses)
  const recentTransactions = [...monthlyTransactions]
    .sort((first, second) => second.date.localeCompare(first.date))
    .slice(0, 4)
  const expenseBreakdownData = categories
    .filter((category) => category.type === 'expense')
    .map((category) => {
      const value = monthlyTransactions
        .filter(
          (transaction) =>
            transaction.type === 'expense' && transaction.categoryId === category.id,
        )
        .reduce((total, transaction) => total + transaction.amount.amount, 0)

      return {
        color: category.color,
        name: category.name,
        value,
      }
    })
    .filter((item) => item.value > 0)
  const cashFlowData = Array.from(
    transactions.reduce((months, transaction) => {
      const month = transaction.date.slice(0, 7)
      const current = months.get(month) ?? {
        expenses: 0,
        income: 0,
        month,
      }

      if (transaction.type === 'income') {
        current.income += transaction.amount.amount
      }

      if (transaction.type === 'expense') {
        current.expenses += transaction.amount.amount
      }

      months.set(month, current)

      return months
    }, new Map<string, { expenses: number; income: number; month: string }>()),
  )
    .map(([, value]) => ({
      ...value,
      label: new Intl.DateTimeFormat('fa-IR', {
        month: 'short',
      }).format(new Date(`${value.month}-01`)),
    }))
    .sort((first, second) => first.month.localeCompare(second.month))
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

  return (
    <div className="dashboard-page">
      <section className="dashboard-hero" aria-labelledby="dashboard-title">
        <div>
          <p className="eyebrow">خلاصه {formatMonthLabel(reportMonth)}</p>
          <h1 id="dashboard-title">داشبورد</h1>
          <p className="intro-copy">
            وضعیت کلی پول، تراکنش‌های اخیر و بودجه‌های مهم این ماه را در یک
            نگاه ببین.
          </p>
        </div>
        <div className="dashboard-hero-badge" aria-label="ماه گزارش">
          {formatMonthLabel(reportMonth)}
        </div>
      </section>

      <section className="month-switcher" aria-label="انتخاب ماه گزارش">
        {availableMonths.map((month) => (
          <button
            className={
              month === reportMonth
                ? 'month-switcher-button month-switcher-button-active'
                : 'month-switcher-button'
            }
            key={month}
            type="button"
            onClick={() => setSelectedMonth(month)}
          >
            {formatMonthLabel(month)}
          </button>
        ))}
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
            {monthlyBudgets.map((budget) => {
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

      <section className="chart-grid" aria-label="نمودارهای داشبورد">
        <article className="dashboard-panel chart-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">تفکیک هزینه‌ها</p>
              <h2>هزینه بر اساس دسته‌بندی</h2>
            </div>
          </div>

          <div className="chart-box" role="img" aria-label="نمودار دایره‌ای تفکیک هزینه‌ها">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={expenseBreakdownData}
                  dataKey="value"
                  innerRadius={58}
                  nameKey="name"
                  outerRadius={94}
                  paddingAngle={3}
                >
                  {expenseBreakdownData.map((entry) => (
                    <Cell fill={entry.color} key={entry.name} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) =>
                    formatMoney({ amount: Number(value), currency: 'IRR' })
                  }
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-legend">
            {expenseBreakdownData.map((item) => (
              <div className="legend-item" key={item.name}>
                <span style={{ background: item.color }} aria-hidden="true" />
                <strong>{item.name}</strong>
                <small>{formatMoney({ amount: item.value, currency: 'IRR' })}</small>
              </div>
            ))}
          </div>
        </article>

        <article className="dashboard-panel chart-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">جریان نقدی</p>
              <h2>درآمد در برابر هزینه</h2>
            </div>
          </div>

          <div
            className="chart-box"
            role="img"
            aria-label="نمودار ستونی درآمد و هزینه ماهانه"
          >
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={cashFlowData}>
                <CartesianGrid stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="label" tickLine={false} />
                <YAxis
                  tickFormatter={(value) => `${Number(value) / 1_000_000}م`}
                  tickLine={false}
                  width={48}
                />
                <Tooltip
                  formatter={(value, name) => [
                    formatMoney({ amount: Number(value), currency: 'IRR' }),
                    name === 'income' ? 'درآمد' : 'هزینه',
                  ]}
                />
                <Bar dataKey="income" fill="var(--color-success)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="expenses" fill="var(--color-danger)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>
      </section>
    </div>
  )
}
