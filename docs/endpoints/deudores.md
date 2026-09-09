# Endpoint de deudores

Central de Deudores. Se accede vía `bcra.deudores`.

Versiones registradas: `1.0` para los tres métodos.

## `getDeudas`

Deudas vigentes de un CUIT.

`GET /centraldedeudores/v1.0/Deudas/{cuit}`

```ts
const deudas = await bcra.deudores.getDeudas('20111111112')
console.log(deudas.identificacion, deudas.denominacion)

for (const periodo of deudas.periodos) {
  console.log(periodo.periodo)
  for (const entidad of periodo.entidades) {
    console.log(entidad.entidad, entidad.situacion, entidad.monto)
  }
}
```

Parámetros:

| Parámetro | Tipo | Descripción |
|---|---|---|
| `cuit` | `string` | CUIT a consultar. Se normaliza (acepta formato con o sin guiones). |
| `opts.version` | `string` | Versión del endpoint (default: la más reciente, `1.0`). |

Modelo de respuesta: [`ResultGetDeudasV1`](../api/modelos.md#respuestas-de-deudores).

!!! note "CUIT de ejemplo"
    La identificación de ejemplo (`20111111112`) devuelve `404` en el entorno real
    del BCRA; los fixtures de los tests la capturan tal cual.

## `getDeudasHistoricas`

Historial de deudas de una identificación.

`GET /CentralDeDeudores/v1.0/Deudas/Historicas/{identification}`

```ts
const historicas = await bcra.deudores.getDeudasHistoricas('20111111112')
for (const periodo of historicas.periodos) {
  for (const entidad of periodo.entidades) {
    console.log(entidad.entidad, entidad.situacion)
  }
}
```

Parámetros:

| Parámetro | Tipo | Descripción |
|---|---|---|
| `identification` | `string` | Identificación a consultar. |
| `opts.version` | `string` | Versión del endpoint (default: `1.0`). |

Modelo de respuesta: [`ResultGetDeudasHistoricasV1`](../api/modelos.md#respuestas-de-deudores).

## `getChequesRechazados`

Cheques rechazados de una identificación, agrupados por causal y entidad.

`GET /centraldedeudores/v1.0/Deudas/ChequesRechazados/{identification}`

```ts
const rechazados = await bcra.deudores.getChequesRechazados('20111111112')
for (const causal of rechazados.causales) {
  console.log(causal.causal)
  for (const entidad of causal.entidades) {
    for (const cheque of entidad.detalle) {
      console.log(cheque.nroCheque, cheque.fechaRechazo, cheque.monto)
    }
  }
}
```

Parámetros:

| Parámetro | Tipo | Descripción |
|---|---|---|
| `identification` | `string` | Identificación a consultar. |
| `opts.version` | `string` | Versión del endpoint (default: `1.0`). |

Modelo de respuesta: [`ResultGetChequesRechazadosV1`](../api/modelos.md#respuestas-de-deudores).