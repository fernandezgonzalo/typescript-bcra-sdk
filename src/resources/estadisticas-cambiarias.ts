import { Resource } from '../resource.js'
import { Transport } from '../transport.js'
import { coerceDate } from '../utils/dates.js'
import {
  fromResultGetDivisasV1,
  type ResultGetDivisasV1,
} from '../models/divisas.js'
import {
  fromResultGetCotizacionesV1,
  type ResultGetCotizacionesV1,
} from '../models/cotizaciones.js'
import {
  fromResultGetEvolucionMonedaV1,
  type ResultGetEvolucionMonedaV1,
} from '../models/evolucion.js'

export interface EstadisticasCambiariasOptions {
  readonly version?: string
}

export interface GetEvolucionMonedaOptions extends EstadisticasCambiariasOptions {
  readonly fechadesde?: Date | string
  readonly fechahasta?: Date | string
  readonly limit?: number
  readonly offset?: number
}

export class EstadisticasCambiarias extends Resource {
  constructor(transport: Transport) {
    super(transport)
    this.registerVersion('getDivisas', '1.0', {
      path: '/estadisticascambiarias/v1.0/Maestros/Divisas',
      model: fromResultGetDivisasV1,
    })
    this.registerVersion('getCotizaciones', '1.0', {
      path: '/estadisticascambiarias/v1.0/Cotizaciones',
      model: fromResultGetCotizacionesV1,
    })
    this.registerVersion('getEvolucionMoneda', '1.0', {
      path: '/estadisticascambiarias/v1.0/Cotizaciones/{moneda}',
      model: fromResultGetEvolucionMonedaV1,
    })
  }

  getDivisas(
    opts: EstadisticasCambiariasOptions = {},
  ): Promise<ResultGetDivisasV1> {
    return this.fetch({
      endpoint: 'getDivisas',
      version: opts.version,
      model: fromResultGetDivisasV1,
    })
  }

  getCotizaciones(
    fecha?: Date | string,
    opts: EstadisticasCambiariasOptions = {},
  ): Promise<ResultGetCotizacionesV1> {
    const params =
      fecha !== undefined ? { fecha: coerceDate(fecha) } : undefined
    return this.fetch({
      endpoint: 'getCotizaciones',
      version: opts.version,
      params,
      model: fromResultGetCotizacionesV1,
    })
  }

  getEvolucionMoneda(
    moneda: string,
    opts: GetEvolucionMonedaOptions = {},
  ): Promise<ResultGetEvolucionMonedaV1> {
    const params: Record<string, unknown> = {}
    if (opts.fechadesde !== undefined) {
      params.fechadesde = coerceDate(opts.fechadesde)
    }
    if (opts.fechahasta !== undefined) {
      params.fechahasta = coerceDate(opts.fechahasta)
    }
    if (opts.limit !== undefined) {
      params.limit = opts.limit
    }
    if (opts.offset !== undefined) {
      params.offset = opts.offset
    }
    return this.fetch({
      endpoint: 'getEvolucionMoneda',
      version: opts.version,
      pathVars: { moneda },
      params,
      model: fromResultGetEvolucionMonedaV1,
      resultsKey: null,
    })
  }
}
