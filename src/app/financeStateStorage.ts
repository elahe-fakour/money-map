import type { FinanceState } from './FinanceContext'

export const FINANCE_STORAGE_KEY = 'moneymap.financeState.v1'

export const isFinanceState = (value: unknown): value is FinanceState => {
  if (!value || typeof value !== 'object') {
    return false
  }

  const state = value as Partial<FinanceState>

  return (
    Array.isArray(state.accounts) &&
    Array.isArray(state.budgets) &&
    Array.isArray(state.categories) &&
    Array.isArray(state.savingsGoals) &&
    Array.isArray(state.transactions) &&
    Boolean(state.settings)
  )
}
