import { describe, it, expect } from 'vitest'
import {
  fromResultGetEntidadesV1,
  type EntidadBancaria,
  type ResultGetEntidadesV1,
} from '../../src/models/entidades'

const banco: EntidadBancaria = {
  codigoEntidad: 11,
  denominacion: 'BANCO NACION',
}

describe('fromResultGetEntidadesV1', () => {
  it('parses a list of bancos', () => {
    const result = fromResultGetEntidadesV1([
      banco,
      { codigoEntidad: 14, denominacion: 'BANCO MACRO' },
    ])
    expect(result).toEqual<ResultGetEntidadesV1>({
      entidades: [banco, { codigoEntidad: 14, denominacion: 'BANCO MACRO' }],
    })
    expect(result.entidades[0].codigoEntidad).toBe(11)
  })

  it('parses an empty list', () => {
    const result = fromResultGetEntidadesV1([])
    expect(result).toEqual<ResultGetEntidadesV1>({ entidades: [] })
  })
})
