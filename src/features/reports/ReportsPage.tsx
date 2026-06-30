import { ArrowDownRight, ArrowUpRight, BadgePercent, Lightbulb } from 'lucide-react'
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
  getSavingsRate,
  getTransactionMonths,
  getTransactionsByMonth,
} from '../../utils'
import './ReportsPage.css'

export function ReportsPage() {
  const { categories, transactions } = useFinance()
  const availableMonths = getTransactionMonths(transactions)
  const latestMonth = availableMonths[0] ?? new Date().toISOString().slice(0, 7)
  const [selectedMonth, setSelectedMonth] = useState(latestMonth)
  const reportMonth = availableMonths.includes(selectedMonth)
    ? selectedMonth
    : latestMonth
  const previousMonth = availableMonths[availableMonths.indexOf(reportMonth) + 1]
  const monthTransactions = getTransactionsByMonth(transactions, reportMonth)
  const previousMonthTransactions = previousMonth
    ? getTransactionsByMonth(transactions, previousMonth)
    : []

  const income = monthTransactions
    .filter((transaction) => transaction.type === 'income')
    .reduce((total, transaction) => total + transaction.amount.amount, 0)
  const expenses = monthTransactions
    .filter((transaction) => transaction.type === 'expense')
    .reduce((total, transaction) => total + transaction.amount.amount, 0)
  const previousIncome = previousMonthTransactions
    .filter((transaction) => transaction.type === 'income')
    .reduce((total, transaction) => total + transaction.amount.amount, 0)
  const previousExpenses = previousMonthTransactions
    .filter((transaction) => transaction.type === 'expense')
    .reduce((total, transaction) => total + transaction.amount.amount, 0)
  const savingsRate = getSavingsRate(
    { amount: income, currency: 'IRR' },
    { amount: expenses, currency: 'IRR' },
  )
  const previousSavingsRate = getSavingsRate(
    { amount: previousIncome, currency: 'IRR' },
    { amount: previousExpenses, currency: 'IRR' },
  )
  const expenseByCategory = categories
    .filter((category) => category.type === 'expense')
    .map((category) => {
      const value = monthTransactions
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
    .sort((first, second) => second.value - first.value)
  const highestSpendingCategory = expenseByCategory[0]
  const comparisonData = [...availableMonths].reverse().map((month) => {
    const currentTransactions = getTransactionsByMonth(transactions, month)

    return {
      expenses: currentTransactions
        .filter((transaction) => transaction.type === 'expense')
        .reduce((total, transaction) => total + transaction.amount.amount, 0),
      income: currentTransactions
        .filter((transaction) => transaction.type === 'income')
        .reduce((total, transaction) => total + transaction.amount.amount, 0),
      label: formatMonthLabel(month).replace('۱۴۰۵', '').trim(),
      month,
    }
  })
  const reportCards = [
    {
      helper: previousIncome
        ? `ماه قبل: ${formatMoney({ amount: previousIncome, currency: 'IRR' })}`
        : 'داده ماه قبل موجود نیست',
      title: 'درآمد ماه',
      value: formatMoney({ amount: income, currency: 'IRR' }),
      Icon: ArrowUpRight,
    },
    {
      helper: previousExpenses
        ? `ماه قبل: ${formatMoney({ amount: previousExpenses, currency: 'IRR' })}`
        : 'داده ماه قبل موجود نیست',
      title: 'هزینه ماه',
      value: formatMoney({ amount: expenses, currency: 'IRR' }),
      Icon: ArrowDownRight,
    },
    {
      helper: `ماه قبل: ${previousSavingsRate}%`,
      title: 'نرخ پس‌انداز',
      value: `${savingsRate}%`,
      Icon: BadgePercent,
    },
  ]

  return (
    <div className="reports-page">
      <section className="reports-hero" aria-labelledby="reports-title">
        <div>
          <p className="eyebrow">درک روندهای مالی</p>
          <h1 id="reports-title">گزارش‌ها</h1>
          <p className="intro-copy">
            درآمد، هزینه، دسته‌های پرخرج و تغییرات ماه‌به‌ماه را از روی داده‌های
            مشترک برنامه بررسی کن.
          </p>
        </div>
        <div className="reports-period">
          <span>دوره گزارش</span>
          <strong>{formatMonthLabel(reportMonth)}</strong>
        </div>
      </section>

      <section className="report-month-switcher" aria-label="انتخاب ماه گزارش">
        {availableMonths.map((month) => (
          <button
            className={
              month === reportMonth
                ? 'report-month-button report-month-button-active'
                : 'report-month-button'
            }
            key={month}
            type="button"
            onClick={() => setSelectedMonth(month)}
          >
            {formatMonthLabel(month)}
          </button>
        ))}
      </section>

      <section className="report-summary-grid" aria-label="خلاصه گزارش ماهانه">
        {reportCards.map((card) => (
          <article className="report-summary-card" key={card.title}>
            <span className="report-icon" aria-hidden="true">
              <card.Icon size={20} strokeWidth={2.3} />
            </span>
            <p>{card.title}</p>
            <strong>{card.value}</strong>
            <small>{card.helper}</small>
          </article>
        ))}
      </section>

      <section className="report-chart-grid" aria-label="نمودارهای گزارش">
        <article className="report-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">مقایسه ماهانه</p>
              <h2>درآمد در برابر هزینه</h2>
            </div>
          </div>
          <div className="report-chart" role="img" aria-label="نمودار مقایسه درآمد و هزینه">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={comparisonData}>
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

        <article className="report-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">دسته‌بندی هزینه‌ها</p>
              <h2>سهم هر دسته</h2>
            </div>
          </div>
          <div className="report-chart" role="img" aria-label="نمودار تفکیک دسته هزینه">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={expenseByCategory}
                  dataKey="value"
                  innerRadius={58}
                  nameKey="name"
                  outerRadius={96}
                  paddingAngle={3}
                >
                  {expenseByCategory.map((entry) => (
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
        </article>
      </section>

      <section className="report-insights" aria-label="بینش‌های گزارش">
        <article className="insight-card">
          <Lightbulb aria-hidden="true" size={22} />
          <div>
            <h2>بیشترین هزینه</h2>
            <p>
              {highestSpendingCategory
                ? `${highestSpendingCategory.name} با ${formatMoney({
                    amount: highestSpendingCategory.value,
                    currency: 'IRR',
                  })} بیشترین سهم هزینه این ماه را داشته است.`
                : 'برای این ماه هزینه‌ای ثبت نشده است.'}
            </p>
          </div>
        </article>

        <article className="insight-card">
          <BadgePercent aria-hidden="true" size={22} />
          <div>
            <h2>تغییر نرخ پس‌انداز</h2>
            <p>
              نرخ پس‌انداز این ماه {savingsRate}% است؛ در ماه قبل{' '}
              {previousSavingsRate}% بود.
            </p>
          </div>
        </article>

        <article className="insight-card">
          <ArrowDownRight aria-hidden="true" size={22} />
          <div>
            <h2>تراکنش‌های هزینه</h2>
            <p>
              در {formatMonthLabel(reportMonth)} تعداد{' '}
              {
                monthTransactions.filter(
                  (transaction) => transaction.type === 'expense',
                ).length
              }{' '}
              تراکنش هزینه ثبت شده است.
            </p>
          </div>
        </article>
      </section>
    </div>
  )
}
