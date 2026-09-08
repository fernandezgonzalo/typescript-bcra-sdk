import { describe, it, expect } from 'vitest'
import {
  fromResultGetDivisasV1,
  type Divisa,
  type ResultGetDivisasV1,
} from '../../src/models/divisas'

const divisa: Divisa = {
  codigo: 'USD',
  denominacion: 'DOLAR ESTADOUNIDENSE',
}

describe('fromResultGetDivisasV1', () => {
  it('parses a list of divisas', () => {
    const result = fromResultGetDivisasV1([
      divisa,
      { codigo: 'EUR', denominacion: 'EURO' },
    ])
    expect(result).toEqual<ResultGetDivisasV1>({
      divisas: [divisa, { codigo: 'EUR', denominacion: 'EURO' }],
    })
    expect(result.divisas[0].codigo).toBe('USD')
  })

  it('parses an empty list', () => {
    const result = fromResultGetDivisasV1([])
    expect(result).toEqual<ResultGetDivisasV1>({ divisas: [] })
  })
})
