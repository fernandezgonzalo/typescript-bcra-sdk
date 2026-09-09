# Endpoint del Régimen de Transparencia

Cajas de ahorro, paquetes de productos, plazos fijos y préstamos de las entidades
financieras. Se accede vía `bcra.regimenDeTransparencia`.

Versiones registradas: `1.0` para los siete métodos.

Todos los métodos de este resource aceptan un `codigoEntidad` opcional como filtro.
Los nombres de campo usan snake_case tal como los devuelve el BCRA (p.ej. `cajas_ahorros`).

## `getCajasAhorros`

Cajas de ahorro.

`GET /transparencia/v1.0/CajasAhorros`

```ts
const cajas = await bcra.regimenDeTransparencia.getCajasAhorros(11)
for (const caja of cajas.cajas_ahorros) {
  console.log(caja.codigoEntidad, caja.descripcionEntidad)
}
```

Parámetros:

| Parámetro | Tipo | Descripción |
|---|---|---|
| `codigoEntidad` | `number` | Código de la entidad a filtrar. Opcional. |
| `opts.version` | `string` | Versión del endpoint (default: `1.0`). |

Modelo de respuesta: [`ResultGetCajasAhorrosV1`](../api/modelos.md#respuestas-de-transparencia).

## `getPaquetesProductos`

Paquetes de productos.

`GET /transparencia/v1.0/PaquetesProductos`

```ts
const paquetes = await bcra.regimenDeTransparencia.getPaquetesProductos()
for (const paquete of paquetes.paquetes_productos) {
  console.log(paquete.nombreCompleto, paquete.comisionMaximaMantenimiento)
}
```

Parámetros:

| Parámetro | Tipo | Descripción |
|---|---|---|
| `codigoEntidad` | `number` | Código de la entidad a filtrar. Opcional. |
| `opts.version` | `string` | Versión del endpoint (default: `1.0`). |

Modelo de respuesta: [`ResultGetPaquetesProductosV1`](../api/modelos.md#respuestas-de-transparencia).

## `getPlazosFijos`

Plazos fijos.

`GET /transparencia/v1.0/PlazosFijos`

```ts
const plazos = await bcra.regimenDeTransparencia.getPlazosFijos(11)
for (const plazo of plazos.plazos_fijos) {
  console.log(plazo.nombreCompleto, plazo.tasaEfectivaAnualMinima)
}
```

Parámetros:

| Parámetro | Tipo | Descripción |
|---|---|---|
| `codigoEntidad` | `number` | Código de la entidad a filtrar. Opcional. |
| `opts.version` | `string` | Versión del endpoint (default: `1.0`). |

Modelo de respuesta: [`ResultGetPlazosFijosV1`](../api/modelos.md#respuestas-de-transparencia).

## `getPrestamosPrendarios`

Préstamos prendarios.

`GET /transparencia/v1.0/Prestamos/Prendarios`

```ts
const prendarios = await bcra.regimenDeTransparencia.getPrestamosPrendarios()
for (const prestamo of prendarios.prestamos_prendarios) {
  console.log(prestamo.nombreCompleto, prestamo.tasaEfectivaAnualMaxima)
}
```

Parámetros:

| Parámetro | Tipo | Descripción |
|---|---|---|
| `codigoEntidad` | `number` | Código de la entidad a filtrar. Opcional. |
| `opts.version` | `string` | Versión del endpoint (default: `1.0`). |

Modelo de respuesta: [`ResultGetPrestamosPrendariosV1`](../api/modelos.md#respuestas-de-transparencia).

## `getPrestamosHipotecarios`

Préstamos hipotecarios.

`GET /transparencia/v1.0/Prestamos/Hipotecarios`

```ts
const hipotecarios = await bcra.regimenDeTransparencia.getPrestamosHipotecarios()
for (const prestamo of hipotecarios.prestamos_hipotecarios) {
  console.log(prestamo.nombreCompleto, prestamo.tasaEfectivaAnualMaxima)
}
```

Parámetros:

| Parámetro | Tipo | Descripción |
|---|---|---|
| `codigoEntidad` | `number` | Código de la entidad a filtrar. Opcional. |
| `opts.version` | `string` | Versión del endpoint (default: `1.0`). |

Modelo de respuesta: [`ResultGetPrestamosHipotecariosV1`](../api/modelos.md#respuestas-de-transparencia).

## `getPrestamosPersonales`

Préstamos personales.

`GET /transparencia/v1.0/Prestamos/Personales`

```ts
const personales = await bcra.regimenDeTransparencia.getPrestamosPersonales(11)
for (const prestamo of personales.prestamos_personales) {
  console.log(prestamo.nombreCompleto, prestamo.tasaEfectivaAnualMaxima)
}
```

Parámetros:

| Parámetro | Tipo | Descripción |
|---|---|---|
| `codigoEntidad` | `number` | Código de la entidad a filtrar. Opcional. |
| `opts.version` | `string` | Versión del endpoint (default: `1.0`). |

Modelo de respuesta: [`ResultGetPrestamosPersonalesV1`](../api/modelos.md#respuestas-de-transparencia).

## `getTarjetasCredito`

Tarjetas de crédito.

`GET /transparencia/v1.0/TarjetasCredito`

```ts
const tarjetas = await bcra.regimenDeTransparencia.getTarjetasCredito()
for (const tarjeta of tarjetas.tarjetas_credito) {
  console.log(tarjeta.nombreCompleto, tarjeta.tasaEfectivaAnualMaximaFinanciacion)
}
```

Parámetros:

| Parámetro | Tipo | Descripción |
|---|---|---|
| `codigoEntidad` | `number` | Código de la entidad a filtrar. Opcional. |
| `opts.version` | `string` | Versión del endpoint (default: `1.0`). |

Modelo de respuesta: [`ResultGetTarjetasCreditoV1`](../api/modelos.md#respuestas-de-transparencia).