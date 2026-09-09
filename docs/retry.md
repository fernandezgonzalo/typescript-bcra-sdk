# Reintentos

El `Transport` reintenta automáticamente ante **errores transitorios**: timeout y status
HTTP de servidor. La configuración se define con `RetryPolicy` y se pasa al `BCRAClient`.

```ts
import { BCRAClient, RetryPolicy } from 'bcra-sdk'

const bcra = new BCRAClient({
  retries: new RetryPolicy({ maxRetries: 3, backoff: 1 }),
})
```

## Política por defecto

| Opción | Default |
|---|---|
| `maxRetries` | `2` |
| `backoff` | `0.5` segundos |
| `retryOnTimeout` | `true` |
| `statuses` | `[429, 500, 502, 503, 504]` |

## Backoff exponencial

El tiempo de espera antes del reintento `attempt` es `backoff * 2**attempt`
(`RetryPolicy.delay(attempt)`):

| Reintento | Espera (`backoff` 0.5) | Espera (`backoff` 1) |
|---|---|---|
| 0 | 0.5 s | 1 s |
| 1 | 1 s | 2 s |
| 2 | 2 s | 4 s |

## Soporte `Retry-After`

Cuando la respuesta trae el header `Retry-After` (en segundos o fecha HTTP), se respeta
por sobre el backoff calculado. El parseo lo hace `parseRetryAfter`, exportado públicamente:

```ts
import { parseRetryAfter } from 'bcra-sdk'

const seconds = parseRetryAfter(response.headers) // number | null
```

## Desactivar reintentos

```ts
const bcra = new BCRAClient({
  retries: new RetryPolicy({ maxRetries: 0 }),
})
```

## Qué reintenta

- **Timeout** (`BCRATimeoutError`): solo si `retryOnTimeout` es `true`.
- **Status HTTP**: solo los listados en `statuses` (`429`, `500`, `502`, `503`, `504`).

Los errores de red (`BCRAConnectionError`, sin respuesta HTTP) no se reintentan.

## Ver también

- [Cliente y configuración](api/cliente.md) — `RetryPolicy` y `parseRetryAfter`.
- [Errores](errores.md) — jerarquía de errores del SDK.