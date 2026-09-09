# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Conventional Commits](https://www.conventionalcommits.org/).

## [Unreleased]

### Added

- SDK en TypeScript con cero dependencias de runtime (`fetch`, `AbortController` y `Response` nativos de Node >= 18), dual ESM/CJS y tipado completo de punta a punta.
- Boilerplate npm: `package.json` (`name: "bcra-sdk"`, exports duales ESM/CJS), `tsconfig.json`, `tsconfig.build.json`, `tsup.config.ts` (`dist/index.js` + `dist/index.cjs` + `.d.ts`).
- Tooling: Vitest con thresholds de coverage 100% (v8), ESLint, Prettier, TypeDoc y cambiosets.
- CI/CD: `.github/workflows/ci.yml` (matrix Node 18/20/22) y `.github/workflows/release.yml` (changesets + `NPM_TOKEN`).
- Jerarquía de errores en `src/errors.ts`: `BCRAError` (base), `BCRAHTTPError` (con `statusCode`, `reason` y `response`), `BCRAConnectionError`, `BCRATimeoutError` y `BCRAEndpointVersionError`.
- `RetryPolicy` con reintentos automáticos ante errores transitorios, backoff exponencial, respeto del header `Retry-After` y retry de timeouts; `parseRetryAfter` para fechas/segundos de `Retry-After`.
- `Transport` (`src/transport.ts`) con fetch wrapper, timeout vía `AbortController`, lazy init del `fetch`, loop de retry y mapeo de errores de red/timeout/HTTP.
- Base `Resource` (`src/resource.ts`) con endpoints versionados: `registerVersion`, `resolveVersion` (última versión por defecto, `console.warn` si la resuelta está deprecada), `versions` y `fetch` con interpolación de `{var}`, soporte de `resultsKey` y deserialización vía modelos.
- Utils: `normalizeCuit`/`validateCuit` (11 dígitos con guiones opcionales), `coerceDate` (`Date` o `string` ISO a `YYYY-MM-DD`) y `buildParams` (filtra `undefined`/`null`/`''`).
- Modelos tipados con factories `fromXxx` para las 5 APIs: deudores (`Entidad`, `Periodo`, `EntidadHistorica`, `PeriodoHistorica`, `Result*V1`), cheques, entidades, denunciados, cotizaciones, divisas, evolución de moneda, monetarias (variables, series, metodologías) y régimen de transparencia (cajas de ahorro, paquetes, plazos fijos, préstamos y tarjetas).
- `BCRAClient` (`src/client.ts`) con un único `Transport` compartido y lazy (`baseUrl`, `timeout` y `retries` configurables) y `close()`.
- Resources con los 19 endpoints: `deudores` (`getDeudas`, `getDeudasHistoricas`, `getChequesRechazados`), `cheques` (`getEntidades`, `getChequeDenunciado`), `estadisticasCambiarias` (`getDivisas`, `getCotizaciones`, `getEvolucionMoneda`), `monetarias` en v4.0 (`getMonetarias`, `getEvolucionVariable`, `getMetodologias`, `getMetodologia`) y `regimenDeTransparencia` (`getCajasAhorros`, `getPaquetesProductos`, `getPlazosFijos`, `getPrestamosPrendarios`, `getPrestamosHipotecarios`, `getPrestamosPersonales`, `getTarjetasCredito`).
- API pública (`src/index.ts`) que exporta `BCRAClient`, todos los modelos y `fromXxx`, la jerarquía de errores, `RetryPolicy` y los tipados del transport (ESM y CJS).
- Fixtures offline para tests (`tests/fixtures/`, un JSON por endpoint) con respuestas reales grabadas, regrabables con `npm run record:fixtures`.
- TSDoc en toda la API pública (TypeDoc → API Reference en `api-docs/`), README final y sitio MkDocs para ReadTheDocs (`docs/` + `mkdocs.yml` + `.readthedocs.yaml`).