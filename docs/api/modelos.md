# Modelos

El SDK estructura cada respuesta en modelos fuertemente tipados (interfaces `readonly`,
`unknown` sobre `any`). Los campos del JSON se conservan tal cual los devuelve el BCRA
(camelCase o snake_case según endpoint), por fidelidad.

Cada modelo de respuesta tiene su deserializador `fromXxx(data: unknown): Modelo`.
Fechas (`string`/`Date`) se aceptan como input y se normalizan a `YYYY-MM-DD`.

## Respuestas de Deudores

### `ResultGetDeudasV1`

| Campo | Tipo | Descripción |
|---|---|---|
| `identificacion` | `number` | Identificación (CUIT) consultada. |
| `denominacion` | `string` | Denominación del deudor. |
| `periodos` | `readonly Periodo[]` | Períodos con deuda. |

- `Periodo`: `periodo` (`string`, `AAAA-MM`), `entidades` (`readonly Entidad[]`).
- `Entidad`: `entidad`, `situacion`, `fechaSit1` (`string`), `monto` (`number`),
  `diasAtrasoPago` (`number`), `refinanciaciones`, `recategorizacionOblig`,
  `situacionJuridica`, `irrecDisposicionTecnica`, `enRevision`, `procesoJud` (boolean).

### `ResultGetDeudasHistoricasV1`

| Campo | Tipo | Descripción |
|---|---|---|
| `identificacion` | `string` | Identificación (CUIT) consultada. |
| `denominacion` | `string` | Denominación del deudor. |
| `periodos` | `readonly PeriodoHistorica[]` | Períodos con historial. |

- `PeriodoHistorica`: `periodo` (`string`), `entidades` (`readonly EntidadHistorica[]`).
- `EntidadHistorica`: `entidad`, `situacion` (`number`), `monto` (`number`), `enRevision`, `procesoJud`.

### `ResultGetChequesRechazadosV1`

| Campo | Tipo | Descripción |
|---|---|---|
| `identificacion` | `number` | Identificación (CUIT) consultada. |
| `causales` | `readonly Causal[]` | Causales con los cheques rechazados. |

- `Causal`: `causal` (`string`), `entidades` (`readonly EntidadCheque[]`).
- `EntidadCheque`: `entidad` (`number`), `detalle` (`readonly DetalleCheque[]`).
- `DetalleCheque`: `nroCheque`, `fechaRechazo`, `monto`, `fechaPago` (`string \| null`),
  `fechaPagoMulta` (`string \| null`), `estadoMulta` (`string \| null`), `ctaPersonal`,
  `denomJuridica` (`string \| null`), `enRevision`, `procesoJud`.

## Respuestas de Cheques

### `ResultGetEntidadesV1`

| Campo | Tipo | Descripción |
|---|---|---|
| `entidades` | `readonly EntidadBancaria[]` | Listado de entidades. |

- `EntidadBancaria`: `codigoEntidad` (`number`), `denominacion` (`string`).

### `ResultGetChequeDenunciadoV1`

| Campo | Tipo | Descripción |
|---|---|---|
| `numeroCheque` | `number` | Número del cheque consultado. |
| `denunciado` | `boolean` | `true` si el cheque fue denunciado. |
| `fechaProcesamiento` | `string` | Fecha de procesamiento (`YYYY-MM-DD`). |
| `denominacionEntidad` | `string` | Nombre de la entidad que reporta. |
| `detalles` | `readonly DetalleDenuncia[]` | Detalles de la denuncia. |

- `DetalleDenuncia`: `sucursal` (`number`), `numeroCuenta` (`number`), `causal` (`string`).

## Respuestas de Estadísticas Cambiarias

### `ResultGetDivisasV1`

| Campo | Tipo | Descripción |
|---|---|---|
| `divisas` | `readonly Divisa[]` | Listado de divisas. |

- `Divisa`: `codigo` (`string`, ISO), `denominacion` (`string`).

### `ResultGetCotizacionesV1`

| Campo | Tipo | Descripción |
|---|---|---|
| `fecha` | `string \| null` | Fecha de la cotización (`YYYY-MM-DD`). |
| `detalle` | `readonly Cotizacion[]` | Cotizaciones por moneda. |

- `Cotizacion`: `codigoMoneda`, `descripcion`, `tipoPase` (`number`), `tipoCotizacion` (`number`).

### `ResultGetEvolucionMonedaV1`

| Campo | Tipo | Descripción |
|---|---|---|
| `resultset` | `Resultset` | Metadata de paginación. |
| `cotizaciones` | `readonly ResultGetCotizacionesV1[]` | Cotizaciones ordenadas por fecha. |

- `Resultset`: `count`, `offset`, `limit` (`number`).

## Respuestas de Estadísticas Monetarias

### `ResultGetMonetariasV1`

| Campo | Tipo | Descripción |
|---|---|---|
| `resultset` | `Resultset` | Metadata de paginación. |
| `variables` | `readonly VariableMonetaria[]` | Variables monetarias disponibles. |

- `VariableMonetaria`: `idVariable` (`number`), `descripcion`, `categoria`, `tipoSerie`,
  `periodicidad`, `unidadExpresion`, `moneda`, `primerFechaInformada`, `ultFechaInformada`,
  `ultValorInformado` (`number`).

### `ResultGetEvolucionVariableV1`

| Campo | Tipo | Descripción |
|---|---|---|
| `resultset` | `Resultset` | Metadata de paginación. |
| `series` | `readonly SerieMonetaria[]` | Series por variable. |

- `SerieMonetaria`: `idVariable` (`number`), `detalle` (`readonly PuntoSerie[]`).
- `PuntoSerie`: `fecha` (`YYYY-MM-DD`), `valor` (`number`).

### `ResultGetMetodologiasV1`

| Campo | Tipo | Descripción |
|---|---|---|
| `resultset` | `Resultset` | Metadata de paginación. |
| `metodologias` | `readonly Metodologia[]` | Listado de metodologías. |

### `ResultGetMetodologiaV1`

| Campo | Tipo | Descripción |
|---|---|---|
| `metodologia` | `Metodologia` | Detalle de la metodología. |

- `Metodologia`: `id` (`number`), `detalle` (`string`).

## Respuestas de Transparencia

Campo de listado en snake_case, tal cual lo devuelve el BCRA.

| Respuesta | Campo de listado | Ítem |
|---|---|---|
| `ResultGetCajasAhorrosV1` | `cajas_ahorros` | `CajaAhorro` |
| `ResultGetPaquetesProductosV1` | `paquetes_productos` | `PaqueteProducto` |
| `ResultGetPlazosFijosV1` | `plazos_fijos` | `PlazoFijo` |
| `ResultGetPrestamosPrendariosV1` | `prestamos_prendarios` | `PrestamoPrendario` |
| `ResultGetPrestamosHipotecariosV1` | `prestamos_hipotecarios` | `PrestamoHipotecario` |
| `ResultGetPrestamosPersonalesV1` | `prestamos_personales` | `PrestamoPersonal` |
| `ResultGetTarjetasCreditoV1` | `tarjetas_credito` | `TarjetaCredito` |

Campos comunes de los ítems:

- `codigoEntidad` (`number`), `descripcionEntidad`, `fechaInformacion`, `nombreCompleto`,
  `nombreCorto`, `territorioValidez` (`string`), `masInformacion` (`string \| null`).
- Préstamos añaden: `montoMinimoOtorgable`, `montoMaximoOtorgable`, `plazoMaximoOtorgable`,
  `ingresoMinimoMensual`, `antiguedadLaboralMinimaMeses`, `edadMaximaSolicitada`,
  `relacionCuotaIngreso`, `beneficiario`, `cargoMaximoCancelacionAnticipada`,
  `tasaEfectivaAnualMaxima`, `tipoTasa`, `costoFinancieroEfectivoTotalMaximo`,
  `cuotaInicial` (`number`), `destinoFondos`, `denominacion` (`string`).
- `PaqueteProducto` añade `comisionMaximaMantenimiento`, `ingresoMinimoMensual`, `segmento`,
  `productosIntegrantes` (entre otros).
- `TarjetaCredito` añade `comisionMaximaAdministracionMantenimiento`,
  `comisionMaximaRenovacion`, `tasaEfectivaAnualMaximaFinanciacion`,
  `tasaEfectivaAnualMaximaAdelantoEfectivo`, `ingresoMinimoMensual`, `segmento`.

!!! note "Referencia profunda vía TypeDoc"
    Todas las interfaces, sus campos y los deserializadores tipados se documentan en el
    código fuente con TSDoc. Para la referencia completa generada, ejecutá `npm run docs`
    (salida en `api-docs/`).