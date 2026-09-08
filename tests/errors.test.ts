import { describe, it, expect } from 'vitest'
import {
  BCRAError,
  BCRAHTTPError,
  BCRAConnectionError,
  BCRATimeoutError,
  BCRAEndpointVersionError,
} from '../src/errors'

describe('BCRAError', () => {
  it('is an Error and keeps the given message', () => {
    const err = new BCRAError('boom')
    expect(err).toBeInstanceOf(Error)
    expect(err).toBeInstanceOf(BCRAError)
    expect(err.message).toBe('boom')
  })
})

describe('BCRAHTTPError', () => {
  it('exposes statusCode, body, response and reason', () => {
    const response = { statusText: 'Not Found' } as Response
    const err = new BCRAHTTPError(404, 'No existe', response)
    expect(err).toBeInstanceOf(Error)
    expect(err).toBeInstanceOf(BCRAError)
    expect(err).toBeInstanceOf(BCRAHTTPError)
    expect(err.statusCode).toBe(404)
    expect(err.body).toBe('No existe')
    expect(err.message).toBe('[404 No existe]')
    expect(err.response).toBe(response)
    expect(err.reason).toBe('Not Found')
  })

  it('keeps response and reason as undefined/null when no response is given', () => {
    const err = new BCRAHTTPError(500, 'error')
    expect(err.message).toBe('[500 error]')
    expect(err.response).toBeUndefined()
    expect(err.reason).toBeNull()
  })
})

describe('BCRAConnectionError', () => {
  it('inherits from BCRAError and Error', () => {
    const err = new BCRAConnectionError('network down')
    expect(err).toBeInstanceOf(Error)
    expect(err).toBeInstanceOf(BCRAError)
    expect(err).toBeInstanceOf(BCRAConnectionError)
  })
})

describe('BCRATimeoutError', () => {
  it('inherits from BCRAConnectionError', () => {
    const err = new BCRATimeoutError('timeout')
    expect(err).toBeInstanceOf(Error)
    expect(err).toBeInstanceOf(BCRAError)
    expect(err).toBeInstanceOf(BCRAConnectionError)
    expect(err).toBeInstanceOf(BCRATimeoutError)
  })
})

describe('BCRAEndpointVersionError', () => {
  it('inherits from BCRAError and Error', () => {
    const err = new BCRAEndpointVersionError('no version')
    expect(err).toBeInstanceOf(Error)
    expect(err).toBeInstanceOf(BCRAError)
    expect(err).toBeInstanceOf(BCRAEndpointVersionError)
  })
})
