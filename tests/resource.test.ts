import { describe, it, expect, vi, afterEach } from 'vitest'
import { Resource, type FetchOptions, type VersionSpec } from '../src/resource'
import { Transport } from '../src/transport'
import { BCRAEndpointVersionError } from '../src/errors'

function jsonResponse(body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    statusText: 'OK',
    headers: { 'content-type': 'application/json' },
  })
}

class TestResource extends Resource {
  register(
    endpoint: string,
    version: string,
    spec: VersionSpec<unknown>,
  ): void {
    this.registerVersion(endpoint, version, spec)
  }

  resolve(endpoint: string, version?: string): VersionSpec<unknown> {
    return this.resolveVersion(endpoint, version)
  }

  doFetch<T>(options: FetchOptions<T>): Promise<T> {
    return this.fetch(options)
  }
}

function makeResource(): {
  resource: TestResource
  request: ReturnType<typeof vi.fn>
} {
  const request = vi.fn()
  const transport = { request } as unknown as Transport
  const resource = new TestResource(transport)
  return { resource, request }
}

const model = (data: unknown) => ({ parsed: data })

describe('Resource', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('versions', () => {
    it('returns an empty mapping for an unregistered endpoint', () => {
      const { resource } = makeResource()
      expect(resource.versions('get_foo')).toEqual({})
    })

    it('returns versions sorted by semver with deprecated flags', () => {
      const { resource } = makeResource()
      resource.register('get_foo', '1.0', { path: '/v1', model })
      resource.register('get_foo', '2.0.1', {
        path: '/v2',
        model,
        deprecated: true,
      })
      resource.register('get_foo', '2.0', { path: '/v2.0', model })
      expect(resource.versions('get_foo')).toEqual({
        '1.0': { deprecated: false },
        '2.0': { deprecated: false },
        '2.0.1': { deprecated: true },
      })
    })

    it('sorts equal-prefix versions with differing segment counts', () => {
      const { resource } = makeResource()
      resource.register('get_foo', '1.0.0', { path: '/v1.0.0', model })
      resource.register('get_foo', '1.0', { path: '/v1', model })
      resource.register('get_foo', '2.0', { path: '/v2', model })
      resource.register('get_foo', '2.0.1', { path: '/v2.0.1', model })
      expect(Object.keys(resource.versions('get_foo'))).toEqual([
        '1.0.0',
        '1.0',
        '2.0',
        '2.0.1',
      ])
    })
  })

  describe('resolveVersion', () => {
    it('defaults to the highest registered version when none is given', () => {
      const { resource } = makeResource()
      resource.register('get_foo', '1.0', { path: '/v1', model })
      resource.register('get_foo', '2.0', { path: '/v2', model })
      expect(resource.resolve('get_foo').path).toBe('/v2')
    })

    it('resolves an explicitly requested version', () => {
      const { resource } = makeResource()
      resource.register('get_foo', '1.0', { path: '/v1', model })
      resource.register('get_foo', '2.0', { path: '/v2', model })
      expect(resource.resolve('get_foo', '1.0').path).toBe('/v1')
    })

    it('throws BCRAEndpointVersionError when no versions are registered', () => {
      const { resource } = makeResource()
      expect(() => resource.resolve('get_missing')).toThrow(
        BCRAEndpointVersionError,
      )
      expect(() => resource.resolve('get_missing')).toThrow(
        "No hay versiones registradas para 'get_missing'.",
      )
    })

    it('throws BCRAEndpointVersionError for an unknown version, listing those available', () => {
      const { resource } = makeResource()
      resource.register('get_foo', '1.0', { path: '/v1', model })
      resource.register('get_foo', '2.0', {
        path: '/v2',
        model,
        deprecated: true,
      })
      expect(() => resource.resolve('get_foo', '9.9')).toThrow(
        BCRAEndpointVersionError,
      )
      expect(() => resource.resolve('get_foo', '9.9')).toThrow(
        "get_foo no tiene version '9.9'. Disponibles: 1.0, 2.0 (deprecada)",
      )
    })

    it('warns via console.warn when resolving a deprecated version', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const { resource } = makeResource()
      resource.register('get_foo', '1.0', { path: '/v1', model })
      resource.register('get_foo', '2.0', {
        path: '/v2',
        model,
        deprecated: true,
      })
      resource.resolve('get_foo')
      expect(warn).toHaveBeenCalledWith(
        '[bcra-sdk] get_foo version 2.0 esta deprecada',
      )
    })
  })

  describe('fetch', () => {
    it('extracts body[resultsKey] with the default resultsKey', async () => {
      const { resource, request } = makeResource()
      request.mockResolvedValue(
        jsonResponse({ results: [{ id: 1 }], extra: 'ignored' }),
      )
      resource.register('get_foo', '1.0', { path: '/v1', model })
      const result = await resource.doFetch({
        endpoint: 'get_foo',
        model,
      })
      expect(result).toEqual({ parsed: [{ id: 1 }] })
    })

    it('parses the full body when resultsKey is null', async () => {
      const { resource, request } = makeResource()
      request.mockResolvedValue(jsonResponse({ nested: true }))
      resource.register('get_foo', '1.0', { path: '/v1', model })
      const result = await resource.doFetch({
        endpoint: 'get_foo',
        resultsKey: null,
        model,
      })
      expect(result).toEqual({ parsed: { nested: true } })
    })

    it('interpolates path variables and forwards params to the transport', async () => {
      const { resource, request } = makeResource()
      request.mockResolvedValue(jsonResponse({ results: [] }))
      resource.register('get_foo', '1.0', {
        path: '/centraldedeudores/v1.0/Deudas/{cuit}',
        model,
      })
      await resource.doFetch({
        endpoint: 'get_foo',
        pathVars: { cuit: '20-12345678-9' },
        params: { limit: 5 },
        model,
      })
      expect(request).toHaveBeenCalledWith(
        'GET',
        '/centraldedeudores/v1.0/Deudas/20-12345678-9',
        { params: { limit: 5 } },
      )
    })

    it('throws when a path variable is missing', async () => {
      const { resource, request } = makeResource()
      request.mockResolvedValue(jsonResponse({ results: [] }))
      resource.register('get_foo', '1.0', {
        path: '/foo/{cuit}',
        model,
      })
      await expect(
        resource.doFetch({ endpoint: 'get_foo', model }),
      ).rejects.toThrow('Falta la variable de path: {cuit}')
    })
  })
})
