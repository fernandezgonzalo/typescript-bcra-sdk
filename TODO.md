# TODO — bcra-sdk

Plan de implementación del SDK en tareas **atomizadas**: cada una es resolvable por un agente de forma independiente, con definición de done y comando de verificación propios.

> **Fuente de referencia**: el SDK Python ya implementado en `/home/gonzadev/code/bcra-sdk` es el **source of truth** de paths, schemas y comportamiento. Este SDK TypeScript lo replica con herramientas propias del entorno TS (fetch nativo, async siempre, camelCase en la API pública). Ante cualquier duda de shapes, leer los `.py` del repo Python.

## Cómo usar este archivo

- Cada tarea tiene checkboxes `- [ ]`. Marcalo como `[x]` solo cuando pase toda su verificación.
- **Definición de done universal**: features implementados + tests con **coverage 100%** en `src/**` (threshold v8 en `vitest.config.ts`) + typecheck/lint/format sin errores.
- Ejecutar **correlativamente** entre fases; dentro de una fase, respetar las dependencias indicadas.
- Verificación de un test individual: `npx vitest run tests/<archivo>.test.ts`. Verificación completa: `npm run typecheck && npm test && npm run lint && npm run format:check && npm run build`.
- Commits: Conventional Commits en inglés (`feat:`, `fix:`, `chore:`, `docs:`). Cumplir `AGENTS.md`.
- **Nunca** llamar a la API real en tests: mockear `fetch` / el transporte (fixtures de la Fase 6).

## Diferencias TS vs el SDK Python (al implementar)

- **Async siempre**: `fetch` nativo; no hay pares sync/async como `get_*`/`aget_*`. Un solo método async por endpoint.
- **camelCase** en métodos y propiedad de client (`getDeudasHistoricas`, `estadisticasCambiarias`, `regimenDeTransparencia`).
- Los **campos del JSON se conservan tal cual devuelve el BCRA** (camelCase/PascalCase y snake_case según endpoint), por fidelidad. Se tipan igual que en Python.
- Models = `interface` TS + función `fromXxx(data: unknown): Xxx` (equivalente al `from_dict` de las dataclasses Python).
- **`resultsKey`**: default `"results"`; los endpoints que devuelven `{results, metadata}` en el root (evolución de moneda y todos los de monetarias) usan `resultsKey: null` → parsear el body completo.

## API BCRA

- Base URL: `https://api.bcra.gob.ar`. Vías intactas, versión embebida en el path.
- Paths exactos → cada tarea de Resource indica los suyos (extraídos del SDK Python).
- Specs OpenAPI de respaldo: mirrors `https://*.bcra.apidocs.ar/`.

---

## Fase 0 — Base del proyecto (COMPLETADA)

- [x] Boilerplate npm: `package.json` (`name: "bcra-sdk"`, dual exports ESM/CJS), `tsconfig.json`, `tsconfig.build.json`, `tsup.config.ts` (`dist/index.js` + `dist/index.cjs` + `.d.ts`).
- [x] Tooling: `vitest.config.ts` (thresholds 100%), `eslint.config.js`, `.prettierrc`, `typedoc.json`, `.gitignore`, `.npmignore`, `AGENTS.md`.
- [x] CI/CD: `.github/workflows/ci.yml` (matrix Node 18/20/22), `.github/workflows/release.yml` (changesets + `NPM_TOKEN`).
- [x] `src/index.ts` actualmente solo exporta `VERSION`.

---

## Fase 1 — Core (infraestructura)

### 1.1 Error hierarchy — `src/errors.ts`

- [x] **Archivos**: `src/errors.ts`, `tests/errors.test.ts`.
- **Especificación** (réplica de `exceptions.py`, con ajuste `body`):
  - `BCRAError extends Error` (base).
  - `BCRAHTTPError extends BCRAError` → `statusCode: number`, `message` base `[<statusCode> <message>]`, `body: string` (cuerpo; en Python era `message`), `response?: Response`, `reason: string | null` (`response?.statusText ?? null`).
  - `BCRAConnectionError extends BCRAError` → error de red (fetch rechazado).
  - `BCRATimeoutError extends BCRAConnectionError` → timeout del AbortController.
  - `BCRAEndpointVersionError extends BCRAError` → versión de endpoint no registrada.
- **Tests**: instanciación, herencia (`instanceof`), propiedades, mensajes.
- **Verificación**: `npx vitest run tests/errors.test.ts`.
- **Depende de**: —.
- **Done cuando**: coverage 100% de `errors.ts`.

### 1.2 RetryPolicy — `src/retry.ts`

- [x] **Archivos**: `src/retry.ts`, `tests/retry.test.ts`.
- **Especificación** (réplica de `_retry.py`):
  - Interface `RetryPolicy` + constantes: `maxRetries: 2`, `backoff: 0.5`, `retryOnTimeout: true`, `statuses: [429, 500, 502, 503, 504]`.
  - `delay(attempt): number` → `backoff * 2**attempt` (exponential backoff).
  - `parseRetryAfter(headers: Headers | Record<string,string>): number | null` → segundos o fecha HTTP de `Retry-After`; `null` si ausente/inválido; nunca negativo.
- **Verificación**: `npx vitest run tests/retry.test.ts`.
- **Depende de**: —.
- **Done cuando**: coverage 100% de `retry.ts`.

### 1.3 Transport — `src/transport.ts`

- [ ] **Archivos**: `src/transport.ts`, `tests/transport.test.ts`.
- **Especificación** (réplica de `_transport.py`, sync-only porque fetch ya es async):
  - `class Transport { constructor(baseUrl, timeout = 10_000, retries?) }`.
  - `request(method, path, { params? }): Promise<Response>` — GET + query params.
  - **Lazy init** del `fetch` (no encapsular en el constructor).
  - Retry loop: timeout → `BCRATimeoutError`; status en `retries.statuses` → reintentar con `Retry-After` si viene, si no `delay(attempt)`; respetar `retryOnTimeout` y `maxRetries`.
  - Timeout vía `AbortController`.
  - Error mapping: `fetch` rechazado → `BCRAConnectionError`; abort/timeout → `BCRATimeoutError`; `!response.ok` → `BCRAHTTPError(status, body, response)`.
- **Tests**: `vi.fn()` sobre `globalThis.fetch` (y `AbortController` fake para timeout). Data de `Retry-After` como `Headers`.
- **Verificación**: `npx vitest run tests/transport.test.ts`.
- **Depende de**: 1.1, 1.2.
- **Done cuando**: coverage 100% de `transport.ts`.

### 1.4 Base Resource — `src/resource.ts`

- [ ] **Archivos**: `src/resource.ts`, `tests/resource.test.ts`.
- **Especificación** (réplica de `_base.py`):
  - `interface VersionSpec { path: string; model: ModelFactory; deprecated?: boolean }`.
  - Tipos: `ModelFactory = { fromXxx(data: unknown): unknown }` (un `Xxx` por recurso).
  - `registerVersion(endpoint, version, spec)`.
  - `resolveVersion(endpoint, version?)` → default última versión registrada (orden semver); `BCRAEndpointVersionError` si no hay versiones o la pedida no existe; `console.warn` (o `process.emitWarning`) si la resuelta está deprecada.
  - `versions(endpoint)` → mapeo `{ "1.0": { deprecated: false }, ... }`.
  - `fetch<T>(options)` async: `{ endpoint, version?, params?, pathVars?, model, resultsKey? = 'results' }` → resuelve versión, interpola `{var}` en `path`, llama `transport.request`, y deserializa: `resultsKey === null` → `model.fromXxx(body)`; si no → `model.fromXxx(body[resultsKey])`.
- **Tests**: mockear Transport; cubrir resolución de versión, error de versión inexistente, deprecación, interpolación, `resultsKey` null vs default, deserialización.
- **Verificación**: `npx vitest run tests/resource.test.ts`.
- **Depende de**: 1.3.
- **Done cuando**: coverage 100% de `resource.ts`.

---

## Fase 2 — Utils

### 2.1 `src/utils/cuit.ts`

- [ ] **Archivos**: `src/utils/cuit.ts`, `tests/utils/cuit.test.ts`.
- **Especificación** (réplica de `deudores.py::_normalize_cuit`):
  - `normalizeCuit(cuit): string` → valida formato `^\d{2}-?\d{8}-?\d$` (11 dígitos, guiones opcionales) y quita guiones; `Throw` `BCRAError`/`TypeError` si inválido.
  - `validateCuit(cuit): boolean` → solo chequea formato (sin dígito verificador; igual que Python).
- **Verificación**: `npx vitest run tests/utils/cuit.test.ts`.
- **Depende de**: —.
- **Done cuando**: coverage 100%.

### 2.2 `src/utils/dates.ts`

- [ ] **Archivos**: `src/utils/dates.ts`, `tests/utils/dates.test.ts`.
- **Especificación** (réplica de `_dates.py::_coerce_date`):
  - `coerceDate(value: Date | string): string` → `YYYY-MM-DD` (Date via `toISOString().slice(0,10)`, string valida ISO 8601); inválido → throw con mensaje claro tipo el de Python.
- **Verificación**: `npx vitest run tests/utils/dates.test.ts`.
- **Depende de**: —.
- **Done cuando**: coverage 100%.

### 2.3 `src/utils/params.ts`

- [ ] **Archivos**: `src/utils/params.ts`, `tests/utils/params.test.ts`.
- **Especificación**: `buildParams(params?: Record<string, unknown>): URLSearchParams` → filtra `undefined`/`null`/`''`.
- **Verificación**: `npx vitest run tests/utils/params.test.ts`.
- **Depende de**: —.
- **Done cuando**: coverage 100%.

---

## Fase 3 — Modelos

Cada model = `interface` con los campos EXACTOS que devuelve la API + `fromXxx(data: unknown)`. **Los campos exhaustivos están en los `.py` de `/home/gonzadev/code/bcra-sdk/src/bcra_sdk/models/`** — replicarlos con tipos TS (`string`, `number`, `boolean`, `T | null`).

### 3.1 `src/models/deudores.ts`

- [ ] **Archivos**: `src/models/deudores.ts`, `tests/models/deudores.test.ts`.
- **Modelos** (idénticos a `models/deudores.py`): `Entidad`, `Periodo` (+from), `ResultGetDeudasV1` (+from), `EntidadHistorica`, `PeriodoHistorica` (+from), `ResultGetDeudasHistoricasV1` (+from).
- **Verificación**: `npx vitest run tests/models/deudores.test.ts`.
- **Depende de**: —.
- **Done cuando**: coverage 100%.

### 3.2 `src/models/cheques.ts`

- [ ] **Archivos**: `src/models/cheques.ts`, `tests/models/cheques.test.ts`.
- **Modelos** (idénticos a `models/cheques.py`): `DetalleCheque`, `EntidadCheque` (+from), `Causal` (+from), `ResultGetChequesRechazadosV1` (+from).
- **Verificación**: `npx vitest run tests/models/cheques.test.ts`.
- **Depende de**: —.
- **Done cuando**: coverage 100%.

### 3.3 `src/models/entidades.ts`

- [ ] **Archivos**: `src/models/entidades.ts`, `tests/models/entidades.test.ts`.
- **Modelos** (idénticos a `models/entidades.py`): `EntidadBancaria`, `ResultGetEntidadesV1` (+from, toma una `list`).
- **Verificación**: `npx vitest run tests/models/entidades.test.ts`.
- **Depende de**: —.
- **Done cuando**: coverage 100%.

### 3.4 `src/models/denunciados.ts`

- [ ] **Archivos**: `src/models/denunciados.ts`, `tests/models/denunciados.test.ts`.
- **Modelos** (idénticos a `models/denunciados.py`): `DetalleDenuncia`, `ResultGetChequeDenunciadoV1` (+from).
- **Verificación**: `npx vitest run tests/models/denunciados.test.ts`.
- **Depende de**: —.
- **Done cuando**: coverage 100%.

### 3.5 `src/models/cotizaciones.ts`

- [ ] **Archivos**: `src/models/cotizaciones.ts`, `tests/models/cotizaciones.test.ts`.
- **Modelos** (idénticos a `models/cotizaciones.py`): `Cotizacion`, `ResultGetCotizacionesV1` (+from; `fecha` puede ser `null`).
- **Verificación**: `npx vitest run tests/models/cotizaciones.test.ts`.
- **Depende de**: —.
- **Done cuando**: coverage 100%.

### 3.6 `src/models/divisas.ts`

- [ ] **Archivos**: `src/models/divisas.ts`, `tests/models/divisas.test.ts`.
- **Modelos** (idénticos a `models/divisas.py`): `Divisa`, `ResultGetDivisasV1` (+from, toma una `list`).
- **Verificación**: `npx vitest run tests/models/divisas.test.ts`.
- **Depende de**: —.
- **Done cuando**: coverage 100%.

### 3.7 `src/models/evolucion.ts`

- [ ] **Archivos**: `src/models/evolucion.ts`, `tests/models/evolucion.test.ts`.
- **Modelos** (idénticos a `models/evolucion.py`): `Resultset`, `ResultGetEvolucionMonedaV1` (+from: `metadata.resultset` + `results: ResultGetCotizacionesV1[]` → dependencia de 3.5). **No re-exportar desde aquí; si los resources lo usan, importan de 3.5.**
- **Verificación**: `npx vitest run tests/models/evolucion.test.ts`.
- **Depende de**: 3.5.
- **Done cuando**: coverage 100%.

### 3.8 `src/models/monetarias.ts`

- [ ] **Archivos**: `src/models/monetarias.ts`, `tests/models/monetarias.test.ts`.
- **Modelos** (idénticos a `models/monetarias.py`): `Metodologia`, `ResultGetMetodologiasV1` (+from), `ResultGetMetodologiaV1` (+from: `results[0]`), `VariableMonetaria`, `PuntoSerie`, `SerieMonetaria`, `ResultGetEvolucionVariableV1` (+from), `ResultGetMonetariasV1` (+from). `Resultset` importado de 3.7.
- **Verificación**: `npx vitest run tests/models/monetarias.test.ts`.
- **Depende de**: 3.7.
- **Done cuando**: coverage 100%.

### 3.9 `src/models/transparencia.ts`

- [ ] **Archivos**: `src/models/transparencia.ts`, `tests/models/transparencia.test.ts`.
- **Modelos** (idénticos a `models/transparencia.py`, cada uno con su `ResultXxxV1` que toma una `list`): `CajaAhorro`, `PaqueteProducto`, `PlazoFijo`, `PrestamoPrendario`, `PrestamoHipotecario`, `PrestamoPersonal`, `TarjetaCredito`. Atención a campos `T | null` (ej. `masInformacion`, `denominacion`).
- **Verificación**: `npx vitest run tests/models/transparencia.test.ts`.
- **Depende de**: —.
- **Done cuando**: coverage 100%.

### 3.10 `src/models/index.ts` — re-exports

- [ ] **Archivos**: `src/models/index.ts`.
- **Especificación**: barrel export de todos los modelos e `fromXxx`.
- **Verificación**: `npx vitest run tests/models/*.test.ts`.
- **Depende de**: 3.1–3.9.
- **Done cuando**: typecheck y tests pasan.

---

## Fase 4 — Resources

Cada resource extiende `Resource` (1.4) y registra sus endpoints versionados con los **paths exactos** que figuran a continuación (del SDK Python). Un resource = clase con un método async público por endpoint, firma tipada real, y `this.fetch({...})`. Tests con transporte mockeado.

### 4.1 `src/resources/deudores.ts`

- [ ] **Archivos**: `src/resources/deudores.ts`, `tests/resources/deudores.test.ts`.
- **Métodos y endpoints** (réplica de `deudores.py`):
  - `getDeudas(cuit: string, opts?: { version?: string })` → `GET /centraldedeudores/v1.0/Deudas/{cuit}`. Normaliza CUIT ([2.1]).
  - `getDeudasHistoricas(identification: string, opts?)` → `GET /CentralDeDeudores/v1.0/Deudas/Historicas/{identification}` (acepta CUIT **o CUIL**: no normalizar).
  - `getChequesRechazados(identification: string, opts?)` → `GET /centraldedeudores/v1.0/Deudas/ChequesRechazados/{identification}`.
  - `resultsKey` default. Modelos 3.1/3.2.
- **Verificación**: `npx vitest run tests/resources/deudores.test.ts`.
- **Depende de**: 1.4, 2.1, 3.1, 3.2.
- **Done cuando**: coverage 100%.

### 4.2 `src/resources/cheques.ts`

- [ ] **Archivos**: `src/resources/cheques.ts`, `tests/resources/cheques.test.ts`.
- **Métodos y endpoints** (réplica de `cheques.py`):
  - `getEntidades(opts?)` → `GET /cheques/v1.0/entidades`.
  - `getChequeDenunciado(codigoEntidad: number, numeroCheque: number, opts?)` → `GET /cheques/v1.0/denunciados/{codigoEntidad}/{numeroCheque}`.
  - `resultsKey` default. Modelos 3.3/3.4.
- **Verificación**: `npx vitest run tests/resources/cheques.test.ts`.
- **Depende de**: 1.4, 3.3, 3.4.
- **Done cuando**: coverage 100%.

### 4.3 `src/resources/estadisticas-cambiarias.ts`

- [ ] **Archivos**: `src/resources/estadisticas-cambiarias.ts`, `tests/resources/estadisticas-cambiarias.test.ts`.
- **Métodos y endpoints** (réplica de `estadisticascambiarias.py`):
  - `getDivisas(opts?)` → `GET /estadisticascambiarias/v1.0/Maestros/Divisas`.
  - `getCotizaciones(fecha?: Date | string, opts?)` → `GET /estadisticascambiarias/v1.0/Cotizaciones` con query `fecha` (coerced; omitida si no se pasa).
  - `getEvolucionMoneda(moneda: string, opts: { fechadesde?, fechahasta?, limit?, offset?, version? })` → `GET /estadisticascambiarias/v1.0/Cotizaciones/{moneda}` con query `fechadesde`/`fechahasta` (coerced) + `limit`/`offset`; **`resultsKey: null`**.
  - Modelos 3.6/3.5/3.7.
- **Verificación**: `npx vitest run tests/resources/estadisticas-cambiarias.test.ts`.
- **Depende de**: 1.4, 2.2, 3.5, 3.6, 3.7.
- **Done cuando**: coverage 100%.

### 4.4 `src/resources/monetarias.ts`

- [ ] **Archivos**: `src/resources/monetarias.ts`, `tests/resources/monetarias.test.ts`.
- **Métodos y endpoints** (réplica de `monetarias.py`, versión `4.0`; todos con `resultsKey: null`):
  - `getMonetarias(opts?)` → `GET /estadisticas/v4.0/monetarias`.
  - `getEvolucionVariable(idVariable: number, opts: { desde?, hasta?, offset?, limit?, version? })` → `GET /estadisticas/v4.0/monetarias/{idVariable}`, query `desde`/`hasta` (coerced) + `offset`/`limit`.
  - `getMetodologias(opts: { offset?, limit?, version? })` → `GET /estadisticas/v4.0/metodologia`.
  - `getMetodologia(idVariable: number, opts?)` → `GET /estadisticas/v4.0/metodologia/{idVariable}`.
  - Modelo 3.8.
- **Verificación**: `npx vitest run tests/resources/monetarias.test.ts`.
- **Depende de**: 1.4, 2.2, 3.8.
- **Done cuando**: coverage 100%.

### 4.5 `src/resources/regimen-de-transparencia.ts`

- [ ] **Archivos**: `src/resources/regimen-de-transparencia.ts`, `tests/resources/regimen-de-transparencia.test.ts`.
- **Métodos y endpoints** (réplica de `regimendetransparencia.py`; todos `GET /transparencia/v1.0/<...>` con query opcional `codigoEntidad` y `resultsKey` default):
  - `getCajasAhorros(codigoEntidad?: number, opts?)` → `.../CajasAhorros`.
  - `getPaquetesProductos(codigoEntidad?, opts?)` → `.../PaquetesProductos`.
  - `getPlazosFijos(codigoEntidad?, opts?)` → `.../PlazosFijos`.
  - `getPrestamosPrendarios(codigoEntidad?, opts?)` → `.../Prestamos/Prendarios`.
  - `getPrestamosHipotecarios(codigoEntidad?, opts?)` → `.../Prestamos/Hipotecarios`.
  - `getPrestamosPersonales(codigoEntidad?, opts?)` → `.../Prestamos/Personales`.
  - `getTarjetasCredito(codigoEntidad?, opts?)` → `.../TarjetasCredito`.
  - Modelo 3.9.
- **Verificación**: `npx vitest run tests/resources/regimen-de-transparencia.test.ts`.
- **Depende de**: 1.4, 3.9.
- **Done cuando**: coverage 100%.

---

## Fase 5 — Client y API pública

### 5.1 `src/client.ts` — BCRAClient

- [ ] **Archivos**: `src/client.ts`, `tests/client.test.ts`.
- **Especificación** (réplica de `client.py`, sin `**httpx_kwargs` extra):
  - `new BCRAClient({ baseUrl = 'https://api.bcra.gob.ar', timeout = 10_000, retries? })`.
  - Recursos expuestos: `deudores`, `cheques`, `estadisticasCambiarias`, `monetarias`, `regimenDeTransparencia`.
  - Un `Transport` compartido y lazy; `close()` cierra.
- **Verificación**: `npx vitest run tests/client.test.ts`.
- **Depende de**: 4.1–4.5.
- **Done cuando**: coverage 100%.

### 5.2 `src/index.ts` — API pública

- [ ] **Archivos**: `src/index.ts` (reemplaza el placeholder `VERSION`).
- **Especificación**: exportar `BCRAClient`, todos los modelos + `fromXxx`, jerarquía de errores, `RetryPolicy` y tipados del transport. Conservar `VERSION` actualizado.
- **Verificación**: `npm run build` + `npm test`.
- **Depende de**: 5.1, Fase 3, 1.1, 1.2.
- **Done cuando**: `dist/` expone todo y los imports ESM/CJS funcionan (`node -e "import('bcra-sdk')"` / `require('bcra-sdk')`).

---

## Fase 6 — Cierre

### 6.1 Fixtures y tests de integración

- [ ] **Archivos**: `tests/fixtures/*.json`, `tests/setup.ts`.
- **Especificación**: fixtures JSON por endpoint (respuestas reales de la API grabadas una vez), reutilizadas por los tests de models/resources para no llamar red ni hardcodear payloads. Patrón de grabado análogo a `scripts/record_cassettes.py` del repo Python.
- **Verificación**: `npm run test:coverage` (100% global).
- **Depende de**: Fase 3, 4.
- **Done cuando**: suite completa verde offline.

### 6.2 Docs y README final

- [ ] **Archivos**: `README.md`, docstrings/Typedoc en API pública.
- **Especificación**: README con tabla endpoint-per-resource (como el del Python), uso rápido con `BCRAClient`, nota de versión de monetarias v4.0. TSDoc en toda la API pública (TypeDoc → ReadTheDocs).
- **Verificación**: `npm run docs` (genera `docs/`) + `npm run build`.
- **Depende de**: 5.2.
- **Done cuando**: README refleja la API real, TypeDoc sin warnings.

### 6.3 Release inicial

- [ ] **Archivos**: `.changeset/*.md`.
- **Especificación**: primer changeset para publicar v0.1.0.
- **Verificación**: `npx changeset status`.
- **Depende de**: 6.2.
- **Done cuando**: CI verde + PR de release listo.

---

## Resumen de dependencias

```
Fase 1: 1.1 → 1.2 → 1.3 → 1.4
Fase 2: 2.1, 2.2, 2.3 (independientes)
Fase 3: 3.5 → 3.7 → 3.8 ; 3.1–3.4, 3.6, 3.9 (independientes) ; → 3.10
Fase 4: 1.4 + modelos correspondientes
Fase 5: 4.1–4.5 → 5.1 → 5.2
Fase 6: 5.2 → 6.1, 6.2 → 6.3
```