/** Divisa del maestro de monedas. */
export interface Divisa {
  /** Código ISO de la divisa (p.ej. `ARS`). */
  readonly codigo: string
  /** Denominación (p.ej. `PESO`). */
  readonly denominacion: string
}

/** Respuesta de {@link EstadisticasCambiarias.getDivisas}. */
export interface ResultGetDivisasV1 {
  /** Listado de divisas. */
  readonly divisas: readonly Divisa[]
}

/** Deserializa la respuesta de `GET /estadisticascambiarias/v1.0/Maestros/Divisas`. */
export function fromResultGetDivisasV1(data: unknown): ResultGetDivisasV1 {
  const items = data as unknown[]
  return {
    divisas: items.map((d) => d as Divisa),
  }
}
