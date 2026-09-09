/**
 * Dev tool: graba respuestas reales de la API del BCRA como fixtures.
 *
 * Uso:
 *   npm run record:fixtures   (node scripts/record_fixtures.mjs)
 *
 * Escribe en `tests/fixtures/<resource>.<method>.json` un JSON con
 * `{ path, params, statusCode, body }` y falla si algún estado HTTP no
 * coincide con el esperado. Análogo a `scripts/record_cassettes.py` del
 * SDK Python.
 */

import { mkdirSync } from 'node:fs'
import { writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const BASE_URL = 'https://api.bcra.gob.ar'
const OUTPUT_DIR = fileURLToPath(new URL('../tests/fixtures/', import.meta.url))

/** @typedef {{ name: string; path: string; params?: Record<string, string | number>; expectedStatus?: number }} RequestSpec */

/** @type {RequestSpec[]} */
const REQUESTS = [
  {
    name: 'deudores.getDeudas',
    path: '/centraldedeudores/v1.0/Deudas/20111111112',
    expectedStatus: 404,
  },
  {
    name: 'deudores.getDeudasHistoricas',
    path: '/CentralDeDeudores/v1.0/Deudas/Historicas/20111111112',
    expectedStatus: 404,
  },
  {
    name: 'deudores.getChequesRechazados',
    path: '/centraldedeudores/v1.0/Deudas/ChequesRechazados/20111111112',
    expectedStatus: 404,
  },
  { name: 'cheques.getEntidades', path: '/cheques/v1.0/entidades' },
  {
    name: 'cheques.getChequeDenunciado',
    path: '/cheques/v1.0/denunciados/11/20377516',
  },
  {
    name: 'estadisticasCambiarias.getDivisas',
    path: '/estadisticascambiarias/v1.0/Maestros/Divisas',
  },
  {
    name: 'estadisticasCambiarias.getCotizaciones',
    path: '/estadisticascambiarias/v1.0/Cotizaciones',
    params: { fecha: '2024-06-12' },
  },
  {
    name: 'estadisticasCambiarias.getEvolucionMoneda',
    path: '/estadisticascambiarias/v1.0/Cotizaciones/EUR',
    params: { fechadesde: '2024-06-10', fechahasta: '2024-06-12', limit: 10 },
  },
  { name: 'monetarias.getMonetarias', path: '/estadisticas/v4.0/monetarias' },
  {
    name: 'monetarias.getEvolucionVariable',
    path: '/estadisticas/v4.0/monetarias/1',
    params: { desde: '2025-05-20', hasta: '2025-05-26', limit: 10 },
  },
  {
    name: 'monetarias.getMetodologias',
    path: '/estadisticas/v4.0/metodologia',
  },
  {
    name: 'monetarias.getMetodologia',
    path: '/estadisticas/v4.0/metodologia/1',
  },
  {
    name: 'transparencia.getCajasAhorros',
    path: '/transparencia/v1.0/CajasAhorros',
    params: { codigoEntidad: 7 },
  },
  {
    name: 'transparencia.getPaquetesProductos',
    path: '/transparencia/v1.0/PaquetesProductos',
    params: { codigoEntidad: 14 },
  },
  {
    name: 'transparencia.getPlazosFijos',
    path: '/transparencia/v1.0/PlazosFijos',
    params: { codigoEntidad: 7 },
  },
  {
    name: 'transparencia.getPrestamosPrendarios',
    path: '/transparencia/v1.0/Prestamos/Prendarios',
    params: { codigoEntidad: 7 },
  },
  {
    name: 'transparencia.getPrestamosHipotecarios',
    path: '/transparencia/v1.0/Prestamos/Hipotecarios',
    params: { codigoEntidad: 7 },
  },
  {
    name: 'transparencia.getPrestamosPersonales',
    path: '/transparencia/v1.0/Prestamos/Personales',
    params: { codigoEntidad: 7 },
  },
  {
    name: 'transparencia.getTarjetasCredito',
    path: '/transparencia/v1.0/TarjetasCredito',
    params: { codigoEntidad: 7 },
  },
]

/**
 * @param {string} path
 * @param {RequestSpec['params']} [params]
 */
function buildQueryUrl(path, params) {
  if (!params) {
    return path
  }
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    search.append(key, String(value))
  }
  return `${path}?${search.toString()}`
}

async function main() {
  mkdirSync(OUTPUT_DIR, { recursive: true })
  for (const spec of REQUESTS) {
    const url = new URL(buildQueryUrl(spec.path, spec.params), BASE_URL)
    const response = await fetch(url, { signal: AbortSignal.timeout(30_000) })
    if (response.status !== (spec.expectedStatus ?? 200)) {
      throw new Error(
        `${spec.path}: status ${response.status} != ${spec.expectedStatus ?? 200}`,
      )
    }
    const payload = {
      path: spec.path,
      params: spec.params ?? null,
      statusCode: response.status,
      body: await response.json(),
    }
    const target = `${OUTPUT_DIR}/${spec.name}.json`
    await writeFile(target, `${JSON.stringify(payload, null, 2)}\n`, 'utf-8')
    console.log(
      `OK ${response.status}  ${spec.path} -> tests/fixtures/${spec.name}.json`,
    )
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})