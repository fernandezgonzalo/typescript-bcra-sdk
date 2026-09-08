import { describe, it, expect } from 'vitest'
import {
  fromResultGetMetodologiasV1,
  fromResultGetMetodologiaV1,
  fromResultGetEvolucionVariableV1,
  fromResultGetMonetariasV1,
  type Metodologia,
  type ResultGetMetodologiasV1,
  type ResultGetMetodologiaV1,
  type VariableMonetaria,
  type ResultGetEvolucionVariableV1,
  type ResultGetMonetariasV1,
} from '../../src/models/monetarias'

const resultset = { count: 1, offset: 0, limit: 1 }

const metodologia: Metodologia = {
  id: 1,
  detalle: 'M1 - METODOLOGIA DE LA VARIABLE',
}

const variable: VariableMonetaria = {
  idVariable: 1,
  descripcion: 'BASE MONETARIA',
  categoria: 'B',
  tipoSerie: 'STOCK',
  periodicidad: 'MENSUAL',
  unidadExpresion: 'MM DE $',
  moneda: 'PESOS',
  primerFechaInformada: '2024-01-01',
  ultFechaInformada: '2024-07-01',
  ultValorInformado: 1000000.25,
}

describe('fromResultGetMetodologiasV1', () => {
  it('parses resultados with their nested metodologias', () => {
    const payload = { metadata: { resultset }, results: [metodologia] }
    const result = fromResultGetMetodologiasV1(payload)
    expect(result).toEqual<ResultGetMetodologiasV1>({
      resultset,
      metodologias: [metodologia],
    })
    expect(result.metodologias[0].id).toBe(1)
  })

  it('defaults results to an empty list when missing', () => {
    const result = fromResultGetMetodologiasV1({ metadata: { resultset } })
    expect(result.metodologias).toEqual([])
  })
})

describe('fromResultGetMetodologiaV1', () => {
  it('parses the first result as the metodologia', () => {
    const result = fromResultGetMetodologiaV1({
      results: [metodologia, { id: 2, detalle: 'X' }],
    })
    expect(result).toEqual<ResultGetMetodologiaV1>({ metodologia })
  })

  it('yields an empty metodologia when results are missing', () => {
    const result = fromResultGetMetodologiaV1({})
    expect(result).toEqual<ResultGetMetodologiaV1>({
      metodologia: undefined as unknown as Metodologia,
    })
  })
})

describe('fromResultGetEvolucionVariableV1', () => {
  it('parses series mapping their puntos de serie', () => {
    const payload = {
      metadata: { resultset },
      results: [
        { idVariable: 1, detalle: [{ fecha: '2024-07-01', valor: 1000.5 }] },
        { idVariable: 2 },
      ],
    }
    const result = fromResultGetEvolucionVariableV1(payload)
    expect(result).toEqual<ResultGetEvolucionVariableV1>({
      resultset,
      series: [
        { idVariable: 1, detalle: [{ fecha: '2024-07-01', valor: 1000.5 }] },
        { idVariable: 2, detalle: [] },
      ],
    })
    expect(result.series[0].detalle[0].valor).toBe(1000.5)
  })

  it('defaults results to an empty list when missing', () => {
    const result = fromResultGetEvolucionVariableV1({
      metadata: { resultset },
    })
    expect(result.series).toEqual([])
  })
})

describe('fromResultGetMonetariasV1', () => {
  it('parses results with their nested variables', () => {
    const payload = { metadata: { resultset }, results: [variable] }
    const result = fromResultGetMonetariasV1(payload)
    expect(result).toEqual<ResultGetMonetariasV1>({
      resultset,
      variables: [variable],
    })
    expect(result.variables[0].idVariable).toBe(1)
  })

  it('defaults results to an empty list when missing', () => {
    const result = fromResultGetMonetariasV1({ metadata: { resultset } })
    expect(result.variables).toEqual([])
  })
})
