import { BCRAEndpointVersionError } from './errors.js'
import { Transport } from './transport.js'

/** Factory que deserializa un payload `unknown` en un modelo tipado. */
export type ModelFactory<T> = (data: unknown) => T

/** Especificación de una versión de endpoint. */
export interface VersionSpec<T> {
  /** Template del path, con `{vars}` interpolables. */
  readonly path: string
  /** Factory del modelo del recurso. */
  readonly model: ModelFactory<T>
  /** Marca la versión como deprecada (emite warning al resolverla). */
  readonly deprecated?: boolean
}

/** Opciones de {@link Resource.fetch}. */
export interface FetchOptions<T> {
  /** Nombre del endpoint registrado vía `registerVersion`. */
  readonly endpoint: string
  /** Versión a resolver (default: la más reciente registrada). */
  readonly version?: string
  /** Query params del request. */
  readonly params?: Record<string, unknown>
  /** Valores para interpolar `{vars}` en el `path`. */
  readonly pathVars?: Record<string, string>
  /** Factory del modelo. */
  readonly model: ModelFactory<T>
  /**
   * Key del body donde está el payload a deserializar.
   * `null` parsea el body completo (endpoints que devuelven `{results, metadata}`).
   */
  readonly resultsKey?: string | null
}

function parseVersion(version: string): number[] {
  return version.split('.').map(Number)
}

function sortVersions(versions: string[]): string[] {
  return [...versions].sort((a, b) => {
    const pa = parseVersion(a)
    const pb = parseVersion(b)
    for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
      const diff = (pa[i] ?? 0) - (pb[i] ?? 0)
      if (diff !== 0) return diff
    }
    return 0
  })
}

function interpolatePath(
  template: string,
  vars: Record<string, string>,
): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => {
    const value = vars[key]
    if (value === undefined) {
      throw new Error(`Falta la variable de path: {${key}}`)
    }
    return value
  })
}

/**
 * Base de todos los resources: registra endpoints versionados, resuelve la
 * versión por defecto y deserializa las respuestas en modelos.
 *
 * No se usa directamente; los resources lo extienden (ver {@link BCRAClient}).
 */
export class Resource {
  protected readonly transport: Transport
  private readonly _specs: Map<string, Map<string, VersionSpec<unknown>>> =
    new Map()

  constructor(transport: Transport) {
    this.transport = transport
  }

  /** Registra una versión de endpoint (se usa en el `constructor` de cada resource). */
  protected registerVersion(
    endpoint: string,
    version: string,
    spec: VersionSpec<unknown>,
  ): void {
    const endpointSpecs =
      this._specs.get(endpoint) ?? new Map<string, VersionSpec<unknown>>()
    endpointSpecs.set(version, spec)
    this._specs.set(endpoint, endpointSpecs)
  }

  /**
   * Resuelve la versión de un endpoint.
   *
   * Sin `version` devuelve la más reciente (orden semver). Lanza
   * {@link BCRAEndpointVersionError} si el endpoint no tiene versiones o la
   * pedida no existe. Si la resuelta está deprecada emite un `console.warn`.
   */
  protected resolveVersion(
    endpoint: string,
    version?: string,
  ): VersionSpec<unknown> {
    const endpointSpecs = this._specs.get(endpoint)
    if (!endpointSpecs) {
      throw new BCRAEndpointVersionError(
        `No hay versiones registradas para '${endpoint}'.`,
      )
    }

    let resolved: string
    if (version === undefined) {
      resolved = sortVersions([...endpointSpecs.keys()]).at(-1)!
    } else {
      if (!endpointSpecs.has(version)) {
        const disponibles = sortVersions([...endpointSpecs.keys()]).map((v) =>
          endpointSpecs.get(v)!.deprecated ? `${v} (deprecada)` : v,
        )
        throw new BCRAEndpointVersionError(
          `${endpoint} no tiene version '${version}'. Disponibles: ${disponibles.join(', ')}`,
        )
      }
      resolved = version
    }

    const spec = endpointSpecs.get(resolved)!
    if (spec.deprecated) {
      console.warn(`[bcra-sdk] ${endpoint} version ${resolved} esta deprecada`)
    }
    return spec
  }

  /** Versiones registradas de un endpoint, p.ej. `{ '1.0': { deprecated: false } }`. */
  versions(endpoint: string): Record<string, { deprecated: boolean }> {
    const endpointSpecs = this._specs.get(endpoint)
    const versions = sortVersions(
      endpointSpecs ? [...endpointSpecs.keys()] : [],
    )
    const result: Record<string, { deprecated: boolean }> = {}
    for (const v of versions) {
      result[v] = { deprecated: endpointSpecs!.get(v)!.deprecated ?? false }
    }
    return result
  }

  /**
   * Resuelve la versión, interpola `{vars}` en el `path`, ejecuta el request
   * y deserializa la respuesta vía `model`.
   *
   * Con `resultsKey === null` parsea el body completo; si no, parses
   * `body[resultsKey]` (default `'results'`).
   */
  protected async fetch<T>(options: FetchOptions<T>): Promise<T> {
    const {
      endpoint,
      version,
      params,
      pathVars,
      model,
      resultsKey = 'results',
    } = options

    const spec = this.resolveVersion(endpoint, version)
    const path = interpolatePath(spec.path, pathVars ?? {})
    const response = await this.transport.request('GET', path, { params })
    const body: unknown = await response.json()

    const data =
      resultsKey === null ? body : (body as Record<string, unknown>)[resultsKey]

    return model(data)
  }
}
