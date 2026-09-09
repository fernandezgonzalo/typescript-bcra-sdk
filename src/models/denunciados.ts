/** Detalle de una denuncia de cheque. */
export interface DetalleDenuncia {
  /** Entidad sucursal que reportó el cheque. */
  readonly sucursal: number
  /** Número de cuenta asociada al cheque. */
  readonly numeroCuenta: number
  /** Causal de la denuncia (p.ej. `Denunciado por tercero`). */
  readonly causal: string
}

/** Respuesta de {@link Cheques.getChequeDenunciado}. */
export interface ResultGetChequeDenunciadoV1 {
  /** Número del cheque consultado. */
  readonly numeroCheque: number
  /** `true` si el cheque fue denunciado. */
  readonly denunciado: boolean
  /** Fecha de procesamiento de la denuncia (`YYYY-MM-DD`). */
  readonly fechaProcesamiento: string
  /** Nombre de la entidad que reporta. */
  readonly denominacionEntidad: string
  /** Detalles de la denuncia. */
  readonly detalles: readonly DetalleDenuncia[]
}

/** Deserializa la respuesta de `GET /cheques/v1.0/denunciados/{...}`. */
export function fromResultGetChequeDenunciadoV1(
  data: unknown,
): ResultGetChequeDenunciadoV1 {
  const d = data as Record<string, unknown>
  const detalles = (d.detalles ?? []) as unknown[]
  return {
    numeroCheque: d.numeroCheque as number,
    denunciado: d.denunciado as boolean,
    fechaProcesamiento: d.fechaProcesamiento as string,
    denominacionEntidad: d.denominacionEntidad as string,
    detalles: detalles.map((dd) => dd as DetalleDenuncia),
  }
}
