# Endpoint de cheques

Cheques denunciados. Se accede vía `bcra.cheques`.

Versiones registradas: `1.0` para los dos métodos.

## `getEntidades`

Listado completo de entidades bancarias.

`GET /cheques/v1.0/entidades`

```ts
const entidades = await bcra.cheques.getEntidades()
for (const entidad of entidades.entidades) {
  console.log(entidad.codigoEntidad, entidad.denominacion)
}
```

Parámetros:

| Parámetro | Tipo | Descripción |
|---|---|---|
| `opts.version` | `string` | Versión del endpoint (default: `1.0`). |

Modelo de respuesta: [`ResultGetEntidadesV1`](../api/modelos.md#respuestas-de-cheques).

## `getChequeDenunciado`

Estado de denuncia de un cheque en particular.

`GET /cheques/v1.0/denunciados/{codigoEntidad}/{numeroCheque}`

```ts
const denunciado = await bcra.cheques.getChequeDenunciado(137, 20377516)
console.log(denunciado.denunciado)
console.log(denunciado.denominacionEntidad, denunciado.fechaProcesamiento)

for (const detalle of denunciado.detalles) {
  console.log(detalle.sucursal, detalle.causal)
}
```

Parámetros:

| Parámetro | Tipo | Descripción |
|---|---|---|
| `codigoEntidad` | `number` | Código de la entidad (ver [`getEntidades`](#getentidades)). |
| `numeroCheque` | `number` | Número del cheque denunciado. |
| `opts.version` | `string` | Versión del endpoint (default: `1.0`). |

Modelo de respuesta: [`ResultGetChequeDenunciadoV1`](../api/modelos.md#respuestas-de-cheques).