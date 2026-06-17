import type { Account, CurrencyCode, MoneyAmount, Transaction } from '../types'

export const createMoney = (
  amount: number,
  currency: CurrencyCode = 'IRR',
): MoneyAmount => ({
  amount,
  currency,
})

export const sumMoney = (
  values: MoneyAmount[],
  currency: CurrencyCode = 'IRR',
): MoneyAmount =>
  createMoney(
    values.reduce((total, value) => total + value.amount, 0),
    currency,
  )

export const getTotalBalance = (accounts: Account[]): MoneyAmount =>
  sumMoney(accounts.map((account) => account.balance))

export const getTotalByTransactionType = (
  transactions: Transaction[],
  type: Transaction['type'],
): MoneyAmount =>
  sumMoney(
    transactions
      .filter((transaction) => transaction.type === type)
      .map((transaction) => transaction.amount),
  )

export const getSavingsRate = (
  income: MoneyAmount,
  expenses: MoneyAmount,
): number => {
  if (income.amount === 0) {
    return 0
  }

  return Math.round(((income.amount - expenses.amount) / income.amount) * 100)
}

