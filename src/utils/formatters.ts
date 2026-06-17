import type { CurrencyCode, ISODateString, MoneyAmount } from '../types'

const currencyFormatters = new Map<string, Intl.NumberFormat>()
const dateFormatters = new Map<string, Intl.DateTimeFormat>()

export const formatMoney = (
  money: MoneyAmount,
  locale = 'fa-IR',
  currency: CurrencyCode = money.currency,
) => {
  const key = `${locale}-${currency}`

  if (!currencyFormatters.has(key)) {
    currencyFormatters.set(
      key,
      new Intl.NumberFormat(locale, {
        currency,
        maximumFractionDigits: 0,
        style: 'currency',
      }),
    )
  }

  return currencyFormatters.get(key)!.format(money.amount)
}

export const formatShortDate = (date: ISODateString, locale = 'fa-IR') => {
  if (!dateFormatters.has(locale)) {
    dateFormatters.set(
      locale,
      new Intl.DateTimeFormat(locale, {
        day: 'numeric',
        month: 'short',
      }),
    )
  }

  return dateFormatters.get(locale)!.format(new Date(date))
}

