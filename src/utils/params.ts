/**
 * Normaliza un objeto de query params a `URLSearchParams`, omitiendo los
 * valores `null`, `undefined` y string vacío.
 */
export function buildParams(params?: Record<string, unknown>): URLSearchParams {
  const searchParams = new URLSearchParams()
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value != null && value !== '') {
        searchParams.set(key, String(value))
      }
    }
  }
  return searchParams
}
