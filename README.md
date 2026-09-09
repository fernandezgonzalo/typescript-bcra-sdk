# bcra-sdk

SDK en TypeScript para las APIs públicas del **Banco Central de la República Argentina** (BCRA).

Tipado completo de punta a punta, dual ESM/CJS, versionado por endpoint y **cero dependencias de runtime** (usa `fetch` nativo de Node.js ≥ 18).

`BCRAClient` es un único cliente que organiza los endpoints por dominio (`deudores`, `cheques`, `estadisticasCambiarias`, `monetarias`, `regimenDeTransparencia`)
y estructura las respuestas en modelos fuertemente tipados. Los endpoints están versionados, resuelven por defecto
la versión más reciente y permiten forzar una versión.

Características:

- Un método async por endpoint (fetch nativo; sin pares sync/async).
- Reintentos automáticos ante errores transitorios con backoff exponencial y soporte `Retry-After` (configurables vía `RetryPolicy`).
- Errores de red, timeout y HTTP unificados bajo `BCRAError`.
- Inputs tipados: fechas como `string` ISO o `Date`; validación de CUIT en `getDeudas`.
- Cero dependencias de runtime: Node.js ≥ 18 con `fetch`, `AbortController` y `Response` nativos.

## Cobertura

El SDK cubre las **5 APIs públicas** que el BCRA ofrece en
[`api.bcra.gob.ar`](https://www.bcra.gob.ar/apis-banco-central/): Central de
Deudores, Cheques denunciados, Estadísticas Cambiarias, Estadísticas
Monetarias y Régimen de Transparencia. Son **19 endpoints**.

| API oficial (BCRA) | Resource | Endpoints |
|---|---|---|
| Central de Deudores | `bcra.deudores` | `getDeudas`, `getDeudasHistoricas`, `getChequesRechazados` |
| Cheques denunciados | `bcra.cheques` | `getEntidades`, `getChequeDenunciado` |
| Estadísticas Cambiarias | `bcra.estadisticasCambiarias` | `getDivisas`, `getCotizaciones`, `getEvolucionMoneda` |
| Estadísticas Monetarias | `bcra.monetarias` | `getMonetarias`, `getEvolucionVariable`, `getMetodologias`, `getMetodologia` |
| Régimen de Transparencia | `bcra.regimenDeTransparencia` | `getCajasAhorros`, `getPaquetesProductos`, `getPlazosFijos`, `getPrestamosPrendarios`, `getPrestamosHipotecarios`, `getPrestamosPersonales`, `getTarjetasCredito` |

Estadísticas Monetarias usa la versión actual `v4.0` (que incluye Principales
Variables; `v1.0`–`v3.0` quedaron deprecadas por el BCRA). Cada endpoint
registra sus versiones disponibles y resuelve por defecto a la más reciente;
consultalas con `bcra.monetarias.versions('getMonetarias')`.

## Instalación

```bash
npm install bcra-sdk
```

Requiere **Node.js >= 18** (usa `fetch` nativo).

## Uso rápido

```ts
import { BCRAClient } from 'bcra-sdk'

const bcra = new BCRAClient()

// Deudas de un CUIT (lo normaliza incluso con guiones)
const deudas = await bcra.deudores.getDeudas('20111111112')
console.log(deudas.denominacion)

// Cotizaciones de una fecha
const cotizaciones = await bcra.estadisticasCambiarias.getCotizaciones(
  '2024-06-12',
)
for (const c of cotizaciones.detalle) {
  console.log(c.codigoMoneda, c.tipoCotizacion)
}

// Variables monetarias (v4.0)
const monetarias = await bcra.monetarias.getMonetarias()
for (const v of monetarias.variables) {
  console.log(v.idVariable, v.descripcion)
}

// Régimen de transparencia
const cajas = await bcra.regimenDeTransparencia.getCajasAhorros(11)
for (const caja of cajas.cajas_ahorros) {
  console.log(caja.descripcionEntidad)
}

bcra.close()
```

Campos del JSON se conservan tal cual los devuelve el BCRA (camelCase o
snake_case según endpoint), por fidelidad. Fechas se pueden pasar como
`Date` o `string` ISO.

## Errores

Todas las fallas son instancias de `BCRAError`:

- `BCRAHTTPError` — respuesta HTTP `!ok` (incluye `statusCode`, `reason` y `response`).
- `BCRAConnectionError` — error de red.
- `BCRATimeoutError` — timeout del request.
- `BCRAEndpointVersionError` — versión de endpoint no registrada.

## Documentación

La documentación completa de la API (generada con TypeDoc) se compila con:

```bash
npm run docs
```

## Desarrollo

```bash
npm install             # instalar dependencias
npm run typecheck       # chequeo de tipos (solo src/)
npm test                # tests unitarios (Vitest)
npm run test:coverage   # coverage con thresholds 100%
npm run lint            # ESLint
npm run format:check    # Prettier
npm run build           # build dual ESM/CJS con tsup
```

Los tests no llaman a la API real: usan respuestas grabadas en
`tests/fixtures/` (offline, un JSON por endpoint). Para re-grabar los
fixtures contra la API real:

```bash
npm run record:fixtures
```

Los fixtures incluyen las respuestas reales para los 19 endpoints; para
Central de Deudores la identificación de ejemplo (`20111111112`) devuelve
`404`, igual que en el SDK Python de referencia. Correspondencia de
verificación: `typecheck` → `test` → `lint` → `format:check` → `build`.

## Licencia

[MIT](./LICENSE)