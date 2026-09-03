/**
 * Content validation. `npm run validate`. Runs in CI before the build, so a
 * broken scenario never reaches a kid.
 *
 * Every check here corresponds to a mistake that is easy to make at 11pm while
 * adding the fortieth scenario of the season.
 */

import { SCENARIOS } from '../src/content/scenarios/index.ts'
import { isBallZone, isZone, BALL_ZONE_NAMES, ZONE_NAMES } from '../src/field/zones.ts'
import { isPosition } from '../src/field/positions.ts'
import type { Scenario, OverlayStep, FieldRef } from '../src/types.ts'

const errors: string[] = []

function fail(id: string, message: string) {
  errors.push(`${id}: ${message}`)
}

/** An overlay target may be a zone name or a fielder position. */
function checkRef(id: string, where: string, ref: FieldRef) {
  if (isZone(ref) || isPosition(ref)) return
  fail(id, `${where} "${ref}" is not in the zone lookup table or a fielder position`)
}

function checkOverlayStep(id: string, i: number, step: OverlayStep) {
  if (step.kind === 'touch') {
    checkRef(id, `overlay step ${i} touch target`, step.at)
    return
  }
  checkRef(id, `overlay step ${i} "from"`, step.from)
  checkRef(id, `overlay step ${i} "to"`, step.to)
}

function checkScenario(s: Scenario, seen: Set<string>) {
  const id = s.id || '<missing id>'

  if (!s.id) errors.push('a scenario has no id')
  else if (seen.has(s.id)) fail(id, 'duplicate scenario id')
  else seen.add(s.id)

  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(id)) fail(id, 'id must be kebab-case')

  if (!s.divisions || s.divisions.length === 0) {
    fail(id, 'divisions is empty; every scenario needs at least one division tag')
  }

  if (s.options.length < 3 || s.options.length > 4) {
    fail(id, `has ${s.options.length} options; must be 3 or 4`)
  }

  const optionIds = new Set(s.options.map((o) => o.id))
  if (optionIds.size !== s.options.length) fail(id, 'duplicate option ids')
  if (!optionIds.has(s.correctOptionId)) {
    fail(id, `correctOptionId "${s.correctOptionId}" does not match any option id`)
  }

  const explanation = (s.explanation ?? '').trim()
  if (explanation.length < 20) {
    fail(id, 'explanation is missing or too short; it must give a reason, not restate the answer')
  }

  if ((s.mode === 'make-the-play' || s.mode === 'where-do-i-go') && !s.youAre) {
    fail(id, `mode "${s.mode}" requires youAre`)
  }

  if (s.youAre && !isPosition(s.youAre)) fail(id, `youAre "${s.youAre}" is not a fielding position`)

  if (s.ball && !isBallZone(s.ball.zone)) {
    fail(id, `ball.zone "${s.ball.zone}" is not a ball zone in the lookup table`)
  }

  s.overlay?.steps.forEach((step, i) => checkOverlayStep(id, i, step))
}

const seen = new Set<string>()
for (const s of SCENARIOS) checkScenario(s, seen)

const label = `${SCENARIOS.length} scenario${SCENARIOS.length === 1 ? '' : 's'}`
const zones = `${BALL_ZONE_NAMES.length} ball zones, ${ZONE_NAMES.length} zones total`

if (errors.length > 0) {
  console.error(`\nContent validation failed (${label}, ${zones}):\n`)
  for (const e of errors) console.error(`  - ${e}`)
  console.error('')
  process.exit(1)
}

console.log(`Content OK: ${label} checked against ${zones}.`)
