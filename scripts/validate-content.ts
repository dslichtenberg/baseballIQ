/**
 * Content validation. `npm run validate`. Runs in CI before the build, so a
 * broken scenario never reaches a kid.
 *
 * Every check here corresponds to a mistake that is easy to make at 11pm while
 * adding the fortieth scenario of the season.
 */

import { SCENARIOS } from '../src/content/scenarios/index.ts'
import { isBallZone, isZone, BALL_ZONE_NAMES, ZONE_NAMES } from '../src/field/zones.ts'
import { isPosition, isAlignment } from '../src/field/positions.ts'
import { refPoint, lineUpSpot } from '../src/field/geometry.ts'
import type { Scenario, OverlayStep, FieldRef } from '../src/types.ts'

const errors: string[] = []

function sentences(text: string): string[] {
  return text
    .split(/(?<=[.?!])\s+/)
    .map((s) => s.trim())
    .filter(Boolean)
}

function fail(id: string, message: string) {
  errors.push(`${id}: ${message}`)
}

/** An overlay target may be a zone name or a fielder position. */
function checkRef(id: string, where: string, ref: FieldRef) {
  if (isZone(ref) || isPosition(ref)) return
  fail(id, `${where} "${ref}" is not in the zone lookup table or a fielder position`)
}

function checkOverlayStep(id: string, i: number, step: OverlayStep, scenarioHasBall: boolean) {
  const where = `overlay step ${i}`

  if (step.kind === 'touch') {
    checkRef(id, `${where} touch target`, step.at)
    return
  }

  checkRef(id, `${where} "to"`, step.to)

  if (step.kind === 'throw') {
    checkRef(id, `${where} "from"`, step.from)
    return
  }

  // move, cut and relay all name a player; "from" is optional and defaults to
  // wherever that player starts.
  if (!isPosition(step.who)) fail(id, `${where} "who" (${step.who}) is not a fielding position`)
  if (step.from) checkRef(id, `${where} "from"`, step.from)

  if (step.kind === 'cut' || step.kind === 'relay') {
    // The spot is computed from the ball and the target base, so one of the two
    // has to exist. Without a ball there is no line to stand on.
    if (step.ball) {
      if (!isBallZone(step.ball)) {
        fail(id, `${where} "ball" (${step.ball}) is not a ball zone in the lookup table`)
      }
    } else if (!scenarioHasBall) {
      fail(id, `${where} is a ${step.kind} with no "ball", and the scenario has no batted ball`)
    }
  }
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

  // A button a kid reads at arm's length in the sun. Keep it short.
  for (const o of s.options) {
    const words = o.label.trim().split(/\s+/).length
    if (words > 8) fail(id, `option "${o.label}" is ${words} words; keep it under 8`)
    if (!o.label.trim()) fail(id, `option "${o.id}" has an empty label`)
  }

  const labels = s.options.map((o) => o.label.trim().toLowerCase())
  if (new Set(labels).size !== labels.length) fail(id, 'two options say the same thing')

  if (!s.prompt.trim().endsWith('?')) {
    fail(id, 'prompt is the question, so it should end with a question mark')
  }

  // Reading level, enforced the only way a script can: sentence length. These
  // are read by a nine year old holding a phone in the sun, so a long compound
  // sentence has to become two short ones. The situation strip and the diagram
  // already show the outs and the runners, so the prompt should not repeat them.
  for (const sentence of sentences(s.prompt)) {
    const words = sentence.split(/\s+/).length
    if (words > 15) fail(id, `prompt sentence is ${words} words; split it: "${sentence}"`)
  }
  for (const sentence of sentences(s.explanation)) {
    const words = sentence.split(/\s+/).length
    if (words > 23) fail(id, `explanation sentence is ${words} words; split it: "${sentence}"`)
  }

  const explanation = (s.explanation ?? '').trim()
  if (explanation.length < 20) {
    fail(id, 'explanation is missing or too short; it must give a reason, not restate the answer')
  }

  // The rule that matters most and is easiest to break in a hurry: an
  // explanation has to say WHY, and repeating the answer back is not why.
  const correct = s.options.find((o) => o.id === s.correctOptionId)
  if (correct) {
    const bare = (t: string) => t.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim()
    if (bare(explanation) === bare(correct.label)) {
      fail(id, 'explanation just restates the correct answer; say why it is right')
    }
  }

  if ((s.mode === 'make-the-play' || s.mode === 'where-do-i-go') && !s.youAre) {
    fail(id, `mode "${s.mode}" requires youAre`)
  }

  if (s.youAre && !isPosition(s.youAre)) fail(id, `youAre "${s.youAre}" is not a fielding position`)

  if (s.ball && !isBallZone(s.ball.zone)) {
    fail(id, `ball.zone "${s.ball.zone}" is not a ball zone in the lookup table`)
  }

  if (s.state.alignment && !isAlignment(s.state.alignment)) {
    fail(id, `alignment "${s.state.alignment}" is not a defensive alignment`)
  }

  s.overlay?.steps.forEach((step, i) => checkOverlayStep(id, i, step, Boolean(s.ball)))
  checkOverlayDraws(s)
}

/**
 * Actually resolve the geometry every overlay will draw.
 *
 * Names that exist in the table can still describe a play that cannot be drawn:
 * a cut whose ball and target are the same point has no line to stand on, and a
 * throw from a spot to itself is a zero-length arrow. Catching those here beats
 * finding them when a kid taps an answer and gets an empty field.
 */
function checkOverlayDraws(s: Scenario) {
  const id = s.id || '<missing id>'
  const alignment = s.state.alignment ?? 'normal'
  const finite = (p: { x: number; y: number }) => Number.isFinite(p.x) && Number.isFinite(p.y)
  const apart = (a: { x: number; y: number }, b: { x: number; y: number }) =>
    Math.hypot(a.x - b.x, a.y - b.y)

  s.overlay?.steps.forEach((step, i) => {
    const where = `overlay step ${i}`
    try {
      if (step.kind === 'touch') {
        if (!finite(refPoint(step.at, alignment))) fail(id, `${where} touch point is not on the field`)
        return
      }

      if (step.kind === 'cut' || step.kind === 'relay') {
        const source = step.ball ?? s.ball?.zone
        if (!source) return // already reported
        const ball = refPoint(source, alignment)
        const base = refPoint(step.to, alignment)
        if (apart(ball, base) < 20) {
          fail(id, `${where} is a ${step.kind} from "${source}" to "${step.to}", which are the same place`)
          return
        }
        const spot = lineUpSpot(ball, base, step.kind)
        if (!finite(spot)) fail(id, `${where} ${step.kind} spot does not resolve to a point`)
        return
      }

      const from = refPoint(step.kind === 'move' ? (step.from ?? step.who) : step.from, alignment)
      const to = refPoint(step.to, alignment)
      if (!finite(from) || !finite(to)) {
        fail(id, `${where} does not resolve to points on the field`)
      } else if (apart(from, to) < 12) {
        fail(id, `${where} draws an arrow from a spot to itself; there is nothing to show`)
      }
    } catch (e) {
      fail(id, `${where} could not be drawn: ${(e as Error).message}`)
    }
  })
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
