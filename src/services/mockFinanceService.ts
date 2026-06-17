import {
  mockAccounts,
  mockBudgets,
  mockCategories,
  mockSavingsGoals,
  mockSettings,
  mockTransactions,
} from '../data'

export const getMockFinanceSnapshot = () => ({
  accounts: mockAccounts,
  budgets: mockBudgets,
  categories: mockCategories,
  savingsGoals: mockSavingsGoals,
  settings: mockSettings,
  transactions: mockTransactions,
})

