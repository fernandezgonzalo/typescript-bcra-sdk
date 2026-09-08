import {
  BCRAConnectionError,
  BCRAHTTPError,
  BCRATimeoutError,
} from './errors.js'
import { RetryPolicy, parseRetryAfter } from './retry.js'

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms * 1000))
}

export class Transport {
  readonly baseUrl: string
  readonly timeout: number
  readonly retries: RetryPolicy

  constructor(baseUrl: string, timeout = 10_000, retries?: RetryPolicy) {
    this.baseUrl = baseUrl
    this.timeout = timeout
    this.retries = retries ?? new RetryPolicy()
  }

  async request(
    method: string,
    path: string,
    options?: { params?: Record<string, unknown> },
  ): Promise<Response> {
    const url = this.buildUrl(path, options?.params)
    let attempt = 0

    while (true) {
      try {
        const response = await this.perform(method, url)
        this.raiseForStatus(response)
        return response
      } catch (error) {
        if (error instanceof BCRATimeoutError) {
          if (
            !this.retries.retryOnTimeout ||
            attempt >= this.retries.maxRetries
          ) {
            throw error
          }
          const delay = this.retries.delay(attempt)
          await sleep(delay)
          attempt++
        } else if (error instanceof BCRAHTTPError) {
          if (
            !this.retries.statuses.includes(error.statusCode) ||
            attempt >= this.retries.maxRetries
          ) {
            throw error
          }
          const retryAfter = parseRetryAfter(error.response!.headers)
          const delay = retryAfter ?? this.retries.delay(attempt)
          await sleep(delay)
          attempt++
        } else {
          throw error
        }
      }
    }
  }

  private buildUrl(path: string, params?: Record<string, unknown>): string {
    const url = new URL(path, this.baseUrl)
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value != null && value !== '') {
          url.searchParams.set(key, String(value))
        }
      }
    }
    return url.toString()
  }

  private async perform(method: string, url: string): Promise<Response> {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), this.timeout)
    try {
      const response = await globalThis.fetch(url, {
        method,
        signal: controller.signal,
      })
      clearTimeout(timer)
      return response
    } catch (error: unknown) {
      clearTimeout(timer)
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new BCRATimeoutError(`Timeout en ${method} ${url}`)
      }
      throw new BCRAConnectionError(`Error de red en ${method} ${url}`)
    }
  }

  private raiseForStatus(response: Response): void {
    if (!response.ok) {
      throw new BCRAHTTPError(response.status, response.statusText, response)
    }
  }
}
