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

/** Opciones comunes de {@link EstadisticasCambiarias}. */
export interface EstadisticasCambiariasOptions {
  /** Versión del endpoint a usar (default: la más reciente). */
  readonly version?: string
}

/** Opciones de {@link EstadisticasCambiarias.getEvolucionMoneda}. */
export interface GetEvolucionMonedaOptions extends EstadisticasCambiariasOptions {
  /** Desde qué fecha (`YYYY-MM-DD` o `Date`). */
  readonly fechadesde?: Date | string
  /** Hasta qué fecha (`YYYY-MM-DD` o `Date`). */
  readonly fechahasta?: Date | string
  /** Cantidad máxima de resultados. */
  readonly limit?: number
  /** Primer resultado a devolver (offset). */
  readonly offset?: number
}

/**
 * Estadísticas cambiarias (divisas y cotizaciones del BCRA).
 *
 * @example
 * const divisas = await bcra.estadisticasCambiarias.getDivisas()
 * const cotizaciones = await bcra.estadisticasCambiarias.getCotizaciones('2024-06-12')
 */
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

  /** Devuelve el listado de divisas del maestro (`GET /estadisticascambiarias/v1.0/Maestros/Divisas`). */
  getDivisas(
    opts: EstadisticasCambiariasOptions = {},
  ): Promise<ResultGetDivisasV1> {
    return this.fetch({
      endpoint: 'getDivisas',
      version: opts.version,
      model: fromResultGetDivisasV1,
    })
  }

  /**
   * Devuelve las cotizaciones de todas las monedas para una fecha
   * (`GET /estadisticascambiarias/v1.0/Cotizaciones`).
   *
   * @param fecha Fecha a consultar (`YYYY-MM-DD` o `Date`). Sin fecha, el BCRA
   * devuelve la cotización más reciente.
   */
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

  /**
   * Devuelve la evolución de cotización de una moneda
   * (`GET /estadisticascambiarias/v1.0/Cotizaciones/{moneda}`).
   *
   * @param moneda Código de moneda (ver {@link getDivisas}).
   */
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
