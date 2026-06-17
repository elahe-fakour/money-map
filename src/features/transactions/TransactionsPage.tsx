import { zodResolver } from '@hookform/resolvers/zod'
import { Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { z } from 'zod'
import { getMockFinanceSnapshot } from '../../services'
import type { Transaction, TransactionType } from '../../types'
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
  const [transactionRecords, setTransactionRecords] = useState(transactions)
  const [editingTransactionId, setEditingTransactionId] = useState<string | null>(
    null,
  )
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState('')
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

    return [...transactionRecords]
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
  }, [searchQuery, sortOption, transactionRecords, typeFilter])

  const formCategoryOptions = categories.filter((category) => {
    if (selectedTransactionType === 'transfer') {
      return true
    }

    return category.type === selectedTransactionType
  })

  const resetForm = (values?: Partial<TransactionFormInput>) => {
    reset({
      accountId: values?.accountId ?? accounts[0]?.id ?? '',
      amount: 0,
      categoryId: values?.categoryId ?? formCategoryOptions[0]?.id ?? '',
      date: values?.date ?? '2026-06-17',
      note: '',
      transferAccountId: '',
      type: values?.type ?? 'expense',
    })
  }

  const onSubmit = (values: TransactionFormValues) => {
    const now = new Date().toISOString()
    const transactionPayload: Transaction = {
      accountId: values.accountId,
      amount: {
        amount: values.amount,
        currency: 'IRR',
      },
      categoryId: values.categoryId,
      createdAt: now,
      date: values.date,
      id: editingTransactionId ?? `transaction-${crypto.randomUUID()}`,
      note: values.note?.trim() || undefined,
      transferAccountId:
        values.type === 'transfer' ? values.transferAccountId : undefined,
      type: values.type,
      updatedAt: now,
    }

    if (editingTransactionId) {
      setTransactionRecords((currentTransactions) =>
        currentTransactions.map((transaction) =>
          transaction.id === editingTransactionId ? transactionPayload : transaction,
        ),
      )
      setStatusMessage('تراکنش با موفقیت ویرایش شد.')
      setEditingTransactionId(null)
    } else {
      setTransactionRecords((currentTransactions) => [
        transactionPayload,
        ...currentTransactions,
      ])
      setStatusMessage('تراکنش جدید به لیست اضافه شد.')
    }

    resetForm({ accountId: values.accountId, date: values.date, type: values.type })
  }

  const startEditingTransaction = (transaction: Transaction) => {
    setEditingTransactionId(transaction.id)
    setStatusMessage('')
    reset({
      accountId: transaction.accountId,
      amount: transaction.amount.amount,
      categoryId: transaction.categoryId,
      date: transaction.date,
      note: transaction.note ?? '',
      transferAccountId: transaction.transferAccountId ?? '',
      type: transaction.type,
    })
  }

  const cancelEditing = () => {
    setEditingTransactionId(null)
    setStatusMessage('')
    resetForm()
  }

  const confirmDeleteTransaction = () => {
    if (!pendingDeleteId) {
      return
    }

    setTransactionRecords((currentTransactions) =>
      currentTransactions.filter((transaction) => transaction.id !== pendingDeleteId),
    )
    setStatusMessage('تراکنش حذف شد.')
    setPendingDeleteId(null)

    if (editingTransactionId === pendingDeleteId) {
      cancelEditing()
    }
  }

  const pendingDeleteTransaction = transactionRecords.find(
    (transaction) => transaction.id === pendingDeleteId,
  )
  const isEditing = editingTransactionId !== null

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
          {filteredTransactions.length} از {transactionRecords.length} تراکنش
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
            <p className="eyebrow">
              {isEditing ? 'ویرایش تراکنش' : 'تراکنش جدید'}
            </p>
            <h2 id="transaction-form-title">
              {isEditing ? 'ویرایش تراکنش' : 'افزودن تراکنش'}
            </h2>
          </div>
          <p>
            تغییرات این صفحه فعلاً در state محلی همین صفحه ذخیره می‌شود؛ در قدم
            state management آن را سراسری می‌کنیم.
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
            {isEditing ? (
              <button className="secondary-button" type="button" onClick={cancelEditing}>
                انصراف
              </button>
            ) : null}
            <button type="submit">
              {isEditing ? 'ذخیره ویرایش' : 'ثبت تراکنش'}
            </button>
          </div>
        </form>

        {isSubmitSuccessful && statusMessage ? (
          <div className="form-success" role="status">
            {statusMessage}
          </div>
        ) : null}
      </section>

      {pendingDeleteTransaction ? (
        <section className="delete-confirm-panel" aria-labelledby="delete-title">
          <div>
            <p className="eyebrow">تأیید حذف</p>
            <h2 id="delete-title">این تراکنش حذف شود؟</h2>
            <p>
              {pendingDeleteTransaction.note ?? 'تراکنش انتخاب‌شده'} برای همیشه
              از لیست فعلی حذف می‌شود.
            </p>
          </div>
          <div className="delete-actions">
            <button type="button" onClick={() => setPendingDeleteId(null)}>
              انصراف
            </button>
            <button
              className="danger-button"
              type="button"
              onClick={confirmDeleteTransaction}
            >
              حذف تراکنش
            </button>
          </div>
        </section>
      ) : null}

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
                  <div className="transaction-actions">
                    <button
                      type="button"
                      onClick={() => startEditingTransaction(transaction)}
                    >
                      ویرایش
                    </button>
                    <button
                      className="danger-text-button"
                      type="button"
                      onClick={() => setPendingDeleteId(transaction.id)}
                    >
                      حذف
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
