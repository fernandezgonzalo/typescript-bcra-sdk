import { describe, it, expect } from 'vitest'
import {
  fromResultGetChequeDenunciadoV1,
  type DetalleDenuncia,
  type ResultGetChequeDenunciadoV1,
} from '../../src/models/denunciados'

const detalle: DetalleDenuncia = {
  sucursal: 12,
  numeroCuenta: 4521,
  causal: 'FALTA DE FONDOS',
}

describe('fromResultGetChequeDenunciadoV1', () => {
  const payload = {
    numeroCheque: 123456789,
    denunciado: true,
    fechaProcesamiento: '2024-08-01T00:00:00',
    denominacionEntidad: 'BANCO NACION',
    detalles: [detalle],
  }

  it('parses the cheque with its denuncia details', () => {
    const result = fromResultGetChequeDenunciadoV1(payload)
    expect(result).toEqual<ResultGetChequeDenunciadoV1>({ ...payload })
    expect(result.denunciado).toBe(true)
    expect(result.detalles[0].causal).toBe('FALTA DE FONDOS')
  })

  it('defaults detalles to an empty list when missing', () => {
    const result = fromResultGetChequeDenunciadoV1({
      numeroCheque: 123456789,
      denunciado: false,
      fechaProcesamiento: '2024-08-01T00:00:00',
      denominacionEntidad: 'BANCO NACION',
    })
    expect(result.detalles).toEqual([])
  })
})
