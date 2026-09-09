import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { BCRAClient } from '../src/client'
import { BCRAHTTPError } from '../src/errors'
import { loadFixture, listFixtures } from './setup'
import type { Fixture } from './setup'
import type { ResultGetChequeDenunciadoV1 } from '../src/models/denunciados'
import type { ResultGetEntidadesV1 } from '../src/models/entidades'
import type { ResultGetCotizacionesV1 } from '../src/models/cotizaciones'
import type { ResultGetDivisasV1 } from '../src/models/divisas'
import type { ResultGetEvolucionMonedaV1 } from '../src/models/evolucion'
import type {
  ResultGetEvolucionVariableV1,
  ResultGetMetodologiaV1,
  ResultGetMetodologiasV1,
  ResultGetMonetariasV1,
} from '../src/models/monetarias'
import type {
  ResultGetCajasAhorrosV1,
  ResultGetPaquetesProductosV1,
  ResultGetPrestamosHipotecariosV1,
  ResultGetPrestamosPersonalesV1,
  ResultGetTarjetasCreditoV1,
  ResultGetPlazosFijosV1,
  ResultGetPrestamosPrendariosV1,
} from '../src/models/transparencia'

interface EndpointCase<R = unknown> {
  readonly fixture: string
  readonly expectedStatus: number
  readonly call: (client: BCRAClient) => Promise<R>
}

const ENDPOINTS: EndpointCase[] = [
  {
    fixture: 'deudores.getDeudas',
    expectedStatus: 404,
    call: (client) => client.deudores.getDeudas('20111111112'),
  },
  {
    fixture: 'deudores.getDeudasHistoricas',
    expectedStatus: 404,
    call: (client) => client.deudores.getDeudasHistoricas('20111111112'),
  },
  {
    fixture: 'deudores.getChequesRechazados',
    expectedStatus: 404,
    call: (client) => client.deudores.getChequesRechazados('20111111112'),
  },
  {
    fixture: 'cheques.getEntidades',
    expectedStatus: 200,
    call: (client) => client.cheques.getEntidades(),
  },
  {
    fixture: 'cheques.getChequeDenunciado',
    expectedStatus: 200,
    call: (client) => client.cheques.getChequeDenunciado(11, 20377516),
  },
  {
    fixture: 'estadisticasCambiarias.getDivisas',
    expectedStatus: 200,
    call: (client) => client.estadisticasCambiarias.getDivisas(),
  },
  {
    fixture: 'estadisticasCambiarias.getCotizaciones',
    expectedStatus: 200,
    call: (client) =>
      client.estadisticasCambiarias.getCotizaciones('2024-06-12'),
  },
  {
    fixture: 'estadisticasCambiarias.getEvolucionMoneda',
    expectedStatus: 200,
    call: (client) =>
      client.estadisticasCambiarias.getEvolucionMoneda('EUR', {
        fechadesde: '2024-06-10',
        fechahasta: '2024-06-12',
        limit: 10,
      }),
  },
  {
    fixture: 'monetarias.getMonetarias',
    expectedStatus: 200,
    call: (client) => client.monetarias.getMonetarias(),
  },
  {
    fixture: 'monetarias.getEvolucionVariable',
    expectedStatus: 200,
    call: (client) =>
      client.monetarias.getEvolucionVariable(1, {
        desde: '2025-05-20',
        hasta: '2025-05-26',
        limit: 10,
      }),
  },
  {
    fixture: 'monetarias.getMetodologias',
    expectedStatus: 200,
    call: (client) => client.monetarias.getMetodologias(),
  },
  {
    fixture: 'monetarias.getMetodologia',
    expectedStatus: 200,
    call: (client) => client.monetarias.getMetodologia(1),
  },
  {
    fixture: 'transparencia.getCajasAhorros',
    expectedStatus: 200,
    call: (client) => client.regimenDeTransparencia.getCajasAhorros(7),
  },
  {
    fixture: 'transparencia.getPaquetesProductos',
    expectedStatus: 200,
    call: (client) => client.regimenDeTransparencia.getPaquetesProductos(14),
  },
  {
    fixture: 'transparencia.getPlazosFijos',
    expectedStatus: 200,
    call: (client) => client.regimenDeTransparencia.getPlazosFijos(7),
  },
  {
    fixture: 'transparencia.getPrestamosPrendarios',
    expectedStatus: 200,
    call: (client) => client.regimenDeTransparencia.getPrestamosPrendarios(7),
  },
  {
    fixture: 'transparencia.getPrestamosHipotecarios',
    expectedStatus: 200,
    call: (client) => client.regimenDeTransparencia.getPrestamosHipotecarios(7),
  },
  {
    fixture: 'transparencia.getPrestamosPersonales',
    expectedStatus: 200,
    call: (client) => client.regimenDeTransparencia.getPrestamosPersonales(7),
  },
  {
    fixture: 'transparencia.getTarjetasCredito',
    expectedStatus: 200,
    call: (client) => client.regimenDeTransparencia.getTarjetasCredito(7),
  },
]

describe('fixtures', () => {
  const byName = new Map<string, Fixture>()

  beforeEach(() => {
    for (const name of listFixtures()) {
      byName.set(name, loadFixture(name))
    }
    assertNoMissingFixtures()
    vi.stubGlobal('fetch', fetchFromFixture)
  })

  afterEach(() => {
    byName.clear()
    vi.unstubAllGlobals()
  })

  function assertNoMissingFixtures(): void {
    for (const endpoint of ENDPOINTS) {
      expect(byName.has(endpoint.fixture), `fixture ${endpoint.fixture}`).toBe(
        true,
      )
    }
  }

  async function fetchFromFixture(input: RequestInfo | URL): Promise<Response> {
    const requestedUrl = new URL(String(input))
    const fixture = [...byName.values()].find(
      (candidate) =>
        new URL(candidate.path, 'https://api.bcra.gob.ar').pathname ===
        requestedUrl.pathname,
    )
    if (!fixture) {
      throw new Error(`No hay fixture para ${requestedUrl.pathname}`)
    }
    if (fixture.params) {
      const actual = Object.fromEntries(requestedUrl.searchParams)
      const expected = Object.fromEntries(
        Object.entries(fixture.params).map(([key, value]) => [
          key,
          String(value),
        ]),
      )
      expect(actual).toEqual(expected)
    }
    return new Response(JSON.stringify(fixture.body), {
      status: fixture.statusCode,
      statusText: fixture.statusCode === 200 ? 'OK' : 'Not Found',
      headers: { 'content-type': 'application/json' },
    })
  }

  it('exports one fixture per public endpoint', () => {
    const expected = ENDPOINTS.map((endpoint) => endpoint.fixture).sort()
    expect(listFixtures()).toEqual(expected)
  })

  it('replays every endpoint offline through the real client and transport', async () => {
    const client = new BCRAClient()
    try {
      for (const endpoint of ENDPOINTS) {
        if (endpoint.expectedStatus === 404) {
          await expect(endpoint.call(client)).rejects.toMatchObject({
            statusCode: 404,
          })
        } else {
          const result = await endpoint.call(client)
          expect(result).toBeDefined()
        }
      }
    } finally {
      client.close()
    }
  })

  describe('parsed values match the recorded responses', () => {
    it('getDeudas raises BCRAHTTPError 404', async () => {
      const client = new BCRAClient()
      try {
        await expect(
          client.deudores.getDeudas('20111111112'),
        ).rejects.toBeInstanceOf(BCRAHTTPError)
      } finally {
        client.close()
      }
    })

    it('getDeudasHistoricas raises BCRAHTTPError 404', async () => {
      const client = new BCRAClient()
      try {
        await expect(
          client.deudores.getDeudasHistoricas('20111111112'),
        ).rejects.toMatchObject<Partial<BCRAHTTPError>>({ statusCode: 404 })
      } finally {
        client.close()
      }
    })

    it('getChequesRechazados raises BCRAHTTPError 404', async () => {
      const client = new BCRAClient()
      try {
        await expect(
          client.deudores.getChequesRechazados('20111111112'),
        ).rejects.toMatchObject<Partial<BCRAHTTPError>>({ statusCode: 404 })
      } finally {
        client.close()
      }
    })

    it('getEntidades (59 entidades, primera BANEX)', async () => {
      const client = new BCRAClient()
      try {
        const result =
          (await client.cheques.getEntidades()) as ResultGetEntidadesV1
        expect(result.entidades.length).toBe(59)
        expect(result.entidades[0]).toMatchObject({
          codigoEntidad: 297,
          denominacion: 'BANCO BANEX S.A.',
        })
      } finally {
        client.close()
      }
    })

    it('getChequeDenunciado (cheque 20377516 denunciado)', async () => {
      const client = new BCRAClient()
      try {
        const result = (await client.cheques.getChequeDenunciado(
          11,
          20377516,
        )) as ResultGetChequeDenunciadoV1
        expect(result).toMatchObject({
          numeroCheque: 20377516,
          denunciado: true,
          denominacionEntidad: 'BANCO DE LA NACION ARGENTINA',
        })
        expect(result.detalles[0]).toMatchObject({
          sucursal: 524,
          causal: 'Denunciado por tercero',
        })
      } finally {
        client.close()
      }
    })

    it('getDivisas (44 divisas, ARS = PESO)', async () => {
      const client = new BCRAClient()
      try {
        const result =
          (await client.estadisticasCambiarias.getDivisas()) as ResultGetDivisasV1
        expect(result.divisas.length).toBe(44)
        expect(result.divisas[0]).toEqual({
          codigo: 'ARS',
          denominacion: 'PESO',
        })
      } finally {
        client.close()
      }
    })

    it('getCotizaciones (2024-06-12, 39 monedas)', async () => {
      const client = new BCRAClient()
      try {
        const result = (await client.estadisticasCambiarias.getCotizaciones(
          '2024-06-12',
        )) as ResultGetCotizacionesV1
        expect(result.fecha).toBe('2024-06-12')
        expect(result.detalle.length).toBe(39)
        const eur = result.detalle.find((c) => c.codigoMoneda === 'EUR')!
        expect(eur.tipoCotizacion).toBe(976.3245)
      } finally {
        client.close()
      }
    })

    it('getEvolucionMoneda (EUR, 3 días; casa oficial)', async () => {
      const client = new BCRAClient()
      try {
        const result = (await client.estadisticasCambiarias.getEvolucionMoneda(
          'EUR',
          { fechadesde: '2024-06-10', fechahasta: '2024-06-12', limit: 10 },
        )) as ResultGetEvolucionMonedaV1
        expect(result.resultset).toEqual({ count: 3, offset: 0, limit: 10 })
        expect(result.cotizaciones.length).toBe(3)
        expect(result.cotizaciones[0].detalle[0].codigoMoneda).toBe('EUR')
      } finally {
        client.close()
      }
    })

    it('getMonetarias (1000 variables, primera reservas)', async () => {
      const client = new BCRAClient()
      try {
        const result =
          (await client.monetarias.getMonetarias()) as ResultGetMonetariasV1
        expect(result.resultset.count).toBe(1610)
        expect(result.variables).toHaveLength(1000)
        expect(result.variables[0]).toMatchObject({
          idVariable: 1,
          descripcion: 'Reservas internacionales',
          unidadExpresion: 'En millones de USD',
        })
      } finally {
        client.close()
      }
    })

    it('getEvolucionVariable (5 puntos de la variable 1)', async () => {
      const client = new BCRAClient()
      try {
        const result = (await client.monetarias.getEvolucionVariable(1, {
          desde: '2025-05-20',
          hasta: '2025-05-26',
          limit: 10,
        })) as ResultGetEvolucionVariableV1
        expect(result.series[0].idVariable).toBe(1)
        expect(result.series[0].detalle).toHaveLength(5)
        expect(result.series[0].detalle[0]).toEqual({
          fecha: '2025-05-26',
          valor: 38384,
        })
      } finally {
        client.close()
      }
    })

    it('getMetodologias (250 metodologías)', async () => {
      const client = new BCRAClient()
      try {
        const result =
          (await client.monetarias.getMetodologias()) as ResultGetMetodologiasV1
        expect(result.metodologias).toHaveLength(250)
        expect(result.metodologias[0].id).toBe(1)
      } finally {
        client.close()
      }
    })

    it('getMetodologia (variable 1)', async () => {
      const client = new BCRAClient()
      try {
        const result = (await client.monetarias.getMetodologia(
          1,
        )) as ResultGetMetodologiaV1
        expect(result.metodologia.id).toBe(1)
        expect(result.metodologia.detalle).toContain('Reservas Internacionales')
      } finally {
        client.close()
      }
    })

    it('getCajasAhorros (BANCO DE GALICIA)', async () => {
      const client = new BCRAClient()
      try {
        const result = (await client.regimenDeTransparencia.getCajasAhorros(
          7,
        )) as ResultGetCajasAhorrosV1
        expect(result.cajas_ahorros[0]).toMatchObject({
          codigoEntidad: 7,
          descripcionEntidad: 'BANCO DE GALICIA Y BUENOS AIRES S.A.',
          procesoSimplificadoDebidaDiligencia: 'SI',
        })
      } finally {
        client.close()
      }
    })

    it('getPaquetesProductos (72 paquetes, primero L OGROS)', async () => {
      const client = new BCRAClient()
      try {
        const result =
          (await client.regimenDeTransparencia.getPaquetesProductos(
            14,
          )) as ResultGetPaquetesProductosV1
        expect(result.paquetes_productos).toHaveLength(72)
        expect(result.paquetes_productos[0]).toMatchObject({
          codigoEntidad: 14,
          nombreCorto: 'LOGROS',
        })
      } finally {
        client.close()
      }
    })

    it('getPlazosFijos (tasa mínima 19.92)', async () => {
      const client = new BCRAClient()
      try {
        const result = (await client.regimenDeTransparencia.getPlazosFijos(
          7,
        )) as ResultGetPlazosFijosV1
        expect(result.plazos_fijos).toHaveLength(12)
        expect(result.plazos_fijos[0]).toMatchObject({
          tasaEfectivaAnualMinima: 19.92,
          denominacion: null,
        })
      } finally {
        client.close()
      }
    })

    it('getPrestamosPrendarios (18 préstamos)', async () => {
      const client = new BCRAClient()
      try {
        const result =
          (await client.regimenDeTransparencia.getPrestamosPrendarios(
            7,
          )) as ResultGetPrestamosPrendariosV1
        expect(result.prestamos_prendarios).toHaveLength(18)
        expect(result.prestamos_prendarios[0]).toMatchObject({
          montoMaximoOtorgable: 57000000,
          nombreCorto: 'PRENDARIO2.0',
        })
      } finally {
        client.close()
      }
    })

    it('getPrestamosHipotecarios (préstamo UVA)', async () => {
      const client = new BCRAClient()
      try {
        const result =
          (await client.regimenDeTransparencia.getPrestamosHipotecarios(
            7,
          )) as ResultGetPrestamosHipotecariosV1
        expect(result.prestamos_hipotecarios).toHaveLength(1)
        expect(result.prestamos_hipotecarios[0]).toMatchObject({
          denominacion: 'UVA',
          plazoMaximoOtorgable: 240,
          tasaEfectivaAnualMaxima: 7.76,
        })
      } finally {
        client.close()
      }
    })

    it('getPrestamosPersonales (tasa máxima 282.7)', async () => {
      const client = new BCRAClient()
      try {
        const result =
          (await client.regimenDeTransparencia.getPrestamosPersonales(
            7,
          )) as ResultGetPrestamosPersonalesV1
        expect(result.prestamos_personales).toHaveLength(7)
        expect(result.prestamos_personales[0]).toMatchObject({
          tasaEfectivaAnualMaxima: 282.7,
          nombreCorto: 'PPMAXMOVE',
        })
      } finally {
        client.close()
      }
    })

    it('getTarjetasCredito (12 tarjetas, segmento internacional)', async () => {
      const client = new BCRAClient()
      try {
        const result = (await client.regimenDeTransparencia.getTarjetasCredito(
          7,
        )) as ResultGetTarjetasCreditoV1
        expect(result.tarjetas_credito).toHaveLength(12)
        expect(result.tarjetas_credito[0]).toMatchObject({
          segmento: 'Internacional',
          nombreCorto: 'MASTER INTER',
        })
      } finally {
        client.close()
      }
    })
  })
})
