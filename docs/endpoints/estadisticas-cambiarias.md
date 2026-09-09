# Endpoint de estadísticas cambiarias

Divisas y cotizaciones. Se accede vía `bcra.estadisticasCambiarias`.

Versiones registradas: `1.0` para los tres métodos.

## `getDivisas`

Maestro de divisas.

`GET /estadisticascambiarias/v1.0/Maestros/Divisas`

```ts
const divisas = await bcra.estadisticasCambiarias.getDivisas()
for (const divisa of divisas.divisas) {
  console.log(divisa.codigo, divisa.denominacion)
}
```

Parámetros:

| Parámetro | Tipo | Descripción |
|---|---|---|
| `opts.version` | `string` | Versión del endpoint (default: `1.0`). |

Modelo de respuesta: [`ResultGetDivisasV1`](../api/modelos.md#respuestas-de-estadisticas-cambiarias).

## `getCotizaciones`

Cotizaciones de todas las monedas para una fecha.

`GET /estadisticascambiarias/v1.0/Cotizaciones`

```ts
const cotizaciones = await bcra.estadisticasCambiarias.getCotizaciones(
  '2024-06-12',
)
console.log(cotizaciones.fecha)
for (const c of cotizaciones.detalle) {
  console.log(c.codigoMoneda, c.tipoCotizacion)
}
```

Sin fecha, el BCRA devuelve la cotización más reciente:

```ts
const cotizaciones = await bcra.estadisticasCambiarias.getCotizaciones()
```

Parámetros:

| Parámetro | Tipo | Descripción |
|---|---|---|
| `fecha` | `string \| Date` | Fecha a consultar (`YYYY-MM-DD` o `Date`). Opcional: sin fecha devuelve la cotización más reciente. |
| `opts.version` | `string` | Versión del endpoint (default: `1.0`). |

Modelo de respuesta: [`ResultGetCotizacionesV1`](../api/modelos.md#respuestas-de-estadisticas-cambiarias).

## `getEvolucionMoneda`

Evolución de cotización de una moneda.

`GET /estadisticascambiarias/v1.0/Cotizaciones/{moneda}`

```ts
const evolucion = await bcra.estadisticasCambiarias.getEvolucionMoneda('EUR', {
  fechadesde: '2024-01-01',
  fechahasta: '2024-06-30',
  limit: 100,
  offset: 0,
})
for (const cotizacion of evolucion.cotizaciones) {
  console.log(cotizacion.fecha)
  for (const c of cotizacion.detalle) {
    console.log(c.codigoMoneda, c.tipoCotizacion)
  }
}
```

Parámetros:

| Parámetro | Tipo | Descripción |
|---|---|---|
| `moneda` | `string` | Código de moneda (ver [`getDivisas`](#getdivisas)). |
| `opts.fechadesde` | `Date \| string` | Desde qué fecha (`YYYY-MM-DD` o `Date`). |
| `opts.fechahasta` | `Date \| string` | Hasta qué fecha (`YYYY-MM-DD` o `Date`). |
| `opts.limit` | `number` | Cantidad máxima de resultados. |
| `opts.offset` | `number` | Primer resultado a devolver (offset). |
| `opts.version` | `string` | Versión del endpoint (default: `1.0`). |

Modelo de respuesta: [`ResultGetEvolucionMonedaV1`](../api/modelos.md#respuestas-de-estadisticas-cambiarias).