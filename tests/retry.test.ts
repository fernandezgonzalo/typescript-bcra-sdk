import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { RetryPolicy, parseRetryAfter } from '../src/retry'

describe('RetryPolicy', () => {
  it('uses default values when no options are given', () => {
    const policy = new RetryPolicy()
    expect(policy.maxRetries).toBe(2)
    expect(policy.backoff).toBe(0.5)
    expect(policy.retryOnTimeout).toBe(true)
    expect(policy.statuses).toEqual([429, 500, 502, 503, 504])
  })

  it('overrides each field when options are provided', () => {
    const policy = new RetryPolicy({
      maxRetries: 5,
      backoff: 1,
      retryOnTimeout: false,
      statuses: [503],
    })
    expect(policy.maxRetries).toBe(5)
    expect(policy.backoff).toBe(1)
    expect(policy.retryOnTimeout).toBe(false)
    expect(policy.statuses).toEqual([503])
  })

  it('computes exponential backoff with delay(attempt)', () => {
    const policy = new RetryPolicy({ backoff: 0.5 })
    expect(policy.delay(0)).toBe(0.5)
    expect(policy.delay(1)).toBe(1)
    expect(policy.delay(2)).toBe(2)
    expect(policy.delay(3)).toBe(4)
  })
})

describe('parseRetryAfter', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  describe('given a Headers instance', () => {
    it('parses delta seconds', () => {
      const headers = new Headers({ 'retry-after': '5' })
      expect(parseRetryAfter(headers)).toBe(5)
    })

    it('parses fractional seconds', () => {
      const headers = new Headers({ 'retry-after': '2.5' })
      expect(parseRetryAfter(headers)).toBe(2.5)
    })

    it('returns null when the header is absent', () => {
      expect(parseRetryAfter(new Headers())).toBeNull()
    })

    it('returns null for an empty value', () => {
      const headers = new Headers({ 'retry-after': '   ' })
      expect(parseRetryAfter(headers)).toBeNull()
    })

    it('clamps a negative value to 0', () => {
      const headers = new Headers({ 'retry-after': '-10' })
      expect(parseRetryAfter(headers)).toBe(0)
    })

    it('parses an HTTP date in the future', () => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date('2024-01-01T00:00:00Z'))
      const headers = new Headers({
        'retry-after': 'Wed, 01 Jan 2025 00:00:00 GMT',
      })
      expect(parseRetryAfter(headers)).toBe(366 * 24 * 60 * 60)
    })

    it('clamps a past HTTP date to 0', () => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date('2024-01-01T00:00:00Z'))
      const headers = new Headers({
        'retry-after': 'Mon, 01 Jan 2024 00:00:00 GMT',
      })
      expect(parseRetryAfter(headers)).toBe(0)
    })

    it('returns null for an invalid value', () => {
      const headers = new Headers({ 'retry-after': 'not-a-date' })
      expect(parseRetryAfter(headers)).toBeNull()
    })
  })

  describe('given a Record', () => {
    it('parses the header by lowercase key', () => {
      expect(parseRetryAfter({ 'retry-after': '3' })).toBe(3)
    })

    it('parses the header by capitalized key', () => {
      expect(parseRetryAfter({ 'Retry-After': '4' })).toBe(4)
    })

    it('returns null when neither key is present', () => {
      expect(parseRetryAfter({})).toBeNull()
    })
  })
})

describe('parseRetryAfter date parsing edge', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-01T00:00:00Z'))
  })

  it('returns fractional seconds for a future HTTP date', () => {
    const headers = new Headers({
      'retry-after': 'Mon, 01 Jan 2024 00:00:30 GMT',
    })
    expect(parseRetryAfter(headers)).toBe(30)
  })
})
