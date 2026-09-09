import { describe, it, expect } from 'vitest'
import {
  BCRAClient,
  VERSION,
  BCRAError,
  BCRAHTTPError,
  BCRAConnectionError,
  BCRATimeoutError,
  BCRAEndpointVersionError,
  RetryPolicy,
  parseRetryAfter,
  Cheques,
  Deudores,
  EstadisticasCambiarias,
  Monetarias,
  RegimenDeTransparencia,
  Resource,
  Transport,
  fromResultGetCotizacionesV1,
} from '../src/index'

describe('bcra-sdk', () => {
  it('exports VERSION', () => {
    expect(VERSION).toBe('0.1.0')
  })

  it('exports BCRAClient', () => {
    const client = new BCRAClient()
    expect(client).toBeInstanceOf(BCRAClient)
    client.close()
  })

  it('exports the error hierarchy', () => {
    expect(new BCRAError('x')).toBeInstanceOf(Error)
    expect(BCRAHTTPError).toBeInstanceOf(Function)
    expect(BCRAConnectionError).toBeInstanceOf(Function)
    expect(BCRATimeoutError).toBeInstanceOf(Function)
    expect(BCRAEndpointVersionError).toBeInstanceOf(Function)
  })

  it('exports RetryPolicy helpers', () => {
    expect(new RetryPolicy().maxRetries).toBe(2)
    expect(parseRetryAfter(new Headers({ 'Retry-After': '5' }))).toBe(5)
  })

  it('exports the resource classes', () => {
    expect(Cheques).toBeInstanceOf(Function)
    expect(Deudores).toBeInstanceOf(Function)
    expect(EstadisticasCambiarias).toBeInstanceOf(Function)
    expect(Monetarias).toBeInstanceOf(Function)
    expect(RegimenDeTransparencia).toBeInstanceOf(Function)
    expect(Resource).toBeInstanceOf(Function)
    expect(Transport).toBeInstanceOf(Function)
  })

  it('exports a model factory', () => {
    const cotizaciones = fromResultGetCotizacionesV1({
      fecha: '2024-06-12',
      detalle: [
        {
          codigoMoneda: 'ARS',
          descripcion: 'Peso argentino',
          tipoPase: 1,
          tipoCotizacion: 1,
        },
      ],
    })
    expect(cotizaciones.fecha).toBe('2024-06-12')
    expect(cotizaciones.detalle[0].codigoMoneda).toBe('ARS')
  })
})
