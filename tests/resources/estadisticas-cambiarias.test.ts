import { describe, it, expect, vi, afterEach } from 'vitest'
import { EstadisticasCambiarias } from '../../src/resources/estadisticas-cambiarias'
import { Transport } from '../../src/transport'
import type { ResultGetDivisasV1 } from '../../src/models/divisas'
import type { ResultGetCotizacionesV1 } from '../../src/models/cotizaciones'
import type { ResultGetEvolucionMonedaV1 } from '../../src/models/evolucion'

function jsonResponse(body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    statusText: 'OK',
    headers: { 'content-type': 'application/json' },
  })
}

function makeEstadisticasCambiarias(): {
  estadisticasCambiarias: EstadisticasCambiarias
  request: ReturnType<typeof vi.fn>
} {
  const request = vi.fn()
  const transport = { request } as unknown as Transport
  return {
    estadisticasCambiarias: new EstadisticasCambiarias(transport),
    request,
  }
}

const divisasPayload = [{ codigo: 'USD', denominacion: 'Dólar estadounidense' }]

const cotizacionesPayload = [
  {
    codigoMoneda: 'USD',
    descripcion: 'Dólar estadounidense',
    tipoPase: 1,
    tipoCotizacion: 10,
  },
]

const cotizacionesResult = {
  fecha: '2024-06-01',
  detalle: cotizacionesPayload,
}

const evolucionPayload = {
  metadata: { resultset: { count: 1, offset: 0, limit: 1000 } },
  results: [
    {
      fecha: '2024-06-01',
      detalle: cotizacionesPayload,
    },
  ],
}

describe('EstadisticasCambiarias', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('versions', () => {
    it('registers the three endpoints with version 1.0', () => {
      const { estadisticasCambiarias } = makeEstadisticasCambiarias()
      expect(estadisticasCambiarias.versions('getDivisas')).toEqual({
        '1.0': { deprecated: false },
      })
      expect(estadisticasCambiarias.versions('getCotizaciones')).toEqual({
        '1.0': { deprecated: false },
      })
      expect(estadisticasCambiarias.versions('getEvolucionMoneda')).toEqual({
        '1.0': { deprecated: false },
      })
    })
  })

  describe('getDivisas', () => {
    it('requests the divisas maestro endpoint and parses the results payload', async () => {
      const { estadisticasCambiarias, request } = makeEstadisticasCambiarias()
      request.mockResolvedValue(jsonResponse({ results: divisasPayload }))
      const result = await estadisticasCambiarias.getDivisas()
      expect(request).toHaveBeenCalledWith(
        'GET',
        '/estadisticascambiarias/v1.0/Maestros/Divisas',
        { params: undefined },
      )
      expect(result).toEqual<ResultGetDivisasV1>({
        divisas: divisasPayload,
      })
      expect(result.divisas[0].denominacion).toBe('Dólar estadounidense')
    })

    it('forwards the requested version', async () => {
      const { estadisticasCambiarias, request } = makeEstadisticasCambiarias()
      request.mockResolvedValue(jsonResponse({ results: divisasPayload }))
      await estadisticasCambiarias.getDivisas({ version: '1.0' })
      expect(request).toHaveBeenCalledWith(
        'GET',
        '/estadisticascambiarias/v1.0/Maestros/Divisas',
        { params: undefined },
      )
    })
  })

  describe('getCotizaciones', () => {
    it('requests the cotizaciones endpoint without fecha param', async () => {
      const { estadisticasCambiarias, request } = makeEstadisticasCambiarias()
      request.mockResolvedValue(jsonResponse({ results: cotizacionesResult }))
      const result = await estadisticasCambiarias.getCotizaciones()
      expect(request).toHaveBeenCalledWith(
        'GET',
        '/estadisticascambiarias/v1.0/Cotizaciones',
        { params: undefined },
      )
      expect(result).toEqual<ResultGetCotizacionesV1>({
        fecha: '2024-06-01',
        detalle: cotizacionesPayload,
      })
    })

    it('coerces a Date fecha into ISO and sends it as query param', async () => {
      const { estadisticasCambiarias, request } = makeEstadisticasCambiarias()
      request.mockResolvedValue(jsonResponse({ results: cotizacionesResult }))
      await estadisticasCambiarias.getCotizaciones(
        new Date('2024-06-01T00:00:00Z'),
      )
      expect(request).toHaveBeenCalledWith(
        'GET',
        '/estadisticascambiarias/v1.0/Cotizaciones',
        { params: { fecha: '2024-06-01' } },
      )
    })

    it('passes through an ISO string fecha', async () => {
      const { estadisticasCambiarias, request } = makeEstadisticasCambiarias()
      request.mockResolvedValue(jsonResponse({ results: cotizacionesResult }))
      await estadisticasCambiarias.getCotizaciones('2024-06-01')
      expect(request).toHaveBeenCalledWith(
        'GET',
        '/estadisticascambiarias/v1.0/Cotizaciones',
        { params: { fecha: '2024-06-01' } },
      )
    })

    it('forwards the requested version', async () => {
      const { estadisticasCambiarias, request } = makeEstadisticasCambiarias()
      request.mockResolvedValue(jsonResponse({ results: cotizacionesResult }))
      await estadisticasCambiarias.getCotizaciones(undefined, {
        version: '1.0',
      })
      expect(request).toHaveBeenCalledWith(
        'GET',
        '/estadisticascambiarias/v1.0/Cotizaciones',
        { params: undefined },
      )
    })
  })

  describe('getEvolucionMoneda', () => {
    it('interpolates the moneda path var, sends all params and parses the full body', async () => {
      const { estadisticasCambiarias, request } = makeEstadisticasCambiarias()
      request.mockResolvedValue(jsonResponse(evolucionPayload))
      const result = await estadisticasCambiarias.getEvolucionMoneda('USD', {
        fechadesde: new Date('2024-01-01T00:00:00Z'),
        fechahasta: '2024-06-01',
        limit: 100,
        offset: 10,
      })
      expect(request).toHaveBeenCalledWith(
        'GET',
        '/estadisticascambiarias/v1.0/Cotizaciones/USD',
        {
          params: {
            fechadesde: '2024-01-01',
            fechahasta: '2024-06-01',
            limit: 100,
            offset: 10,
          },
        },
      )
      expect(result).toEqual<ResultGetEvolucionMonedaV1>({
        resultset: { count: 1, offset: 0, limit: 1000 },
        cotizaciones: [{ fecha: '2024-06-01', detalle: cotizacionesPayload }],
      })
      expect(result.resultset.count).toBe(1)
      expect(result.cotizaciones[0].detalle[0].codigoMoneda).toBe('USD')
    })

    it('omits optional params when not provided', async () => {
      const { estadisticasCambiarias, request } = makeEstadisticasCambiarias()
      request.mockResolvedValue(jsonResponse(evolucionPayload))
      const result = await estadisticasCambiarias.getEvolucionMoneda('EUR')
      expect(request).toHaveBeenCalledWith(
        'GET',
        '/estadisticascambiarias/v1.0/Cotizaciones/EUR',
        { params: {} },
      )
      expect(result).toEqual<ResultGetEvolucionMonedaV1>({
        resultset: { count: 1, offset: 0, limit: 1000 },
        cotizaciones: [{ fecha: '2024-06-01', detalle: cotizacionesPayload }],
      })
    })

    it('forwards the requested version', async () => {
      const { estadisticasCambiarias, request } = makeEstadisticasCambiarias()
      request.mockResolvedValue(jsonResponse(evolucionPayload))
      await estadisticasCambiarias.getEvolucionMoneda('USD', {
        version: '1.0',
      })
      expect(request).toHaveBeenCalledWith(
        'GET',
        '/estadisticascambiarias/v1.0/Cotizaciones/USD',
        { params: {} },
      )
    })
  })
})
