import { describe, it, expect } from 'vitest'
import {
  fromEntidadCheque,
  fromCausal,
  fromResultGetChequesRechazadosV1,
  type DetalleCheque,
  type EntidadCheque,
  type Causal,
  type ResultGetChequesRechazadosV1,
} from '../../src/models/cheques'

const detalle: DetalleCheque = {
  nroCheque: 123456,
  fechaRechazo: '2024-07-15',
  monto: 50000.75,
  fechaPago: '2024-08-01',
  fechaPagoMulta: null,
  estadoMulta: 'PENDIENTE',
  ctaPersonal: false,
  denomJuridica: 'EMPRESA SA',
  enRevision: true,
  procesoJud: false,
}

describe('fromEntidadCheque', () => {
  it('parses the entity with its cheque details', () => {
    const result = fromEntidadCheque({ entidad: 11, detalle: [detalle] })
    expect(result).toEqual<EntidadCheque>({
      entidad: 11,
      detalle: [detalle],
    })
    expect(result.detalle[0].fechaPagoMulta).toBeNull()
  })

  it('defaults detalle to an empty list when missing', () => {
    const result = fromEntidadCheque({ entidad: 11 })
    expect(result).toEqual<EntidadCheque>({ entidad: 11, detalle: [] })
  })
})

describe('fromCausal', () => {
  it('parses the causal with its nested entities', () => {
    const result = fromCausal({
      causal: 'FALTA DE FONDOS',
      entidades: [{ entidad: 11, detalle: [detalle] }],
    })
    expect(result).toEqual<Causal>({
      causal: 'FALTA DE FONDOS',
      entidades: [{ entidad: 11, detalle: [detalle] }],
    })
    expect(result.entidades[0].detalle[0].nroCheque).toBe(123456)
  })

  it('defaults entidades to an empty list when missing', () => {
    const result = fromCausal({ causal: 'FALTA DE FONDOS' })
    expect(result).toEqual<Causal>({ causal: 'FALTA DE FONDOS', entidades: [] })
  })
})

describe('fromResultGetChequesRechazadosV1', () => {
  const payload = {
    identificacion: 20111111112,
    causales: [
      {
        causal: 'FALTA DE FONDOS',
        entidades: [{ entidad: 11, detalle: [detalle] }],
      },
    ],
  }

  it('parses the identification with its nested causales', () => {
    const result = fromResultGetChequesRechazadosV1(payload)
    expect(result).toEqual<ResultGetChequesRechazadosV1>({ ...payload })
    expect(result.identificacion).toBe(20111111112)
    expect(result.causales[0].entidades[0].entidad).toBe(11)
  })

  it('defaults causales to an empty list when missing', () => {
    const result = fromResultGetChequesRechazadosV1({
      identificacion: 20111111112,
    })
    expect(result.causales).toEqual([])
  })
})
