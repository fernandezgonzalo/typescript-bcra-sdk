import { Resource } from '../resource.js'
import { Transport } from '../transport.js'
import {
  fromResultGetEntidadesV1,
  type ResultGetEntidadesV1,
} from '../models/entidades.js'
import {
  fromResultGetChequeDenunciadoV1,
  type ResultGetChequeDenunciadoV1,
} from '../models/denunciados.js'

export interface ChequesOptions {
  readonly version?: string
}

export class Cheques extends Resource {
  constructor(transport: Transport) {
    super(transport)
    this.registerVersion('getEntidades', '1.0', {
      path: '/cheques/v1.0/entidades',
      model: fromResultGetEntidadesV1,
    })
    this.registerVersion('getChequeDenunciado', '1.0', {
      path: '/cheques/v1.0/denunciados/{codigoEntidad}/{numeroCheque}',
      model: fromResultGetChequeDenunciadoV1,
    })
  }

  getEntidades(opts: ChequesOptions = {}): Promise<ResultGetEntidadesV1> {
    return this.fetch({
      endpoint: 'getEntidades',
      version: opts.version,
      model: fromResultGetEntidadesV1,
    })
  }

  getChequeDenunciado(
    codigoEntidad: number,
    numeroCheque: number,
    opts: ChequesOptions = {},
  ): Promise<ResultGetChequeDenunciadoV1> {
    return this.fetch({
      endpoint: 'getChequeDenunciado',
      version: opts.version,
      pathVars: {
        codigoEntidad: String(codigoEntidad),
        numeroCheque: String(numeroCheque),
      },
      model: fromResultGetChequeDenunciadoV1,
    })
  }
}
