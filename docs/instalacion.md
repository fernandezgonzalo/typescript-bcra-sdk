# Instalación

## Requisitos

- Node.js >= 18 (usa `fetch` nativo).

## Desde npm

El paquete se publica en npm como **`bcra-sdk`** (el repositorio se llama `typescript-bcra-sdk`,
pero importás y instalás con el nombre del paquete):

```bash
npm install bcra-sdk
```

> Publicación aún pendiente en npm registries. Próximamente disponible.

## Desde el repositorio

Para usar la última versión directamente desde GitHub:

```bash
npm install "github:gonzadev/typescript-bcra-sdk"
```

## Verificación

```ts
import { BCRAClient, VERSION } from 'bcra-sdk'

console.log(VERSION) // p.ej. '0.1.0'
```

## Próximos pasos

- [Guía rápida](guia-rapida.md)
- [Versionado de endpoints](versionado.md)
- [Errores](errores.md)