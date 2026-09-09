import { describe, it, expect, vi, afterEach } from 'vitest'
import { Cheques } from '../../src/resources/cheques'
import { Transport } from '../../src/transport'
import { jsonResponse, loadFixture } from '../setup'
import type { EntidadBancaria } from '../../src/models/entidades'
import type { ResultGetEntidadesV1 } from '../../src/models/entidades'
import type { ResultGetChequeDenunciadoV1 } from '../../src/models/denunciados'

function makeCheques(): {
  cheques: Cheques
  request: ReturnType<typeof vi.fn>
} {
  const request = vi.fn()
  const transport = { request } as unknown as Transport
  return { cheques: new Cheques(transport), request }
}

const entidadesPayload = (
  loadFixture('cheques.getEntidades').body as {
    results: EntidadBancaria[]
  }
).results

const chequeDenunciadoPayload = (
  loadFixture('cheques.getChequeDenunciado').body as {
    results: ResultGetChequeDenunciadoV1
  }
).results

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
      request.mockResolvedValue(
        jsonResponse(loadFixture('cheques.getEntidades').body),
      )
      const result = await cheques.getEntidades()
      expect(request).toHaveBeenCalledWith('GET', '/cheques/v1.0/entidades', {
        params: undefined,
      })
      expect(result).toEqual<ResultGetEntidadesV1>({
        entidades: entidadesPayload,
      })
      expect(result.entidades[0].denominacion).toBe('BANCO BANEX S.A.')
    })

    it('forwards the requested version', async () => {
      const { cheques, request } = makeCheques()
      request.mockResolvedValue(
        jsonResponse(loadFixture('cheques.getEntidades').body),
      )
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
        jsonResponse(loadFixture('cheques.getChequeDenunciado').body),
      )
      const result = await cheques.getChequeDenunciado(11, 20377516)
      expect(request).toHaveBeenCalledWith(
        'GET',
        '/cheques/v1.0/denunciados/11/20377516',
        { params: undefined },
      )
      expect(result).toEqual<ResultGetChequeDenunciadoV1>(
        chequeDenunciadoPayload,
      )
      expect(result.numeroCheque).toBe(20377516)
      expect(result.detalles[0].causal).toBe('Denunciado por tercero')
    })

    it('defaults missing detalles to an empty list', async () => {
      const { cheques, request } = makeCheques()
      request.mockResolvedValue(
        jsonResponse({
          results: { ...chequeDenunciadoPayload, detalles: undefined },
        }),
      )
      const result = await cheques.getChequeDenunciado(11, 20377516)
      expect(result.detalles).toEqual([])
    })

    it('forwards the requested version', async () => {
      const { cheques, request } = makeCheques()
      request.mockResolvedValue(
        jsonResponse(loadFixture('cheques.getChequeDenunciado').body),
      )
      await cheques.getChequeDenunciado(11, 20377516, { version: '1.0' })
      expect(request).toHaveBeenCalledWith(
        'GET',
        '/cheques/v1.0/denunciados/11/20377516',
        { params: undefined },
      )
    })
  })
})
