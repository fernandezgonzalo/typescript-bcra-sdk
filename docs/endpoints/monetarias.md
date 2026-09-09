# Endpoint de estadísticas monetarias

Variables monetarias y metodologías. Se accede vía `bcra.monetarias`.

La API v4.0 incluye las **Principales Variables**; las versiones v1.0–v3.0 quedaron
deprecadas por el BCRA y no se registran.

Versiones registradas: `4.0` para los cuatro métodos.

## `getMonetarias`

Variables monetarias disponibles (principales variables del BCRA).

`GET /estadisticas/v4.0/monetarias`

```ts
const monetarias = await bcra.monetarias.getMonetarias()
console.log(monetarias.resultset.count)
for (const variable of monetarias.variables) {
  console.log(variable.idVariable, variable.descripcion)
  console.log(variable.categoria, variable.periodicidad, variable.unidadExpresion)
}
```

Parámetros:

| Parámetro | Tipo | Descripción |
|---|---|---|
| `opts.version` | `string` | Versión del endpoint (default: `4.0`). |

Modelo de respuesta: [`ResultGetMonetariasV1`](../api/modelos.md#respuestas-de-estadisticas-monetarias).

## `getEvolucionVariable`

Evolución histórica de una variable.

`GET /estadisticas/v4.0/monetarias/{idVariable}`

```ts
const evolucion = await bcra.monetarias.getEvolucionVariable(1, {
  desde: '2024-01-01',
  hasta: '2024-06-30',
  limit: 100,
  offset: 0,
})
for (const serie of evolucion.series) {
  for (const punto of serie.detalle) {
    console.log(punto.fecha, punto.valor)
  }
}
```

Parámetros:

| Parámetro | Tipo | Descripción |
|---|---|---|
| `idVariable` | `number` | ID de la variable (ver [`getMonetarias`](#getmonetarias)). |
| `opts.desde` | `Date \| string` | Desde qué fecha (`YYYY-MM-DD` o `Date`). |
| `opts.hasta` | `Date \| string` | Hasta qué fecha (`YYYY-MM-DD` o `Date`). |
| `opts.offset` | `number` | Primer resultado a devolver (offset). |
| `opts.limit` | `number` | Cantidad máxima de resultados. |
| `opts.version` | `string` | Versión del endpoint (default: `4.0`). |

Modelo de respuesta: [`ResultGetEvolucionVariableV1`](../api/modelos.md#respuestas-de-estadisticas-monetarias).

## `getMetodologias`

Listado de metodologías disponibles.

`GET /estadisticas/v4.0/metodologia`

```ts
const metodologias = await bcra.monetarias.getMetodologias({ limit: 50 })
for (const metodologia of metodologias.metodologias) {
  console.log(metodologia.id, metodologia.detalle)
}
```

Parámetros:

| Parámetro | Tipo | Descripción |
|---|---|---|
| `opts.offset` | `number` | Primer resultado a devolver (offset). |
| `opts.limit` | `number` | Cantidad máxima de resultados. |
| `opts.version` | `string` | Versión del endpoint (default: `4.0`). |

Modelo de respuesta: [`ResultGetMetodologiasV1`](../api/modelos.md#respuestas-de-estadisticas-monetarias).

## `getMetodologia`

Metodología de una variable.

`GET /estadisticas/v4.0/metodologia/{idVariable}`

```ts
const metodologia = await bcra.monetarias.getMetodologia(1)
console.log(metodologia.metodologia.id, metodologia.metodologia.detalle)
```

Parámetros:

| Parámetro | Tipo | Descripción |
|---|---|---|
| `idVariable` | `number` | ID de la variable (ver [`getMonetarias`](#getmonetarias)). |
| `opts.version` | `string` | Versión del endpoint (default: `4.0`). |

Modelo de respuesta: [`ResultGetMetodologiaV1`](../api/modelos.md#respuestas-de-estadisticas-monetarias).