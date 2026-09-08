export interface DetalleCheque {
  readonly nroCheque: number
  readonly fechaRechazo: string
  readonly monto: number
  readonly fechaPago: string | null
  readonly fechaPagoMulta: string | null
  readonly estadoMulta: string | null
  readonly ctaPersonal: boolean
  readonly denomJuridica: string | null
  readonly enRevision: boolean
  readonly procesoJud: boolean
}

export interface EntidadCheque {
  readonly entidad: number
  readonly detalle: readonly DetalleCheque[]
}

export function fromEntidadCheque(data: unknown): EntidadCheque {
  const d = data as Record<string, unknown>
  const detalle = (d.detalle ?? []) as unknown[]
  return {
    entidad: d.entidad as number,
    detalle: detalle.map((e) => e as DetalleCheque),
  }
}

export interface Causal {
  readonly causal: string
  readonly entidades: readonly EntidadCheque[]
}

export function fromCausal(data: unknown): Causal {
  const d = data as Record<string, unknown>
  const entidades = (d.entidades ?? []) as unknown[]
  return {
    causal: d.causal as string,
    entidades: entidades.map((e) => fromEntidadCheque(e)),
  }
}

export interface ResultGetChequesRechazadosV1 {
  readonly identificacion: number
  readonly causales: readonly Causal[]
}

export function fromResultGetChequesRechazadosV1(
  data: unknown,
): ResultGetChequesRechazadosV1 {
  const d = data as Record<string, unknown>
  const causales = (d.causales ?? []) as unknown[]
  return {
    identificacion: d.identificacion as number,
    causales: causales.map((c) => fromCausal(c)),
  }
}
