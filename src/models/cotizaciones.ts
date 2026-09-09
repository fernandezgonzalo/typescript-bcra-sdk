/** Cotización de una moneda contra el peso. */
export interface Cotizacion {
  /** Código de la moneda (p.ej. `EUR`). */
  readonly codigoMoneda: string
  /** Descripción de la moneda. */
  readonly descripcion: string
  /** Tipo de pase / referencia. */
  readonly tipoPase: number
  /** Cotización (pesos por unidad). */
  readonly tipoCotizacion: number
}

/** Respuesta de {@link EstadisticasCambiarias.getCotizaciones}. */
export interface ResultGetCotizacionesV1 {
  /** Fecha de la cotización (`YYYY-MM-DD`), si viene. */
  readonly fecha: string | null
  /** Cotizaciones por moneda. */
  readonly detalle: readonly Cotizacion[]
}

/** Deserializa el payload de cotizaciones de `GET /estadisticascambiarias/v1.0/Cotizaciones{...}`. */
export function fromResultGetCotizacionesV1(
  data: unknown,
): ResultGetCotizacionesV1 {
  const d = data as Record<string, unknown>
  const detalle = (d.detalle ?? []) as unknown[]
  return {
    fecha: d.fecha as string | null,
    detalle: detalle.map((c) => c as Cotizacion),
  }
}
