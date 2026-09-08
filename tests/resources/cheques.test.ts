import { describe, it, expect, vi, afterEach } from 'vitest'
import { Cheques } from '../../src/resources/cheques'
import { Transport } from '../../src/transport'
import type { ResultGetEntidadesV1 } from '../../src/models/entidades'
import type {
  DetalleDenuncia,
  ResultGetChequeDenunciadoV1,
} from '../../src/models/denunciados'

function jsonResponse(body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    statusText: 'OK',
    headers: { 'content-type': 'application/json' },
  })
}

function makeCheques(): {
  cheques: Cheques
  request: ReturnType<typeof vi.fn>
} {
  const request = vi.fn()
  const transport = { request } as unknown as Transport
  return { cheques: new Cheques(transport), request }
}

const entidadesPayload = [{ codigoEntidad: 11, denominacion: 'Banco Nación' }]

const detalleDenuncia: DetalleDenuncia = {
  sucursal: 2,
  numeroCuenta: 345,
  causal: 'Falta de fondos',
}

const chequeDenunciadoPayload = {
  numeroCheque: 123,
  denunciado: true,
  fechaProcesamiento: '2024-06-01',
  denominacionEntidad: 'Banco Nación',
  detalles: [detalleDenuncia],
}

describe('Cheques', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('versions', () => {
    it('registers the two endpoints with version 1.0', () => {
      const { cheques } = makeCheques()
      expect(cheques.versions('getEntidades')).toEqual({
        '1.0': { deprecated: false },
      })
      expect(cheques.versions('getChequeDenunciado')).toEqual({
        '1.0': { deprecated: false },
      })
    })
  })

  describe('getEntidades', () => {
    it('requests the entidades endpoint and parses the results payload', async () => {
      const { cheques, request } = makeCheques()
      request.mockResolvedValue(jsonResponse({ results: entidadesPayload }))
      const result = await cheques.getEntidades()
      expect(request).toHaveBeenCalledWith('GET', '/cheques/v1.0/entidades', {
        params: undefined,
      })
      expect(result).toEqual<ResultGetEntidadesV1>({
        entidades: entidadesPayload,
      })
      expect(result.entidades[0].denominacion).toBe('Banco Nación')
    })

    it('forwards the requested version', async () => {
      const { cheques, request } = makeCheques()
      request.mockResolvedValue(jsonResponse({ results: entidadesPayload }))
      await cheques.getEntidades({ version: '1.0' })
      expect(request).toHaveBeenCalledWith('GET', '/cheques/v1.0/entidades', {
        params: undefined,
      })
    })
  })

  describe('getChequeDenunciado', () => {
    it('interpolates the path vars and parses the results payload', async () => {
      const { cheques, request } = makeCheques()
      request.mockResolvedValue(
        jsonResponse({ results: chequeDenunciadoPayload }),
      )
      const result = await cheques.getChequeDenunciado(11, 123)
      expect(request).toHaveBeenCalledWith(
        'GET',
        '/cheques/v1.0/denunciados/11/123',
        { params: undefined },
      )
      expect(result).toEqual<ResultGetChequeDenunciadoV1>(
        chequeDenunciadoPayload,
      )
      expect(result.numeroCheque).toBe(123)
      expect(result.detalles[0].causal).toBe('Falta de fondos')
    })

    it('defaults missing detalles to an empty list', async () => {
      const { cheques, request } = makeCheques()
      request.mockResolvedValue(
        jsonResponse({
          results: { ...chequeDenunciadoPayload, detalles: undefined },
        }),
      )
      const result = await cheques.getChequeDenunciado(11, 123)
      expect(result.detalles).toEqual([])
    })

    it('forwards the requested version', async () => {
      const { cheques, request } = makeCheques()
      request.mockResolvedValue(
        jsonResponse({ results: chequeDenunciadoPayload }),
      )
      await cheques.getChequeDenunciado(11, 123, { version: '1.0' })
      expect(request).toHaveBeenCalledWith(
        'GET',
        '/cheques/v1.0/denunciados/11/123',
        { params: undefined },
      )
    })
  })
})
