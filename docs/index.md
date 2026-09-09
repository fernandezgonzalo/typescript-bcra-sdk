# bcra-sdk

SDK en TypeScript para las APIs públicas del **Banco Central de la República Argentina** (BCRA).

`bcra-sdk` ofrece un único cliente (`BCRAClient`) que organiza los endpoints por dominio
(`deudores`, `cheques`, `estadisticasCambiarias`, `monetarias`, `regimenDeTransparencia`)
y estructura cada respuesta en modelos fuertemente tipados.

Tipado completo de punta a punta, dual ESM/CJS, versionado por endpoint y **cero dependencias de runtime**
(usa `fetch` nativo de Node.js >= 18).

## Características

- **Un solo cliente**: toda la API detrás de `BCRAClient`, con `baseUrl` y timeout configurables.
- **Respuestas tipadas**: cada endpoint devuelve un modelo tipado (interfaces `readonly`), sin manejar JSON crudo.
- **Endpoints versionados**: cada endpoint resuelve su versión más reciente por defecto y permite forzar una versión.
- **Reintentos automáticos**: backoff exponencial ante errores transitorios, con soporte `Retry-After` (configurable vía `RetryPolicy`).
- **Errores explícitos**: jerarquía propia (`BCRAError`, `BCRAHTTPError`, `BCRAConnectionError`, `BCRATimeoutError`, `BCRAEndpointVersionError`).
- **Cero dependencias de runtime**: Node.js >= 18 con `fetch`, `AbortController` y `Response` nativos.

## Cobertura

El SDK cubre las **5 APIs públicas** que el BCRA ofrece en
[`api.bcra.gob.ar`](https://www.bcra.gob.ar/apis-banco-central/): Central de Deudores,
Cheques denunciados, Estadísticas Cambiarias, Estadísticas Monetarias y Régimen de Transparencia.
Son **19 endpoints**.

| API oficial (BCRA) | Resource | Endpoints |
|---|---|---|
| Central de Deudores | `bcra.deudores` | `getDeudas`, `getDeudasHistoricas`, `getChequesRechazados` |
| Cheques denunciados | `bcra.cheques` | `getEntidades`, `getChequeDenunciado` |
| Estadísticas Cambiarias | `bcra.estadisticasCambiarias` | `getDivisas`, `getCotizaciones`, `getEvolucionMoneda` |
| Estadísticas Monetarias | `bcra.monetarias` | `getMonetarias`, `getEvolucionVariable`, `getMetodologias`, `getMetodologia` |
| Régimen de Transparencia | `bcra.regimenDeTransparencia` | `getCajasAhorros`, `getPaquetesProductos`, `getPlazosFijos`, `getPrestamosPrendarios`, `getPrestamosHipotecarios`, `getPrestamosPersonales`, `getTarjetasCredito` |

Estadísticas Monetarias usa la versión actual `v4.0` (que incluye Principales Variables;
`v1.0`–`v3.0` quedaron deprecadas por el BCRA). Cada endpoint registra sus versiones disponibles
y resuelve por defecto a la más reciente; consultalas con `bcra.monetarias.versions('getMonetarias')`.

## Contenido

- [Instalación](instalacion.md)
- [Guía rápida](guia-rapida.md)
- Endpoints
    - [Deudores](endpoints/deudores.md)
    - [Cheques](endpoints/cheques.md)
    - [Estadísticas cambiarias](endpoints/estadisticas-cambiarias.md)
    - [Monetarias](endpoints/monetarias.md)
    - [Régimen de Transparencia](endpoints/transparencia.md)
- API Reference
    - [Cliente y configuración](api/cliente.md)
    - [Recursos](api/recursos.md)
    - [Modelos](api/modelos.md)
    - [Errores](api/errores.md)
- [Versionado de endpoints](versionado.md)
- [Reintentos](retry.md)
- [Errores](errores.md)
- [Contribución](contribucion.md)
- [Changelog](changelog.md)

## Licencia

[MIT](https://github.com/gonzadev/typescript-bcra-sdk/blob/main/LICENSE)