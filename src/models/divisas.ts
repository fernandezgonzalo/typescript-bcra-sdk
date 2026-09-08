export interface Divisa {
  readonly codigo: string
  readonly denominacion: string
}

export interface ResultGetDivisasV1 {
  readonly divisas: readonly Divisa[]
}

export function fromResultGetDivisasV1(data: unknown): ResultGetDivisasV1 {
  const items = data as unknown[]
  return {
    divisas: items.map((d) => d as Divisa),
  }
}
