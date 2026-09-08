import { describe, it, expect } from 'vitest'
import { normalizeCuit, validateCuit } from '../../src/utils/cuit'
import { BCRAError } from '../../src/errors'

describe('normalizeCuit', () => {
  it('returns the 11 digits of a plain CUIT', () => {
    expect(normalizeCuit('20111111112')).toBe('20111111112')
  })

  it('strips hyphens from a hyphenated CUIT', () => {
    expect(normalizeCuit('20-11111111-2')).toBe('20111111112')
  })

  it('strips hyphens when only the second separator is present', () => {
    expect(normalizeCuit('2011111111-2')).toBe('20111111112')
  })

  it('throws BCRAError for a CUIT with too few digits', () => {
    expect(() => normalizeCuit('12345')).toThrow(BCRAError)
  })

  it('throws BCRAError for a CUIT with too many digits', () => {
    expect(() => normalizeCuit('201111111125')).toThrow(BCRAError)
  })

  it('throws BCRAError for a CUIT with letters', () => {
    expect(() => normalizeCuit('20-abcdefgh-ab')).toThrow(BCRAError)
  })

  it('throws BCRAError for misplaced hyphens', () => {
    expect(() => normalizeCuit('20-1111111-112')).toThrow(BCRAError)
  })

  it('throws BCRAError for an empty string', () => {
    expect(() => normalizeCuit('')).toThrow(BCRAError)
  })

  it('throws BCRAError with the Spanish message borrowing the Python one', () => {
    expect(() => normalizeCuit('20-a1111111-2')).toThrow(
      "CUIT inválido: 20-a1111111-2. Debe contener 11 dígitos (ej. '20111111112').",
    )
  })

  it('throws TypeError for a non-string input', () => {
    expect(() => normalizeCuit(20111111112 as unknown as string)).toThrow(
      TypeError,
    )
  })
})

describe('validateCuit', () => {
  it('returns true for a plain 11-digit CUIT', () => {
    expect(validateCuit('20111111112')).toBe(true)
  })

  it('returns true for a hyphenated CUIT', () => {
    expect(validateCuit('20-11111111-2')).toBe(true)
  })

  it('returns false for an invalid CUIT', () => {
    expect(validateCuit('12345')).toBe(false)
  })

  it('returns false for a CUIT with letters', () => {
    expect(validateCuit('20-abcdefgh-ab')).toBe(false)
  })

  it('returns false for a non-string input', () => {
    expect(validateCuit(20111111112 as unknown as string)).toBe(false)
  })
})
