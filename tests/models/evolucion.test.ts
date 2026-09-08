import { describe, it, expect } from 'vitest'
import {
  fromResultGetEvolucionMonedaV1,
  type Resultset,
  type ResultGetEvolucionMonedaV1,
} from '../../src/models/evolucion'

const resultset: Resultset = { count: 2, offset: 0, limit: 10 }

const cotizacion = {
  fecha: '2024-08-01',
  detalle: [
    {
      codigoMoneda: 'USD',
      descripcion: 'DOLAR ESTADOUNIDENSE',
      tipoPase: 123.5,
      tipoCotizacion: 124.1,
    },
  ],
}

describe('fromResultGetEvolucionMonedaV1', () => {
  it('parses chunks with their nested cotizaciones', () => {
    const payload = {
      metadata: { resultset },
      results: [cotizacion],
    }
    const result = fromResultGetEvolucionMonedaV1(payload)
    expect(result).toEqual<ResultGetEvolucionMonedaV1>({
      resultset,
      cotizaciones: [cotizacion],
    })
    expect(result.resultset.count).toBe(2)
    expect(result.cotizaciones[0].detalle[0].codigoMoneda).toBe('USD')
  })

  it('defaults results to an empty list when missing', () => {
    const result = fromResultGetEvolucionMonedaV1({
      metadata: { resultset },
    })
    expect(result).toEqual<ResultGetEvolucionMonedaV1>({
      resultset,
      cotizaciones: [],
    })
  })
})
