import { BadgeAlert, CheckCircle2, Pencil, Plus, WalletCards } from 'lucide-react'
import { type FormEvent, useMemo, useState } from 'react'
import { useFinance } from '../../hooks/useFinance'
import type { Budget, BudgetStatus } from '../../types'
import { formatMoney, getSpentByCategoryMonth } from '../../utils'
import './BudgetsPage.css'

type BudgetFormState = {
  categoryId: string
  limit: string
  month: string
}

const budgetStatusLabels: Record<BudgetStatus, string> = {
  'near-limit': 'نزدیک سقف',
  'on-track': 'در مسیر درست',
  'over-budget': 'بیش از بودجه',
}

const getBudgetStatus = (spent: number, limit: number): BudgetStatus => {
  if (limit <= 0 || spent > limit) {
    return 'over-budget'
  }

  if (spent / limit >= 0.85) {
    return 'near-limit'
  }

  return 'on-track'
}

export function BudgetsPage() {
  const { addBudget, budgets, categories, transactions, updateBudget } =
    useFinance()
  const expenseCategories = categories.filter(
    (category) => category.type === 'expense',
  )
  const [editingBudgetId, setEditingBudgetId] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState('')
  const [statusTone, setStatusTone] = useState<'error' | 'success'>('success')
  const [budgetForm, setBudgetForm] = useState<BudgetFormState>({
    categoryId: expenseCategories[0]?.id ?? '',
    limit: '',
    month: '2026-06',
  })

  const categoryById = useMemo(
    () => new Map(categories.map((category) => [category.id, category])),
    [categories],
  )

  const getSpentForBudget = (budget: Pick<Budget, 'categoryId' | 'month'>) =>
    getSpentByCategoryMonth(
      transactions,
      budget.categoryId,
      budget.month,
    ).amount

  const enrichedBudgets = budgets.map((budget) => {
    const spentAmount = getSpentForBudget(budget)
    const remainingAmount = budget.limit.amount - spentAmount
    const progress = budget.limit.amount
      ? Math.round((spentAmount / budget.limit.amount) * 100)
      : 0

    return {
      ...budget,
      progress,
      remainingAmount,
      spentAmount,
      status: getBudgetStatus(spentAmount, budget.limit.amount),
    }
  })

  const totalLimit = enrichedBudgets.reduce(
    (total, budget) => total + budget.limit.amount,
    0,
  )
  const totalSpent = enrichedBudgets.reduce(
    (total, budget) => total + budget.spentAmount,
    0,
  )
  const overBudgetCount = enrichedBudgets.filter(
    (budget) => budget.status === 'over-budget',
  ).length
  const budgetLimit = Number(budgetForm.limit)
  const hasDuplicateBudget = budgets.some(
    (budget) =>
      budget.categoryId === budgetForm.categoryId &&
      budget.month === budgetForm.month &&
      budget.id !== editingBudgetId,
  )
  const isBudgetSubmitDisabled =
    !budgetForm.categoryId ||
    !budgetForm.month ||
    !Number.isFinite(budgetLimit) ||
    budgetLimit <= 0 ||
    hasDuplicateBudget

  const resetForm = () => {
    setEditingBudgetId(null)
    setBudgetForm({
      categoryId: expenseCategories[0]?.id ?? '',
      limit: '',
      month: '2026-06',
    })
  }

  const submitBudget = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const limit = Number(budgetForm.limit)

    if (!Number.isFinite(limit) || limit <= 0) {
      setStatusTone('error')
      setStatusMessage('مبلغ بودجه باید بزرگ‌تر از صفر باشد.')
      return
    }

    const duplicateBudget = budgets.find(
      (budget) =>
        budget.categoryId === budgetForm.categoryId &&
        budget.month === budgetForm.month &&
        budget.id !== editingBudgetId,
    )

    if (duplicateBudget) {
      setStatusTone('error')
      setStatusMessage('برای این دسته‌بندی و ماه قبلاً بودجه ساخته شده است.')
      return
    }

    const spent = getSpentForBudget(budgetForm)
    const nextBudget: Budget = {
      categoryId: budgetForm.categoryId,
      id: editingBudgetId ?? `budget-${crypto.randomUUID()}`,
      limit: {
        amount: limit,
        currency: 'IRR',
      },
      month: budgetForm.month,
      spent: {
        amount: spent,
        currency: 'IRR',
      },
      status: getBudgetStatus(spent, limit),
    }

    if (editingBudgetId) {
      updateBudget(nextBudget)
      setStatusTone('success')
      setStatusMessage('بودجه ویرایش شد؛ میزان خرج از تراکنش‌ها محاسبه می‌شود.')
    } else {
      addBudget(nextBudget)
      setStatusTone('success')
      setStatusMessage('بودجه ساخته شد؛ میزان خرج با تراکنش‌های این ماه به‌روز می‌شود.')
    }

    resetForm()
  }

  const startEditingBudget = (budget: Budget) => {
    setEditingBudgetId(budget.id)
    setStatusMessage('')
    setStatusTone('success')
    setBudgetForm({
      categoryId: budget.categoryId,
      limit: String(budget.limit.amount),
      month: budget.month,
    })
  }

  return (
    <div className="budgets-page">
      <section className="budgets-hero" aria-labelledby="budgets-title">
        <div>
          <p className="eyebrow">برنامه‌ریزی هزینه‌های ماهانه</p>
          <h1 id="budgets-title">بودجه‌ها</h1>
          <p className="intro-copy">
            برای هر دسته هزینه سقف ماهانه تعیین کن و ببین خرج واقعی چقدر به
            برنامه نزدیک است.
          </p>
        </div>
        <div className="budgets-total">
          <span>مصرف کل بودجه‌ها</span>
          <strong>
            {formatMoney({ amount: totalSpent, currency: 'IRR' })} از{' '}
            {formatMoney({ amount: totalLimit, currency: 'IRR' })}
          </strong>
        </div>
      </section>

      <section className="budget-summary-grid" aria-label="خلاصه بودجه‌ها">
        <article className="budget-summary-card">
          <WalletCards aria-hidden="true" size={22} />
          <span>بودجه‌های فعال</span>
          <strong>{budgets.length}</strong>
        </article>
        <article className="budget-summary-card">
          <CheckCircle2 aria-hidden="true" size={22} />
          <span>خرج‌شده</span>
          <strong>{formatMoney({ amount: totalSpent, currency: 'IRR' })}</strong>
        </article>
        <article className="budget-summary-card">
          <BadgeAlert aria-hidden="true" size={22} />
          <span>عبور از بودجه</span>
          <strong>{overBudgetCount}</strong>
        </article>
      </section>

      <section className="budget-workspace">
        <article className="budget-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">
                {editingBudgetId ? 'ویرایش بودجه' : 'بودجه جدید'}
              </p>
              <h2>{editingBudgetId ? 'ویرایش بودجه ماهانه' : 'ساخت بودجه'}</h2>
            </div>
            <Plus aria-hidden="true" size={22} />
          </div>

          <form className="budget-form" onSubmit={submitBudget}>
            <label className="budget-field">
              <span>دسته‌بندی</span>
              <select
                value={budgetForm.categoryId}
                onChange={(event) =>
                  setBudgetForm((current) => ({
                    ...current,
                    categoryId: event.target.value,
                  }))
                }
              >
                {expenseCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="budget-field">
              <span>ماه</span>
              <input
                required
                type="month"
                value={budgetForm.month}
                onChange={(event) =>
                  setBudgetForm((current) => ({
                    ...current,
                    month: event.target.value,
                  }))
                }
              />
            </label>

            <label className="budget-field">
              <span>سقف بودجه</span>
              <input
                required
                inputMode="numeric"
                min="1"
                step="100000"
                type="number"
                value={budgetForm.limit}
                onChange={(event) =>
                  setBudgetForm((current) => ({
                    ...current,
                    limit: event.target.value,
                  }))
                }
              />
              <small>
                {hasDuplicateBudget
                  ? 'برای این دسته‌بندی و ماه بودجه وجود دارد.'
                  : 'سقف بودجه را بر اساس توان خرج ماهانه وارد کن.'}
              </small>
            </label>

            <div className="budget-form-actions">
              {editingBudgetId ? (
                <button className="secondary-button" type="button" onClick={resetForm}>
                  انصراف
                </button>
              ) : null}
              <button type="submit" disabled={isBudgetSubmitDisabled}>
                {editingBudgetId ? 'ذخیره ویرایش' : 'افزودن بودجه'}
              </button>
            </div>
          </form>

          {statusMessage ? (
            <div className={`budget-status budget-status-${statusTone}`} role="status">
              {statusMessage}
            </div>
          ) : null}
        </article>

        <div className="budget-card-list" aria-label="لیست بودجه‌ها">
          {enrichedBudgets.map((budget) => {
            const category = categoryById.get(budget.categoryId)
            const cappedProgress = Math.min(budget.progress, 100)

            return (
              <article className="budget-card" key={budget.id}>
                <div className="budget-card-heading">
                  <div>
                    <p>{budget.month}</p>
                    <h2>{category?.name}</h2>
                  </div>
                  <span className={`budget-badge ${budget.status}`}>
                    {budgetStatusLabels[budget.status]}
                  </span>
                </div>

                <div className="budget-progress-row">
                  <strong>{budget.progress}%</strong>
                  <span>
                    باقی‌مانده:{' '}
                    {formatMoney({
                      amount: Math.max(budget.remainingAmount, 0),
                      currency: 'IRR',
                    })}
                  </span>
                </div>

                <div className="budget-track" aria-hidden="true">
                  <span
                    className={`budget-fill ${budget.status}`}
                    style={{ inlineSize: `${cappedProgress}%` }}
                  />
                </div>

                <div className="budget-meta">
                  <span>
                    خرج‌شده:{' '}
                    {formatMoney({ amount: budget.spentAmount, currency: 'IRR' })}
                  </span>
                  <span>سقف: {formatMoney(budget.limit)}</span>
                </div>

                <button
                  className="budget-edit-button"
                  type="button"
                  onClick={() => startEditingBudget(budget)}
                >
                  <Pencil aria-hidden="true" size={16} />
                  ویرایش
                </button>
              </article>
            )
          })}
        </div>
      </section>
    </div>
  )
}
