import { describe, expect, it } from 'vitest'
import {
  getLatestTransactionMonth,
  getSavingsRate,
  getTransactionMonths,
  getTransactionsByMonth,
  getTotalBalance,
  getTotalByTransactionType,
} from './financeCalculations'
import type { Account, Transaction } from '../types'

const accounts: Account[] = [
  {
    balance: { amount: 100, currency: 'IRR' },
    color: '#0f766e',
    createdAt: '2026-01-01',
    id: 'account-1',
    isArchived: false,
    name: 'کارت بانکی',
    type: 'checking',
    updatedAt: '2026-01-01',
  },
  {
    balance: { amount: 50, currency: 'IRR' },
    color: '#2563eb',
    createdAt: '2026-01-01',
    id: 'account-2',
    isArchived: false,
    name: 'نقدی',
    type: 'cash',
    updatedAt: '2026-01-01',
  },
]

const transactions: Transaction[] = [
  {
    accountId: 'account-1',
    amount: { amount: 200, currency: 'IRR' },
    categoryId: 'salary',
    createdAt: '2026-06-01',
    date: '2026-06-01',
    id: 'transaction-1',
    type: 'income',
    updatedAt: '2026-06-01',
  },
  {
    accountId: 'account-1',
    amount: { amount: 80, currency: 'IRR' },
    categoryId: 'rent',
    createdAt: '2026-06-02',
    date: '2026-06-02',
    id: 'transaction-2',
    type: 'expense',
    updatedAt: '2026-06-02',
  },
  {
    accountId: 'account-1',
    amount: { amount: 150, currency: 'IRR' },
    categoryId: 'salary',
    createdAt: '2026-05-01',
    date: '2026-05-01',
    id: 'transaction-3',
    type: 'income',
    updatedAt: '2026-05-01',
  },
]

describe('finance calculations', () => {
  it('calculates total account balance', () => {
    expect(getTotalBalance(accounts)).toEqual({ amount: 150, currency: 'IRR' })
  })

  it('calculates total amount by transaction type', () => {
    expect(getTotalByTransactionType(transactions, 'expense')).toEqual({
      amount: 80,
      currency: 'IRR',
    })
  })

  it('calculates savings rate from income and expenses', () => {
    expect(
      getSavingsRate(
        { amount: 200, currency: 'IRR' },
        { amount: 80, currency: 'IRR' },
      ),
    ).toBe(60)
  })

  it('finds the latest transaction month', () => {
    expect(getLatestTransactionMonth(transactions)).toBe('2026-06')
  })

  it('returns unique transaction months from newest to oldest', () => {
    expect(getTransactionMonths(transactions)).toEqual(['2026-06', '2026-05'])
  })

  it('filters transactions by month', () => {
    expect(getTransactionsByMonth(transactions, '2026-05')).toEqual([
      transactions[2],
    ])
  })
})
