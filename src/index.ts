/**
 * SDK en TypeScript para las APIs públicas del BCRA.
 *
 * - {@link BCRAClient}: cliente principal (resources agrupados por dominio).
 * - {@link RetryPolicy} y {@link Transport}: transporte con reintentos y timeout.
 * - {@link BCRAError} y subclases: jerarquía de errores.
 * - Models de recursos y versiones de endpoint: ver cada resource.
 *
 * @packageDocumentation
 */

/** Versión del SDK (sincronizada con `package.json`). */
export const VERSION = '0.1.0'

export { BCRAClient, type BCRAClientOptions } from './client.js'
export * from './errors.js'
export {
  RetryPolicy,
  parseRetryAfter,
  type RetryPolicyOptions,
} from './retry.js'
export { Transport } from './transport.js'
export {
  Resource,
  type FetchOptions,
  type ModelFactory,
  type VersionSpec,
} from './resource.js'
export * from './resources/cheques.js'
export * from './resources/deudores.js'
export * from './resources/estadisticas-cambiarias.js'
export * from './resources/monetarias.js'
export * from './resources/regimen-de-transparencia.js'
export * from './models/index.js'
