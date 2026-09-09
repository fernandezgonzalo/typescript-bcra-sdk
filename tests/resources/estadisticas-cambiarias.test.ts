import { describe, it, expect, vi, afterEach } from 'vitest'
import { EstadisticasCambiarias } from '../../src/resources/estadisticas-cambiarias'
import { Transport } from '../../src/transport'
import { jsonResponse, loadFixture } from '../setup'
import type { Divisa } from '../../src/models/divisas'
import type { ResultGetDivisasV1 } from '../../src/models/divisas'
import type { ResultGetCotizacionesV1 } from '../../src/models/cotizaciones'
import type { Resultset } from '../../src/models/evolucion'
import type { ResultGetEvolucionMonedaV1 } from '../../src/models/evolucion'

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

const divisasResult = (
  loadFixture('estadisticasCambiarias.getDivisas').body as {
    results: Divisa[]
  }
).results

const cotizacionesResult = (
  loadFixture('estadisticasCambiarias.getCotizaciones').body as {
    results: ResultGetCotizacionesV1
  }
).results

interface EvolucionMonedaBody {
  readonly status: number
  readonly metadata: { resultset: Resultset }
  readonly results: ResultGetCotizacionesV1[]
}

const evolucionBody = loadFixture('estadisticasCambiarias.getEvolucionMoneda')
  .body as EvolucionMonedaBody

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
      request.mockResolvedValue(
        jsonResponse(loadFixture('estadisticasCambiarias.getDivisas').body),
      )
      const result = await estadisticasCambiarias.getDivisas()
      expect(request).toHaveBeenCalledWith(
        'GET',
        '/estadisticascambiarias/v1.0/Maestros/Divisas',
        { params: undefined },
      )
      expect(result).toEqual<ResultGetDivisasV1>({ divisas: divisasResult })
      expect(result.divisas[0].denominacion).toBe('PESO')
    })

    it('forwards the requested version', async () => {
      const { estadisticasCambiarias, request } = makeEstadisticasCambiarias()
      request.mockResolvedValue(
        jsonResponse(loadFixture('estadisticasCambiarias.getDivisas').body),
      )
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
      request.mockResolvedValue(
        jsonResponse(
          loadFixture('estadisticasCambiarias.getCotizaciones').body,
        ),
      )
      const result = await estadisticasCambiarias.getCotizaciones()
      expect(request).toHaveBeenCalledWith(
        'GET',
        '/estadisticascambiarias/v1.0/Cotizaciones',
        { params: undefined },
      )
      expect(result).toEqual<ResultGetCotizacionesV1>(cotizacionesResult)
    })

    it('coerces a Date fecha into ISO and sends it as query param', async () => {
      const { estadisticasCambiarias, request } = makeEstadisticasCambiarias()
      request.mockResolvedValue(
        jsonResponse(
          loadFixture('estadisticasCambiarias.getCotizaciones').body,
        ),
      )
      await estadisticasCambiarias.getCotizaciones(
        new Date('2024-06-12T00:00:00Z'),
      )
      expect(request).toHaveBeenCalledWith(
        'GET',
        '/estadisticascambiarias/v1.0/Cotizaciones',
        { params: { fecha: '2024-06-12' } },
      )
    })

    it('passes through an ISO string fecha', async () => {
      const { estadisticasCambiarias, request } = makeEstadisticasCambiarias()
      request.mockResolvedValue(
        jsonResponse(
          loadFixture('estadisticasCambiarias.getCotizaciones').body,
        ),
      )
      await estadisticasCambiarias.getCotizaciones('2024-06-12')
      expect(request).toHaveBeenCalledWith(
        'GET',
        '/estadisticascambiarias/v1.0/Cotizaciones',
        { params: { fecha: '2024-06-12' } },
      )
    })

    it('forwards the requested version', async () => {
      const { estadisticasCambiarias, request } = makeEstadisticasCambiarias()
      request.mockResolvedValue(
        jsonResponse(
          loadFixture('estadisticasCambiarias.getCotizaciones').body,
        ),
      )
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
      request.mockResolvedValue(
        jsonResponse(
          loadFixture('estadisticasCambiarias.getEvolucionMoneda').body,
        ),
      )
      const result = await estadisticasCambiarias.getEvolucionMoneda('EUR', {
        fechadesde: '2024-06-10',
        fechahasta: '2024-06-12',
        limit: 10,
        offset: 10,
      })
      expect(request).toHaveBeenCalledWith(
        'GET',
        '/estadisticascambiarias/v1.0/Cotizaciones/EUR',
        {
          params: {
            fechadesde: '2024-06-10',
            fechahasta: '2024-06-12',
            limit: 10,
            offset: 10,
          },
        },
      )
      expect(result).toEqual<ResultGetEvolucionMonedaV1>({
        resultset: evolucionBody.metadata.resultset,
        cotizaciones: evolucionBody.results,
      })
      expect(result.resultset.count).toBe(3)
      expect(result.cotizaciones[0].detalle[0].codigoMoneda).toBe('EUR')
    })

    it('omits optional params when not provided', async () => {
      const { estadisticasCambiarias, request } = makeEstadisticasCambiarias()
      request.mockResolvedValue(
        jsonResponse(
          loadFixture('estadisticasCambiarias.getEvolucionMoneda').body,
        ),
      )
      const result = await estadisticasCambiarias.getEvolucionMoneda('EUR')
      expect(request).toHaveBeenCalledWith(
        'GET',
        '/estadisticascambiarias/v1.0/Cotizaciones/EUR',
        { params: {} },
      )
      expect(result).toEqual<ResultGetEvolucionMonedaV1>({
        resultset: evolucionBody.metadata.resultset,
        cotizaciones: evolucionBody.results,
      })
    })

    it('forwards the requested version', async () => {
      const { estadisticasCambiarias, request } = makeEstadisticasCambiarias()
      request.mockResolvedValue(
        jsonResponse(
          loadFixture('estadisticasCambiarias.getEvolucionMoneda').body,
        ),
      )
      await estadisticasCambiarias.getEvolucionMoneda('EUR', {
        version: '1.0',
      })
      expect(request).toHaveBeenCalledWith(
        'GET',
        '/estadisticascambiarias/v1.0/Cotizaciones/EUR',
        { params: {} },
      )
    })
  })
})
