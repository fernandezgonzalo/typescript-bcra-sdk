/** Entidad bancaria de la API de cheques denunciados. */
export interface EntidadBancaria {
  /** Código numérico de la entidad. */
  readonly codigoEntidad: number
  /** Denominación de la entidad. */
  readonly denominacion: string
}

/** Respuesta de {@link Cheques.getEntidades}. */
export interface ResultGetEntidadesV1 {
  /** Listado de entidades. */
  readonly entidades: readonly EntidadBancaria[]
}

/** Deserializa la respuesta de `GET /cheques/v1.0/entidades`. */
export function fromResultGetEntidadesV1(data: unknown): ResultGetEntidadesV1 {
  const items = data as unknown[]
  return {
    entidades: items.map((e) => e as EntidadBancaria),
  }
}
