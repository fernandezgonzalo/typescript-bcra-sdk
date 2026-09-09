import { Resource } from '../resource.js'
import { Transport } from '../transport.js'
import { coerceDate } from '../utils/dates.js'
import {
  fromResultGetEvolucionVariableV1,
  fromResultGetMetodologiaV1,
  fromResultGetMetodologiasV1,
  fromResultGetMonetariasV1,
  type ResultGetEvolucionVariableV1,
  type ResultGetMetodologiaV1,
  type ResultGetMetodologiasV1,
  type ResultGetMonetariasV1,
} from '../models/monetarias.js'

/** Opciones comunes de {@link Monetarias}. */
export interface MonetariasOptions {
  /** Versión del endpoint a usar (default: la más reciente). */
  readonly version?: string
}

/** Opciones de {@link Monetarias.getEvolucionVariable}. */
export interface GetEvolucionVariableOptions extends MonetariasOptions {
  /** Desde qué fecha (`YYYY-MM-DD` o `Date`). */
  readonly desde?: Date | string
  /** Hasta qué fecha (`YYYY-MM-DD` o `Date`). */
  readonly hasta?: Date | string
  /** Primer resultado a devolver (offset). */
  readonly offset?: number
  /** Cantidad máxima de resultados. */
  readonly limit?: number
}

/** Opciones de {@link Monetarias.getMetodologias}. */
export interface GetMetodologiasOptions extends MonetariasOptions {
  /** Primer resultado a devolver (offset). */
  readonly offset?: number
  /** Cantidad máxima de resultados. */
  readonly limit?: number
}

/**
 * Estadísticas monetarias y metodologías (API v4.0 del BCRA).
 *
 * La API v4.0 incluye las Principales Variables; las versiones v1.0–v3.0
 * quedaron deprecadas por el BCRA y no se registran.
 *
 * @example
 * const monetarias = await bcra.monetarias.getMonetarias()
 * const evolucion = await bcra.monetarias.getEvolucionVariable(1, {
 *   desde: '2024-01-01',
 * })
 */
export class Monetarias extends Resource {
  constructor(transport: Transport) {
    super(transport)
    this.registerVersion('getMonetarias', '4.0', {
      path: '/estadisticas/v4.0/monetarias',
      model: fromResultGetMonetariasV1,
    })
    this.registerVersion('getEvolucionVariable', '4.0', {
      path: '/estadisticas/v4.0/monetarias/{idVariable}',
      model: fromResultGetEvolucionVariableV1,
    })
    this.registerVersion('getMetodologias', '4.0', {
      path: '/estadisticas/v4.0/metodologia',
      model: fromResultGetMetodologiasV1,
    })
    this.registerVersion('getMetodologia', '4.0', {
      path: '/estadisticas/v4.0/metodologia/{idVariable}',
      model: fromResultGetMetodologiaV1,
    })
  }

  /** Devuelve las variables monetarias disponibles (`GET /estadisticas/v4.0/monetarias`). */
  getMonetarias(opts: MonetariasOptions = {}): Promise<ResultGetMonetariasV1> {
    return this.fetch({
      endpoint: 'getMonetarias',
      version: opts.version,
      model: fromResultGetMonetariasV1,
      resultsKey: null,
    })
  }

  /**
   * Devuelve la evolución histórica de una variable
   * (`GET /estadisticas/v4.0/monetarias/{idVariable}`).
   *
   * @param idVariable ID de la variable (ver {@link getMonetarias}).
   */
  getEvolucionVariable(
    idVariable: number,
    opts: GetEvolucionVariableOptions = {},
  ): Promise<ResultGetEvolucionVariableV1> {
    const params: Record<string, unknown> = {}
    if (opts.desde !== undefined) {
      params.desde = coerceDate(opts.desde)
    }
    if (opts.hasta !== undefined) {
      params.hasta = coerceDate(opts.hasta)
    }
    if (opts.offset !== undefined) {
      params.offset = opts.offset
    }
    if (opts.limit !== undefined) {
      params.limit = opts.limit
    }
    return this.fetch({
      endpoint: 'getEvolucionVariable',
      version: opts.version,
      pathVars: { idVariable: String(idVariable) },
      params,
      model: fromResultGetEvolucionVariableV1,
      resultsKey: null,
    })
  }

  /** Devuelve el listado de metodologías disponibles (`GET /estadisticas/v4.0/metodologia`). */
  getMetodologias(
    opts: GetMetodologiasOptions = {},
  ): Promise<ResultGetMetodologiasV1> {
    const params: Record<string, unknown> = {}
    if (opts.offset !== undefined) {
      params.offset = opts.offset
    }
    if (opts.limit !== undefined) {
      params.limit = opts.limit
    }
    return this.fetch({
      endpoint: 'getMetodologias',
      version: opts.version,
      params,
      model: fromResultGetMetodologiasV1,
      resultsKey: null,
    })
  }

  /**
   * Devuelve la metodología de una variable
   * (`GET /estadisticas/v4.0/metodologia/{idVariable}`).
   *
   * @param idVariable ID de la variable (ver {@link getMonetarias}).
   */
  getMetodologia(
    idVariable: number,
    opts: MonetariasOptions = {},
  ): Promise<ResultGetMetodologiaV1> {
    return this.fetch({
      endpoint: 'getMetodologia',
      version: opts.version,
      pathVars: { idVariable: String(idVariable) },
      model: fromResultGetMetodologiaV1,
      resultsKey: null,
    })
  }
}
