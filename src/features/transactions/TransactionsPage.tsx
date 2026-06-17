import { Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { getMockFinanceSnapshot } from '../../services'
import type { TransactionType } from '../../types'
import { formatMoney, formatShortDate } from '../../utils'
import './TransactionsPage.css'

type TypeFilter = TransactionType | 'all'

type SortOption = 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'

const { accounts, categories, transactions } = getMockFinanceSnapshot()

const accountById = new Map(accounts.map((account) => [account.id, account]))
const categoryById = new Map(
  categories.map((category) => [category.id, category]),
)

const transactionTypeLabels: Record<TransactionType, string> = {
  expense: 'هزینه',
  income: 'درآمد',
  transfer: 'انتقال',
}

const typeFilterOptions: { label: string; value: TypeFilter }[] = [
  { label: 'همه', value: 'all' },
  { label: 'درآمد', value: 'income' },
  { label: 'هزینه', value: 'expense' },
  { label: 'انتقال', value: 'transfer' },
]

export function TransactionsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all')
  const [sortOption, setSortOption] = useState<SortOption>('date-desc')

  const filteredTransactions = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase()

    return [...transactions]
      .filter((transaction) => {
        const category = categoryById.get(transaction.categoryId)
        const account = accountById.get(transaction.accountId)
        const searchableText = [
          transaction.note,
          category?.name,
          account?.name,
          transactionTypeLabels[transaction.type],
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()

        const matchesSearch =
          normalizedQuery.length === 0 ||
          searchableText.includes(normalizedQuery)
        const matchesType =
          typeFilter === 'all' || transaction.type === typeFilter

        return matchesSearch && matchesType
      })
      .sort((first, second) => {
        if (sortOption === 'date-desc') {
          return second.date.localeCompare(first.date)
        }

        if (sortOption === 'date-asc') {
          return first.date.localeCompare(second.date)
        }

        if (sortOption === 'amount-desc') {
          return second.amount.amount - first.amount.amount
        }

        return first.amount.amount - second.amount.amount
      })
  }, [searchQuery, sortOption, typeFilter])

  return (
    <div className="transactions-page">
      <section className="transactions-hero" aria-labelledby="transactions-title">
        <div>
          <p className="eyebrow">پیگیری جریان پول</p>
          <h1 id="transactions-title">تراکنش‌ها</h1>
          <p className="intro-copy">
            درآمد، هزینه و انتقال‌های نمونه را جست‌وجو، فیلتر و مرتب کن.
          </p>
        </div>
        <span className="transactions-count">
          {filteredTransactions.length} تراکنش
        </span>
      </section>

      <section className="transactions-toolbar" aria-label="ابزارهای تراکنش‌ها">
        <label className="search-field">
          <Search aria-hidden="true" size={18} />
          <span className="sr-only">جست‌وجوی تراکنش</span>
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="جست‌وجو بر اساس یادداشت، دسته یا حساب"
          />
        </label>

        <div className="filter-group" aria-label="فیلتر نوع تراکنش">
          {typeFilterOptions.map((option) => (
            <button
              className={
                typeFilter === option.value
                  ? 'filter-button filter-button-active'
                  : 'filter-button'
              }
              key={option.value}
              type="button"
              onClick={() => setTypeFilter(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>

        <label className="sort-field">
          <span>مرتب‌سازی</span>
          <select
            value={sortOption}
            onChange={(event) => setSortOption(event.target.value as SortOption)}
          >
            <option value="date-desc">جدیدترین</option>
            <option value="date-asc">قدیمی‌ترین</option>
            <option value="amount-desc">بیشترین مبلغ</option>
            <option value="amount-asc">کمترین مبلغ</option>
          </select>
        </label>
      </section>

      <section className="transactions-panel" aria-label="لیست تراکنش‌ها">
        {filteredTransactions.length === 0 ? (
          <div className="transactions-empty">
            <h2>تراکنشی پیدا نشد</h2>
            <p>عبارت جست‌وجو یا فیلترها را تغییر بده.</p>
          </div>
        ) : (
          <div className="transactions-list">
            <div className="transactions-header" aria-hidden="true">
              <span>تراکنش</span>
              <span>نوع</span>
              <span>حساب</span>
              <span>تاریخ</span>
              <span>مبلغ</span>
            </div>

            {filteredTransactions.map((transaction) => {
              const category = categoryById.get(transaction.categoryId)
              const account = accountById.get(transaction.accountId)
              const isExpense = transaction.type === 'expense'

              return (
                <article className="transaction-card" key={transaction.id}>
                  <div className="transaction-name">
                    <span
                      className="transaction-category-dot"
                      style={{ background: category?.color }}
                      aria-hidden="true"
                    />
                    <div>
                      <strong>{transaction.note ?? category?.name}</strong>
                      <span>{category?.name}</span>
                    </div>
                  </div>
                  <span className={`transaction-type ${transaction.type}`}>
                    {transactionTypeLabels[transaction.type]}
                  </span>
                  <span className="transaction-account">{account?.name}</span>
                  <span className="transaction-date">
                    {formatShortDate(transaction.date)}
                  </span>
                  <strong
                    className={
                      isExpense
                        ? 'transaction-list-amount expense'
                        : 'transaction-list-amount'
                    }
                  >
                    {isExpense ? '-' : '+'}
                    {formatMoney(transaction.amount)}
                  </strong>
                </article>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
