import { Resource } from '../resource.js'
import { Transport } from '../transport.js'
import {
  fromResultGetCajasAhorrosV1,
  type ResultGetCajasAhorrosV1,
} from '../models/transparencia.js'
import {
  fromResultGetPaquetesProductosV1,
  type ResultGetPaquetesProductosV1,
} from '../models/transparencia.js'
import {
  fromResultGetPlazosFijosV1,
  type ResultGetPlazosFijosV1,
} from '../models/transparencia.js'
import {
  fromResultGetPrestamosPrendariosV1,
  type ResultGetPrestamosPrendariosV1,
} from '../models/transparencia.js'
import {
  fromResultGetPrestamosHipotecariosV1,
  type ResultGetPrestamosHipotecariosV1,
} from '../models/transparencia.js'
import {
  fromResultGetPrestamosPersonalesV1,
  type ResultGetPrestamosPersonalesV1,
} from '../models/transparencia.js'
import {
  fromResultGetTarjetasCreditoV1,
  type ResultGetTarjetasCreditoV1,
} from '../models/transparencia.js'

export interface RegimenDeTransparenciaOptions {
  readonly version?: string
}

export class RegimenDeTransparencia extends Resource {
  constructor(transport: Transport) {
    super(transport)
    this.registerVersion('getCajasAhorros', '1.0', {
      path: '/transparencia/v1.0/CajasAhorros',
      model: fromResultGetCajasAhorrosV1,
    })
    this.registerVersion('getPaquetesProductos', '1.0', {
      path: '/transparencia/v1.0/PaquetesProductos',
      model: fromResultGetPaquetesProductosV1,
    })
    this.registerVersion('getPlazosFijos', '1.0', {
      path: '/transparencia/v1.0/PlazosFijos',
      model: fromResultGetPlazosFijosV1,
    })
    this.registerVersion('getPrestamosPrendarios', '1.0', {
      path: '/transparencia/v1.0/Prestamos/Prendarios',
      model: fromResultGetPrestamosPrendariosV1,
    })
    this.registerVersion('getPrestamosHipotecarios', '1.0', {
      path: '/transparencia/v1.0/Prestamos/Hipotecarios',
      model: fromResultGetPrestamosHipotecariosV1,
    })
    this.registerVersion('getPrestamosPersonales', '1.0', {
      path: '/transparencia/v1.0/Prestamos/Personales',
      model: fromResultGetPrestamosPersonalesV1,
    })
    this.registerVersion('getTarjetasCredito', '1.0', {
      path: '/transparencia/v1.0/TarjetasCredito',
      model: fromResultGetTarjetasCreditoV1,
    })
  }

  getCajasAhorros(
    codigoEntidad?: number,
    opts: RegimenDeTransparenciaOptions = {},
  ): Promise<ResultGetCajasAhorrosV1> {
    return this.fetch({
      endpoint: 'getCajasAhorros',
      version: opts.version,
      params: codigoEntidad !== undefined ? { codigoEntidad } : undefined,
      model: fromResultGetCajasAhorrosV1,
    })
  }

  getPaquetesProductos(
    codigoEntidad?: number,
    opts: RegimenDeTransparenciaOptions = {},
  ): Promise<ResultGetPaquetesProductosV1> {
    return this.fetch({
      endpoint: 'getPaquetesProductos',
      version: opts.version,
      params: codigoEntidad !== undefined ? { codigoEntidad } : undefined,
      model: fromResultGetPaquetesProductosV1,
    })
  }

  getPlazosFijos(
    codigoEntidad?: number,
    opts: RegimenDeTransparenciaOptions = {},
  ): Promise<ResultGetPlazosFijosV1> {
    return this.fetch({
      endpoint: 'getPlazosFijos',
      version: opts.version,
      params: codigoEntidad !== undefined ? { codigoEntidad } : undefined,
      model: fromResultGetPlazosFijosV1,
    })
  }

  getPrestamosPrendarios(
    codigoEntidad?: number,
    opts: RegimenDeTransparenciaOptions = {},
  ): Promise<ResultGetPrestamosPrendariosV1> {
    return this.fetch({
      endpoint: 'getPrestamosPrendarios',
      version: opts.version,
      params: codigoEntidad !== undefined ? { codigoEntidad } : undefined,
      model: fromResultGetPrestamosPrendariosV1,
    })
  }

  getPrestamosHipotecarios(
    codigoEntidad?: number,
    opts: RegimenDeTransparenciaOptions = {},
  ): Promise<ResultGetPrestamosHipotecariosV1> {
    return this.fetch({
      endpoint: 'getPrestamosHipotecarios',
      version: opts.version,
      params: codigoEntidad !== undefined ? { codigoEntidad } : undefined,
      model: fromResultGetPrestamosHipotecariosV1,
    })
  }

  getPrestamosPersonales(
    codigoEntidad?: number,
    opts: RegimenDeTransparenciaOptions = {},
  ): Promise<ResultGetPrestamosPersonalesV1> {
    return this.fetch({
      endpoint: 'getPrestamosPersonales',
      version: opts.version,
      params: codigoEntidad !== undefined ? { codigoEntidad } : undefined,
      model: fromResultGetPrestamosPersonalesV1,
    })
  }

  getTarjetasCredito(
    codigoEntidad?: number,
    opts: RegimenDeTransparenciaOptions = {},
  ): Promise<ResultGetTarjetasCreditoV1> {
    return this.fetch({
      endpoint: 'getTarjetasCredito',
      version: opts.version,
      params: codigoEntidad !== undefined ? { codigoEntidad } : undefined,
      model: fromResultGetTarjetasCreditoV1,
    })
  }
}
