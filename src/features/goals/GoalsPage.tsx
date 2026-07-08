import { CalendarDays, PiggyBank, Plus, Target } from 'lucide-react'
import { type FormEvent, useMemo, useState } from 'react'
import { useFinance } from '../../hooks/useFinance'
import type { SavingsGoal } from '../../types'
import { formatMoney, formatShortDate } from '../../utils'
import './GoalsPage.css'

type GoalFormState = {
  color: string
  currentAmount: string
  deadline: string
  name: string
  targetAmount: string
}

type ContributionFormState = {
  accountId: string
  amount: string
  goalId: string
}

const getDateInputValueMonthsFromNow = (months: number) => {
  const date = new Date()

  date.setMonth(date.getMonth() + months)

  return date.toISOString().slice(0, 10)
}

const getInitialGoalForm = (): GoalFormState => ({
  color: '#0f766e',
  currentAmount: '',
  deadline: getDateInputValueMonthsFromNow(6),
  name: '',
  targetAmount: '',
})

export function GoalsPage() {
  const {
    accounts,
    addSavingsGoal,
    contributeToSavingsGoal,
    savingsGoals,
  } = useFinance()
  const [goalForm, setGoalForm] = useState<GoalFormState>(getInitialGoalForm)
  const [contributionForm, setContributionForm] =
    useState<ContributionFormState>({
      accountId: accounts[0]?.id ?? '',
      amount: '',
      goalId: savingsGoals[0]?.id ?? '',
    })
  const [statusMessage, setStatusMessage] = useState('')

  const goalStats = useMemo(() => {
    const targetTotal = savingsGoals.reduce(
      (total, goal) => total + goal.targetAmount.amount,
      0,
    )
    const currentTotal = savingsGoals.reduce(
      (total, goal) => total + goal.currentAmount.amount,
      0,
    )

    return {
      currentTotal,
      progress: targetTotal ? Math.round((currentTotal / targetTotal) * 100) : 0,
      targetTotal,
    }
  }, [savingsGoals])
  const selectedContributionGoal = savingsGoals.find(
    (goal) => goal.id === contributionForm.goalId,
  )
  const contributionRemainingAmount = selectedContributionGoal
    ? Math.max(
        selectedContributionGoal.targetAmount.amount -
          selectedContributionGoal.currentAmount.amount,
        0,
      )
    : undefined

  const submitGoal = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const targetAmount = Number(goalForm.targetAmount)
    const currentAmount = Number(goalForm.currentAmount || 0)
    const now = new Date().toISOString()

    if (!Number.isFinite(targetAmount) || targetAmount <= 0) {
      setStatusMessage('مبلغ هدف باید بزرگ‌تر از صفر باشد.')
      return
    }

    if (currentAmount > targetAmount) {
      setStatusMessage('مبلغ فعلی نباید از مبلغ هدف بیشتر باشد.')
      return
    }

    const goal: SavingsGoal = {
      color: goalForm.color,
      createdAt: now,
      currentAmount: {
        amount: Number.isFinite(currentAmount) ? currentAmount : 0,
        currency: 'IRR',
      },
      deadline: goalForm.deadline,
      id: `goal-${crypto.randomUUID()}`,
      name: goalForm.name.trim(),
      targetAmount: {
        amount: targetAmount,
        currency: 'IRR',
      },
      updatedAt: now,
    }

    addSavingsGoal(goal)
    setGoalForm(getInitialGoalForm())
    setContributionForm((current) => ({
      ...current,
      goalId: current.goalId || goal.id,
    }))
    setStatusMessage('هدف پس‌انداز جدید اضافه شد.')
  }

  const submitContribution = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const amount = Number(contributionForm.amount)

    if (!contributionForm.goalId || !contributionForm.accountId) {
      setStatusMessage('هدف و حساب را انتخاب کن.')
      return
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      setStatusMessage('مبلغ واریزی باید بزرگ‌تر از صفر باشد.')
      return
    }

    if (
      selectedContributionGoal &&
      amount > selectedContributionGoal.targetAmount.amount -
        selectedContributionGoal.currentAmount.amount
    ) {
      setStatusMessage('مبلغ واریزی نباید از مبلغ باقی‌مانده هدف بیشتر باشد.')
      return
    }

    contributeToSavingsGoal({
      accountId: contributionForm.accountId,
      amount,
      goalId: contributionForm.goalId,
    })
    setContributionForm((current) => ({
      ...current,
      amount: '',
    }))
    setStatusMessage('واریزی هدف پس‌انداز ثبت شد.')
  }

  return (
    <div className="goals-page">
      <section className="goals-hero" aria-labelledby="goals-title">
        <div>
          <p className="eyebrow">ساختن پیشرفت مالی</p>
          <h1 id="goals-title">اهداف پس‌انداز</h1>
          <p className="intro-copy">
            هدف‌های مالی آینده را تعریف کن، پیشرفتشان را ببین و برایشان واریزی
            ثبت کن.
          </p>
        </div>
        <div className="goals-total">
          <span>پیشرفت کل</span>
          <strong>{goalStats.progress}%</strong>
          <small>
            {formatMoney({ amount: goalStats.currentTotal, currency: 'IRR' })} از{' '}
            {formatMoney({ amount: goalStats.targetTotal, currency: 'IRR' })}
          </small>
        </div>
      </section>

      <section className="goal-grid" aria-label="اهداف فعال">
        {savingsGoals.map((goal) => {
          const progress = goal.targetAmount.amount
            ? Math.round((goal.currentAmount.amount / goal.targetAmount.amount) * 100)
            : 0
          const cappedProgress = Math.min(progress, 100)

          return (
            <article className="goal-card" key={goal.id}>
              <div className="goal-card-heading">
                <span
                  className="goal-icon"
                  style={{ color: goal.color }}
                  aria-hidden="true"
                >
                  <Target size={22} strokeWidth={2.3} />
                </span>
                <div>
                  <p>مهلت: {formatShortDate(goal.deadline)}</p>
                  <h2>{goal.name}</h2>
                </div>
              </div>

              <div className="goal-progress-row">
                <strong>{progress}%</strong>
                <span>
                  {formatMoney(goal.currentAmount)} از {formatMoney(goal.targetAmount)}
                </span>
              </div>

              <div className="goal-track" aria-hidden="true">
                <span
                  className="goal-fill"
                  style={{
                    background: goal.color,
                    inlineSize: `${cappedProgress}%`,
                  }}
                />
              </div>
            </article>
          )
        })}
      </section>

      <section className="goal-workspace">
        <article className="goal-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">هدف جدید</p>
              <h2>ساخت هدف پس‌انداز</h2>
            </div>
            <Plus aria-hidden="true" size={22} />
          </div>

          <form className="goal-form" onSubmit={submitGoal}>
            <label className="goal-field">
              <span>نام هدف</span>
              <input
                required
                value={goalForm.name}
                onChange={(event) =>
                  setGoalForm((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
                placeholder="مثلاً سفر، لپ‌تاپ یا صندوق اضطراری"
              />
            </label>

            <label className="goal-field">
              <span>مبلغ هدف</span>
              <input
                required
                inputMode="numeric"
                min="1"
                step="100000"
                type="number"
                value={goalForm.targetAmount}
                onChange={(event) =>
                  setGoalForm((current) => ({
                    ...current,
                    targetAmount: event.target.value,
                  }))
                }
              />
            </label>

            <label className="goal-field">
              <span>مبلغ فعلی</span>
              <input
                inputMode="numeric"
                min="0"
                step="100000"
                type="number"
                value={goalForm.currentAmount}
                onChange={(event) =>
                  setGoalForm((current) => ({
                    ...current,
                    currentAmount: event.target.value,
                  }))
                }
              />
            </label>

            <label className="goal-field">
              <span>مهلت</span>
              <input
                required
                type="date"
                value={goalForm.deadline}
                onChange={(event) =>
                  setGoalForm((current) => ({
                    ...current,
                    deadline: event.target.value,
                  }))
                }
              />
            </label>

            <label className="goal-field">
              <span>رنگ هدف</span>
              <input
                type="color"
                value={goalForm.color}
                onChange={(event) =>
                  setGoalForm((current) => ({
                    ...current,
                    color: event.target.value,
                  }))
                }
              />
            </label>

            <button type="submit">افزودن هدف</button>
          </form>
        </article>

        <article className="goal-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">واریزی</p>
              <h2>ثبت واریزی به هدف</h2>
            </div>
            <PiggyBank aria-hidden="true" size={22} />
          </div>

          <form className="goal-form" onSubmit={submitContribution}>
            <label className="goal-field">
              <span>هدف</span>
              <select
                value={contributionForm.goalId}
                onChange={(event) =>
                  setContributionForm((current) => ({
                    ...current,
                    goalId: event.target.value,
                  }))
                }
              >
                {savingsGoals.map((goal) => (
                  <option key={goal.id} value={goal.id}>
                    {goal.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="goal-field">
              <span>حساب پرداخت</span>
              <select
                value={contributionForm.accountId}
                onChange={(event) =>
                  setContributionForm((current) => ({
                    ...current,
                    accountId: event.target.value,
                  }))
                }
              >
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="goal-field">
              <span>مبلغ واریزی</span>
              <input
                required
                inputMode="numeric"
                min="1"
                max={contributionRemainingAmount}
                step="100000"
                type="number"
                value={contributionForm.amount}
                onChange={(event) =>
                  setContributionForm((current) => ({
                    ...current,
                    amount: event.target.value,
                  }))
                }
              />
            </label>

            <button type="submit">ثبت واریزی</button>
          </form>
        </article>
      </section>

      {statusMessage ? (
        <div className="goal-status" role="status">
          <CalendarDays aria-hidden="true" size={18} />
          {statusMessage}
        </div>
      ) : null}
    </div>
  )
}
