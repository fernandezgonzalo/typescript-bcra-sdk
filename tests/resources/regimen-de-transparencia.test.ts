import { describe, it, expect, vi, afterEach } from 'vitest'
import { RegimenDeTransparencia } from '../../src/resources/regimen-de-transparencia'
import { Transport } from '../../src/transport'
import { jsonResponse, loadFixture } from '../setup'
import type {
  CajaAhorro,
  ResultGetCajasAhorrosV1,
} from '../../src/models/transparencia'
import type {
  PaqueteProducto,
  ResultGetPaquetesProductosV1,
} from '../../src/models/transparencia'
import type {
  PlazoFijo,
  ResultGetPlazosFijosV1,
} from '../../src/models/transparencia'
import type {
  PrestamoPrendario,
  ResultGetPrestamosPrendariosV1,
} from '../../src/models/transparencia'
import type {
  PrestamoHipotecario,
  ResultGetPrestamosHipotecariosV1,
} from '../../src/models/transparencia'
import type {
  PrestamoPersonal,
  ResultGetPrestamosPersonalesV1,
} from '../../src/models/transparencia'
import type {
  TarjetaCredito,
  ResultGetTarjetasCreditoV1,
} from '../../src/models/transparencia'

function makeRegimen(): {
  regimen: RegimenDeTransparencia
  request: ReturnType<typeof vi.fn>
} {
  const request = vi.fn()
  const transport = { request } as unknown as Transport
  return { regimen: new RegimenDeTransparencia(transport), request }
}

function resultsFrom(fixture: string): unknown[] {
  return (loadFixture(fixture).body as { results: unknown[] }).results
}

const cajasAhorros = resultsFrom(
  'transparencia.getCajasAhorros',
) as CajaAhorro[]
const paquetesProductos = resultsFrom(
  'transparencia.getPaquetesProductos',
) as PaqueteProducto[]
const plazosFijos = resultsFrom('transparencia.getPlazosFijos') as PlazoFijo[]
const prestamosPrendarios = resultsFrom(
  'transparencia.getPrestamosPrendarios',
) as PrestamoPrendario[]
const prestamosHipotecarios = resultsFrom(
  'transparencia.getPrestamosHipotecarios',
) as PrestamoHipotecario[]
const prestamosPersonales = resultsFrom(
  'transparencia.getPrestamosPersonales',
) as PrestamoPersonal[]
const tarjetasCredito = resultsFrom(
  'transparencia.getTarjetasCredito',
) as TarjetaCredito[]

describe('RegimenDeTransparencia', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('versions', () => {
    it('registers the seven endpoints with version 1.0', () => {
      const { regimen } = makeRegimen()
      expect(regimen.versions('getCajasAhorros')).toEqual({
        '1.0': { deprecated: false },
      })
      expect(regimen.versions('getPaquetesProductos')).toEqual({
        '1.0': { deprecated: false },
      })
      expect(regimen.versions('getPlazosFijos')).toEqual({
        '1.0': { deprecated: false },
      })
      expect(regimen.versions('getPrestamosPrendarios')).toEqual({
        '1.0': { deprecated: false },
      })
      expect(regimen.versions('getPrestamosHipotecarios')).toEqual({
        '1.0': { deprecated: false },
      })
      expect(regimen.versions('getPrestamosPersonales')).toEqual({
        '1.0': { deprecated: false },
      })
      expect(regimen.versions('getTarjetasCredito')).toEqual({
        '1.0': { deprecated: false },
      })
    })
  })

  describe('getCajasAhorros', () => {
    it('requests the endpoint and parses the results payload', async () => {
      const { regimen, request } = makeRegimen()
      request.mockResolvedValue(
        jsonResponse(loadFixture('transparencia.getCajasAhorros').body),
      )
      const result = await regimen.getCajasAhorros()
      expect(request).toHaveBeenCalledWith(
        'GET',
        '/transparencia/v1.0/CajasAhorros',
        { params: undefined },
      )
      expect(result).toEqual<ResultGetCajasAhorrosV1>({
        cajas_ahorros: cajasAhorros,
      })
      expect(result.cajas_ahorros[0].codigoEntidad).toBe(7)
    })

    it('sends the codigoEntidad filter when provided', async () => {
      const { regimen, request } = makeRegimen()
      request.mockResolvedValue(
        jsonResponse(loadFixture('transparencia.getCajasAhorros').body),
      )
      await regimen.getCajasAhorros(7)
      expect(request).toHaveBeenCalledWith(
        'GET',
        '/transparencia/v1.0/CajasAhorros',
        { params: { codigoEntidad: 7 } },
      )
    })

    it('forwards the requested version', async () => {
      const { regimen, request } = makeRegimen()
      request.mockResolvedValue(
        jsonResponse(loadFixture('transparencia.getCajasAhorros').body),
      )
      await regimen.getCajasAhorros(undefined, { version: '1.0' })
      expect(request).toHaveBeenCalledWith(
        'GET',
        '/transparencia/v1.0/CajasAhorros',
        { params: undefined },
      )
    })
  })

  describe('getPaquetesProductos', () => {
    it('requests the endpoint and parses the results payload', async () => {
      const { regimen, request } = makeRegimen()
      request.mockResolvedValue(
        jsonResponse(loadFixture('transparencia.getPaquetesProductos').body),
      )
      const result = await regimen.getPaquetesProductos()
      expect(request).toHaveBeenCalledWith(
        'GET',
        '/transparencia/v1.0/PaquetesProductos',
        { params: undefined },
      )
      expect(result).toEqual<ResultGetPaquetesProductosV1>({
        paquetes_productos: paquetesProductos,
      })
      expect(result.paquetes_productos).toHaveLength(72)
      expect(result.paquetes_productos[0].nombreCorto).toBe('LOGROS')
    })

    it('sends the codigoEntidad filter when provided', async () => {
      const { regimen, request } = makeRegimen()
      request.mockResolvedValue(
        jsonResponse(loadFixture('transparencia.getPaquetesProductos').body),
      )
      await regimen.getPaquetesProductos(14)
      expect(request).toHaveBeenCalledWith(
        'GET',
        '/transparencia/v1.0/PaquetesProductos',
        { params: { codigoEntidad: 14 } },
      )
    })

    it('forwards the requested version', async () => {
      const { regimen, request } = makeRegimen()
      request.mockResolvedValue(
        jsonResponse(loadFixture('transparencia.getPaquetesProductos').body),
      )
      await regimen.getPaquetesProductos(undefined, { version: '1.0' })
      expect(request).toHaveBeenCalledWith(
        'GET',
        '/transparencia/v1.0/PaquetesProductos',
        { params: undefined },
      )
    })
  })

  describe('getPlazosFijos', () => {
    it('requests the endpoint and parses the results payload', async () => {
      const { regimen, request } = makeRegimen()
      request.mockResolvedValue(
        jsonResponse(loadFixture('transparencia.getPlazosFijos').body),
      )
      const result = await regimen.getPlazosFijos()
      expect(request).toHaveBeenCalledWith(
        'GET',
        '/transparencia/v1.0/PlazosFijos',
        { params: undefined },
      )
      expect(result).toEqual<ResultGetPlazosFijosV1>({
        plazos_fijos: plazosFijos,
      })
      expect(result.plazos_fijos).toHaveLength(12)
      expect(result.plazos_fijos[0].tasaEfectivaAnualMinima).toBe(19.92)
    })

    it('sends the codigoEntidad filter when provided', async () => {
      const { regimen, request } = makeRegimen()
      request.mockResolvedValue(
        jsonResponse(loadFixture('transparencia.getPlazosFijos').body),
      )
      await regimen.getPlazosFijos(7)
      expect(request).toHaveBeenCalledWith(
        'GET',
        '/transparencia/v1.0/PlazosFijos',
        { params: { codigoEntidad: 7 } },
      )
    })

    it('forwards the requested version', async () => {
      const { regimen, request } = makeRegimen()
      request.mockResolvedValue(
        jsonResponse(loadFixture('transparencia.getPlazosFijos').body),
      )
      await regimen.getPlazosFijos(undefined, { version: '1.0' })
      expect(request).toHaveBeenCalledWith(
        'GET',
        '/transparencia/v1.0/PlazosFijos',
        { params: undefined },
      )
    })
  })

  describe('getPrestamosPrendarios', () => {
    it('requests the endpoint and parses the results payload', async () => {
      const { regimen, request } = makeRegimen()
      request.mockResolvedValue(
        jsonResponse(loadFixture('transparencia.getPrestamosPrendarios').body),
      )
      const result = await regimen.getPrestamosPrendarios()
      expect(request).toHaveBeenCalledWith(
        'GET',
        '/transparencia/v1.0/Prestamos/Prendarios',
        { params: undefined },
      )
      expect(result).toEqual<ResultGetPrestamosPrendariosV1>({
        prestamos_prendarios: prestamosPrendarios,
      })
      expect(result.prestamos_prendarios).toHaveLength(18)
      expect(result.prestamos_prendarios[0].montoMaximoOtorgable).toBe(57000000)
    })

    it('sends the codigoEntidad filter when provided', async () => {
      const { regimen, request } = makeRegimen()
      request.mockResolvedValue(
        jsonResponse(loadFixture('transparencia.getPrestamosPrendarios').body),
      )
      await regimen.getPrestamosPrendarios(7)
      expect(request).toHaveBeenCalledWith(
        'GET',
        '/transparencia/v1.0/Prestamos/Prendarios',
        { params: { codigoEntidad: 7 } },
      )
    })

    it('forwards the requested version', async () => {
      const { regimen, request } = makeRegimen()
      request.mockResolvedValue(
        jsonResponse(loadFixture('transparencia.getPrestamosPrendarios').body),
      )
      await regimen.getPrestamosPrendarios(undefined, { version: '1.0' })
      expect(request).toHaveBeenCalledWith(
        'GET',
        '/transparencia/v1.0/Prestamos/Prendarios',
        { params: undefined },
      )
    })
  })

  describe('getPrestamosHipotecarios', () => {
    it('requests the endpoint and parses the results payload', async () => {
      const { regimen, request } = makeRegimen()
      request.mockResolvedValue(
        jsonResponse(
          loadFixture('transparencia.getPrestamosHipotecarios').body,
        ),
      )
      const result = await regimen.getPrestamosHipotecarios()
      expect(request).toHaveBeenCalledWith(
        'GET',
        '/transparencia/v1.0/Prestamos/Hipotecarios',
        { params: undefined },
      )
      expect(result).toEqual<ResultGetPrestamosHipotecariosV1>({
        prestamos_hipotecarios: prestamosHipotecarios,
      })
      expect(result.prestamos_hipotecarios).toHaveLength(1)
      expect(result.prestamos_hipotecarios[0].plazoMaximoOtorgable).toBe(240)
    })

    it('sends the codigoEntidad filter when provided', async () => {
      const { regimen, request } = makeRegimen()
      request.mockResolvedValue(
        jsonResponse(
          loadFixture('transparencia.getPrestamosHipotecarios').body,
        ),
      )
      await regimen.getPrestamosHipotecarios(7)
      expect(request).toHaveBeenCalledWith(
        'GET',
        '/transparencia/v1.0/Prestamos/Hipotecarios',
        { params: { codigoEntidad: 7 } },
      )
    })

    it('forwards the requested version', async () => {
      const { regimen, request } = makeRegimen()
      request.mockResolvedValue(
        jsonResponse(
          loadFixture('transparencia.getPrestamosHipotecarios').body,
        ),
      )
      await regimen.getPrestamosHipotecarios(undefined, { version: '1.0' })
      expect(request).toHaveBeenCalledWith(
        'GET',
        '/transparencia/v1.0/Prestamos/Hipotecarios',
        { params: undefined },
      )
    })
  })

  describe('getPrestamosPersonales', () => {
    it('requests the endpoint and parses the results payload', async () => {
      const { regimen, request } = makeRegimen()
      request.mockResolvedValue(
        jsonResponse(loadFixture('transparencia.getPrestamosPersonales').body),
      )
      const result = await regimen.getPrestamosPersonales()
      expect(request).toHaveBeenCalledWith(
        'GET',
        '/transparencia/v1.0/Prestamos/Personales',
        { params: undefined },
      )
      expect(result).toEqual<ResultGetPrestamosPersonalesV1>({
        prestamos_personales: prestamosPersonales,
      })
      expect(result.prestamos_personales).toHaveLength(7)
      expect(result.prestamos_personales[0].tasaEfectivaAnualMaxima).toBe(282.7)
    })

    it('sends the codigoEntidad filter when provided', async () => {
      const { regimen, request } = makeRegimen()
      request.mockResolvedValue(
        jsonResponse(loadFixture('transparencia.getPrestamosPersonales').body),
      )
      await regimen.getPrestamosPersonales(7)
      expect(request).toHaveBeenCalledWith(
        'GET',
        '/transparencia/v1.0/Prestamos/Personales',
        { params: { codigoEntidad: 7 } },
      )
    })

    it('forwards the requested version', async () => {
      const { regimen, request } = makeRegimen()
      request.mockResolvedValue(
        jsonResponse(loadFixture('transparencia.getPrestamosPersonales').body),
      )
      await regimen.getPrestamosPersonales(undefined, { version: '1.0' })
      expect(request).toHaveBeenCalledWith(
        'GET',
        '/transparencia/v1.0/Prestamos/Personales',
        { params: undefined },
      )
    })
  })

  describe('getTarjetasCredito', () => {
    it('requests the endpoint and parses the results payload', async () => {
      const { regimen, request } = makeRegimen()
      request.mockResolvedValue(
        jsonResponse(loadFixture('transparencia.getTarjetasCredito').body),
      )
      const result = await regimen.getTarjetasCredito()
      expect(request).toHaveBeenCalledWith(
        'GET',
        '/transparencia/v1.0/TarjetasCredito',
        { params: undefined },
      )
      expect(result).toEqual<ResultGetTarjetasCreditoV1>({
        tarjetas_credito: tarjetasCredito,
      })
      expect(result.tarjetas_credito).toHaveLength(12)
      expect(result.tarjetas_credito[0].segmento).toBe('Internacional')
    })

    it('sends the codigoEntidad filter when provided', async () => {
      const { regimen, request } = makeRegimen()
      request.mockResolvedValue(
        jsonResponse(loadFixture('transparencia.getTarjetasCredito').body),
      )
      await regimen.getTarjetasCredito(7)
      expect(request).toHaveBeenCalledWith(
        'GET',
        '/transparencia/v1.0/TarjetasCredito',
        { params: { codigoEntidad: 7 } },
      )
    })

    it('forwards the requested version', async () => {
      const { regimen, request } = makeRegimen()
      request.mockResolvedValue(
        jsonResponse(loadFixture('transparencia.getTarjetasCredito').body),
      )
      await regimen.getTarjetasCredito(undefined, { version: '1.0' })
      expect(request).toHaveBeenCalledWith(
        'GET',
        '/transparencia/v1.0/TarjetasCredito',
        { params: undefined },
      )
    })
  })
})
