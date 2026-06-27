import { describe, expect, it } from 'vitest'
import { getMockFinanceSnapshot } from '../services'
import { isFinanceState } from './financeStateStorage'

describe('financeStateStorage', () => {
  it('accepts a valid finance state backup', () => {
    expect(isFinanceState(getMockFinanceSnapshot())).toBe(true)
  })

  it('rejects an incomplete finance state backup', () => {
    expect(
      isFinanceState({
        accounts: [],
        settings: { currency: 'IRR' },
      }),
    ).toBe(false)
  })
})
