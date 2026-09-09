import { describe, it, expect, vi, afterEach } from 'vitest'
import { Monetarias } from '../../src/resources/monetarias'
import { Transport } from '../../src/transport'
import type { ResultGetMonetariasV1 } from '../../src/models/monetarias'
import type { ResultGetEvolucionVariableV1 } from '../../src/models/monetarias'
import type { ResultGetMetodologiasV1 } from '../../src/models/monetarias'
import type { ResultGetMetodologiaV1 } from '../../src/models/monetarias'

function jsonResponse(body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    statusText: 'OK',
    headers: { 'content-type': 'application/json' },
  })
}

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

const resultset = { count: 1, offset: 0, limit: 1 }

const variable = {
  idVariable: 1,
  descripcion: 'BASE MONETARIA',
  categoria: 'B',
  tipoSerie: 'STOCK',
  periodicidad: 'MENSUAL',
  unidadExpresion: 'MM DE $',
  moneda: 'PESOS',
  primerFechaInformada: '2024-01-01',
  ultFechaInformada: '2024-07-01',
  ultValorInformado: 1000000.25,
}

const monetariasPayload = {
  metadata: { resultset },
  results: [variable],
}

const evolucionPayload = {
  metadata: { resultset },
  results: [
    { idVariable: 1, detalle: [{ fecha: '2024-07-01', valor: 1000.5 }] },
  ],
}

const metodologiasPayload = {
  metadata: { resultset },
  results: [{ id: 1, detalle: 'M1 - METODOLOGIA DE LA VARIABLE' }],
}

const metodologiaPayload = {
  results: [
    { id: 1, detalle: 'M1 - METODOLOGIA DE LA VARIABLE' },
    { id: 2, detalle: 'X' },
  ],
}

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
      request.mockResolvedValue(jsonResponse(monetariasPayload))
      const result = await monetarias.getMonetarias()
      expect(request).toHaveBeenCalledWith(
        'GET',
        '/estadisticas/v4.0/monetarias',
        { params: undefined },
      )
      expect(result).toEqual<ResultGetMonetariasV1>({
        resultset,
        variables: [variable],
      })
      expect(result.resultset.count).toBe(1)
      expect(result.variables[0].idVariable).toBe(1)
      expect(result.variables[0].descripcion).toBe('BASE MONETARIA')
    })

    it('forwards the requested version', async () => {
      const { monetarias, request } = makeMonetarias()
      request.mockResolvedValue(jsonResponse(monetariasPayload))
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
      request.mockResolvedValue(jsonResponse(evolucionPayload))
      const result = await monetarias.getEvolucionVariable(1, {
        desde: new Date('2024-01-01T00:00:00Z'),
        hasta: '2024-06-01',
        offset: 10,
        limit: 100,
      })
      expect(request).toHaveBeenCalledWith(
        'GET',
        '/estadisticas/v4.0/monetarias/1',
        {
          params: {
            desde: '2024-01-01',
            hasta: '2024-06-01',
            offset: 10,
            limit: 100,
          },
        },
      )
      expect(result).toEqual<ResultGetEvolucionVariableV1>({
        resultset,
        series: [
          { idVariable: 1, detalle: [{ fecha: '2024-07-01', valor: 1000.5 }] },
        ],
      })
      expect(result.resultset.count).toBe(1)
      expect(result.series[0].detalle[0].valor).toBe(1000.5)
    })

    it('omits optional params when not provided', async () => {
      const { monetarias, request } = makeMonetarias()
      request.mockResolvedValue(jsonResponse(evolucionPayload))
      const result = await monetarias.getEvolucionVariable(2)
      expect(request).toHaveBeenCalledWith(
        'GET',
        '/estadisticas/v4.0/monetarias/2',
        { params: {} },
      )
      expect(result).toEqual<ResultGetEvolucionVariableV1>({
        resultset,
        series: [
          { idVariable: 1, detalle: [{ fecha: '2024-07-01', valor: 1000.5 }] },
        ],
      })
    })

    it('forwards the requested version', async () => {
      const { monetarias, request } = makeMonetarias()
      request.mockResolvedValue(jsonResponse(evolucionPayload))
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
      request.mockResolvedValue(jsonResponse(metodologiasPayload))
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
        resultset,
        metodologias: [{ id: 1, detalle: 'M1 - METODOLOGIA DE LA VARIABLE' }],
      })
      expect(result.metodologias[0].id).toBe(1)
    })

    it('omits offset/limit params when not provided', async () => {
      const { monetarias, request } = makeMonetarias()
      request.mockResolvedValue(jsonResponse(metodologiasPayload))
      await monetarias.getMetodologias()
      expect(request).toHaveBeenCalledWith(
        'GET',
        '/estadisticas/v4.0/metodologia',
        { params: {} },
      )
    })

    it('forwards the requested version', async () => {
      const { monetarias, request } = makeMonetarias()
      request.mockResolvedValue(jsonResponse(metodologiasPayload))
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
      request.mockResolvedValue(jsonResponse(metodologiaPayload))
      const result = await monetarias.getMetodologia(1)
      expect(request).toHaveBeenCalledWith(
        'GET',
        '/estadisticas/v4.0/metodologia/1',
        { params: undefined },
      )
      expect(result).toEqual<ResultGetMetodologiaV1>({
        metodologia: { id: 1, detalle: 'M1 - METODOLOGIA DE LA VARIABLE' },
      })
      expect(result.metodologia.id).toBe(1)
      expect(result.metodologia.detalle).toBe('M1 - METODOLOGIA DE LA VARIABLE')
    })

    it('forwards the requested version', async () => {
      const { monetarias, request } = makeMonetarias()
      request.mockResolvedValue(jsonResponse(metodologiaPayload))
      await monetarias.getMetodologia(1, { version: '4.0' })
      expect(request).toHaveBeenCalledWith(
        'GET',
        '/estadisticas/v4.0/metodologia/1',
        { params: undefined },
      )
    })
  })
})
