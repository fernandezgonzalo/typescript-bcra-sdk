# Guía rápida

`BCRAClient` organiza los endpoints por dominio: `deudores`, `cheques`,
`estadisticasCambiarias`, `monetarias` y `regimenDeTransparencia`. Cada método de
endpoint es `async` y devuelve un modelo fuertemente tipado.

## Crear el cliente

```ts
import { BCRAClient } from 'bcra-sdk'

const bcra = new BCRAClient()
```

Por defecto apunta a `https://api.bcra.gob.ar`, con timeout de `10_000` ms y una
`RetryPolicy` por defecto. Todo es configurable:

```ts
import { BCRAClient, RetryPolicy } from 'bcra-sdk'

const bcra = new BCRAClient({
  timeout: 5000,
  retries: new RetryPolicy({ maxRetries: 3, backoff: 1 }),
})
```

## Deudas de un CUIT

```ts
const deudas = await bcra.deudores.getDeudas('20111111112')
console.log(deudas.denominacion)

for (const periodo of deudas.periodos) {
  for (const entidad of periodo.entidades) {
    console.log(entidad.entidad, entidad.situacion, entidad.monto)
  }
}
```

El CUIT se normaliza automáticamente: acepta formato con o sin guiones.

## Cotizaciones

```ts
const cotizaciones = await bcra.estadisticasCambiarias.getCotizaciones(
  '2024-06-12',
)

for (const c of cotizaciones.detalle) {
  console.log(c.codigoMoneda, c.tipoCotizacion)
}
```

Las fechas se aceptan como `string` ISO (`YYYY-MM-DD`) o como `Date`.

## Variables monetarias (v4.0)

```ts
const monetarias = await bcra.monetarias.getMonetarias()
for (const v of monetarias.variables) {
  console.log(v.idVariable, v.descripcion)
}

const evolucion = await bcra.monetarias.getEvolucionVariable(1, {
  desde: '2024-01-01',
  hasta: '2024-06-30',
})
for (const serie of evolucion.series) {
  for (const punto of serie.detalle) {
    console.log(punto.fecha, punto.valor)
  }
}
```

## Régimen de transparencia

```ts
const cajas = await bcra.regimenDeTransparencia.getCajasAhorros(11)
for (const caja of cajas.cajas_ahorros) {
  console.log(caja.descripcionEntidad)
}
```

## Cerrar el cliente

`fetch` nativo no mantiene conexiones persistentes, por lo que `close()` es un
no-op que se mantiene por paridad con el SDK Python:

```ts
bcra.close()
```

## Próximos pasos

- [Endpoint de deudores](endpoints/deudores.md)
- [Endpoint de cheques](endpoints/cheques.md)
- [Endpoint de estadísticas cambiarias](endpoints/estadisticas-cambiarias.md)
- [Endpoint de estadísticas monetarias](endpoints/monetarias.md)
- [Endpoint del Régimen de Transparencia](endpoints/transparencia.md)
- [Versionado de endpoints](versionado.md)