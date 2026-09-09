import { Resource } from '../resource.js'
import { Transport } from '../transport.js'
import {
  fromResultGetChequesRechazadosV1,
  type ResultGetChequesRechazadosV1,
} from '../models/cheques.js'
import {
  fromResultGetDeudasHistoricasV1,
  fromResultGetDeudasV1,
  type ResultGetDeudasHistoricasV1,
  type ResultGetDeudasV1,
} from '../models/deudores.js'
import { normalizeCuit } from '../utils/cuit.js'

/** Opciones comunes de {@link Deudores}. */
export interface DeudoresOptions {
  /** Versión del endpoint a usar (default: la más reciente). */
  readonly version?: string
}

/**
 * Central de Deudores (API de Deudores del BCRA).
 *
 * @example
 * const deudas = await bcra.deudores.getDeudas('20111111112')
 * const rechazados = await bcra.deudores.getChequesRechazados('20111111112')
 */
export class Deudores extends Resource {
  constructor(transport: Transport) {
    super(transport)
    this.registerVersion('getDeudas', '1.0', {
      path: '/centraldedeudores/v1.0/Deudas/{cuit}',
      model: fromResultGetDeudasV1,
    })
    this.registerVersion('getDeudasHistoricas', '1.0', {
      path: '/CentralDeDeudores/v1.0/Deudas/Historicas/{identification}',
      model: fromResultGetDeudasHistoricasV1,
    })
    this.registerVersion('getChequesRechazados', '1.0', {
      path: '/centraldedeudores/v1.0/Deudas/ChequesRechazados/{identification}',
      model: fromResultGetChequesRechazadosV1,
    })
  }

  /**
   * Devuelve las deudas vigentes de un CUIT
   * (`GET /centraldedeudores/v1.0/Deudas/{cuit}`).
   *
   * @param cuit CUIT a consultar (acepta formato con o sin guiones).
   */
  getDeudas(
    cuit: string,
    opts: DeudoresOptions = {},
  ): Promise<ResultGetDeudasV1> {
    const normalized = normalizeCuit(cuit)
    return this.fetch({
      endpoint: 'getDeudas',
      version: opts.version,
      pathVars: { cuit: normalized },
      model: fromResultGetDeudasV1,
    })
  }

  /** Devuelve el historial de deudas de una identificación (`GET /CentralDeDeudores/v1.0/Deudas/Historicas/{identification}`). */
  getDeudasHistoricas(
    identification: string,
    opts: DeudoresOptions = {},
  ): Promise<ResultGetDeudasHistoricasV1> {
    return this.fetch({
      endpoint: 'getDeudasHistoricas',
      version: opts.version,
      pathVars: { identification },
      model: fromResultGetDeudasHistoricasV1,
    })
  }

  /** Devuelve los cheques rechazados de una identificación (`GET /centraldedeudores/v1.0/Deudas/ChequesRechazados/{identification}`). */
  getChequesRechazados(
    identification: string,
    opts: DeudoresOptions = {},
  ): Promise<ResultGetChequesRechazadosV1> {
    return this.fetch({
      endpoint: 'getChequesRechazados',
      version: opts.version,
      pathVars: { identification },
      model: fromResultGetChequesRechazadosV1,
    })
  }
}
