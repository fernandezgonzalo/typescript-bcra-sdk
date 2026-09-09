import { BCRAError } from '../errors'

const CUIT_RE = /^\d{2}-?\d{8}-?\d$/

/**
 * Normaliza un CUIT: quita separadores y valida el formato de 11 dígitos.
 *
 * Acepta `20111111112` o `20-11111111-2`. Lanza `TypeError` (no string) o
 * {@link BCRAError} (formato inválido).
 */
export function normalizeCuit(cuit: string): string {
  if (typeof cuit !== 'string') {
    throw new TypeError(
      `CUIT inválido: ${String(cuit)}. Debe contener 11 dígitos (ej. '20111111112').`,
    )
  }
  if (!CUIT_RE.test(cuit)) {
    throw new BCRAError(
      `CUIT inválido: ${cuit}. Debe contener 11 dígitos (ej. '20111111112').`,
    )
  }
  return cuit.replace(/-/g, '')
}

/** Valida que un valor sea un string con formato de CUIT válido (11 dígitos). */
export function validateCuit(cuit: string): boolean {
  return typeof cuit === 'string' && CUIT_RE.test(cuit)
}
