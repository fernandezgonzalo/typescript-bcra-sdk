# Errores

Todas las fallas del SDK son instancias de `BCRAError`, lo que permite manejarlas con un
único `catch`:

```ts
import { BCRAClient, BCRAError } from 'bcra-sdk'

const bcra = new BCRAClient()
try {
  await bcra.monetarias.getMonetarias()
} catch (error) {
  if (error instanceof BCRAError) {
    console.error(error.message)
  }
}
```

## Jerarquía

```
Error
└── BCRAError
    ├── BCRAHTTPError
    ├── BCRAConnectionError
    │   └── BCRATimeoutError
    └── BCRAEndpointVersionError
```

| Error | Cuándo ocurre | Campos extra |
|---|---|---|
| `BCRAHTTPError` | Respuesta HTTP `!ok` (alcanzó el servidor). | `statusCode`, `body`, `response`, `reason` |
| `BCRAConnectionError` | Error de red (el `fetch` fue rechazado). | — |
| `BCRATimeoutError` | El request superó el timeout configurado. Extiende `BCRAConnectionError`. | — |
| `BCRAEndpointVersionError` | Versión de endpoint no registrada o sin versiones. | — |

## Manejo por tipo

```ts
try {
  await bcra.deudores.getDeudas('20111111112')
} catch (error) {
  if (error instanceof BCRAHTTPError) {
    console.error(`HTTP ${error.statusCode}: ${error.reason}`)
  } else if (error instanceof BCRATimeoutError) {
    console.error('Timeout agotado')
  } else if (error instanceof BCRAConnectionError) {
    console.error('Sin conexión con el BCRA')
  } else if (error instanceof BCRAEndpointVersionError) {
    console.error(error.message)
  }
}
```

Consulta la referencia de tipo en [Errores de API](api/errores.md) y el detalle del
comportamiento de reintentos en [Reintentos](retry.md).