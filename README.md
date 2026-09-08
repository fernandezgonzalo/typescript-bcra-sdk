# bcra-sdk

SDK en TypeScript para la API del **Banco Central de la República Argentina** (BCRA).

Tipado completo, dual ESM/CJS, y cero dependencias de runtime.

## Instalación

```bash
npm install bcra-sdk
```

Requiere **Node.js >= 18** (usa `fetch` nativo).

## Uso rápido

```ts
import { BCRAClient } from 'bcra-sdk'

const client = new BCRAClient()

const deudas = await client.deudores.getDeudas()
console.log(deudas)
```

## Características

- Type-safe de punta a punta (modelos tipados en TypeScript)
- Dual ESM + CJS con tipos `.d.ts`
- Cero dependencias de runtime (fetch nativo de Node)
- Retry con exponential backoff y soporte `Retry-After`
- Jerarquía de errores descriptiva
- Documentación generada con TypeDoc

## Documentación

La documentación completa de la API se genera con:

```bash
npm run docs
```

## Desarrollo

```bash
npm install            # instalar dependencias
npm test               # correr tests (Vitest)
npm run coverage       # coverage con thresholds 100%
npm run lint           # ESLint
npm run build          # build dual ESM/CJS con tsup
```

## Licencia

[MIT](./LICENSE)