import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { Transport } from '../src/transport'
import {
  BCRATimeoutError,
  BCRAConnectionError,
  BCRAHTTPError,
} from '../src/errors'
import { RetryPolicy } from '../src/retry'

function jsonResponse(body: unknown, init?: ResponseInit): Response {
  return new Response(JSON.stringify(body), {
    status: init?.status ?? 200,
    statusText: init?.statusText ?? 'OK',
    headers: { 'content-type': 'application/json', ...init?.headers },
  })
}

describe('Transport', () => {
  let fetchMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.useRealTimers()
  })

  it('uses default timeout and RetryPolicy when no options are given', () => {
    const transport = new Transport('https://api.bcra.gob.ar')
    expect(transport.baseUrl).toBe('https://api.bcra.gob.ar')
    expect(transport.timeout).toBe(10_000)
    expect(transport.retries).toBeInstanceOf(RetryPolicy)
    expect(transport.retries.maxRetries).toBe(2)
  })

  it('stores custom timeout and RetryPolicy', () => {
    const retries = new RetryPolicy({ maxRetries: 4 })
    const transport = new Transport('https://x', 5000, retries)
    expect(transport.timeout).toBe(5000)
    expect(transport.retries).toBe(retries)
  })

  it('performs a GET without params', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ ok: true }))
    const transport = new Transport('https://api.bcra.gob.ar')
    const res = await transport.request('GET', '/v1.0/test')
    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('https://api.bcra.gob.ar/v1.0/test')
    expect(init.method).toBe('GET')
    expect(await res.json()).toEqual({ ok: true })
  })

  it('serializes query params, filtering undefined/null/empty', async () => {
    fetchMock.mockResolvedValue(jsonResponse({}))
    const transport = new Transport('https://api.bcra.gob.ar')
    await transport.request('GET', '/v1.0/test', {
      params: { a: '1', b: undefined, c: null, d: '', e: 0, f: true },
    })
    const url = fetchMock.mock.calls[0][0] as string
    const u = new URL(url)
    expect(u.pathname).toBe('/v1.0/test')
    expect(u.searchParams.get('a')).toBe('1')
    expect(u.searchParams.get('e')).toBe('0')
    expect(u.searchParams.get('f')).toBe('true')
    expect(u.searchParams.get('b')).toBeNull()
    expect(u.searchParams.get('c')).toBeNull()
    expect(u.searchParams.get('d')).toBeNull()
  })

  it('throws BCRAHTTPError for a non-retryable status', async () => {
    fetchMock.mockResolvedValue(
      new Response('nope', {
        status: 404,
        statusText: 'Not Found',
      }),
    )
    const transport = new Transport('https://api.bcra.gob.ar')
    const promise = transport.request('GET', '/v1.0/foo')
    await expect(promise).rejects.toBeInstanceOf(BCRAHTTPError)
    await expect(promise).rejects.toMatchObject({
      statusCode: 404,
      body: 'Not Found',
    })
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('retries a retryable status then succeeds using exponential backoff', async () => {
    fetchMock
      .mockResolvedValueOnce(
        new Response('err', { status: 500, statusText: 'Server Error' }),
      )
      .mockResolvedValueOnce(jsonResponse({ recovered: true }))
    const transport = new Transport('https://api.bcra.gob.ar')
    const res = await transport.request('GET', '/v1.0/foo')
    expect(await res.json()).toEqual({ recovered: true })
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('gives up after exhausting max retries for a retryable status', async () => {
    fetchMock.mockResolvedValue(
      new Response('err', { status: 503, statusText: 'Unavailable' }),
    )
    const transport = new Transport(
      'https://api.bcra.gob.ar',
      10_000,
      new RetryPolicy({ maxRetries: 1 }),
    )
    await expect(transport.request('GET', '/v1.0/foo')).rejects.toBeInstanceOf(
      BCRAHTTPError,
    )
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('uses Retry-After header delay when present for retryable status', async () => {
    vi.useFakeTimers()
    const headers = new Headers({ 'Retry-After': '5' })
    fetchMock
      .mockResolvedValueOnce(
        new Response('err', { status: 429, statusText: 'Too Many', headers }),
      )
      .mockResolvedValueOnce(jsonResponse({ ok: true }))
    const transport = new Transport('https://api.bcra.gob.ar')
    const promise = transport.request('GET', '/v1.0/foo')
    await vi.advanceTimersByTimeAsync(6000)
    const res = await promise
    expect(await res.json()).toEqual({ ok: true })
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('throws on the first attempt for a status not in retries list', async () => {
    fetchMock.mockResolvedValue(
      new Response('conflict', { status: 409, statusText: 'Conflict' }),
    )
    const transport = new Transport('https://api.bcra.gob.ar')
    await expect(transport.request('GET', '/v1.0/foo')).rejects.toBeInstanceOf(
      BCRAHTTPError,
    )
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('maps a network failure to BCRAConnectionError', async () => {
    fetchMock.mockRejectedValue(new TypeError('fetch failed'))
    const transport = new Transport('https://api.bcra.gob.ar')
    await expect(transport.request('GET', '/v1.0/foo')).rejects.toBeInstanceOf(
      BCRAConnectionError,
    )
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('maps an abort to BCRATimeoutError', async () => {
    vi.useFakeTimers()
    fetchMock.mockImplementation(
      (_url: string, init?: RequestInit) =>
        new Promise((_resolve, reject) => {
          init?.signal?.addEventListener('abort', () => {
            reject(new DOMException('Aborted', 'AbortError'))
          })
        }),
    )
    const transport = new Transport(
      'https://api.bcra.gob.ar',
      50,
      new RetryPolicy({ retryOnTimeout: false }),
    )
    const promise = transport.request('GET', '/v1.0/foo')
    const assertion = expect(promise).rejects.toBeInstanceOf(BCRATimeoutError)
    await vi.advanceTimersByTimeAsync(200)
    await assertion
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('does not retry on timeout when retryOnTimeout is false', async () => {
    vi.useFakeTimers()
    fetchMock.mockImplementation(
      (_url: string, init?: RequestInit) =>
        new Promise((_resolve, reject) => {
          init?.signal?.addEventListener('abort', () => {
            reject(new DOMException('Aborted', 'AbortError'))
          })
        }),
    )
    const transport = new Transport(
      'https://api.bcra.gob.ar',
      50,
      new RetryPolicy({ retryOnTimeout: false }),
    )
    const promise = transport.request('GET', '/v1.0/foo')
    const assertion = expect(promise).rejects.toBeInstanceOf(BCRATimeoutError)
    await vi.advanceTimersByTimeAsync(100)
    await assertion
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('retries a timeout then succeeds when retryOnTimeout is true', async () => {
    vi.useFakeTimers()
    fetchMock
      .mockImplementationOnce(
        (_url: string, init?: RequestInit) =>
          new Promise((_resolve, reject) => {
            init?.signal?.addEventListener('abort', () => {
              reject(new DOMException('Aborted', 'AbortError'))
            })
          }),
      )
      .mockResolvedValueOnce(jsonResponse({ ok: true }))
    const transport = new Transport('https://api.bcra.gob.ar', 50)
    const promise = transport.request('GET', '/v1.0/foo')
    await vi.advanceTimersByTimeAsync(2000)
    const res = await promise
    expect(await res.json()).toEqual({ ok: true })
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('throws the last timeout after exhausting max retries', async () => {
    vi.useFakeTimers()
    fetchMock.mockImplementation(
      (_url: string, init?: RequestInit) =>
        new Promise((_resolve, reject) => {
          init?.signal?.addEventListener('abort', () => {
            reject(new DOMException('Aborted', 'AbortError'))
          })
        }),
    )
    const transport = new Transport(
      'https://api.bcra.gob.ar',
      50,
      new RetryPolicy({ maxRetries: 1 }),
    )
    const promise = transport.request('GET', '/v1.0/foo')
    const assertion = expect(promise).rejects.toBeInstanceOf(BCRATimeoutError)
    await vi.advanceTimersByTimeAsync(2000)
    await assertion
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('rethrows a network BCRAConnectionError as-is', async () => {
    fetchMock.mockRejectedValue(new TypeError('fetch failed'))
    const transport = new Transport('https://api.bcra.gob.ar')
    const promise = transport.request('GET', '/v1.0/foo')
    await expect(promise).rejects.toBeInstanceOf(BCRAConnectionError)
    await expect(promise).rejects.toMatchObject({
      message: 'Error de red en GET https://api.bcra.gob.ar/v1.0/foo',
    })
  })
})
