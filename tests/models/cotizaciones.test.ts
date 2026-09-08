import { describe, it, expect } from 'vitest'
import {
  fromResultGetCotizacionesV1,
  type Cotizacion,
  type ResultGetCotizacionesV1,
} from '../../src/models/cotizaciones'

const cotizacion: Cotizacion = {
  codigoMoneda: 'USD',
  descripcion: 'DOLAR ESTADOUNIDENSE',
  tipoPase: 123.5,
  tipoCotizacion: 124.1,
}

describe('fromResultGetCotizacionesV1', () => {
  it('parses the fecha with its cotizaciones', () => {
    const result = fromResultGetCotizacionesV1({
      fecha: '2024-08-01',
      detalle: [cotizacion],
    })
    expect(result).toEqual<ResultGetCotizacionesV1>({
      fecha: '2024-08-01',
      detalle: [cotizacion],
    })
    expect(result.detalle[0].codigoMoneda).toBe('USD')
  })

  it('parses null fecha for the latest cotizacion', () => {
    const result = fromResultGetCotizacionesV1({
      fecha: null,
      detalle: [cotizacion],
    })
    expect(result.fecha).toBeNull()
  })

  it('defaults detalle to an empty list when missing', () => {
    const result = fromResultGetCotizacionesV1({ fecha: '2024-08-01' })
    expect(result).toEqual<ResultGetCotizacionesV1>({
      fecha: '2024-08-01',
      detalle: [],
    })
  })
})
