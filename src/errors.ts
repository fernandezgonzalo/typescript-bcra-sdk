export class BCRAError extends Error {}

export class BCRAHTTPError extends BCRAError {
  readonly statusCode: number
  readonly body: string
  readonly response?: Response
  readonly reason: string | null

  constructor(statusCode: number, message: string, response?: Response) {
    super(`[${statusCode} ${message}]`)
    this.statusCode = statusCode
    this.body = message
    this.response = response
    this.reason = response?.statusText ?? null
  }
}

export class BCRAConnectionError extends BCRAError {}

export class BCRATimeoutError extends BCRAConnectionError {}

export class BCRAEndpointVersionError extends BCRAError {}
