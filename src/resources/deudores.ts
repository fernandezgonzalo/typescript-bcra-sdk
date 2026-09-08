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

export interface DeudoresOptions {
  readonly version?: string
}

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
