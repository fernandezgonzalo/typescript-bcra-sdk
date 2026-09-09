import { BCRAError } from '../errors'

const ISO_RE = /^(\d{4})-(\d{2})-(\d{2})$/
const COMPACT_RE = /^(\d{4})(\d{2})(\d{2})$/

/**
 * Normaliza una fecha a string `YYYY-MM-DD`, aceptando:
 * - `Date` válido (se serializa en UTC).
 * - string ISO `YYYY-MM-DD` o compacto `YYYYMMDD`.
 *
 * Lanza `TypeError` (otro tipo) o {@link BCRAError} (fecha inválida).
 */
export function coerceDate(value: Date | string): string {
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) {
      throw new BCRAError(
        `Fecha inválida: ${String(value)}. Usá el formato ISO 8601 (YYYY-MM-DD).`,
      )
    }
    return value.toISOString().slice(0, 10)
  }

  if (typeof value === 'string') {
    const match = ISO_RE.exec(value) ?? COMPACT_RE.exec(value)
    if (!match) {
      throw new BCRAError(
        `Fecha inválida: '${value}'. Usá el formato ISO 8601 (YYYY-MM-DD).`,
      )
    }
    const year = Number(match[1])
    const month = Number(match[2])
    const day = Number(match[3])
    const date = new Date(Date.UTC(year, month - 1, day))
    if (
      date.getUTCFullYear() !== year ||
      date.getUTCMonth() !== month - 1 ||
      date.getUTCDate() !== day
    ) {
      throw new BCRAError(
        `Fecha inválida: '${value}'. Usá el formato ISO 8601 (YYYY-MM-DD).`,
      )
    }
    return `${match[1]}-${match[2]}-${match[3]}`
  }

  throw new TypeError(
    `Fecha inválida: ${String(value)}. Usá el formato ISO 8601 (YYYY-MM-DD).`,
  )
}
