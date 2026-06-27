import { type ReactNode, useMemo, useReducer } from 'react'
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

const initialFinanceState: FinanceState = getMockFinanceSnapshot()

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
  const [state, dispatch] = useReducer(financeReducer, initialFinanceState)

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
