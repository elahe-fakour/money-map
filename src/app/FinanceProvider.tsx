import { type ReactNode, useMemo, useReducer } from 'react'
import {
  FinanceContext,
  type FinanceContextValue,
  type FinanceState,
} from './FinanceContext'
import { getMockFinanceSnapshot } from '../services'
import type { Transaction } from '../types'

type FinanceAction =
  | { payload: Transaction; type: 'transaction/add' }
  | { payload: Transaction; type: 'transaction/update' }
  | { payload: string; type: 'transaction/delete' }

const initialFinanceState: FinanceState = getMockFinanceSnapshot()

const financeReducer = (
  state: FinanceState,
  action: FinanceAction,
): FinanceState => {
  switch (action.type) {
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
      addTransaction: (transaction) =>
        dispatch({ payload: transaction, type: 'transaction/add' }),
      deleteTransaction: (transactionId) =>
        dispatch({ payload: transactionId, type: 'transaction/delete' }),
      updateTransaction: (transaction) =>
        dispatch({ payload: transaction, type: 'transaction/update' }),
    }),
    [state],
  )

  return (
    <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
  )
}
