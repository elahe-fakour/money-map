import { CreditCard, Landmark, Plus, Repeat2, Wallet } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useFinance } from '../../hooks/useFinance'
import type { AccountType } from '../../types'
import { formatMoney, getTotalBalance } from '../../utils'
import './AccountsPage.css'

type AccountFormState = {
  balance: string
  color: string
  name: string
  type: AccountType
}

type TransferFormState = {
  amount: string
  fromAccountId: string
  note: string
  toAccountId: string
}

const accountTypeLabels: Record<AccountType, string> = {
  cash: 'نقدی',
  checking: 'کارت بانکی',
  'credit-card': 'کارت اعتباری',
  savings: 'پس‌انداز',
}

const accountTypeIcons = {
  cash: Wallet,
  checking: CreditCard,
  'credit-card': CreditCard,
  savings: Landmark,
}

const initialAccountForm: AccountFormState = {
  balance: '',
  color: '#0f766e',
  name: '',
  type: 'checking',
}

export function AccountsPage() {
  const { accounts, addAccount, transferBetweenAccounts } = useFinance()
  const [accountForm, setAccountForm] = useState<AccountFormState>(initialAccountForm)
  const [transferForm, setTransferForm] = useState<TransferFormState>({
    amount: '',
    fromAccountId: accounts[0]?.id ?? '',
    note: '',
    toAccountId: accounts[1]?.id ?? '',
  })
  const [statusMessage, setStatusMessage] = useState('')
  const totalBalance = useMemo(() => getTotalBalance(accounts), [accounts])
  const sourceAccount = accounts.find(
    (account) => account.id === transferForm.fromAccountId,
  )

  const submitAccount = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const balance = Number(accountForm.balance)
    const now = new Date().toISOString()

    addAccount({
      balance: {
        amount: Number.isFinite(balance) ? balance : 0,
        currency: 'IRR',
      },
      color: accountForm.color,
      createdAt: now,
      id: `account-${crypto.randomUUID()}`,
      isArchived: false,
      name: accountForm.name.trim(),
      type: accountForm.type,
      updatedAt: now,
    })
    setAccountForm(initialAccountForm)
    setStatusMessage('حساب جدید اضافه شد.')
  }

  const submitTransfer = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const amount = Number(transferForm.amount)

    if (transferForm.fromAccountId === transferForm.toAccountId) {
      setStatusMessage('حساب مبدا و مقصد نباید یکسان باشند.')
      return
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      setStatusMessage('مبلغ انتقال باید بزرگ‌تر از صفر باشد.')
      return
    }

    if (sourceAccount && amount > sourceAccount.balance.amount) {
      setStatusMessage('مبلغ انتقال نباید از موجودی حساب مبدا بیشتر باشد.')
      return
    }

    transferBetweenAccounts({
      amount,
      fromAccountId: transferForm.fromAccountId,
      note: transferForm.note.trim() || undefined,
      toAccountId: transferForm.toAccountId,
    })
    setTransferForm((current) => ({
      ...current,
      amount: '',
      note: '',
    }))
    setStatusMessage('انتقال بین حساب‌ها ثبت شد.')
  }

  return (
    <div className="accounts-page">
      <section className="accounts-hero" aria-labelledby="accounts-title">
        <div>
          <p className="eyebrow">مدیریت موجودی‌ها</p>
          <h1 id="accounts-title">حساب‌ها</h1>
          <p className="intro-copy">
            موجودی همه حساب‌ها را ببین، حساب جدید اضافه کن و بین حساب‌ها انتقال
            ثبت کن.
          </p>
        </div>
        <div className="accounts-total">
          <span>موجودی کل</span>
          <strong>{formatMoney(totalBalance)}</strong>
        </div>
      </section>

      <section className="account-grid" aria-label="حساب‌های فعال">
        {accounts.map((account) => {
          const Icon = accountTypeIcons[account.type]

          return (
            <article className="account-card" key={account.id}>
              <span
                className="account-icon"
                style={{ color: account.color }}
                aria-hidden="true"
              >
                <Icon size={22} strokeWidth={2.3} />
              </span>
              <div>
                <p>{accountTypeLabels[account.type]}</p>
                <h2>{account.name}</h2>
              </div>
              <strong>{formatMoney(account.balance)}</strong>
            </article>
          )
        })}
      </section>

      <section className="account-workspace">
        <article className="account-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">حساب جدید</p>
              <h2>افزودن حساب</h2>
            </div>
            <Plus aria-hidden="true" size={22} />
          </div>

          <form className="account-form" onSubmit={submitAccount}>
            <label className="account-field">
              <span>نام حساب</span>
              <input
                required
                value={accountForm.name}
                onChange={(event) =>
                  setAccountForm((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
                placeholder="مثلاً کارت حقوق"
              />
            </label>

            <label className="account-field">
              <span>نوع حساب</span>
              <select
                value={accountForm.type}
                onChange={(event) =>
                  setAccountForm((current) => ({
                    ...current,
                    type: event.target.value as AccountType,
                  }))
                }
              >
                {Object.entries(accountTypeLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>

            <label className="account-field">
              <span>موجودی اولیه</span>
              <input
                required
                inputMode="numeric"
                min="0"
                step="100000"
                type="number"
                value={accountForm.balance}
                onChange={(event) =>
                  setAccountForm((current) => ({
                    ...current,
                    balance: event.target.value,
                  }))
                }
              />
            </label>

            <label className="account-field">
              <span>رنگ حساب</span>
              <input
                type="color"
                value={accountForm.color}
                onChange={(event) =>
                  setAccountForm((current) => ({
                    ...current,
                    color: event.target.value,
                  }))
                }
              />
            </label>

            <button type="submit">افزودن حساب</button>
          </form>
        </article>

        <article className="account-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">انتقال</p>
              <h2>انتقال بین حساب‌ها</h2>
            </div>
            <Repeat2 aria-hidden="true" size={22} />
          </div>

          <form className="account-form" onSubmit={submitTransfer}>
            <label className="account-field">
              <span>از حساب</span>
              <select
                value={transferForm.fromAccountId}
                onChange={(event) =>
                  setTransferForm((current) => ({
                    ...current,
                    fromAccountId: event.target.value,
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

            <label className="account-field">
              <span>به حساب</span>
              <select
                value={transferForm.toAccountId}
                onChange={(event) =>
                  setTransferForm((current) => ({
                    ...current,
                    toAccountId: event.target.value,
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

            <label className="account-field">
              <span>مبلغ انتقال</span>
              <input
                required
                inputMode="numeric"
                max={sourceAccount?.balance.amount}
                min="1"
                step="100000"
                type="number"
                value={transferForm.amount}
                onChange={(event) =>
                  setTransferForm((current) => ({
                    ...current,
                    amount: event.target.value,
                  }))
                }
              />
            </label>

            {sourceAccount ? (
              <p className="account-helper">
                موجودی قابل انتقال:{' '}
                {formatMoney(sourceAccount.balance)}
              </p>
            ) : null}

            <label className="account-field">
              <span>یادداشت</span>
              <input
                value={transferForm.note}
                onChange={(event) =>
                  setTransferForm((current) => ({
                    ...current,
                    note: event.target.value,
                  }))
                }
                placeholder="مثلاً انتقال به پس‌انداز"
              />
            </label>

            <button type="submit">ثبت انتقال</button>
          </form>
        </article>
      </section>

      {statusMessage ? (
        <div className="account-status" role="status">
          {statusMessage}
        </div>
      ) : null}
    </div>
  )
}
