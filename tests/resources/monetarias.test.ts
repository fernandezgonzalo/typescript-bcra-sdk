import { describe, it, expect, vi, afterEach } from 'vitest'
import { Monetarias } from '../../src/resources/monetarias'
import { Transport } from '../../src/transport'
import { jsonResponse, loadFixture } from '../setup'
import type { Resultset } from '../../src/models/evolucion'
import type {
  Metodologia,
  ResultGetMetodologiasV1,
  ResultGetMetodologiaV1,
  ResultGetEvolucionVariableV1,
  ResultGetMonetariasV1,
  SerieMonetaria,
  VariableMonetaria,
} from '../../src/models/monetarias'

function makeMonetarias(): {
  monetarias: Monetarias
  request: ReturnType<typeof vi.fn>
} {
  const request = vi.fn()
  const transport = { request } as unknown as Transport
  return {
    monetarias: new Monetarias(transport),
    request,
  }
}

interface WrapBody<T> {
  readonly status: number
  readonly metadata: { resultset: Resultset }
  readonly results: T[]
}

const monetariasBody = loadFixture('monetarias.getMonetarias')
  .body as WrapBody<VariableMonetaria>
const evolucionBody = loadFixture('monetarias.getEvolucionVariable')
  .body as WrapBody<SerieMonetaria>
const metodologiasBody = loadFixture('monetarias.getMetodologias')
  .body as WrapBody<Metodologia>
const metodologiaResults = (
  loadFixture('monetarias.getMetodologia').body as {
    status: number
    results: Metodologia[]
  }
).results

describe('Monetarias', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('versions', () => {
    it('registers the four endpoints with version 4.0', () => {
      const { monetarias } = makeMonetarias()
      expect(monetarias.versions('getMonetarias')).toEqual({
        '4.0': { deprecated: false },
      })
      expect(monetarias.versions('getEvolucionVariable')).toEqual({
        '4.0': { deprecated: false },
      })
      expect(monetarias.versions('getMetodologias')).toEqual({
        '4.0': { deprecated: false },
      })
      expect(monetarias.versions('getMetodologia')).toEqual({
        '4.0': { deprecated: false },
      })
    })
  })

  describe('getMonetarias', () => {
    it('requests the monetarias endpoint and parses the full body', async () => {
      const { monetarias, request } = makeMonetarias()
      request.mockResolvedValue(jsonResponse(monetariasBody))
      const result = await monetarias.getMonetarias()
      expect(request).toHaveBeenCalledWith(
        'GET',
        '/estadisticas/v4.0/monetarias',
        { params: undefined },
      )
      expect(result).toEqual<ResultGetMonetariasV1>({
        resultset: monetariasBody.metadata.resultset,
        variables: monetariasBody.results,
      })
      expect(result.resultset.count).toBe(1610)
      expect(result.variables[0].idVariable).toBe(1)
      expect(result.variables[0].descripcion).toBe('Reservas internacionales')
    })

    it('forwards the requested version', async () => {
      const { monetarias, request } = makeMonetarias()
      request.mockResolvedValue(jsonResponse(monetariasBody))
      await monetarias.getMonetarias({ version: '4.0' })
      expect(request).toHaveBeenCalledWith(
        'GET',
        '/estadisticas/v4.0/monetarias',
        { params: undefined },
      )
    })
  })

  describe('getEvolucionVariable', () => {
    it('interpolates the idVariable path var, sends all params and parses the full body', async () => {
      const { monetarias, request } = makeMonetarias()
      request.mockResolvedValue(jsonResponse(evolucionBody))
      const result = await monetarias.getEvolucionVariable(1, {
        desde: '2025-05-20',
        hasta: '2025-05-26',
        offset: 10,
        limit: 100,
      })
      expect(request).toHaveBeenCalledWith(
        'GET',
        '/estadisticas/v4.0/monetarias/1',
        {
          params: {
            desde: '2025-05-20',
            hasta: '2025-05-26',
            offset: 10,
            limit: 100,
          },
        },
      )
      expect(result).toEqual<ResultGetEvolucionVariableV1>({
        resultset: evolucionBody.metadata.resultset,
        series: evolucionBody.results,
      })
      expect(result.resultset.count).toBe(5)
      expect(result.series[0].detalle[0].valor).toBe(38384)
    })

    it('omits optional params when not provided', async () => {
      const { monetarias, request } = makeMonetarias()
      request.mockResolvedValue(jsonResponse(evolucionBody))
      const result = await monetarias.getEvolucionVariable(2)
      expect(request).toHaveBeenCalledWith(
        'GET',
        '/estadisticas/v4.0/monetarias/2',
        { params: {} },
      )
      expect(result).toEqual<ResultGetEvolucionVariableV1>({
        resultset: evolucionBody.metadata.resultset,
        series: evolucionBody.results,
      })
    })

    it('forwards the requested version', async () => {
      const { monetarias, request } = makeMonetarias()
      request.mockResolvedValue(jsonResponse(evolucionBody))
      await monetarias.getEvolucionVariable(1, { version: '4.0' })
      expect(request).toHaveBeenCalledWith(
        'GET',
        '/estadisticas/v4.0/monetarias/1',
        { params: {} },
      )
    })
  })

  describe('getMetodologias', () => {
    it('sends offset/limit params and parses the full body', async () => {
      const { monetarias, request } = makeMonetarias()
      request.mockResolvedValue(jsonResponse(metodologiasBody))
      const result = await monetarias.getMetodologias({
        offset: 10,
        limit: 100,
      })
      expect(request).toHaveBeenCalledWith(
        'GET',
        '/estadisticas/v4.0/metodologia',
        { params: { offset: 10, limit: 100 } },
      )
      expect(result).toEqual<ResultGetMetodologiasV1>({
        resultset: metodologiasBody.metadata.resultset,
        metodologias: metodologiasBody.results,
      })
      expect(result.metodologias[0].id).toBe(1)
    })

    it('omits offset/limit params when not provided', async () => {
      const { monetarias, request } = makeMonetarias()
      request.mockResolvedValue(jsonResponse(metodologiasBody))
      await monetarias.getMetodologias()
      expect(request).toHaveBeenCalledWith(
        'GET',
        '/estadisticas/v4.0/metodologia',
        { params: {} },
      )
    })

    it('forwards the requested version', async () => {
      const { monetarias, request } = makeMonetarias()
      request.mockResolvedValue(jsonResponse(metodologiasBody))
      await monetarias.getMetodologias({ version: '4.0' })
      expect(request).toHaveBeenCalledWith(
        'GET',
        '/estadisticas/v4.0/metodologia',
        { params: {} },
      )
    })
  })

  describe('getMetodologia', () => {
    it('interpolates the idVariable path var and parses the first result', async () => {
      const { monetarias, request } = makeMonetarias()
      request.mockResolvedValue(
        jsonResponse({ status: 200, results: metodologiaResults }),
      )
      const result = await monetarias.getMetodologia(1)
      expect(request).toHaveBeenCalledWith(
        'GET',
        '/estadisticas/v4.0/metodologia/1',
        { params: undefined },
      )
      expect(result).toEqual<ResultGetMetodologiaV1>({
        metodologia: metodologiaResults[0],
      })
      expect(result.metodologia.id).toBe(1)
      expect(result.metodologia.detalle).toContain('Reservas Internacionales')
    })

    it('forwards the requested version', async () => {
      const { monetarias, request } = makeMonetarias()
      request.mockResolvedValue(
        jsonResponse({ status: 200, results: metodologiaResults }),
      )
      await monetarias.getMetodologia(1, { version: '4.0' })
      expect(request).toHaveBeenCalledWith(
        'GET',
        '/estadisticas/v4.0/metodologia/1',
        { params: undefined },
      )
    })
  })
})
