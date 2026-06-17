import { zodResolver } from '@hookform/resolvers/zod'
import { Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { z } from 'zod'
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

const transactionFormSchema = z
  .object({
    accountId: z.string().min(1, 'حساب را انتخاب کن.'),
    amount: z.coerce
      .number('مبلغ باید عدد باشد.')
      .positive('مبلغ باید بزرگ‌تر از صفر باشد.'),
    categoryId: z.string().min(1, 'دسته‌بندی را انتخاب کن.'),
    date: z.string().min(1, 'تاریخ را وارد کن.'),
    note: z.string().max(80, 'یادداشت باید کمتر از ۸۰ کاراکتر باشد.').optional(),
    transferAccountId: z.string().optional(),
    type: z.enum(['income', 'expense', 'transfer']),
  })
  .superRefine((values, context) => {
    if (values.type !== 'transfer') {
      return
    }

    if (!values.transferAccountId) {
      context.addIssue({
        code: 'custom',
        message: 'برای انتقال، حساب مقصد را انتخاب کن.',
        path: ['transferAccountId'],
      })
    }

    if (values.accountId === values.transferAccountId) {
      context.addIssue({
        code: 'custom',
        message: 'حساب مبدا و مقصد نباید یکسان باشند.',
        path: ['transferAccountId'],
      })
    }
  })

type TransactionFormInput = z.input<typeof transactionFormSchema>
type TransactionFormValues = z.output<typeof transactionFormSchema>

export function TransactionsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all')
  const [sortOption, setSortOption] = useState<SortOption>('date-desc')
  const [lastSubmittedTransaction, setLastSubmittedTransaction] =
    useState<TransactionFormValues | null>(null)
  const {
    control,
    formState: { errors, isSubmitSuccessful },
    handleSubmit,
    register,
    reset,
  } = useForm<TransactionFormInput, unknown, TransactionFormValues>({
    defaultValues: {
      accountId: accounts[0]?.id ?? '',
      amount: 0,
      categoryId: categories[0]?.id ?? '',
      date: '2026-06-17',
      note: '',
      transferAccountId: '',
      type: 'expense',
    },
    mode: 'onBlur',
    resolver: zodResolver(transactionFormSchema),
  })
  const selectedTransactionType = useWatch({
    control,
    name: 'type',
  }) as TransactionType

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

  const formCategoryOptions = categories.filter((category) => {
    if (selectedTransactionType === 'transfer') {
      return true
    }

    return category.type === selectedTransactionType
  })

  const onSubmit = (values: TransactionFormValues) => {
    setLastSubmittedTransaction(values)
    reset({
      accountId: values.accountId,
      amount: 0,
      categoryId: formCategoryOptions[0]?.id ?? '',
      date: values.date,
      note: '',
      transferAccountId: '',
      type: values.type,
    })
  }

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

      <section className="transaction-form-panel" aria-labelledby="transaction-form-title">
        <div className="form-heading">
          <div>
            <p className="eyebrow">تراکنش جدید</p>
            <h2 id="transaction-form-title">افزودن تراکنش</h2>
          </div>
          <p>
            این فرم فعلاً داده را ذخیره دائمی نمی‌کند؛ در قدم state management
            آن را به لیست وصل می‌کنیم.
          </p>
        </div>

        <form className="transaction-form" onSubmit={handleSubmit(onSubmit)}>
          <label className="form-field">
            <span>نوع تراکنش</span>
            <select {...register('type')}>
              <option value="expense">هزینه</option>
              <option value="income">درآمد</option>
              <option value="transfer">انتقال</option>
            </select>
          </label>

          <label className="form-field">
            <span>مبلغ</span>
            <input
              type="number"
              inputMode="numeric"
              min="0"
              step="100000"
              {...register('amount')}
            />
            {errors.amount ? (
              <small className="field-error">{errors.amount.message}</small>
            ) : null}
          </label>

          <label className="form-field">
            <span>تاریخ</span>
            <input type="date" {...register('date')} />
            {errors.date ? (
              <small className="field-error">{errors.date.message}</small>
            ) : null}
          </label>

          <label className="form-field">
            <span>دسته‌بندی</span>
            <select {...register('categoryId')}>
              {formCategoryOptions.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.categoryId ? (
              <small className="field-error">{errors.categoryId.message}</small>
            ) : null}
          </label>

          <label className="form-field">
            <span>حساب</span>
            <select {...register('accountId')}>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </select>
            {errors.accountId ? (
              <small className="field-error">{errors.accountId.message}</small>
            ) : null}
          </label>

          {selectedTransactionType === 'transfer' ? (
            <label className="form-field">
              <span>حساب مقصد</span>
              <select {...register('transferAccountId')}>
                <option value="">انتخاب حساب مقصد</option>
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.name}
                  </option>
                ))}
              </select>
              {errors.transferAccountId ? (
                <small className="field-error">
                  {errors.transferAccountId.message}
                </small>
              ) : null}
            </label>
          ) : null}

          <label className="form-field form-field-wide">
            <span>یادداشت</span>
            <input
              type="text"
              placeholder="مثلاً خرید هفتگی یا حقوق ماهانه"
              {...register('note')}
            />
            {errors.note ? (
              <small className="field-error">{errors.note.message}</small>
            ) : null}
          </label>

          <div className="form-actions">
            <button type="submit">ثبت تراکنش</button>
          </div>
        </form>

        {isSubmitSuccessful && lastSubmittedTransaction ? (
          <div className="form-success" role="status">
            تراکنش معتبر است: {formatMoney({
              amount: lastSubmittedTransaction.amount,
              currency: 'IRR',
            })}{' '}
            برای {transactionTypeLabels[lastSubmittedTransaction.type]} آماده ثبت
            شد.
          </div>
        ) : null}
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
