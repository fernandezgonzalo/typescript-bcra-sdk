# Contribución

## Setup

```bash
npm install
```

## Comandos de desarrollo

| Comando | Qué hace |
|---|---|
| `npm run typecheck` | Chequeo de tipos (`tsc --noEmit`, solo `src/`). |
| `npm test` | Tests unitarios (Vitest). |
| `npm run test:coverage` | Coverage con thresholds 100% (v8). |
| `npm run lint` | ESLint. |
| `npm run format:check` | Prettier (check). |
| `npm run build` | Build dual ESM/CJS con tsup. |
| `npm run docs` | Genera la referencia de API con TypeDoc en `api-docs/`. |
| `npm run record:fixtures` | Re-graba los fixtures contra la API real. |

Orden de verificación: `typecheck` → `test` → `lint` → `format:check` → `build`.

## Principios

- **Cero dependencias de runtime**: el diseño se vende por usar `fetch` nativo de
  Node >= 18. Cualquier dependencia de runtime requiere aprobación explícita.
- **Idiomas TypeScript**: clases, interfaces, generics, `unknown` sobre `any`, `readonly`.
  No traducir mecánicamente patrones del SDK Python.
- **Commit messages** en inglés, siguiendo [Conventional Commits](https://www.conventionalcommits.org/)
  (por ejemplo `feat:`, `fix:`, `chore:`, `docs:`).
- **Documentación en el código**: los TSDoc de la API pública se mantienen en el source
  para que `typedoc.json` los compile; este sitio (MkDocs) es el front-end narrativo.

## Tests y fixtures

Los tests no llaman a la API real: usan respuestas grabadas en `tests/fixtures/`
(offline, un JSON por endpoint). Los fixtures incluyen las respuestas reales para los
19 endpoints; para Central de Deudores la identificación de ejemplo (`20111111112`)
devuelve `404`.

Para re-grabar los fixtures contra la API real:

```bash
npm run record:fixtures
```

El CI (GitHub Actions) corre la matriz Node 18/20/22 con
`typecheck → lint → format:check → test:coverage → build`.

## Releases

Los releases se manejan con [changesets](https://github.com/changesets/changesets)
(`.changeset/`). `.github/workflows/release.yml` publica en npm con el secreto `NPM_TOKEN`.

## Esta documentación

Este sitio se construye con MkDocs Material y se publica en ReadTheDocs
(`.readthedocs.yaml`). Ediciones en `docs/` → PR a `main`.