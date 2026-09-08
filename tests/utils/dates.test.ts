import { describe, it, expect } from 'vitest'
import { coerceDate } from '../../src/utils/dates'
import { BCRAError } from '../../src/errors'

describe('coerceDate', () => {
  it('returns the ISO date of a Date', () => {
    expect(coerceDate(new Date('2024-06-12'))).toBe('2024-06-12')
  })

  it('takes only the date part of a Date with a time component', () => {
    expect(coerceDate(new Date('2024-06-12T15:30:00Z'))).toBe('2024-06-12')
  })

  it('passes through an ISO 8601 string', () => {
    expect(coerceDate('2024-06-12')).toBe('2024-06-12')
  })

  it('normalizes a compact ISO 8601 string', () => {
    expect(coerceDate('20240612')).toBe('2024-06-12')
  })

  it('throws BCRAError for a non-ISO string', () => {
    expect(() => coerceDate('12/06/2024')).toThrow(BCRAError)
  })

  it('throws BCRAError for an impossible calendar date', () => {
    expect(() => coerceDate('2024-02-30')).toThrow(BCRAError)
  })

  it('throws BCRAError for an out-of-range month', () => {
    expect(() => coerceDate('2024-13-01')).toThrow(BCRAError)
  })

  it('throws BCRAError for an empty string', () => {
    expect(() => coerceDate('')).toThrow(BCRAError)
  })

  it('throws BCRAError with the message borrowing the Python one', () => {
    expect(() => coerceDate('12/06/2024')).toThrow(
      "Fecha inválida: '12/06/2024'. Usá el formato ISO 8601 (YYYY-MM-DD).",
    )
  })

  it('throws BCRAError for an invalid Date', () => {
    expect(() => coerceDate(new Date('garbage'))).toThrow(BCRAError)
  })

  it('throws TypeError for a non-Date, non-string input', () => {
    expect(() => coerceDate(20240612 as unknown as Date)).toThrow(TypeError)
  })
})
