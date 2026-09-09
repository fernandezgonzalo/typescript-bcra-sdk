# Versionado de endpoints

Los endpoints del BCRA están versionados. Cada resource registra las versiones de cada
endpoint (`registerVersion`) y las resuelve con `resolveVersion`, ambos en la clase base
`Resource`.

## Comportamiento por defecto

Si no se indica nada, cada endpoint resuelve **la versión más reciente registrada**, de
forma independiente a los demás endpoints del mismo resource:

```ts
const deudas = await bcra.deudores.getDeudas('20111111112') // resuelve 1.0
```

## Consultar versiones disponibles

`resource.versions(endpoint)` devuelve las versiones de un endpoint y su estado de deprecación:

```ts
bcra.estadisticasCambiarias.versions('getCotizaciones')
// { '1.0': { deprecated: false } }

bcra.monetarias.versions('getMonetarias')
// { '4.0': { deprecated: false } }
```

## Forzar una versión (escape hatch)

Todos los métodos de endpoint aceptan `opts.version`:

```ts
bcra.deudores.getDeudas('20111111112', { version: '1.0' })
```

### Versión inexistente

Si se pide una versión que el endpoint no tiene, se lanza `BCRAEndpointVersionError`
(listando las versiones disponibles y su estado):

```ts
await bcra.estadisticasCambiarias.getDivisas({ version: '9.0' })
// BCRAEndpointVersionError: getDivisas no tiene version '9.0'. Disponibles: 1.0
```

### Versión deprecada

Si la versión resuelta está deprecada, se emite un `console.warn`:

```
[bcra-sdk] getDivisas version 1.0 esta deprecada
```

## Estado actual de la API monetaria

Estadísticas Monetarias usa la versión actual **`v4.0`** (que incluye Principales Variables);
`v1.0`–`v3.0` quedaron deprecadas por el BCRA y **no se registran** en el SDK.

!!! note "Naming de modelos"
    Los modelos de respuesta de los endpoints se nombran `Result{Metodo}V{Version}`
    (por ejemplo `ResultGetCotizacionesV1`). Ver [Modelos](api/modelos.md).