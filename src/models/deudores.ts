export interface Entidad {
  readonly entidad: string
  readonly situacion: string
  readonly fechaSit1: string
  readonly monto: number
  readonly diasAtrasoPago: number
  readonly refinanciaciones: boolean
  readonly recategorizacionOblig: boolean
  readonly situacionJuridica: boolean
  readonly irrecDisposicionTecnica: boolean
  readonly enRevision: boolean
  readonly procesoJud: boolean
}

export interface Periodo {
  readonly periodo: string
  readonly entidades: readonly Entidad[]
}

export function fromPeriodo(data: unknown): Periodo {
  const d = data as Record<string, unknown>
  const entidades = (d.entidades ?? []) as unknown[]
  return {
    periodo: d.periodo as string,
    entidades: entidades.map((e) => e as Entidad),
  }
}

export interface ResultGetDeudasV1 {
  readonly identificacion: number
  readonly denominacion: string
  readonly periodos: readonly Periodo[]
}

export function fromResultGetDeudasV1(data: unknown): ResultGetDeudasV1 {
  const d = data as Record<string, unknown>
  const periodos = (d.periodos ?? []) as unknown[]
  return {
    identificacion: d.identificacion as number,
    denominacion: d.denominacion as string,
    periodos: periodos.map((p) => fromPeriodo(p)),
  }
}

export interface EntidadHistorica {
  readonly entidad: string
  readonly situacion: number
  readonly monto: number
  readonly enRevision: boolean
  readonly procesoJud: boolean
}

export interface PeriodoHistorica {
  readonly periodo: string
  readonly entidades: readonly EntidadHistorica[]
}

export function fromPeriodoHistorica(data: unknown): PeriodoHistorica {
  const d = data as Record<string, unknown>
  const entidades = (d.entidades ?? []) as unknown[]
  return {
    periodo: d.periodo as string,
    entidades: entidades.map((e) => e as EntidadHistorica),
  }
}

export interface ResultGetDeudasHistoricasV1 {
  readonly identificacion: string
  readonly denominacion: string
  readonly periodos: readonly PeriodoHistorica[]
}

export function fromResultGetDeudasHistoricasV1(
  data: unknown,
): ResultGetDeudasHistoricasV1 {
  const d = data as Record<string, unknown>
  const periodos = (d.periodos ?? []) as unknown[]
  return {
    identificacion: d.identificacion as string,
    denominacion: d.denominacion as string,
    periodos: periodos.map((p) => fromPeriodoHistorica(p)),
  }
}
