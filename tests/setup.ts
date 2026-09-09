import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

export interface Fixture<B = Record<string, unknown>> {
  readonly path: string
  readonly params: Record<string, string | number> | null
  readonly statusCode: number
  readonly body: B
}

const FIXTURES_DIR = join(process.cwd(), 'tests', 'fixtures')

const cache = new Map<string, Fixture>()

/**
 * Carga un fixture desde `tests/fixtures/<name>.json`. Son respuestas reales
 * de la API del BCRA grabadas una vez por `scripts/record_fixtures.mjs`.
 */
export function loadFixture<B = Record<string, unknown>>(
  name: string,
): Fixture<B> {
  let fixture = cache.get(name) as Fixture<B> | undefined
  if (fixture === undefined) {
    const raw = readFileSync(join(FIXTURES_DIR, `${name}.json`), 'utf-8')
    fixture = JSON.parse(raw) as Fixture<B>
    cache.set(name, fixture)
  }
  return fixture
}

/** Lista los nombres de los fixtures disponibles (sin extensión). */
export function listFixtures(): string[] {
  return readdirSync(FIXTURES_DIR)
    .filter((file) => file.endsWith('.json'))
    .map((file) => file.slice(0, -'.json'.length))
    .sort()
}

/** Construye un `Response` JSON listo para mockear el transporte. */
export function jsonResponse(
  body: unknown,
  statusCode = 200,
  statusText = 'OK',
): Response {
  return new Response(JSON.stringify(body), {
    status: statusCode,
    statusText,
    headers: { 'content-type': 'application/json' },
  })
}
