import { fromResultGetCotizacionesV1 } from './cotizaciones.js'
import type { ResultGetCotizacionesV1 } from './cotizaciones.js'

/** Metadata de paginación que devuelve la API (`count/offset/limit`). */
export interface Resultset {
  /** Total de resultados disponibles. */
  readonly count: number
  /** Primer resultado devuelto. */
  readonly offset: number
  /** Cantidad máxima por página. */
  readonly limit: number
}

/** Respuesta de {@link EstadisticasCambiarias.getEvolucionMoneda}. */
export interface ResultGetEvolucionMonedaV1 {
  readonly resultset: Resultset
  /** Cotizaciones ordenadas por fecha. */
  readonly cotizaciones: readonly ResultGetCotizacionesV1[]
}

/** Deserializa la respuesta de `GET /estadisticascambiarias/v1.0/Cotizaciones/{moneda}`. */
export function fromResultGetEvolucionMonedaV1(
  data: unknown,
): ResultGetEvolucionMonedaV1 {
  const d = data as Record<string, unknown>
  const metadata = d.metadata as Record<string, unknown>
  const results = (d.results ?? []) as unknown[]
  return {
    resultset: metadata.resultset as Resultset,
    cotizaciones: results.map((c) => fromResultGetCotizacionesV1(c)),
  }
}
