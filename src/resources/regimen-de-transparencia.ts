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

/** Opciones comunes de {@link RegimenDeTransparencia}. */
export interface RegimenDeTransparenciaOptions {
  /** Versión del endpoint a usar (default: la más reciente). */
  readonly version?: string
}

/**
 * Régimen de Transparencia: cajas de ahorro, paquetes, plazos fijos y
 * préstamos de las entidades financieras.
 *
 * @example
 * const cajas = await bcra.regimenDeTransparencia.getCajasAhorros(11)
 * const tarjetas = await bcra.regimenDeTransparencia.getTarjetasCredito()
 */
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

  /**
   * Devuelve las cajas de ahorro (`GET /transparencia/v1.0/CajasAhorros`).
   *
   * @param codigoEntidad Código de la entidad a filtrar.
   */
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

  /**
   * Devuelve los paquetes de productos (`GET /transparencia/v1.0/PaquetesProductos`).
   *
   * @param codigoEntidad Código de la entidad a filtrar.
   */
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

  /**
   * Devuelve los plazos fijos (`GET /transparencia/v1.0/PlazosFijos`).
   *
   * @param codigoEntidad Código de la entidad a filtrar.
   */
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

  /**
   * Devuelve los préstamos prendarios (`GET /transparencia/v1.0/Prestamos/Prendarios`).
   *
   * @param codigoEntidad Código de la entidad a filtrar.
   */
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

  /**
   * Devuelve los préstamos hipotecarios (`GET /transparencia/v1.0/Prestamos/Hipotecarios`).
   *
   * @param codigoEntidad Código de la entidad a filtrar.
   */
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

  /**
   * Devuelve los préstamos personales (`GET /transparencia/v1.0/Prestamos/Personales`).
   *
   * @param codigoEntidad Código de la entidad a filtrar.
   */
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

  /**
   * Devuelve las tarjetas de crédito (`GET /transparencia/v1.0/TarjetasCredito`).
   *
   * @param codigoEntidad Código de la entidad a filtrar.
   */
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
