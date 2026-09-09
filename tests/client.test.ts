import { describe, it, expect, vi, afterEach } from 'vitest'
import { BCRAClient } from '../src/client'
import { Cheques } from '../src/resources/cheques'
import { Deudores } from '../src/resources/deudores'
import { EstadisticasCambiarias } from '../src/resources/estadisticas-cambiarias'
import { Monetarias } from '../src/resources/monetarias'
import { RegimenDeTransparencia } from '../src/resources/regimen-de-transparencia'
import { RetryPolicy } from '../src/retry'
import { Transport } from '../src/transport'
import type { ResultGetMonetariasV1 } from '../src/models/monetarias'
import type { ResultGetDeudasV1 } from '../src/models/deudores'

function jsonResponse(body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    statusText: 'OK',
    headers: { 'content-type': 'application/json' },
  })
}

const deudasPayload: ResultGetDeudasV1 = {
  identificacion: 20111111112,
  denominacion: 'EMPRESA SA',
  periodos: [
    {
      periodo: '2024-06',
      entidades: [
        {
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
        },
      ],
    },
  ],
}

const monetariasBody = {
  results: [
    {
      idVariable: 1,
      descripcion: 'BASE MONETARIA',
      categoria: 'MONETARIAS',
      tipoSerie: 's',
      periodicidad: 'd',
      unidadExpresion: 'millones de pesos',
      moneda: 'ARS',
      primerFechaInformada: '2002-01-01',
      ultFechaInformada: '2024-06-01',
      ultValorInformado: 1000,
    },
  ],
  metadata: { resultset: { count: 1, first: 1, last: 1 } },
}

const monetariasResult: ResultGetMonetariasV1 = {
  resultset: { count: 1, first: 1, last: 1 },
  variables: [
    {
      idVariable: 1,
      descripcion: 'BASE MONETARIA',
      categoria: 'MONETARIAS',
      tipoSerie: 's',
      periodicidad: 'd',
      unidadExpresion: 'millones de pesos',
      moneda: 'ARS',
      primerFechaInformada: '2002-01-01',
      ultFechaInformada: '2024-06-01',
      ultValorInformado: 1000,
    },
  ],
}

describe('BCRAClient', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('exposes the five resources', () => {
    const client = new BCRAClient()
    expect(client.deudores).toBeInstanceOf(Deudores)
    expect(client.cheques).toBeInstanceOf(Cheques)
    expect(client.estadisticasCambiarias).toBeInstanceOf(EstadisticasCambiarias)
    expect(client.monetarias).toBeInstanceOf(Monetarias)
    expect(client.regimenDeTransparencia).toBeInstanceOf(RegimenDeTransparencia)
  })

  it('shares a single transport across all resources', () => {
    const client = new BCRAClient() as unknown as {
      _transport: Transport
      deudores: { transport: Transport }
      cheques: { transport: Transport }
      estadisticasCambiarias: { transport: Transport }
      monetarias: { transport: Transport }
      regimenDeTransparencia: { transport: Transport }
    }
    const shared = client._transport
    expect(client.deudores.transport).toBe(shared)
    expect(client.cheques.transport).toBe(shared)
    expect(client.estadisticasCambiarias.transport).toBe(shared)
    expect(client.monetarias.transport).toBe(shared)
    expect(client.regimenDeTransparencia.transport).toBe(shared)
  })

  it('uses default baseUrl, timeout and RetryPolicy', () => {
    const client = new BCRAClient() as unknown as {
      _transport: Transport
    }
    expect(client._transport.baseUrl).toBe('https://api.bcra.gob.ar')
    expect(client._transport.timeout).toBe(10_000)
    expect(client._transport.retries).toBeInstanceOf(RetryPolicy)
  })

  it('forwards custom baseUrl, timeout and retries to the transport', () => {
    const retries = new RetryPolicy({ maxRetries: 0 })
    const client = new BCRAClient({
      baseUrl: 'https://api.example.com',
      timeout: 5000,
      retries,
    }) as unknown as { _transport: Transport }
    expect(client._transport.baseUrl).toBe('https://api.example.com')
    expect(client._transport.timeout).toBe(5000)
    expect(client._transport.retries).toBe(retries)
  })

  it('performs a request end to end through a resource', async () => {
    const spy = vi
      .spyOn(Transport.prototype, 'request')
      .mockResolvedValue(jsonResponse({ results: deudasPayload }))
    const client = new BCRAClient()
    const deudas = await client.deudores.getDeudas('20-11111111-2')
    expect(spy).toHaveBeenCalledWith(
      'GET',
      '/centraldedeudores/v1.0/Deudas/20111111112',
      { params: undefined },
    )
    expect(deudas).toEqual<ResultGetDeudasV1>(deudasPayload)
    expect(deudas.identificacion).toBe(20111111112)
  })

  it('performs a resultsKey-null request through a resource', async () => {
    const spy = vi
      .spyOn(Transport.prototype, 'request')
      .mockResolvedValue(jsonResponse(monetariasBody))
    const client = new BCRAClient()
    const monetarias = await client.monetarias.getMonetarias()
    expect(spy).toHaveBeenCalledWith('GET', '/estadisticas/v4.0/monetarias', {
      params: undefined,
    })
    expect(monetarias).toEqual<ResultGetMonetariasV1>(monetariasResult)
    expect(monetarias.resultset.count).toBe(1)
  })

  it('close() is a no-op', () => {
    const client = new BCRAClient()
    expect(() => client.close()).not.toThrow()
  })
})
