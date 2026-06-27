import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { FinanceProvider } from './FinanceProvider'
import { useFinance } from '../hooks/useFinance'

function FinanceHarness() {
  const { addTransaction, deleteTransaction, transactions } = useFinance()

  return (
    <div>
      <p>تعداد تراکنش‌ها: {transactions.length}</p>
      <button
        type="button"
        onClick={() =>
          addTransaction({
            accountId: 'account-bank-card',
            amount: { amount: 1_000_000, currency: 'IRR' },
            categoryId: 'category-groceries',
            createdAt: '2026-06-20',
            date: '2026-06-20',
            id: 'transaction-test',
            note: 'تست خرید',
            type: 'expense',
            updatedAt: '2026-06-20',
          })
        }
      >
        افزودن تراکنش تست
      </button>
      <button
        type="button"
        onClick={() => deleteTransaction('transaction-test')}
      >
        حذف تراکنش تست
      </button>
    </div>
  )
}

describe('FinanceProvider', () => {
  it('adds and deletes transactions through shared state actions', async () => {
    const user = userEvent.setup()

    render(
      <FinanceProvider>
        <FinanceHarness />
      </FinanceProvider>,
    )

    expect(screen.getByText('تعداد تراکنش‌ها: 14')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'افزودن تراکنش تست' }))
    expect(screen.getByText('تعداد تراکنش‌ها: 15')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'حذف تراکنش تست' }))
    expect(screen.getByText('تعداد تراکنش‌ها: 14')).toBeInTheDocument()
  })
})

