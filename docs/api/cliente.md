# Cliente y configuración

## `BCRAClient`

Cliente único que agrupa todos los endpoints públicos del BCRA. No abre conexiones
hasta la primera petición: el transporte se comparte entre todos los resources y se
crea de forma perezosa (`fetch` nativo no mantiene un pool, por lo que no requiere liberación).

```ts
const bcra = new BCRAClient()
```

Exposición de resources por dominio:

| Propiedad | Resource |
|---|---|
| `bcra.deudores` | [`Deudores`](../api/recursos.md#deudores) |
| `bcra.cheques` | [`Cheques`](../api/recursos.md#cheques) |
| `bcra.estadisticasCambiarias` | [`EstadisticasCambiarias`](../api/recursos.md#estadisticascambiarias) |
| `bcra.monetarias` | [`Monetarias`](../api/recursos.md#monetarias) |
| `bcra.regimenDeTransparencia` | [`RegimenDeTransparencia`](../api/recursos.md#regimendetransparencia) |

### `close()`

Cierra el cliente. Es un no-op (el `fetch` nativo no mantiene conexiones persistentes
que liberar); se mantiene por paridad con el SDK Python.

## `BCRAClientOptions`

Opciones de configuración del cliente. Todas opcionales:

| Opción | Tipo | Default | Descripción |
|---|---|---|---|
| `baseUrl` | `string` | `https://api.bcra.gob.ar` | URL base de la API. |
| `timeout` | `number` | `10_000` | Timeout por request en ms. |
| `retries` | [`RetryPolicy`](../api/cliente.md#retrypolicy) | `new RetryPolicy()` | Política de reintentos. Pasá `new RetryPolicy({ maxRetries: 0 })` para desactivarlos. |

```ts
import { BCRAClient, RetryPolicy } from 'bcra-sdk'

const bcra = new BCRAClient({
  baseUrl: 'https://api.bcra.gob.ar',
  timeout: 5000,
  retries: new RetryPolicy({ maxRetries: 3, backoff: 1 }),
})
```

## `RetryPolicy`

Configuración de reintentos con backoff exponencial. Se construye con `RetryPolicyOptions`
(todos los campos opcionales):

| Opción | Default | Descripción |
|---|---|---|
| `maxRetries` | `2` | Cantidad máxima de reintentos por request. |
| `backoff` | `0.5` | Base del backoff exponencial en segundos: `backoff * 2**attempt`. |
| `retryOnTimeout` | `true` | Reintentar también cuando el error es un timeout. |
| `statuses` | `[429, 500, 502, 503, 504]` | Status HTTP que disparan reintento. |

### `delay(attempt): number`

Segundos a esperar antes del reintento `attempt`: `backoff * 2**attempt`.

## `parseRetryAfter(headers): number | null`

Parsea el header `Retry-After` (segundos o fecha HTTP). Devuelve `null` si el header
está ausente o es inválido. Nunca devuelve un valor negativo (floors a 0).

```ts
import { parseRetryAfter } from 'bcra-sdk'

const retryAfter = parseRetryAfter(response.headers)
```

Ver [Reintentos](../retry.md) para el detalle del comportamiento.

## `VERSION`

Versión del SDK, sincronizada con `package.json`:

```ts
import { VERSION } from 'bcra-sdk'
console.log(VERSION) // '0.1.0'
```