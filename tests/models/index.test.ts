import { describe, it, expect } from 'vitest'
import * as models from '../../src/models'

describe('models barrel', () => {
  it('exposes all model interfaces and fromXxx factories', () => {
    expect(typeof models.fromResultGetDeudasV1).toBe('function')
    expect(typeof models.fromResultGetChequesRechazadosV1).toBe('function')
    expect(typeof models.fromResultGetEntidadesV1).toBe('function')
    expect(typeof models.fromResultGetChequeDenunciadoV1).toBe('function')
    expect(typeof models.fromResultGetCotizacionesV1).toBe('function')
    expect(typeof models.fromResultGetDivisasV1).toBe('function')
    expect(typeof models.fromResultGetEvolucionMonedaV1).toBe('function')
    expect(typeof models.fromResultGetMetodologiasV1).toBe('function')
    expect(typeof models.fromResultGetMetodologiaV1).toBe('function')
    expect(typeof models.fromResultGetEvolucionVariableV1).toBe('function')
    expect(typeof models.fromResultGetMonetariasV1).toBe('function')
    expect(typeof models.fromResultGetCajasAhorrosV1).toBe('function')
    expect(typeof models.fromResultGetPaquetesProductosV1).toBe('function')
    expect(typeof models.fromResultGetPlazosFijosV1).toBe('function')
    expect(typeof models.fromResultGetPrestamosPrendariosV1).toBe('function')
    expect(typeof models.fromResultGetPrestamosHipotecariosV1).toBe('function')
    expect(typeof models.fromResultGetPrestamosPersonalesV1).toBe('function')
    expect(typeof models.fromResultGetTarjetasCreditoV1).toBe('function')
  })

  it('re-exports a factory that works end to end', () => {
    const result = models.fromResultGetEntidadesV1([
      { codigoEntidad: 11, denominacion: 'BANCO NACION' },
    ])
    expect(result.entidades[0].codigoEntidad).toBe(11)
  })
})
