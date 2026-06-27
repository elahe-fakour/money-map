import { createContext } from 'react'
import type {
  Account,
  AppSettings,
  Budget,
  Category,
  SavingsGoal,
  Transaction,
} from '../types'

export type FinanceState = {
  accounts: Account[]
  budgets: Budget[]
  categories: Category[]
  savingsGoals: SavingsGoal[]
  settings: AppSettings
  transactions: Transaction[]
}

export type FinanceContextValue = FinanceState & {
  addAccount: (account: Account) => void
  addBudget: (budget: Budget) => void
  addSavingsGoal: (goal: SavingsGoal) => void
  addTransaction: (transaction: Transaction) => void
  contributeToSavingsGoal: (payload: {
    accountId: string
    amount: number
    goalId: string
  }) => void
  deleteTransaction: (transactionId: string) => void
  replaceFinanceData: (state: FinanceState) => void
  resetFinanceData: () => void
  transferBetweenAccounts: (payload: {
    amount: number
    fromAccountId: string
    note?: string
    toAccountId: string
  }) => void
  updateSettings: (settings: AppSettings) => void
  updateBudget: (budget: Budget) => void
  updateTransaction: (transaction: Transaction) => void
}

export const FinanceContext = createContext<FinanceContextValue | null>(null)
