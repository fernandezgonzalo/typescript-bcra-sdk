import { fromResultGetCotizacionesV1 } from './cotizaciones.js'
import type { ResultGetCotizacionesV1 } from './cotizaciones.js'

export interface Resultset {
  readonly count: number
  readonly offset: number
  readonly limit: number
}

export interface ResultGetEvolucionMonedaV1 {
  readonly resultset: Resultset
  readonly cotizaciones: readonly ResultGetCotizacionesV1[]
}

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
