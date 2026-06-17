import { type ReactNode, useMemo, useReducer } from 'react'
import {
  FinanceContext,
  type FinanceContextValue,
  type FinanceState,
} from './FinanceContext'
import { getMockFinanceSnapshot } from '../services'
import type { Account, Transaction } from '../types'

type FinanceAction =
  | { payload: Account; type: 'account/add' }
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
      addTransaction: (transaction) =>
        dispatch({ payload: transaction, type: 'transaction/add' }),
      deleteTransaction: (transactionId) =>
        dispatch({ payload: transactionId, type: 'transaction/delete' }),
      transferBetweenAccounts: (payload) =>
        dispatch({ payload, type: 'account/transfer' }),
      updateTransaction: (transaction) =>
        dispatch({ payload: transaction, type: 'transaction/update' }),
    }),
    [state],
  )

  return (
    <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
  )
}
