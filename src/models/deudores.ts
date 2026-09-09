/** Situación de deuda ante una entidad en un período. */
export interface Entidad {
  /** Denominación de la entidad. */
  readonly entidad: string
  /** Situación del deudor. */
  readonly situacion: string
  /** Fecha de la situación. */
  readonly fechaSit1: string
  /** Monto de la deuda. */
  readonly monto: number
  /** Días de atraso en el pago. */
  readonly diasAtrasoPago: number
  /** `true` si hubo refinanciaciones. */
  readonly refinanciaciones: boolean
  /** `true` si hubo recategorización obligatoria. */
  readonly recategorizacionOblig: boolean
  /** `true` si existe situación jurídica. */
  readonly situacionJuridica: boolean
  /** `true` si es irrecuperable por disposición técnica. */
  readonly irrecDisposicionTecnica: boolean
  /** `true` si está en revisión. */
  readonly enRevision: boolean
  /** `true` si tiene proceso judicial. */
  readonly procesoJud: boolean
}

/** Deudas de una identificación en un período contable. */
export interface Periodo {
  /** Período contable (`AAAA-MM`). */
  readonly periodo: string
  /** Situaciones por entidad. */
  readonly entidades: readonly Entidad[]
}

/** Deserializa un {@link Periodo}. */
export function fromPeriodo(data: unknown): Periodo {
  const d = data as Record<string, unknown>
  const entidades = (d.entidades ?? []) as unknown[]
  return {
    periodo: d.periodo as string,
    entidades: entidades.map((e) => e as Entidad),
  }
}

/** Respuesta de {@link Deudores.getDeudas}. */
export interface ResultGetDeudasV1 {
  /** Identificación (CUIT) consultada. */
  readonly identificacion: number
  /** Denominación del deudor. */
  readonly denominacion: string
  /** Períodos con deuda. */
  readonly periodos: readonly Periodo[]
}

/** Deserializa la respuesta de `GET /centraldedeudores/v1.0/Deudas/{cuit}`. */
export function fromResultGetDeudasV1(data: unknown): ResultGetDeudasV1 {
  const d = data as Record<string, unknown>
  const periodos = (d.periodos ?? []) as unknown[]
  return {
    identificacion: d.identificacion as number,
    denominacion: d.denominacion as string,
    periodos: periodos.map((p) => fromPeriodo(p)),
  }
}

/** Situación histórica ante una entidad. */
export interface EntidadHistorica {
  /** Denominación de la entidad. */
  readonly entidad: string
  /** Situación del deudor. */
  readonly situacion: number
  /** Monto de la deuda. */
  readonly monto: number
  /** `true` si está en revisión. */
  readonly enRevision: boolean
  /** `true` si tiene proceso judicial. */
  readonly procesoJud: boolean
}

/** Historial de deudas en un período contable. */
export interface PeriodoHistorica {
  /** Período contable (`AAAA-MM`). */
  readonly periodo: string
  /** Situaciones por entidad. */
  readonly entidades: readonly EntidadHistorica[]
}

/** Deserializa un {@link PeriodoHistorica}. */
export function fromPeriodoHistorica(data: unknown): PeriodoHistorica {
  const d = data as Record<string, unknown>
  const entidades = (d.entidades ?? []) as unknown[]
  return {
    periodo: d.periodo as string,
    entidades: entidades.map((e) => e as EntidadHistorica),
  }
}

/** Respuesta de {@link Deudores.getDeudasHistoricas}. */
export interface ResultGetDeudasHistoricasV1 {
  /** Identificación (CUIT) consultada. */
  readonly identificacion: string
  /** Denominación del deudor. */
  readonly denominacion: string
  /** Períodos con historial. */
  readonly periodos: readonly PeriodoHistorica[]
}

/** Deserializa la respuesta de `GET /CentralDeDeudores/v1.0/Deudas/Historicas/{id}`. */
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
