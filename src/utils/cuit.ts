import { BCRAError } from '../errors'

const CUIT_RE = /^\d{2}-?\d{8}-?\d$/

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

export function validateCuit(cuit: string): boolean {
  return typeof cuit === 'string' && CUIT_RE.test(cuit)
}
