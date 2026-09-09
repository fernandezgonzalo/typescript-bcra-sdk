/** Caja de ahorro ofrecida por una entidad. */
export interface CajaAhorro {
  readonly codigoEntidad: number
  readonly descripcionEntidad: string
  readonly fechaInformacion: string
  readonly procesoSimplificadoDebidaDiligencia: string
}

/** Respuesta de {@link RegimenDeTransparencia.getCajasAhorros}. */
export interface ResultGetCajasAhorrosV1 {
  readonly cajas_ahorros: readonly CajaAhorro[]
}

/** Deserializa la respuesta de `GET /transparencia/v1.0/CajasAhorros`. */
export function fromResultGetCajasAhorrosV1(
  data: unknown,
): ResultGetCajasAhorrosV1 {
  const items = data as unknown[]
  return {
    cajas_ahorros: items.map((d) => d as CajaAhorro),
  }
}

/** Paquete de productos ofrecido por una entidad. */
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

/** Respuesta de {@link RegimenDeTransparencia.getPaquetesProductos}. */
export interface ResultGetPaquetesProductosV1 {
  readonly paquetes_productos: readonly PaqueteProducto[]
}

/** Deserializa la respuesta de `GET /transparencia/v1.0/PaquetesProductos`. */
export function fromResultGetPaquetesProductosV1(
  data: unknown,
): ResultGetPaquetesProductosV1 {
  const items = data as unknown[]
  return {
    paquetes_productos: items.map((d) => d as PaqueteProducto),
  }
}

/** Plazo fijo ofrecido por una entidad. */
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

/** Respuesta de {@link RegimenDeTransparencia.getPlazosFijos}. */
export interface ResultGetPlazosFijosV1 {
  readonly plazos_fijos: readonly PlazoFijo[]
}

/** Deserializa la respuesta de `GET /transparencia/v1.0/PlazosFijos`. */
export function fromResultGetPlazosFijosV1(
  data: unknown,
): ResultGetPlazosFijosV1 {
  const items = data as unknown[]
  return {
    plazos_fijos: items.map((d) => d as PlazoFijo),
  }
}

/** Préstamo prendario ofrecido por una entidad. */
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

/** Respuesta de {@link RegimenDeTransparencia.getPrestamosPrendarios}. */
export interface ResultGetPrestamosPrendariosV1 {
  readonly prestamos_prendarios: readonly PrestamoPrendario[]
}

/** Deserializa la respuesta de `GET /transparencia/v1.0/Prestamos/Prendarios`. */
export function fromResultGetPrestamosPrendariosV1(
  data: unknown,
): ResultGetPrestamosPrendariosV1 {
  const items = data as unknown[]
  return {
    prestamos_prendarios: items.map((d) => d as PrestamoPrendario),
  }
}

/** Préstamo hipotecario ofrecido por una entidad. */
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

/** Respuesta de {@link RegimenDeTransparencia.getPrestamosHipotecarios}. */
export interface ResultGetPrestamosHipotecariosV1 {
  readonly prestamos_hipotecarios: readonly PrestamoHipotecario[]
}

/** Deserializa la respuesta de `GET /transparencia/v1.0/Prestamos/Hipotecarios`. */
export function fromResultGetPrestamosHipotecariosV1(
  data: unknown,
): ResultGetPrestamosHipotecariosV1 {
  const items = data as unknown[]
  return {
    prestamos_hipotecarios: items.map((d) => d as PrestamoHipotecario),
  }
}

/** Préstamo personal ofrecido por una entidad. */
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

/** Respuesta de {@link RegimenDeTransparencia.getPrestamosPersonales}. */
export interface ResultGetPrestamosPersonalesV1 {
  readonly prestamos_personales: readonly PrestamoPersonal[]
}

/** Deserializa la respuesta de `GET /transparencia/v1.0/Prestamos/Personales`. */
export function fromResultGetPrestamosPersonalesV1(
  data: unknown,
): ResultGetPrestamosPersonalesV1 {
  const items = data as unknown[]
  return {
    prestamos_personales: items.map((d) => d as PrestamoPersonal),
  }
}

/** Tarjeta de crédito ofrecida por una entidad. */
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

/** Respuesta de {@link RegimenDeTransparencia.getTarjetasCredito}. */
export interface ResultGetTarjetasCreditoV1 {
  readonly tarjetas_credito: readonly TarjetaCredito[]
}

/** Deserializa la respuesta de `GET /transparencia/v1.0/TarjetasCredito`. */
export function fromResultGetTarjetasCreditoV1(
  data: unknown,
): ResultGetTarjetasCreditoV1 {
  const items = data as unknown[]
  return {
    tarjetas_credito: items.map((d) => d as TarjetaCredito),
  }
}
