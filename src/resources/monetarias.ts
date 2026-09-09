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

export interface MonetariasOptions {
  readonly version?: string
}

export interface GetEvolucionVariableOptions extends MonetariasOptions {
  readonly desde?: Date | string
  readonly hasta?: Date | string
  readonly offset?: number
  readonly limit?: number
}

export interface GetMetodologiasOptions extends MonetariasOptions {
  readonly offset?: number
  readonly limit?: number
}

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

  getMonetarias(opts: MonetariasOptions = {}): Promise<ResultGetMonetariasV1> {
    return this.fetch({
      endpoint: 'getMonetarias',
      version: opts.version,
      model: fromResultGetMonetariasV1,
      resultsKey: null,
    })
  }

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
