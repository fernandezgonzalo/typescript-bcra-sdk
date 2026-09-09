import type { Resultset } from './evolucion.js'

/** Metodología de cálculo de una variable monetaria. */
export interface Metodologia {
  /** ID de la variable. */
  readonly id: number
  /** Detalle de la metodología. */
  readonly detalle: string
}

/** Respuesta de {@link Monetarias.getMetodologias}. */
export interface ResultGetMetodologiasV1 {
  readonly resultset: Resultset
  /** Listado de metodologías. */
  readonly metodologias: readonly Metodologia[]
}

/** Deserializa la respuesta de `GET /estadisticas/v4.0/metodologia`. */
export function fromResultGetMetodologiasV1(
  data: unknown,
): ResultGetMetodologiasV1 {
  const d = data as Record<string, unknown>
  const metadata = d.metadata as Record<string, unknown>
  const results = (d.results ?? []) as unknown[]
  return {
    resultset: metadata.resultset as Resultset,
    metodologias: results.map((m) => m as Metodologia),
  }
}

/** Respuesta de {@link Monetarias.getMetodologia}. */
export interface ResultGetMetodologiaV1 {
  readonly metodologia: Metodologia
}

/** Deserializa la respuesta de `GET /estadisticas/v4.0/metodologia/{idVariable}`. */
export function fromResultGetMetodologiaV1(
  data: unknown,
): ResultGetMetodologiaV1 {
  const d = data as Record<string, unknown>
  const results = (d.results ?? []) as unknown[]
  return {
    metodologia: results[0] as Metodologia,
  }
}

/** Variable monetaria (principales variables del BCRA). */
export interface VariableMonetaria {
  readonly idVariable: number
  /** Descripción de la variable. */
  readonly descripcion: string
  /** Categoría económica. */
  readonly categoria: string
  /** Tipo de serie. */
  readonly tipoSerie: string
  /** Periodicidad de la serie. */
  readonly periodicidad: string
  /** Unidad de expresión del valor. */
  readonly unidadExpresion: string
  /** Moneda del valor. */
  readonly moneda: string
  /** Primer fecha informada. */
  readonly primerFechaInformada: string
  /** Última fecha informada. */
  readonly ultFechaInformada: string
  /** Último valor informado. */
  readonly ultValorInformado: number
}

/** Un punto de la serie (fecha, valor). */
export interface PuntoSerie {
  /** Fecha del punto (`YYYY-MM-DD`). */
  readonly fecha: string
  /** Valor de la variable en esa fecha. */
  readonly valor: number
}

/** Serie histórica de una variable. */
export interface SerieMonetaria {
  readonly idVariable: number
  /** Puntos de la serie. */
  readonly detalle: readonly PuntoSerie[]
}

/** Respuesta de {@link Monetarias.getEvolucionVariable}. */
export interface ResultGetEvolucionVariableV1 {
  readonly resultset: Resultset
  /** Series por variable. */
  readonly series: readonly SerieMonetaria[]
}

/** Deserializa la respuesta de `GET /estadisticas/v4.0/monetarias/{idVariable}`. */
export function fromResultGetEvolucionVariableV1(
  data: unknown,
): ResultGetEvolucionVariableV1 {
  const d = data as Record<string, unknown>
  const metadata = d.metadata as Record<string, unknown>
  const results = (d.results ?? []) as unknown[]
  return {
    resultset: metadata.resultset as Resultset,
    series: results.map((s) => {
      const rec = s as Record<string, unknown>
      const detalle = (rec.detalle ?? []) as unknown[]
      return {
        idVariable: rec.idVariable as number,
        detalle: detalle.map((p) => p as PuntoSerie),
      }
    }),
  }
}

/** Respuesta de {@link Monetarias.getMonetarias}. */
export interface ResultGetMonetariasV1 {
  readonly resultset: Resultset
  /** Variables monetarias disponibles. */
  readonly variables: readonly VariableMonetaria[]
}

/** Deserializa la respuesta de `GET /estadisticas/v4.0/monetarias`. */
export function fromResultGetMonetariasV1(
  data: unknown,
): ResultGetMonetariasV1 {
  const d = data as Record<string, unknown>
  const metadata = d.metadata as Record<string, unknown>
  const results = (d.results ?? []) as unknown[]
  return {
    resultset: metadata.resultset as Resultset,
    variables: results.map((v) => v as VariableMonetaria),
  }
}
