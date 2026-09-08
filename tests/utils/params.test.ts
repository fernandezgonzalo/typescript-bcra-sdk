import { describe, it, expect } from 'vitest'
import { buildParams } from '../../src/utils/params'

describe('buildParams', () => {
  it('returns an empty URLSearchParams when params is undefined', () => {
    const search = buildParams()
    expect(search).toBeInstanceOf(URLSearchParams)
    expect(search.size).toBe(0)
  })

  it('returns an empty URLSearchParams for an empty object', () => {
    expect(buildParams({}).toString()).toBe('')
  })

  it('filters undefined values', () => {
    expect(buildParams({ a: undefined }).size).toBe(0)
  })

  it('filters null values', () => {
    expect(buildParams({ a: null }).size).toBe(0)
  })

  it('filters empty string values', () => {
    expect(buildParams({ a: '' }).size).toBe(0)
  })

  it('filters all falsy-to-drop values at once', () => {
    const search = buildParams({ a: undefined, b: null, c: '' })
    expect(search.toString()).toBe('')
  })

  it('keeps the number zero', () => {
    expect(buildParams({ limit: 0 }).get('limit')).toBe('0')
  })

  it('keeps and stringifies booleans', () => {
    expect(buildParams({ flag: false }).get('flag')).toBe('false')
  })

  it('stringifies number values', () => {
    expect(buildParams({ limit: 10 }).get('limit')).toBe('10')
  })

  it('serializes multiple params preserving insertion order', () => {
    expect(
      buildParams({
        fechadesde: '2024-01-01',
        limit: 10,
        offset: 0,
      }).toString(),
    ).toBe('fechadesde=2024-01-01&limit=10&offset=0')
  })

  it('percent-encodes special characters', () => {
    expect(buildParams({ q: 'a b&c=d' }).toString()).toBe('q=a+b%26c%3Dd')
  })
})
