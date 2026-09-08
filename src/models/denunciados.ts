export interface DetalleDenuncia {
  readonly sucursal: number
  readonly numeroCuenta: number
  readonly causal: string
}

export interface ResultGetChequeDenunciadoV1 {
  readonly numeroCheque: number
  readonly denunciado: boolean
  readonly fechaProcesamiento: string
  readonly denominacionEntidad: string
  readonly detalles: readonly DetalleDenuncia[]
}

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
