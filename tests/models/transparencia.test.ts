import { describe, it, expect } from 'vitest'
import {
  fromResultGetCajasAhorrosV1,
  fromResultGetPaquetesProductosV1,
  fromResultGetPlazosFijosV1,
  fromResultGetPrestamosPrendariosV1,
  fromResultGetPrestamosHipotecariosV1,
  fromResultGetPrestamosPersonalesV1,
  fromResultGetTarjetasCreditoV1,
  type CajaAhorro,
  type PaqueteProducto,
  type PlazoFijo,
  type PrestamoPrendario,
  type PrestamoHipotecario,
  type PrestamoPersonal,
  type TarjetaCredito,
} from '../../src/models/transparencia'

describe('fromResultGetCajasAhorrosV1', () => {
  const caja: CajaAhorro = {
    codigoEntidad: 11,
    descripcionEntidad: 'BANCO NACION',
    fechaInformacion: '2024-08-01',
    procesoSimplificadoDebidaDiligencia: 'SI',
  }

  it('parses a list of cajas de ahorro', () => {
    const result = fromResultGetCajasAhorrosV1([caja])
    expect(result).toEqual({ cajas_ahorros: [caja] })
  })

  it('parses an empty list', () => {
    const result = fromResultGetCajasAhorrosV1([])
    expect(result.cajas_ahorros).toEqual([])
  })
})

describe('fromResultGetPaquetesProductosV1', () => {
  const paquete: PaqueteProducto = {
    codigoEntidad: 11,
    descripcionEntidad: 'BANCO NACION',
    fechaInformacion: '2024-08-01',
    nombreCompleto: 'PAQUETE PREMIUM',
    nombreCorto: 'PREMIUM',
    comisionMaximaMantenimiento: 0,
    ingresoMinimoMensual: 1000000,
    antiguedadLaboralMinimaMeses: 6,
    edadMaximaSolicitada: 65,
    beneficiarios: 'TITULAR',
    segmento: 'PERSONAS',
    productosIntegrantes: 'CAJA DE AHORRO, TARJETA',
    territorioValidez: 'TODO EL PAIS',
    masInformacion: null,
  }

  it('parses a list of paquetes de productos', () => {
    const result = fromResultGetPaquetesProductosV1([paquete])
    expect(result).toEqual({ paquetes_productos: [paquete] })
    expect(result.paquetes_productos[0].masInformacion).toBeNull()
  })

  it('parses an empty list', () => {
    const result = fromResultGetPaquetesProductosV1([])
    expect(result.paquetes_productos).toEqual([])
  })
})

describe('fromResultGetPlazosFijosV1', () => {
  const plazo: PlazoFijo = {
    codigoEntidad: 11,
    descripcionEntidad: 'BANCO NACION',
    fechaInformacion: '2024-08-01',
    nombreCompleto: 'PLAZO FIJO TRADICIONAL',
    nombreCorto: 'PF TRADICIONAL',
    denominacion: null,
    montoMinimoInvertir: 10000,
    plazoMinimoInvertirDias: 30,
    canalConstitucion: 'WEB',
    tasaEfectivaAnualMinima: 35.5,
    territorioValidez: 'TODO EL PAIS',
    masInformacion: 'https://ejemplo.com/plazo-fijo',
  }

  it('parses a list of plazos fijos', () => {
    const result = fromResultGetPlazosFijosV1([plazo])
    expect(result).toEqual({ plazos_fijos: [plazo] })
    expect(result.plazos_fijos[0].denominacion).toBeNull()
  })

  it('parses an empty list', () => {
    const result = fromResultGetPlazosFijosV1([])
    expect(result.plazos_fijos).toEqual([])
  })
})

describe('fromResultGetPrestamosPrendariosV1', () => {
  const prestamo: PrestamoPrendario = {
    relacionMontoTasacion: 80,
    destinoFondos: 'COMPRA DE VEHICULO',
    montoMinimoOtorgable: 500000,
    denominacion: 'PRENDARIO AUTO',
    montoMaximoOtorgable: 50000000,
    plazoMaximoOtorgable: 72,
    ingresoMinimoMensual: 300000,
    antiguedadLaboralMinimaMeses: 6,
    edadMaximaSolicitada: 65,
    relacionCuotaIngreso: 30,
    beneficiario: 'TITULAR',
    cargoMaximoCancelacionAnticipada: 5,
    tasaEfectivaAnualMaxima: 45,
    tipoTasa: 'FIJA',
    costoFinancieroEfectivoTotalMaximo: 55,
    cuotaInicial: 0,
    codigoEntidad: 11,
    descripcionEntidad: 'BANCO NACION',
    fechaInformacion: '2024-08-01',
    nombreCompleto: 'PRENDARIO AUTO',
    nombreCorto: 'PRENDARIO',
    territorioValidez: 'TODO EL PAIS',
    masInformacion: null,
  }

  it('parses a list of prestamos prendarios', () => {
    const result = fromResultGetPrestamosPrendariosV1([prestamo])
    expect(result).toEqual({ prestamos_prendarios: [prestamo] })
  })

  it('parses an empty list', () => {
    const result = fromResultGetPrestamosPrendariosV1([])
    expect(result.prestamos_prendarios).toEqual([])
  })
})

describe('fromResultGetPrestamosHipotecariosV1', () => {
  const prestamo: PrestamoHipotecario = {
    relacionMontoTasacion: 75,
    destinoFondos: 'COMPRA DE VIVIENDA',
    denominacion: 'HIPOTECARIO',
    montoMaximoOtorgable: 150000000,
    plazoMaximoOtorgable: 360,
    ingresoMinimoMensual: 500000,
    antiguedadLaboralMinimaMeses: 12,
    edadMaximaSolicitada: 65,
    relacionCuotaIngreso: 25,
    beneficiario: 'TITULAR',
    cargoMaximoCancelacionAnticipada: 5,
    tasaEfectivaAnualMaxima: 30,
    tipoTasa: 'AJUSTABLE',
    costoFinancieroEfectivoTotalMaximo: 35,
    cuotaInicial: 20,
    codigoEntidad: 11,
    descripcionEntidad: 'BANCO NACION',
    fechaInformacion: '2024-08-01',
    nombreCompleto: 'HIPOTECARIO',
    nombreCorto: 'HIPOTECARIO',
    territorioValidez: 'TODO EL PAIS',
    masInformacion: 'https://ejemplo.com/hipotecario',
  }

  it('parses a list of prestamos hipotecarios', () => {
    const result = fromResultGetPrestamosHipotecariosV1([prestamo])
    expect(result).toEqual({ prestamos_hipotecarios: [prestamo] })
  })

  it('parses an empty list', () => {
    const result = fromResultGetPrestamosHipotecariosV1([])
    expect(result.prestamos_hipotecarios).toEqual([])
  })
})

describe('fromResultGetPrestamosPersonalesV1', () => {
  const prestamo: PrestamoPersonal = {
    montoMinimoOtorgable: 100000,
    denominacion: 'PERSONAL',
    montoMaximoOtorgable: 10000000,
    plazoMaximoOtorgable: 60,
    ingresoMinimoMensual: 150000,
    antiguedadLaboralMinimaMeses: 3,
    edadMaximaSolicitada: 65,
    relacionCuotaIngreso: 35,
    beneficiario: 'TITULAR',
    cargoMaximoCancelacionAnticipada: 3,
    tasaEfectivaAnualMaxima: 60,
    tipoTasa: 'FIJA',
    costoFinancieroEfectivoTotalMaximo: 70,
    cuotaInicial: 0,
    codigoEntidad: 11,
    descripcionEntidad: 'BANCO NACION',
    fechaInformacion: '2024-08-01',
    nombreCompleto: 'PERSONAL',
    nombreCorto: 'PERSONAL',
    territorioValidez: 'TODO EL PAIS',
    masInformacion: null,
  }

  it('parses a list of prestamos personales', () => {
    const result = fromResultGetPrestamosPersonalesV1([prestamo])
    expect(result).toEqual({ prestamos_personales: [prestamo] })
  })

  it('parses an empty list', () => {
    const result = fromResultGetPrestamosPersonalesV1([])
    expect(result.prestamos_personales).toEqual([])
  })
})

describe('fromResultGetTarjetasCreditoV1', () => {
  const tarjeta: TarjetaCredito = {
    comisionMaximaAdministracionMantenimiento: 5000,
    comisionMaximaRenovacion: 4000,
    tasaEfectivaAnualMaximaFinanciacion: 75,
    tasaEfectivaAnualMaximaAdelantoEfectivo: 85,
    ingresoMinimoMensual: 200000,
    antiguedadLaboralMinimaMeses: 6,
    edadMaximaSolicitada: 65,
    segmento: 'PERSONAS',
    codigoEntidad: 11,
    descripcionEntidad: 'BANCO NACION',
    fechaInformacion: '2024-08-01',
    nombreCompleto: 'VISA PREMIUM',
    nombreCorto: 'VISA PREMIUM',
    territorioValidez: 'TODO EL PAIS',
    masInformacion: null,
  }

  it('parses a list of tarjetas de credito', () => {
    const result = fromResultGetTarjetasCreditoV1([tarjeta])
    expect(result).toEqual({ tarjetas_credito: [tarjeta] })
  })

  it('parses an empty list', () => {
    const result = fromResultGetTarjetasCreditoV1([])
    expect(result.tarjetas_credito).toEqual([])
  })
})
