import { describe, it, expect, vi, afterEach } from 'vitest'
import { Deudores } from '../../src/resources/deudores'
import { Transport } from '../../src/transport'
import { BCRAError } from '../../src/errors'
import type {
  Entidad,
  ResultGetDeudasHistoricasV1,
  ResultGetDeudasV1,
} from '../../src/models/deudores'
import type {
  Causal,
  ResultGetChequesRechazadosV1,
} from '../../src/models/cheques'

function jsonResponse(body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    statusText: 'OK',
    headers: { 'content-type': 'application/json' },
  })
}

function makeDeudores(): {
  deudores: Deudores
  request: ReturnType<typeof vi.fn>
} {
  const request = vi.fn()
  const transport = { request } as unknown as Transport
  return { deudores: new Deudores(transport), request }
}

const entidad: Entidad = {
  entidad: 'Banco Nación',
  situacion: '2',
  fechaSit1: '2024-06-30',
  monto: 15000.5,
  diasAtrasoPago: 45,
  refinanciaciones: true,
  recategorizacionOblig: false,
  situacionJuridica: true,
  irrecDisposicionTecnica: false,
  enRevision: true,
  procesoJud: false,
}

const periodo = { periodo: '2024-06', entidades: [entidad] }
const deudasPayload = {
  identificacion: 20111111112,
  denominacion: 'EMPRESA SA',
  periodos: [periodo],
}

const entidadHistorica = {
  entidad: 'Banco Nación',
  situacion: 2,
  monto: 15000.5,
  enRevision: true,
  procesoJud: false,
}

const deudasHistoricasPayload = {
  identificacion: '20111111112',
  denominacion: 'EMPRESA SA',
  periodos: [{ periodo: '2024-06', entidades: [entidadHistorica] }],
}

const causal: Causal = {
  causal: 'Falta de fondos',
  entidades: [
    {
      entidad: 11,
      detalle: [
        {
          nroCheque: 123,
          fechaRechazo: '2024-05-01',
          monto: 5000,
          fechaPago: null,
          fechaPagoMulta: '2024-06-01',
          estadoMulta: 'PAGO',
          ctaPersonal: true,
          denomJuridica: null,
          enRevision: false,
          procesoJud: true,
        },
      ],
    },
  ],
}

const chequesRechazadosPayload = {
  identificacion: 20111111112,
  causales: [causal],
}

describe('Deudores', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('versions', () => {
    it('registers the three endpoints with version 1.0', () => {
      const { deudores } = makeDeudores()
      expect(deudores.versions('getDeudas')).toEqual({
        '1.0': { deprecated: false },
      })
      expect(deudores.versions('getDeudasHistoricas')).toEqual({
        '1.0': { deprecated: false },
      })
      expect(deudores.versions('getChequesRechazados')).toEqual({
        '1.0': { deprecated: false },
      })
    })
  })

  describe('getDeudas', () => {
    it('normalizes the CUIT and parses the results payload', async () => {
      const { deudores, request } = makeDeudores()
      request.mockResolvedValue(jsonResponse({ results: deudasPayload }))
      const result = await deudores.getDeudas('20-11111111-2')
      expect(request).toHaveBeenCalledWith(
        'GET',
        '/centraldedeudores/v1.0/Deudas/20111111112',
        { params: undefined },
      )
      expect(result).toEqual<ResultGetDeudasV1>(deudasPayload)
      expect(result.identificacion).toBe(20111111112)
      expect(result.periodos[0].entidades[0].situacion).toBe('2')
    })

    it('throws without calling the transport for an invalid CUIT', () => {
      const { deudores, request } = makeDeudores()
      expect(() => deudores.getDeudas('123')).toThrow(BCRAError)
      expect(request).not.toHaveBeenCalled()
    })

    it('forwards the requested version', async () => {
      const { deudores, request } = makeDeudores()
      request.mockResolvedValue(jsonResponse({ results: deudasPayload }))
      await deudores.getDeudas('20111111112', { version: '1.0' })
      expect(request).toHaveBeenCalledWith(
        'GET',
        '/centraldedeudores/v1.0/Deudas/20111111112',
        { params: undefined },
      )
    })
  })

  describe('getDeudasHistoricas', () => {
    it('passes the identification as-is and parses the results payload', async () => {
      const { deudores, request } = makeDeudores()
      request.mockResolvedValue(
        jsonResponse({ results: deudasHistoricasPayload }),
      )
      const result = await deudores.getDeudasHistoricas('27-20111111-2')
      expect(request).toHaveBeenCalledWith(
        'GET',
        '/CentralDeDeudores/v1.0/Deudas/Historicas/27-20111111-2',
        { params: undefined },
      )
      expect(result).toEqual<ResultGetDeudasHistoricasV1>(
        deudasHistoricasPayload,
      )
      expect(result.identificacion).toBe('20111111112')
    })

    it('forwards the requested version', async () => {
      const { deudores, request } = makeDeudores()
      request.mockResolvedValue(
        jsonResponse({ results: deudasHistoricasPayload }),
      )
      await deudores.getDeudasHistoricas('20111111112', { version: '1.0' })
      expect(request).toHaveBeenCalledWith(
        'GET',
        '/CentralDeDeudores/v1.0/Deudas/Historicas/20111111112',
        { params: undefined },
      )
    })
  })

  describe('getChequesRechazados', () => {
    it('passes the identification as-is and parses the results payload', async () => {
      const { deudores, request } = makeDeudores()
      request.mockResolvedValue(
        jsonResponse({ results: chequesRechazadosPayload }),
      )
      const result = await deudores.getChequesRechazados('20-11111111-2')
      expect(request).toHaveBeenCalledWith(
        'GET',
        '/centraldedeudores/v1.0/Deudas/ChequesRechazados/20-11111111-2',
        { params: undefined },
      )
      expect(result).toEqual<ResultGetChequesRechazadosV1>(
        chequesRechazadosPayload,
      )
      expect(result.causales[0].entidades[0].detalle[0].nroCheque).toBe(123)
    })

    it('forwards the requested version', async () => {
      const { deudores, request } = makeDeudores()
      request.mockResolvedValue(
        jsonResponse({ results: chequesRechazadosPayload }),
      )
      await deudores.getChequesRechazados('20111111112', { version: '1.0' })
      expect(request).toHaveBeenCalledWith(
        'GET',
        '/centraldedeudores/v1.0/Deudas/ChequesRechazados/20111111112',
        { params: undefined },
      )
    })
  })
})
