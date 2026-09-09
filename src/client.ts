import { Cheques } from './resources/cheques.js'
import { Deudores } from './resources/deudores.js'
import { EstadisticasCambiarias } from './resources/estadisticas-cambiarias.js'
import { Monetarias } from './resources/monetarias.js'
import { RegimenDeTransparencia } from './resources/regimen-de-transparencia.js'
import { RetryPolicy } from './retry.js'
import { Transport } from './transport.js'

const DEFAULT_BASE_URL = 'https://api.bcra.gob.ar'

const DEFAULT_TIMEOUT = 10_000

/**
 * Opciones de configuración de {@link BCRAClient}.
 */
export interface BCRAClientOptions {
  /** URL base de la API. El default es la pública del BCRA. */
  readonly baseUrl?: string
  /** Timeout por request en ms. El default es 10_000. */
  readonly timeout?: number
  /**
   * Política de reintentos. El default es `new RetryPolicy()`;
   * pasá `new RetryPolicy({ maxRetries: 0 })` para desactivarlos.
   */
  readonly retries?: RetryPolicy
}

/**
 * Cliente único que agrupa todos los endpoints públicos del BCRA.
 *
 * No abre conexiones hasta la primera petición: el transporte se comparte
 * entre todos los resources y se crea de forma perezosa (fetch nativo no
 * mantiene un pool, por lo que no requiere liberación).
 *
 * Los recursos se exponen como propiedades organizadas por dominio:
 * `deudores`, `cheques`, `estadisticasCambiarias`, `monetarias` y
 * `regimenDeTransparencia`.
 *
 * @example
 * const bcra = new BCRAClient()
 * const deudas = await bcra.deudores.getDeudas('20111111112')
 * const cotizaciones = await bcra.estadisticasCambiarias.getCotizaciones()
 * bcra.close()
 */
export class BCRAClient {
  readonly deudores: Deudores
  readonly cheques: Cheques
  readonly estadisticasCambiarias: EstadisticasCambiarias
  readonly monetarias: Monetarias
  readonly regimenDeTransparencia: RegimenDeTransparencia

  private readonly _transport: Transport

  constructor(options: BCRAClientOptions = {}) {
    this._transport = new Transport(
      options.baseUrl ?? DEFAULT_BASE_URL,
      options.timeout ?? DEFAULT_TIMEOUT,
      options.retries,
    )
    this.deudores = new Deudores(this._transport)
    this.cheques = new Cheques(this._transport)
    this.estadisticasCambiarias = new EstadisticasCambiarias(this._transport)
    this.monetarias = new Monetarias(this._transport)
    this.regimenDeTransparencia = new RegimenDeTransparencia(this._transport)
  }

  /**
   * Cierra el cliente. Es un no-op: el `fetch` nativo no mantiene conexiones
   * persistentes que liberar. Se mantiene por paridad con el SDK Python.
   */
  close(): void {}
}
