export interface CajaAhorro {
  readonly codigoEntidad: number
  readonly descripcionEntidad: string
  readonly fechaInformacion: string
  readonly procesoSimplificadoDebidaDiligencia: string
}

export interface ResultGetCajasAhorrosV1 {
  readonly cajas_ahorros: readonly CajaAhorro[]
}

export function fromResultGetCajasAhorrosV1(
  data: unknown,
): ResultGetCajasAhorrosV1 {
  const items = data as unknown[]
  return {
    cajas_ahorros: items.map((d) => d as CajaAhorro),
  }
}

export interface PaqueteProducto {
  readonly codigoEntidad: number
  readonly descripcionEntidad: string
  readonly fechaInformacion: string
  readonly nombreCompleto: string
  readonly nombreCorto: string
  readonly comisionMaximaMantenimiento: number
  readonly ingresoMinimoMensual: number
  readonly antiguedadLaboralMinimaMeses: number
  readonly edadMaximaSolicitada: number
  readonly beneficiarios: string
  readonly segmento: string
  readonly productosIntegrantes: string
  readonly territorioValidez: string
  readonly masInformacion: string | null
}

export interface ResultGetPaquetesProductosV1 {
  readonly paquetes_productos: readonly PaqueteProducto[]
}

export function fromResultGetPaquetesProductosV1(
  data: unknown,
): ResultGetPaquetesProductosV1 {
  const items = data as unknown[]
  return {
    paquetes_productos: items.map((d) => d as PaqueteProducto),
  }
}

export interface PlazoFijo {
  readonly codigoEntidad: number
  readonly descripcionEntidad: string
  readonly fechaInformacion: string
  readonly nombreCompleto: string
  readonly nombreCorto: string
  readonly denominacion: string | null
  readonly montoMinimoInvertir: number
  readonly plazoMinimoInvertirDias: number
  readonly canalConstitucion: string
  readonly tasaEfectivaAnualMinima: number
  readonly territorioValidez: string
  readonly masInformacion: string | null
}

export interface ResultGetPlazosFijosV1 {
  readonly plazos_fijos: readonly PlazoFijo[]
}

export function fromResultGetPlazosFijosV1(
  data: unknown,
): ResultGetPlazosFijosV1 {
  const items = data as unknown[]
  return {
    plazos_fijos: items.map((d) => d as PlazoFijo),
  }
}

export interface PrestamoPrendario {
  readonly relacionMontoTasacion: number
  readonly destinoFondos: string
  readonly montoMinimoOtorgable: number
  readonly denominacion: string
  readonly montoMaximoOtorgable: number
  readonly plazoMaximoOtorgable: number
  readonly ingresoMinimoMensual: number
  readonly antiguedadLaboralMinimaMeses: number
  readonly edadMaximaSolicitada: number
  readonly relacionCuotaIngreso: number
  readonly beneficiario: string
  readonly cargoMaximoCancelacionAnticipada: number
  readonly tasaEfectivaAnualMaxima: number
  readonly tipoTasa: string
  readonly costoFinancieroEfectivoTotalMaximo: number
  readonly cuotaInicial: number
  readonly codigoEntidad: number
  readonly descripcionEntidad: string
  readonly fechaInformacion: string
  readonly nombreCompleto: string
  readonly nombreCorto: string
  readonly territorioValidez: string
  readonly masInformacion: string | null
}

export interface ResultGetPrestamosPrendariosV1 {
  readonly prestamos_prendarios: readonly PrestamoPrendario[]
}

export function fromResultGetPrestamosPrendariosV1(
  data: unknown,
): ResultGetPrestamosPrendariosV1 {
  const items = data as unknown[]
  return {
    prestamos_prendarios: items.map((d) => d as PrestamoPrendario),
  }
}

export interface PrestamoHipotecario {
  readonly relacionMontoTasacion: number
  readonly destinoFondos: string
  readonly denominacion: string
  readonly montoMaximoOtorgable: number
  readonly plazoMaximoOtorgable: number
  readonly ingresoMinimoMensual: number
  readonly antiguedadLaboralMinimaMeses: number
  readonly edadMaximaSolicitada: number
  readonly relacionCuotaIngreso: number
  readonly beneficiario: string
  readonly cargoMaximoCancelacionAnticipada: number
  readonly tasaEfectivaAnualMaxima: number
  readonly tipoTasa: string
  readonly costoFinancieroEfectivoTotalMaximo: number
  readonly cuotaInicial: number
  readonly codigoEntidad: number
  readonly descripcionEntidad: string
  readonly fechaInformacion: string
  readonly nombreCompleto: string
  readonly nombreCorto: string
  readonly territorioValidez: string
  readonly masInformacion: string | null
}

export interface ResultGetPrestamosHipotecariosV1 {
  readonly prestamos_hipotecarios: readonly PrestamoHipotecario[]
}

export function fromResultGetPrestamosHipotecariosV1(
  data: unknown,
): ResultGetPrestamosHipotecariosV1 {
  const items = data as unknown[]
  return {
    prestamos_hipotecarios: items.map((d) => d as PrestamoHipotecario),
  }
}

export interface PrestamoPersonal {
  readonly montoMinimoOtorgable: number
  readonly denominacion: string
  readonly montoMaximoOtorgable: number
  readonly plazoMaximoOtorgable: number
  readonly ingresoMinimoMensual: number
  readonly antiguedadLaboralMinimaMeses: number
  readonly edadMaximaSolicitada: number
  readonly relacionCuotaIngreso: number
  readonly beneficiario: string
  readonly cargoMaximoCancelacionAnticipada: number
  readonly tasaEfectivaAnualMaxima: number
  readonly tipoTasa: string
  readonly costoFinancieroEfectivoTotalMaximo: number
  readonly cuotaInicial: number
  readonly codigoEntidad: number
  readonly descripcionEntidad: string
  readonly fechaInformacion: string
  readonly nombreCompleto: string
  readonly nombreCorto: string
  readonly territorioValidez: string
  readonly masInformacion: string | null
}

export interface ResultGetPrestamosPersonalesV1 {
  readonly prestamos_personales: readonly PrestamoPersonal[]
}

export function fromResultGetPrestamosPersonalesV1(
  data: unknown,
): ResultGetPrestamosPersonalesV1 {
  const items = data as unknown[]
  return {
    prestamos_personales: items.map((d) => d as PrestamoPersonal),
  }
}

export interface TarjetaCredito {
  readonly comisionMaximaAdministracionMantenimiento: number
  readonly comisionMaximaRenovacion: number
  readonly tasaEfectivaAnualMaximaFinanciacion: number
  readonly tasaEfectivaAnualMaximaAdelantoEfectivo: number
  readonly ingresoMinimoMensual: number
  readonly antiguedadLaboralMinimaMeses: number
  readonly edadMaximaSolicitada: number
  readonly segmento: string
  readonly codigoEntidad: number
  readonly descripcionEntidad: string
  readonly fechaInformacion: string
  readonly nombreCompleto: string
  readonly nombreCorto: string
  readonly territorioValidez: string
  readonly masInformacion: string | null
}

export interface ResultGetTarjetasCreditoV1 {
  readonly tarjetas_credito: readonly TarjetaCredito[]
}

export function fromResultGetTarjetasCreditoV1(
  data: unknown,
): ResultGetTarjetasCreditoV1 {
  const items = data as unknown[]
  return {
    tarjetas_credito: items.map((d) => d as TarjetaCredito),
  }
}
