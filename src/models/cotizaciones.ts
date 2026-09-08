export interface Cotizacion {
  readonly codigoMoneda: string
  readonly descripcion: string
  readonly tipoPase: number
  readonly tipoCotizacion: number
}

export interface ResultGetCotizacionesV1 {
  readonly fecha: string | null
  readonly detalle: readonly Cotizacion[]
}

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
