import { type ReactNode, useEffect, useMemo, useReducer } from 'react'
import {
  FinanceContext,
  type FinanceContextValue,
  type FinanceState,
} from './FinanceContext'
import { getMockFinanceSnapshot } from '../services'
import type { Account, AppSettings, Budget, SavingsGoal, Transaction } from '../types'

type FinanceAction =
  | { payload: Account; type: 'account/add' }
  | { payload: Budget; type: 'budget/add' }
  | { payload: Budget; type: 'budget/update' }
  | { payload: AppSettings; type: 'settings/update' }
  | { type: 'finance/reset' }
  | { payload: SavingsGoal; type: 'goal/add' }
  | {
      payload: {
        accountId: string
        amount: number
        goalId: string
      }
      type: 'goal/contribute'
    }
  | {
      payload: {
        amount: number
        fromAccountId: string
        note?: string
        toAccountId: string
      }
      type: 'account/transfer'
    }
  | { payload: Transaction; type: 'transaction/add' }
  | { payload: Transaction; type: 'transaction/update' }
  | { payload: string; type: 'transaction/delete' }

export const FINANCE_STORAGE_KEY = 'moneymap.financeState.v1'

const initialFinanceState: FinanceState = getMockFinanceSnapshot()

const isStoredFinanceState = (value: unknown): value is FinanceState => {
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

const loadInitialFinanceState = (): FinanceState => {
  if (typeof window === 'undefined') {
    return initialFinanceState
  }

  try {
    const storedState = window.localStorage.getItem(FINANCE_STORAGE_KEY)

    if (!storedState) {
      return initialFinanceState
    }

    const parsedState = JSON.parse(storedState)

    return isStoredFinanceState(parsedState) ? parsedState : initialFinanceState
  } catch {
    return initialFinanceState
  }
}

const financeReducer = (
  state: FinanceState,
  action: FinanceAction,
): FinanceState => {
  switch (action.type) {
    case 'account/add':
      return {
        ...state,
        accounts: [action.payload, ...state.accounts],
      }
    case 'account/transfer': {
      const now = new Date().toISOString()
      const transferTransaction: Transaction = {
        accountId: action.payload.fromAccountId,
        amount: {
          amount: action.payload.amount,
          currency: state.settings.currency,
        },
        categoryId:
          state.categories.find((category) => category.type === 'income')?.id ??
          state.categories[0]?.id ??
          'category-transfer',
        createdAt: now,
        date: now.slice(0, 10),
        id: `transaction-${crypto.randomUUID()}`,
        note: action.payload.note || 'انتقال بین حساب‌ها',
        transferAccountId: action.payload.toAccountId,
        type: 'transfer',
        updatedAt: now,
      }

      return {
        ...state,
        accounts: state.accounts.map((account) => {
          if (account.id === action.payload.fromAccountId) {
            return {
              ...account,
              balance: {
                ...account.balance,
                amount: account.balance.amount - action.payload.amount,
              },
              updatedAt: now,
            }
          }

          if (account.id === action.payload.toAccountId) {
            return {
              ...account,
              balance: {
                ...account.balance,
                amount: account.balance.amount + action.payload.amount,
              },
              updatedAt: now,
            }
          }

          return account
        }),
        transactions: [transferTransaction, ...state.transactions],
      }
    }
    case 'budget/add':
      return {
        ...state,
        budgets: [action.payload, ...state.budgets],
      }
    case 'budget/update':
      return {
        ...state,
        budgets: state.budgets.map((budget) =>
          budget.id === action.payload.id ? action.payload : budget,
        ),
      }
    case 'finance/reset':
      return getMockFinanceSnapshot()
    case 'goal/add':
      return {
        ...state,
        savingsGoals: [action.payload, ...state.savingsGoals],
      }
    case 'goal/contribute': {
      const now = new Date().toISOString()
      const goal = state.savingsGoals.find(
        (savingsGoal) => savingsGoal.id === action.payload.goalId,
      )
      const contributionTransaction: Transaction = {
        accountId: action.payload.accountId,
        amount: {
          amount: action.payload.amount,
          currency: state.settings.currency,
        },
        categoryId:
          state.categories.find((category) => category.type === 'expense')?.id ??
          state.categories[0]?.id ??
          'category-savings',
        createdAt: now,
        date: now.slice(0, 10),
        id: `transaction-${crypto.randomUUID()}`,
        note: goal ? `واریز به ${goal.name}` : 'واریز به هدف پس‌انداز',
        type: 'expense',
        updatedAt: now,
      }

      return {
        ...state,
        accounts: state.accounts.map((account) =>
          account.id === action.payload.accountId
            ? {
                ...account,
                balance: {
                  ...account.balance,
                  amount: account.balance.amount - action.payload.amount,
                },
                updatedAt: now,
              }
            : account,
        ),
        savingsGoals: state.savingsGoals.map((savingsGoal) =>
          savingsGoal.id === action.payload.goalId
            ? {
                ...savingsGoal,
                currentAmount: {
                  ...savingsGoal.currentAmount,
                  amount:
                    savingsGoal.currentAmount.amount + action.payload.amount,
                },
                updatedAt: now,
              }
            : savingsGoal,
        ),
        transactions: [contributionTransaction, ...state.transactions],
      }
    }
    case 'settings/update':
      return {
        ...state,
        settings: action.payload,
      }
    case 'transaction/add':
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
      }
    case 'transaction/update':
      return {
        ...state,
        transactions: state.transactions.map((transaction) =>
          transaction.id === action.payload.id ? action.payload : transaction,
        ),
      }
    case 'transaction/delete':
      return {
        ...state,
        transactions: state.transactions.filter(
          (transaction) => transaction.id !== action.payload,
        ),
      }
    default:
      return state
  }
}

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(
    financeReducer,
    initialFinanceState,
    loadInitialFinanceState,
  )

  useEffect(() => {
    window.localStorage.setItem(FINANCE_STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const value = useMemo<FinanceContextValue>(
    () => ({
      ...state,
      addAccount: (account) =>
        dispatch({ payload: account, type: 'account/add' }),
      addBudget: (budget) => dispatch({ payload: budget, type: 'budget/add' }),
      addSavingsGoal: (goal) => dispatch({ payload: goal, type: 'goal/add' }),
      addTransaction: (transaction) =>
        dispatch({ payload: transaction, type: 'transaction/add' }),
      contributeToSavingsGoal: (payload) =>
        dispatch({ payload, type: 'goal/contribute' }),
      deleteTransaction: (transactionId) =>
        dispatch({ payload: transactionId, type: 'transaction/delete' }),
      resetFinanceData: () => dispatch({ type: 'finance/reset' }),
      transferBetweenAccounts: (payload) =>
        dispatch({ payload, type: 'account/transfer' }),
      updateSettings: (settings) =>
        dispatch({ payload: settings, type: 'settings/update' }),
      updateBudget: (budget) =>
        dispatch({ payload: budget, type: 'budget/update' }),
      updateTransaction: (transaction) =>
        dispatch({ payload: transaction, type: 'transaction/update' }),
    }),
    [state],
  )

  return (
    <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
  )
}
