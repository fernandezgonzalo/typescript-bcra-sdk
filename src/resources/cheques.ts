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

/** Opciones comunes de {@link Cheques}. */
export interface ChequesOptions {
  /** Versión del endpoint a usar (default: la más reciente). */
  readonly version?: string
}

/**
 * Cheques denunciados y entidades (API de Cheques denunciados del BCRA).
 *
 * @example
 * const entidades = await bcra.cheques.getEntidades()
 * const denunciado = await bcra.cheques.getChequeDenunciado(137, 20377516)
 */
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

  /** Devuelve el listado completo de entidades bancarias (`GET /cheques/v1.0/entidades`). */
  getEntidades(opts: ChequesOptions = {}): Promise<ResultGetEntidadesV1> {
    return this.fetch({
      endpoint: 'getEntidades',
      version: opts.version,
      model: fromResultGetEntidadesV1,
    })
  }

  /**
   * Devuelve la denuncia de un cheque (`GET /cheques/v1.0/denunciados/{codigoEntidad}/{numeroCheque}`).
   *
   * @param codigoEntidad Código de la entidad (ver {@link getEntidades}).
   * @param numeroCheque Número del cheque denunciado.
   */
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
