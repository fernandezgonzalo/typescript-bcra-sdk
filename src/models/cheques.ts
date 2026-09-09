/** Detalle de un cheque rechazado. */
export interface DetalleCheque {
  /** Número del cheque. */
  readonly nroCheque: number
  /** Fecha de rechazo (`YYYY-MM-DD`). */
  readonly fechaRechazo: string
  /** Monto del cheque. */
  readonly monto: number
  /** Fecha de pago posterior al rechazo, si existe. */
  readonly fechaPago: string | null
  /** Fecha de pago de multa, si existe. */
  readonly fechaPagoMulta: string | null
  /** Estado de la multa, si aplica. */
  readonly estadoMulta: string | null
  /** `true` si corresponde a cuenta personal. */
  readonly ctaPersonal: boolean
  /** Razón jurídica denunciante, si existe. */
  readonly denomJuridica: string | null
  /** `true` si está en revisión. */
  readonly enRevision: boolean
  /** `true` si tiene proceso judicial. */
  readonly procesoJud: boolean
}

/** Cheques rechazados agrupados por entidad. */
export interface EntidadCheque {
  /** Código de la entidad emisora. */
  readonly entidad: number
  /** Cheques rechazados de esa entidad. */
  readonly detalle: readonly DetalleCheque[]
}

/** Deserializa una {@link EntidadCheque}. */
export function fromEntidadCheque(data: unknown): EntidadCheque {
  const d = data as Record<string, unknown>
  const detalle = (d.detalle ?? []) as unknown[]
  return {
    entidad: d.entidad as number,
    detalle: detalle.map((e) => e as DetalleCheque),
  }
}

/** Cheques rechazados por causal. */
export interface Causal {
  /** Descripción de la causal. */
  readonly causal: string
  /** Entidades involucradas en esa causal. */
  readonly entidades: readonly EntidadCheque[]
}

/** Deserializa una {@link Causal}. */
export function fromCausal(data: unknown): Causal {
  const d = data as Record<string, unknown>
  const entidades = (d.entidades ?? []) as unknown[]
  return {
    causal: d.causal as string,
    entidades: entidades.map((e) => fromEntidadCheque(e)),
  }
}

/** Respuesta de {@link Deudores.getChequesRechazados}. */
export interface ResultGetChequesRechazadosV1 {
  /** Identificación (CUIT) consultada. */
  readonly identificacion: number
  /** Causales con los cheques rechazados. */
  readonly causales: readonly Causal[]
}

/** Deserializa la respuesta de `GET /centraldedeudores/v1.0/Deudas/ChequesRechazados/{id}`. */
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
