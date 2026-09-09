import { describe, it, expect, vi, afterEach } from 'vitest'
import { RegimenDeTransparencia } from '../../src/resources/regimen-de-transparencia'
import { Transport } from '../../src/transport'
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

function jsonResponse(body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    statusText: 'OK',
    headers: { 'content-type': 'application/json' },
  })
}

function makeRegimen(): {
  regimen: RegimenDeTransparencia
  request: ReturnType<typeof vi.fn>
} {
  const request = vi.fn()
  const transport = { request } as unknown as Transport
  return { regimen: new RegimenDeTransparencia(transport), request }
}

function resultsPayload(item: unknown): { results: unknown[] } {
  return { results: [item] }
}

const baseEntidad = {
  codigoEntidad: 11,
  descripcionEntidad: 'BANCO',
  fechaInformacion: '2024-06-30',
}

const cajaAhorro: CajaAhorro = {
  ...baseEntidad,
  procesoSimplificadoDebidaDiligencia: 'NO',
}
const cajasAhorrosPayload = resultsPayload(cajaAhorro)

const paqueteProducto: PaqueteProducto = {
  ...baseEntidad,
  nombreCompleto: 'PAQUETE',
  nombreCorto: 'PAQ',
  comisionMaximaMantenimiento: 100.5,
  ingresoMinimoMensual: 50000,
  antiguedadLaboralMinimaMeses: 6,
  edadMaximaSolicitada: 65,
  beneficiarios: 'PERSONAS HUMANAS',
  segmento: 'MINORISTA',
  productosIntegrantes: 'CC; CA',
  territorioValidez: 'NACIONAL',
  masInformacion: null,
}
const paquetesProductosPayload = resultsPayload(paqueteProducto)

const plazoFijo: PlazoFijo = {
  ...baseEntidad,
  nombreCompleto: 'PLAZO FIJO',
  nombreCorto: 'PF',
  denominacion: 'PESOS',
  montoMinimoInvertir: 1000,
  plazoMinimoInvertirDias: 30,
  canalConstitucion: 'DIGITAL',
  tasaEfectivaAnualMinima: 40.5,
  territorioValidez: 'NACIONAL',
  masInformacion: 'https://banco.com',
}
const plazosFijosPayload = resultsPayload(plazoFijo)

const prestamoPrendario: PrestamoPrendario = {
  relacionMontoTasacion: 80,
  destinoFondos: 'LIBRE DISPONIBILIDAD',
  montoMinimoOtorgable: 50000,
  denominacion: 'PESOS',
  montoMaximoOtorgable: 1000000,
  plazoMaximoOtorgable: 60,
  ingresoMinimoMensual: 100000,
  antiguedadLaboralMinimaMeses: 6,
  edadMaximaSolicitada: 65,
  relacionCuotaIngreso: 30,
  beneficiario: 'PERSONAS HUMANAS',
  cargoMaximoCancelacionAnticipada: 0,
  tasaEfectivaAnualMaxima: 50.5,
  tipoTasa: 'FIJA',
  costoFinancieroEfectivoTotalMaximo: 60.5,
  cuotaInicial: 20000,
  ...baseEntidad,
  nombreCompleto: 'AUTO',
  nombreCorto: 'AUTO',
  territorioValidez: 'NACIONAL',
  masInformacion: null,
}
const prestamosPrendariosPayload = resultsPayload(prestamoPrendario)

const prestamoHipotecario: PrestamoHipotecario = {
  relacionMontoTasacion: 75,
  destinoFondos: 'VIVIENDA',
  denominacion: 'PESOS',
  montoMaximoOtorgable: 5000000,
  plazoMaximoOtorgable: 240,
  ingresoMinimoMensual: 200000,
  antiguedadLaboralMinimaMeses: 12,
  edadMaximaSolicitada: 70,
  relacionCuotaIngreso: 30,
  beneficiario: 'PERSONAS HUMANAS',
  cargoMaximoCancelacionAnticipada: 0,
  tasaEfectivaAnualMaxima: 45.5,
  tipoTasa: 'MIXTA',
  costoFinancieroEfectivoTotalMaximo: 55.5,
  cuotaInicial: 250000,
  ...baseEntidad,
  nombreCompleto: 'VIVIENDA',
  nombreCorto: 'VIV',
  territorioValidez: 'NACIONAL',
  masInformacion: 'https://banco.com',
}
const prestamosHipotecariosPayload = resultsPayload(prestamoHipotecario)

const prestamoPersonal: PrestamoPersonal = {
  montoMinimoOtorgable: 10000,
  denominacion: 'PESOS',
  montoMaximoOtorgable: 500000,
  plazoMaximoOtorgable: 36,
  ingresoMinimoMensual: 50000,
  antiguedadLaboralMinimaMeses: 3,
  edadMaximaSolicitada: 65,
  relacionCuotaIngreso: 35,
  beneficiario: 'PERSONAS HUMANAS',
  cargoMaximoCancelacionAnticipada: 0,
  tasaEfectivaAnualMaxima: 60.5,
  tipoTasa: 'FIJA',
  costoFinancieroEfectivoTotalMaximo: 70.5,
  cuotaInicial: 0,
  ...baseEntidad,
  nombreCompleto: 'PERSONAL',
  nombreCorto: 'PERS',
  territorioValidez: 'NACIONAL',
  masInformacion: null,
}
const prestamosPersonalesPayload = resultsPayload(prestamoPersonal)

const tarjetaCredito: TarjetaCredito = {
  comisionMaximaAdministracionMantenimiento: 1000,
  comisionMaximaRenovacion: 1200,
  tasaEfectivaAnualMaximaFinanciacion: 80.5,
  tasaEfectivaAnualMaximaAdelantoEfectivo: 90.5,
  ingresoMinimoMensual: 40000,
  antiguedadLaboralMinimaMeses: 6,
  edadMaximaSolicitada: 65,
  segmento: 'MINORISTA',
  ...baseEntidad,
  nombreCompleto: 'TARJETA',
  nombreCorto: 'TC',
  territorioValidez: 'NACIONAL',
  masInformacion: null,
}
const tarjetasCreditoPayload = resultsPayload(tarjetaCredito)

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
      request.mockResolvedValue(jsonResponse(cajasAhorrosPayload))
      const result = await regimen.getCajasAhorros()
      expect(request).toHaveBeenCalledWith(
        'GET',
        '/transparencia/v1.0/CajasAhorros',
        { params: undefined },
      )
      expect(result).toEqual<ResultGetCajasAhorrosV1>({
        cajas_ahorros: [cajaAhorro],
      })
      expect(result.cajas_ahorros[0].codigoEntidad).toBe(11)
    })

    it('sends the codigoEntidad filter when provided', async () => {
      const { regimen, request } = makeRegimen()
      request.mockResolvedValue(jsonResponse(cajasAhorrosPayload))
      await regimen.getCajasAhorros(11)
      expect(request).toHaveBeenCalledWith(
        'GET',
        '/transparencia/v1.0/CajasAhorros',
        { params: { codigoEntidad: 11 } },
      )
    })

    it('forwards the requested version', async () => {
      const { regimen, request } = makeRegimen()
      request.mockResolvedValue(jsonResponse(cajasAhorrosPayload))
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
      request.mockResolvedValue(jsonResponse(paquetesProductosPayload))
      const result = await regimen.getPaquetesProductos()
      expect(request).toHaveBeenCalledWith(
        'GET',
        '/transparencia/v1.0/PaquetesProductos',
        { params: undefined },
      )
      expect(result).toEqual<ResultGetPaquetesProductosV1>({
        paquetes_productos: [paqueteProducto],
      })
      expect(result.paquetes_productos[0].masInformacion).toBeNull()
    })

    it('sends the codigoEntidad filter when provided', async () => {
      const { regimen, request } = makeRegimen()
      request.mockResolvedValue(jsonResponse(paquetesProductosPayload))
      await regimen.getPaquetesProductos(11)
      expect(request).toHaveBeenCalledWith(
        'GET',
        '/transparencia/v1.0/PaquetesProductos',
        { params: { codigoEntidad: 11 } },
      )
    })

    it('forwards the requested version', async () => {
      const { regimen, request } = makeRegimen()
      request.mockResolvedValue(jsonResponse(paquetesProductosPayload))
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
      request.mockResolvedValue(jsonResponse(plazosFijosPayload))
      const result = await regimen.getPlazosFijos()
      expect(request).toHaveBeenCalledWith(
        'GET',
        '/transparencia/v1.0/PlazosFijos',
        { params: undefined },
      )
      expect(result).toEqual<ResultGetPlazosFijosV1>({
        plazos_fijos: [plazoFijo],
      })
      expect(result.plazos_fijos[0].tasaEfectivaAnualMinima).toBe(40.5)
    })

    it('sends the codigoEntidad filter when provided', async () => {
      const { regimen, request } = makeRegimen()
      request.mockResolvedValue(jsonResponse(plazosFijosPayload))
      await regimen.getPlazosFijos(11)
      expect(request).toHaveBeenCalledWith(
        'GET',
        '/transparencia/v1.0/PlazosFijos',
        { params: { codigoEntidad: 11 } },
      )
    })

    it('forwards the requested version', async () => {
      const { regimen, request } = makeRegimen()
      request.mockResolvedValue(jsonResponse(plazosFijosPayload))
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
      request.mockResolvedValue(jsonResponse(prestamosPrendariosPayload))
      const result = await regimen.getPrestamosPrendarios()
      expect(request).toHaveBeenCalledWith(
        'GET',
        '/transparencia/v1.0/Prestamos/Prendarios',
        { params: undefined },
      )
      expect(result).toEqual<ResultGetPrestamosPrendariosV1>({
        prestamos_prendarios: [prestamoPrendario],
      })
      expect(result.prestamos_prendarios[0].montoMaximoOtorgable).toBe(1000000)
    })

    it('sends the codigoEntidad filter when provided', async () => {
      const { regimen, request } = makeRegimen()
      request.mockResolvedValue(jsonResponse(prestamosPrendariosPayload))
      await regimen.getPrestamosPrendarios(11)
      expect(request).toHaveBeenCalledWith(
        'GET',
        '/transparencia/v1.0/Prestamos/Prendarios',
        { params: { codigoEntidad: 11 } },
      )
    })

    it('forwards the requested version', async () => {
      const { regimen, request } = makeRegimen()
      request.mockResolvedValue(jsonResponse(prestamosPrendariosPayload))
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
      request.mockResolvedValue(jsonResponse(prestamosHipotecariosPayload))
      const result = await regimen.getPrestamosHipotecarios()
      expect(request).toHaveBeenCalledWith(
        'GET',
        '/transparencia/v1.0/Prestamos/Hipotecarios',
        { params: undefined },
      )
      expect(result).toEqual<ResultGetPrestamosHipotecariosV1>({
        prestamos_hipotecarios: [prestamoHipotecario],
      })
      expect(result.prestamos_hipotecarios[0].plazoMaximoOtorgable).toBe(240)
    })

    it('sends the codigoEntidad filter when provided', async () => {
      const { regimen, request } = makeRegimen()
      request.mockResolvedValue(jsonResponse(prestamosHipotecariosPayload))
      await regimen.getPrestamosHipotecarios(11)
      expect(request).toHaveBeenCalledWith(
        'GET',
        '/transparencia/v1.0/Prestamos/Hipotecarios',
        { params: { codigoEntidad: 11 } },
      )
    })

    it('forwards the requested version', async () => {
      const { regimen, request } = makeRegimen()
      request.mockResolvedValue(jsonResponse(prestamosHipotecariosPayload))
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
      request.mockResolvedValue(jsonResponse(prestamosPersonalesPayload))
      const result = await regimen.getPrestamosPersonales()
      expect(request).toHaveBeenCalledWith(
        'GET',
        '/transparencia/v1.0/Prestamos/Personales',
        { params: undefined },
      )
      expect(result).toEqual<ResultGetPrestamosPersonalesV1>({
        prestamos_personales: [prestamoPersonal],
      })
      expect(result.prestamos_personales[0].tasaEfectivaAnualMaxima).toBe(60.5)
    })

    it('sends the codigoEntidad filter when provided', async () => {
      const { regimen, request } = makeRegimen()
      request.mockResolvedValue(jsonResponse(prestamosPersonalesPayload))
      await regimen.getPrestamosPersonales(11)
      expect(request).toHaveBeenCalledWith(
        'GET',
        '/transparencia/v1.0/Prestamos/Personales',
        { params: { codigoEntidad: 11 } },
      )
    })

    it('forwards the requested version', async () => {
      const { regimen, request } = makeRegimen()
      request.mockResolvedValue(jsonResponse(prestamosPersonalesPayload))
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
      request.mockResolvedValue(jsonResponse(tarjetasCreditoPayload))
      const result = await regimen.getTarjetasCredito()
      expect(request).toHaveBeenCalledWith(
        'GET',
        '/transparencia/v1.0/TarjetasCredito',
        { params: undefined },
      )
      expect(result).toEqual<ResultGetTarjetasCreditoV1>({
        tarjetas_credito: [tarjetaCredito],
      })
      expect(result.tarjetas_credito[0].segmento).toBe('MINORISTA')
    })

    it('sends the codigoEntidad filter when provided', async () => {
      const { regimen, request } = makeRegimen()
      request.mockResolvedValue(jsonResponse(tarjetasCreditoPayload))
      await regimen.getTarjetasCredito(11)
      expect(request).toHaveBeenCalledWith(
        'GET',
        '/transparencia/v1.0/TarjetasCredito',
        { params: { codigoEntidad: 11 } },
      )
    })

    it('forwards the requested version', async () => {
      const { regimen, request } = makeRegimen()
      request.mockResolvedValue(jsonResponse(tarjetasCreditoPayload))
      await regimen.getTarjetasCredito(undefined, { version: '1.0' })
      expect(request).toHaveBeenCalledWith(
        'GET',
        '/transparencia/v1.0/TarjetasCredito',
        { params: undefined },
      )
    })
  })
})
