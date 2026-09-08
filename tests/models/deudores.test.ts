import { describe, it, expect } from 'vitest'
import {
  fromPeriodo,
  fromResultGetDeudasV1,
  fromPeriodoHistorica,
  fromResultGetDeudasHistoricasV1,
  type Entidad,
  type Periodo,
  type ResultGetDeudasV1,
  type EntidadHistorica,
  type PeriodoHistorica,
  type ResultGetDeudasHistoricasV1,
} from '../../src/models/deudores'

const entidad: Entidad = {
  entidad: 'Banco Nación',
  situacion: '2',
  fechaSit1: '2024-06-30',
  monto: 15000.5,
  diasAtrasoPago: 45,
  refinanciaciones: true,
  recategorizacionOblig: false,
  situacionJuridica: true,
  irrecDisposicionTecnica: false,
  enRevision: true,
  procesoJud: false,
}

const entidadHistorica: EntidadHistorica = {
  entidad: 'Banco Nación',
  situacion: 2,
  monto: 15000.5,
  enRevision: true,
  procesoJud: false,
}

describe('fromPeriodo', () => {
  it('parses periodo with its entidades', () => {
    const result = fromPeriodo({
      periodo: '2024-06',
      entidades: [entidad],
    })
    expect(result).toEqual<Periodo>({
      periodo: '2024-06',
      entidades: [entidad],
    })
  })

  it('defaults entidades to an empty list when missing', () => {
    const result = fromPeriodo({ periodo: '2024-06' })
    expect(result).toEqual<Periodo>({ periodo: '2024-06', entidades: [] })
  })
})

describe('fromResultGetDeudasV1', () => {
  const periodo = { periodo: '2024-06', entidades: [entidad] }
  const payload = {
    identificacion: 20111111112,
    denominacion: 'EMPRESA SA',
    periodos: [periodo],
  }

  it('parses the CUIT as a number with its nested periodos', () => {
    const result = fromResultGetDeudasV1(payload)
    expect(result).toEqual<ResultGetDeudasV1>({ ...payload })
    expect(result.identificacion).toBe(20111111112)
    expect(result.periodos[0].entidades[0].situacion).toBe('2')
  })

  it('defaults periodos to an empty list when missing', () => {
    const result = fromResultGetDeudasV1({
      identificacion: 20111111112,
      denominacion: 'EMPRESA SA',
    })
    expect(result.periodos).toEqual([])
  })
})

describe('fromPeriodoHistorica', () => {
  it('parses periodo historica with its entidades (situacion as number)', () => {
    const result = fromPeriodoHistorica({
      periodo: '2024-06',
      entidades: [entidadHistorica],
    })
    expect(result).toEqual<PeriodoHistorica>({
      periodo: '2024-06',
      entidades: [entidadHistorica],
    })
    expect(result.entidades[0].situacion).toBe(2)
  })

  it('defaults entidades to an empty list when missing', () => {
    const result = fromPeriodoHistorica({ periodo: '2024-06' })
    expect(result).toEqual<PeriodoHistorica>({
      periodo: '2024-06',
      entidades: [],
    })
  })
})

describe('fromResultGetDeudasHistoricasV1', () => {
  const periodo = { periodo: '2024-06', entidades: [entidadHistorica] }
  const payload = {
    identificacion: '20111111112',
    denominacion: 'EMPRESA SA',
    periodos: [periodo],
  }

  it('parses the CUIL as a string with its nested periodos', () => {
    const result = fromResultGetDeudasHistoricasV1(payload)
    expect(result).toEqual<ResultGetDeudasHistoricasV1>({ ...payload })
    expect(result.identificacion).toBe('20111111112')
  })

  it('defaults periodos to an empty list when missing', () => {
    const result = fromResultGetDeudasHistoricasV1({
      identificacion: '20111111112',
      denominacion: 'EMPRESA SA',
    })
    expect(result.periodos).toEqual([])
  })
})
