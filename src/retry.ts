export interface RetryPolicyOptions {
  maxRetries?: number
  backoff?: number
  retryOnTimeout?: boolean
  statuses?: number[]
}

export class RetryPolicy {
  readonly maxRetries: number
  readonly backoff: number
  readonly retryOnTimeout: boolean
  readonly statuses: number[]

  constructor(options: RetryPolicyOptions = {}) {
    this.maxRetries = options.maxRetries ?? 2
    this.backoff = options.backoff ?? 0.5
    this.retryOnTimeout = options.retryOnTimeout ?? true
    this.statuses = options.statuses ?? [429, 500, 502, 503, 504]
  }

  delay(attempt: number): number {
    return this.backoff * 2 ** attempt
  }
}

function isHeaders(
  headers: Headers | Record<string, string>,
): headers is Headers {
  return typeof (headers as Headers).get === 'function'
}

export function parseRetryAfter(
  headers: Headers | Record<string, string>,
): number | null {
  let value: string | null
  if (isHeaders(headers)) {
    value = headers.get('retry-after')
  } else {
    value = headers['retry-after'] ?? headers['Retry-After'] ?? null
  }
  if (value == null) return null
  const trimmed = value.trim()
  if (trimmed.length === 0) return null

  const seconds = Number(trimmed)
  if (Number.isFinite(seconds)) return Math.max(0, seconds)

  const parsed = Date.parse(trimmed)
  if (Number.isNaN(parsed)) return null
  return Math.max(0, (parsed - Date.now()) / 1000)
}
