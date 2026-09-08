import type { Resultset } from './evolucion.js'

export interface Metodologia {
  readonly id: number
  readonly detalle: string
}

export interface ResultGetMetodologiasV1 {
  readonly resultset: Resultset
  readonly metodologias: readonly Metodologia[]
}

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

export interface ResultGetMetodologiaV1 {
  readonly metodologia: Metodologia
}

export function fromResultGetMetodologiaV1(
  data: unknown,
): ResultGetMetodologiaV1 {
  const d = data as Record<string, unknown>
  const results = (d.results ?? []) as unknown[]
  return {
    metodologia: results[0] as Metodologia,
  }
}

export interface VariableMonetaria {
  readonly idVariable: number
  readonly descripcion: string
  readonly categoria: string
  readonly tipoSerie: string
  readonly periodicidad: string
  readonly unidadExpresion: string
  readonly moneda: string
  readonly primerFechaInformada: string
  readonly ultFechaInformada: string
  readonly ultValorInformado: number
}

export interface PuntoSerie {
  readonly fecha: string
  readonly valor: number
}

export interface SerieMonetaria {
  readonly idVariable: number
  readonly detalle: readonly PuntoSerie[]
}

export interface ResultGetEvolucionVariableV1 {
  readonly resultset: Resultset
  readonly series: readonly SerieMonetaria[]
}

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

export interface ResultGetMonetariasV1 {
  readonly resultset: Resultset
  readonly variables: readonly VariableMonetaria[]
}

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
