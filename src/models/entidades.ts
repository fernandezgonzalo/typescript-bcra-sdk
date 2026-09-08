export interface EntidadBancaria {
  readonly codigoEntidad: number
  readonly denominacion: string
}

export interface ResultGetEntidadesV1 {
  readonly entidades: readonly EntidadBancaria[]
}

export function fromResultGetEntidadesV1(data: unknown): ResultGetEntidadesV1 {
  const items = data as unknown[]
  return {
    entidades: items.map((e) => e as EntidadBancaria),
  }
}
