export type ID = string

export type ISODateString = string

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'IRR'

export type MoneyAmount = {
  amount: number
  currency: CurrencyCode
}

export type TransactionType = 'income' | 'expense' | 'transfer'

export type AccountType = 'cash' | 'checking' | 'credit-card' | 'savings'

export type CategoryType = 'income' | 'expense'

export type BudgetStatus = 'on-track' | 'near-limit' | 'over-budget'

export type ThemeMode = 'light' | 'dark' | 'system'

export type AppLocale = 'en' | 'fa'

export type TextDirection = 'ltr' | 'rtl'

export type Account = {
  id: ID
  name: string
  type: AccountType
  balance: MoneyAmount
  color: string
  isArchived: boolean
  createdAt: ISODateString
  updatedAt: ISODateString
}

export type Category = {
  id: ID
  name: string
  type: CategoryType
  icon: string
  color: string
  isDefault: boolean
}

export type Transaction = {
  id: ID
  type: TransactionType
  amount: MoneyAmount
  date: ISODateString
  categoryId: ID
  accountId: ID
  note?: string
  transferAccountId?: ID
  createdAt: ISODateString
  updatedAt: ISODateString
}

export type Budget = {
  id: ID
  categoryId: ID
  month: string
  limit: MoneyAmount
  spent: MoneyAmount
  status: BudgetStatus
}

export type SavingsGoal = {
  id: ID
  name: string
  targetAmount: MoneyAmount
  currentAmount: MoneyAmount
  deadline: ISODateString
  color: string
  createdAt: ISODateString
  updatedAt: ISODateString
}

export type AppSettings = {
  currency: CurrencyCode
  locale: AppLocale
  direction: TextDirection
  themeMode: ThemeMode
}

export type MonthlyReport = {
  month: string
  income: MoneyAmount
  expenses: MoneyAmount
  savingsRate: number
  highestSpendingCategoryId?: ID
}
