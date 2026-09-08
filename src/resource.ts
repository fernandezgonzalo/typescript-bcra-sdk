import { BCRAEndpointVersionError } from './errors.js'
import { Transport } from './transport.js'

export type ModelFactory<T> = (data: unknown) => T

export interface VersionSpec<T> {
  readonly path: string
  readonly model: ModelFactory<T>
  readonly deprecated?: boolean
}

export interface FetchOptions<T> {
  readonly endpoint: string
  readonly version?: string
  readonly params?: Record<string, unknown>
  readonly pathVars?: Record<string, string>
  readonly model: ModelFactory<T>
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

export class Resource {
  protected readonly transport: Transport
  private readonly _specs: Map<string, Map<string, VersionSpec<unknown>>> =
    new Map()

  constructor(transport: Transport) {
    this.transport = transport
  }

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
