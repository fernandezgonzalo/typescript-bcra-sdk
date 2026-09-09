/**
 * Jerarquía de errores del SDK.
 *
 * Todas las fallas (HTTP, red, timeout, versión de endpoint) se exponen como
 * subclases de {@link BCRAError}, por lo que un único `catch (error)` sobre
 * `BCRAError` alcanza para manejar cualquier error del cliente.
 */

/** Error base de todo el SDK. Cualquier falla del cliente lo extiende. */
export class BCRAError extends Error {}

/**
 * Error devuelto cuando el BCRA responde con status HTTP `!ok`.
 *
 * @example
 * catch (error) {
 *   if (error instanceof BCRAHTTPError) {
 *     console.error(error.statusCode, error.reason)
 *   }
 * }
 */
export class BCRAHTTPError extends BCRAError {
  /** Código de status HTTP de la respuesta. */
  readonly statusCode: number
  /** Cuerpo del error (`statusText` de la respuesta). */
  readonly body: string
  /** Respuesta HTTP original, si está disponible. */
  readonly response?: Response
  /** `statusText` de la respuesta (`null` si no hay respuesta). */
  readonly reason: string | null

  constructor(statusCode: number, message: string, response?: Response) {
    super(`[${statusCode} ${message}]`)
    this.statusCode = statusCode
    this.body = message
    this.response = response
    this.reason = response?.statusText ?? null
  }
}

/** Error de red: el `fetch` fue rechazado por problemas de conectividad. */
export class BCRAConnectionError extends BCRAError {}

/** Error de timeout: el request superó el timeout configurado (AbortController). */
export class BCRATimeoutError extends BCRAConnectionError {}

/** Error lanzado al pedir una versión de endpoint no registrada o sin versiones. */
export class BCRAEndpointVersionError extends BCRAError {}
