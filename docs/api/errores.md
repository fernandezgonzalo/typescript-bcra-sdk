# Errores de API

Jerarquía de errores del SDK, todos exportados desde `bcra-sdk`.

## Jerarquía

```
Error
└── BCRAError
    ├── BCRAHTTPError
    ├── BCRAConnectionError
    │   └── BCRATimeoutError
    └── BCRAEndpointVersionError
```

Todas las fallas (HTTP, red, timeout, versión de endpoint) se exponen como
subclases de `BCRAError`, por lo que un único `catch` sobre `BCRAError` alcanza
para manejar cualquier error del cliente:

```ts
import { BCRAClient, BCRAError } from 'bcra-sdk'

const bcra = new BCRAClient()
try {
  const deudas = await bcra.deudores.getDeudas('20111111112')
} catch (error) {
  if (error instanceof BCRAError) {
    console.error(error.message)
  }
}
```

## `BCRAError`

Error base de todo el SDK. Cualquier falla del cliente lo extiende.

## `BCRAHTTPError`

Error devuelto cuando el BCRA responde con status HTTP `!ok`.

| Campo | Tipo | Descripción |
|---|---|---|
| `statusCode` | `number` | Código de status HTTP de la respuesta. |
| `body` | `string` | Cuerpo del error (`statusText` de la respuesta). |
| `response` | `Response \| undefined` | Respuesta HTTP original, si está disponible. |
| `reason` | `string \| null` | `statusText` de la respuesta (`null` si no hay respuesta). |

```ts
try {
  await bcra.deudores.getDeudas('20111111112')
} catch (error) {
  if (error instanceof BCRAHTTPError) {
    console.error(error.statusCode, error.reason)
  }
}
```

!!! note "404 en Central de Deudores"
    La identificación de ejemplo `20111111112` devuelve `404` en el entorno real del
    BCRA, capturado en los fixtures de tests.

## `BCRAConnectionError`

Error de red: el `fetch` fue rechazado por problemas de conectividad.

## `BCRATimeoutError`

Error de timeout: el request superó el timeout configurado (vía `AbortController`).
Extiende `BCRAConnectionError`.

## `BCRAEndpointVersionError`

Lanzado al pedir una versión de endpoint no registrada o sin versiones.

```ts
try {
  await bcra.estadisticasCambiarias.getDivisas({ version: '9.0' })
} catch (error) {
  if (error instanceof BCRAEndpointVersionError) {
    console.error(error.message) // getDivisas no tiene version '9.0'. Disponibles: 1.0
  }
}
```

Ver [Versionado de endpoints](../versionado.md) para el detalle.