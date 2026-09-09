# Recursos

Los resources extienden la clase base `Resource`, que registra endpoints versionados,
resuelve la versión por defecto y deserializa las respuestas en modelos tipados.
No se usa directamente; se accede como propiedades de `BCRAClient`.

## Deudores

`bcra.deudores` — Central de Deudores.

| Método | Endpoint | Versión |
|---|---|---|
| [`getDeudas`](../endpoints/deudores.md#getdeudas) | `GET /centraldedeudores/v1.0/Deudas/{cuit}` | 1.0 |
| [`getDeudasHistoricas`](../endpoints/deudores.md#getdeudashistoricas) | `GET /CentralDeDeudores/v1.0/Deudas/Historicas/{identification}` | 1.0 |
| [`getChequesRechazados`](../endpoints/deudores.md#getchequesrechazados) | `GET /centraldedeudores/v1.0/Deudas/ChequesRechazados/{identification}` | 1.0 |

## Cheques

`bcra.cheques` — Cheques denunciados.

| Método | Endpoint | Versión |
|---|---|---|
| [`getEntidades`](../endpoints/cheques.md#getentidades) | `GET /cheques/v1.0/entidades` | 1.0 |
| [`getChequeDenunciado`](../endpoints/cheques.md#getchequedenunciado) | `GET /cheques/v1.0/denunciados/{codigoEntidad}/{numeroCheque}` | 1.0 |

## EstadisticasCambiarias

`bcra.estadisticasCambiarias` — Divisas y cotizaciones.

| Método | Endpoint | Versión |
|---|---|---|
| [`getDivisas`](../endpoints/estadisticas-cambiarias.md#getdivisas) | `GET /estadisticascambiarias/v1.0/Maestros/Divisas` | 1.0 |
| [`getCotizaciones`](../endpoints/estadisticas-cambiarias.md#getcotizaciones) | `GET /estadisticascambiarias/v1.0/Cotizaciones` | 1.0 |
| [`getEvolucionMoneda`](../endpoints/estadisticas-cambiarias.md#getevolucionmoneda) | `GET /estadisticascambiarias/v1.0/Cotizaciones/{moneda}` | 1.0 |

## Monetarias

`bcra.monetarias` — Estadísticas monetarias (API v4.0).

| Método | Endpoint | Versión |
|---|---|---|
| [`getMonetarias`](../endpoints/monetarias.md#getmonetarias) | `GET /estadisticas/v4.0/monetarias` | 4.0 |
| [`getEvolucionVariable`](../endpoints/monetarias.md#getevolucionvariable) | `GET /estadisticas/v4.0/monetarias/{idVariable}` | 4.0 |
| [`getMetodologias`](../endpoints/monetarias.md#getmetodologias) | `GET /estadisticas/v4.0/metodologia` | 4.0 |
| [`getMetodologia`](../endpoints/monetarias.md#getmetodologia) | `GET /estadisticas/v4.0/metodologia/{idVariable}` | 4.0 |

## RegimenDeTransparencia

`bcra.regimenDeTransparencia` — Cajas de ahorro, paquetes, plazos fijos y préstamos.

| Método | Endpoint | Versión |
|---|---|---|
| [`getCajasAhorros`](../endpoints/transparencia.md#getcajasahorros) | `GET /transparencia/v1.0/CajasAhorros` | 1.0 |
| [`getPaquetesProductos`](../endpoints/transparencia.md#getpaquetesproductos) | `GET /transparencia/v1.0/PaquetesProductos` | 1.0 |
| [`getPlazosFijos`](../endpoints/transparencia.md#getplazosfijos) | `GET /transparencia/v1.0/PlazosFijos` | 1.0 |
| [`getPrestamosPrendarios`](../endpoints/transparencia.md#getprestamosprendarios) | `GET /transparencia/v1.0/Prestamos/Prendarios` | 1.0 |
| [`getPrestamosHipotecarios`](../endpoints/transparencia.md#getprestamoshipotecarios) | `GET /transparencia/v1.0/Prestamos/Hipotecarios` | 1.0 |
| [`getPrestamosPersonales`](../endpoints/transparencia.md#getprestamospersonales) | `GET /transparencia/v1.0/Prestamos/Personales` | 1.0 |
| [`getTarjetasCredito`](../endpoints/transparencia.md#gettarjetascredito) | `GET /transparencia/v1.0/TarjetasCredito` | 1.0 |

## Base: `Resource`

Clase interna (no se usa directamente) con el mecanismo de versionado y fetch:

- `registerVersion(endpoint, version, spec)` — registra una versión de endpoint (protected).
- `resolveVersion(endpoint, version?)` — resuelve la versión; sin `version` usa la más reciente.
- `versions(endpoint)` — versiones registradas de un endpoint, por ejemplo `{ '1.0': { deprecated: false } }`.
- `fetch(options)` — resuelve versión, interpola `{vars}`, ejecuta el request y deserializa. Lanza
  [`BCRAEndpointVersionError`](../errores.md) en versiones inexistentes y emite `console.warn` en versiones deprecadas.

Ver [Versionado de endpoints](../versionado.md) para el detalle.