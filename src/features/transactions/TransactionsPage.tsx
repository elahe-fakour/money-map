import { zodResolver } from '@hookform/resolvers/zod'
import { Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { z } from 'zod'
import { useFinance } from '../../hooks/useFinance'
import type { Transaction, TransactionType } from '../../types'
import { formatMoney, formatShortDate } from '../../utils'
import './TransactionsPage.css'

type TypeFilter = TransactionType | 'all'

type SortOption = 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'

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

const getTodayDateInputValue = () => new Date().toISOString().slice(0, 10)

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
  const {
    accounts,
    addTransaction,
    categories,
    deleteTransaction,
    transactions,
    updateTransaction,
  } = useFinance()
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all')
  const [sortOption, setSortOption] = useState<SortOption>('date-desc')
  const [editingTransactionId, setEditingTransactionId] = useState<string | null>(
    null,
  )
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState('')
  const [statusTone, setStatusTone] = useState<'error' | 'success'>('success')
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
      date: getTodayDateInputValue(),
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
  const selectedAccountId = useWatch({
    control,
    name: 'accountId',
  })
  const selectedAmount = useWatch({
    control,
    name: 'amount',
  })
  const accountById = useMemo(
    () => new Map(accounts.map((account) => [account.id, account])),
    [accounts],
  )
  const categoryById = useMemo(
    () => new Map(categories.map((category) => [category.id, category])),
    [categories],
  )

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
  }, [accountById, categoryById, searchQuery, sortOption, transactions, typeFilter])
  const transactionSummary = filteredTransactions.reduce(
    (summary, transaction) => {
      if (transaction.type === 'income') {
        summary.income += transaction.amount.amount
      }

      if (transaction.type === 'expense') {
        summary.expenses += transaction.amount.amount
      }

      if (transaction.type === 'transfer') {
        summary.transfers += 1
      }

      return summary
    },
    {
      expenses: 0,
      income: 0,
      transfers: 0,
    },
  )

  const formCategoryOptions = categories.filter((category) => {
    if (selectedTransactionType === 'transfer') {
      return true
    }

    return category.type === selectedTransactionType
  })
  const editingTransaction = transactions.find(
    (transaction) => transaction.id === editingTransactionId,
  )
  const selectedAccount = accounts.find((account) => account.id === selectedAccountId)
  const selectedAccountAvailableBalance = selectedAccount
    ? selectedAccount.balance.amount +
      (editingTransaction &&
      editingTransaction.accountId === selectedAccount.id &&
      (editingTransaction.type === 'expense' ||
        editingTransaction.type === 'transfer')
        ? editingTransaction.amount.amount
        : 0)
    : undefined
  const shouldValidateAgainstAccountBalance =
    selectedTransactionType === 'expense' || selectedTransactionType === 'transfer'

  const resetForm = (values?: Partial<TransactionFormInput>) => {
    reset({
      accountId: values?.accountId ?? accounts[0]?.id ?? '',
      amount: 0,
      categoryId: values?.categoryId ?? formCategoryOptions[0]?.id ?? '',
      date: values?.date ?? getTodayDateInputValue(),
      note: '',
      transferAccountId: '',
      type: values?.type ?? 'expense',
    })
  }

  const onSubmit = (values: TransactionFormValues) => {
    if (
      (values.type === 'expense' || values.type === 'transfer') &&
      selectedAccountAvailableBalance !== undefined &&
      values.amount > selectedAccountAvailableBalance
    ) {
      setStatusTone('error')
      setStatusMessage('مبلغ تراکنش نباید از موجودی حساب بیشتر باشد.')
      return
    }

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
      updateTransaction(transactionPayload)
      setStatusTone('success')
      setStatusMessage('تراکنش ویرایش شد و موجودی حساب‌ها به‌روز است.')
      setEditingTransactionId(null)
    } else {
      addTransaction(transactionPayload)
      setStatusTone('success')
      setStatusMessage('تراکنش ثبت شد و در موجودی حساب‌ها اعمال شد.')
    }

    resetForm({ accountId: values.accountId, date: values.date, type: values.type })
  }

  const startEditingTransaction = (transaction: Transaction) => {
    setEditingTransactionId(transaction.id)
    setStatusMessage('')
    setStatusTone('success')
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
    setStatusTone('success')
    resetForm()
  }

  const confirmDeleteTransaction = () => {
    if (!pendingDeleteId) {
      return
    }

    deleteTransaction(pendingDeleteId)
    setStatusTone('success')
    setStatusMessage('تراکنش حذف شد و موجودی حساب‌ها به‌روز شد.')
    setPendingDeleteId(null)

    if (editingTransactionId === pendingDeleteId) {
      cancelEditing()
    }
  }

  const pendingDeleteTransaction = transactions.find(
    (transaction) => transaction.id === pendingDeleteId,
  )
  const isEditing = editingTransactionId !== null
  const hasActiveFilters =
    searchQuery.trim().length > 0 || typeFilter !== 'all' || sortOption !== 'date-desc'
  const activeFilterLabel =
    typeFilterOptions.find((option) => option.value === typeFilter)?.label ?? 'همه'
  const resetListControls = () => {
    setSearchQuery('')
    setTypeFilter('all')
    setSortOption('date-desc')
  }
  const numericSelectedAmount = Number(selectedAmount)
  const isTransactionSubmitDisabled =
    !Number.isFinite(numericSelectedAmount) ||
    numericSelectedAmount <= 0 ||
    (shouldValidateAgainstAccountBalance &&
      selectedAccountAvailableBalance !== undefined &&
      numericSelectedAmount > selectedAccountAvailableBalance)

  return (
    <div className="transactions-page">
      <section className="transactions-hero" aria-labelledby="transactions-title">
        <div className="transactions-hero-content">
          <h1 id="transactions-title">تراکنش‌ها</h1>
          <p className="intro-copy">
            درآمدها، هزینه‌ها و انتقال‌ها را ثبت، جست‌وجو و بررسی کن.
          </p>
        </div>
        <div className="transactions-count" aria-live="polite">
          <strong>{filteredTransactions.length}</strong>
          <span>
            {hasActiveFilters
              ? `نتیجه از ${transactions.length} تراکنش`
              : 'تراکنش ثبت‌شده'}
          </span>
        </div>
      </section>

      <section className="transactions-summary-grid" aria-label="خلاصه تراکنش‌های نمایش داده شده">
        <article className="transactions-summary-card transactions-summary-income">
          <span>درآمد نتیجه فعلی</span>
          <strong>{formatMoney({ amount: transactionSummary.income, currency: 'IRR' })}</strong>
        </article>
        <article className="transactions-summary-card transactions-summary-expense">
          <span>هزینه نتیجه فعلی</span>
          <strong>{formatMoney({ amount: transactionSummary.expenses, currency: 'IRR' })}</strong>
        </article>
        <article className="transactions-summary-card">
          <span>فیلتر فعال</span>
          <strong>{activeFilterLabel}</strong>
          <small>{transactionSummary.transfers} انتقال در نتیجه فعلی</small>
        </article>
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
              aria-pressed={typeFilter === option.value}
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
            تغییرات در همین مرورگر ذخیره می‌شوند و پس از نوسازی صفحه هم باقی
            می‌مانند.
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
              aria-invalid={Boolean(errors.amount)}
              max={
                shouldValidateAgainstAccountBalance
                  ? selectedAccountAvailableBalance
                  : undefined
              }
              min="0"
              step="100000"
              {...register('amount')}
            />
            {shouldValidateAgainstAccountBalance &&
            selectedAccountAvailableBalance !== undefined ? (
              <small className="field-helper">
                موجودی قابل استفاده:{' '}
                {formatMoney({
                  amount: selectedAccountAvailableBalance,
                  currency: 'IRR',
                })}
              </small>
            ) : null}
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
            <button type="submit" disabled={isTransactionSubmitDisabled}>
              {isEditing ? 'ذخیره ویرایش' : 'ثبت تراکنش'}
            </button>
          </div>
        </form>

        {(isSubmitSuccessful || statusTone === 'error') && statusMessage ? (
          <div className={`form-status form-status-${statusTone}`} role="status">
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
              {pendingDeleteTransaction.note ?? 'تراکنش انتخاب‌شده'} و اثر آن بر
              موجودی حساب برای همیشه حذف می‌شود. این عمل قابل بازگردانی نیست.
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
        <div className="transactions-panel-heading">
          <div>
            <p className="eyebrow">نتیجه تراکنش‌ها</p>
            <h2>لیست قابل بررسی</h2>
          </div>
          {hasActiveFilters ? (
            <button type="button" onClick={resetListControls}>
              پاک کردن فیلترها
            </button>
          ) : null}
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="transactions-empty">
            <h2>{hasActiveFilters ? 'تراکنشی با این فیلترها پیدا نشد' : 'هنوز تراکنشی ثبت نشده است'}</h2>
            <p>
              {hasActiveFilters
                ? 'جست‌وجو یا فیلترها را تغییر بده تا نتیجه‌های بیشتری ببینی.'
                : 'از فرم بالا اولین درآمد، هزینه یا انتقالت را ثبت کن.'}
            </p>
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
              const isTransfer = transaction.type === 'transfer'

              return (
                <article
                  className={`transaction-card transaction-card-${transaction.type}`}
                  key={transaction.id}
                >
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
                      isTransfer
                        ? 'transaction-list-amount transfer'
                        : isExpense
                        ? 'transaction-list-amount expense'
                        : 'transaction-list-amount'
                    }
                  >
                    {isTransfer ? '' : isExpense ? '-' : '+'}
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
