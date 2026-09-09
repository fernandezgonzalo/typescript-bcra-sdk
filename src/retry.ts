/**
 * Política de reintentos ante errores transitorios (timeout y status HTTP
 * servidor). Se usa desde {@link Transport} y se configura en
 * {@link BCRAClient}.
 */

/** Opciones de {@link RetryPolicy}. Todos los campos son opcionales. */
export interface RetryPolicyOptions {
  /** Cantidad máxima de reintentos por request. Default: `2`. */
  maxRetries?: number
  /** Base del backoff exponencial en segundos: `backoff * 2**attempt`. Default: `0.5`. */
  backoff?: number
  /** Reintentar también cuando el error es un timeout. Default: `true`. */
  retryOnTimeout?: boolean
  /** Status HTTP que disparan reintento. Default: `[429, 500, 502, 503, 504]`. */
  statuses?: number[]
}

/**
 * Configuración de reintentos con backoff exponencial.
 *
 * @example
 * const bcra = new BCRAClient({
 *   retries: new RetryPolicy({ maxRetries: 3, backoff: 1 }),
 * })
 */
export class RetryPolicy {
  readonly maxRetries: number
  readonly backoff: number
  readonly retryOnTimeout: boolean
  readonly statuses: number[]

  constructor(options: RetryPolicyOptions = {}) {
    this.maxRetries = options.maxRetries ?? 2
    this.backoff = options.backoff ?? 0.5
    this.retryOnTimeout = options.retryOnTimeout ?? true
    this.statuses = options.statuses ?? [429, 500, 502, 503, 504]
  }

  /**
   * Segundos a esperar antes del reintento `attempt`.
   * `backoff * 2**attempt` (exponential backoff).
   */
  delay(attempt: number): number {
    return this.backoff * 2 ** attempt
  }
}

function isHeaders(
  headers: Headers | Record<string, string>,
): headers is Headers {
  return typeof (headers as Headers).get === 'function'
}

/**
 * Parsea el header `Retry-After` (segundos o fecha HTTP).
 *
 * Devuelve `null` si el header está ausente o es inválido. Nunca devuelve
 * un valor negativo (floors a 0).
 */
export function parseRetryAfter(
  headers: Headers | Record<string, string>,
): number | null {
  let value: string | null
  if (isHeaders(headers)) {
    value = headers.get('retry-after')
  } else {
    value = headers['retry-after'] ?? headers['Retry-After'] ?? null
  }
  if (value == null) return null
  const trimmed = value.trim()
  if (trimmed.length === 0) return null

  const seconds = Number(trimmed)
  if (Number.isFinite(seconds)) return Math.max(0, seconds)

  const parsed = Date.parse(trimmed)
  if (Number.isNaN(parsed)) return null
  return Math.max(0, (parsed - Date.now()) / 1000)
}
