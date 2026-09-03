/**
 * Every number that describes the shape of the field, and the path builders
 * that turn two points into something a kid can read at a glance.
 *
 * Nothing outside src/field/ should import from here. Scenario content talks in
 * zone names (see zones.ts); components talk in props.
 *
 * A note on proportions: this is a diagram, not a survey. The infield is drawn
 * larger than a scale drawing would put it, because that is where nearly every
 * question in this app happens. The dirt is drawn as basepaths plus base
 * cutouts rather than as a filled skin, which is what keeps the outfield
 * readable as its own open space.
 */

import { ZONES, type Pt, type ZoneName } from './zones.ts'
import { fielderSpot, isPosition, type Alignment, type Position } from './positions.ts'

export const VIEW = { w: 400, h: 384 }

export const HOME: Pt = { x: 200, y: 326 }
export const FIRST: Pt = { x: 276, y: 250 }
export const SECOND: Pt = { x: 200, y: 174 }
export const THIRD: Pt = { x: 124, y: 250 }

/** Little League puts the rubber 46 ft along an 84.9 ft home-to-second line. */
export const MOUND: Pt = { x: 200, y: 244 }

/** Where the foul lines leave the drawing. Both sit on a true 45 degree line. */
export const FOUL_POLE_L: Pt = { x: 30, y: 156 }
export const FOUL_POLE_R: Pt = { x: 370, y: 156 }

/** Circle through both foul poles and straightaway center. */
export const FENCE = { cx: 200, cy: 202.2, r: 176.2 }

/** Where the outfield grass begins, as an arc struck from home plate. */
const MOW = { r: 168 }
const MOW_L: Pt = { x: 81.2, y: 207.2 }
const MOW_R: Pt = { x: 318.8, y: 207.2 }

/** Fair territory: home, out the left line, around the fence, back down the right line. */
export const FAIR_PATH =
  `M ${HOME.x} ${HOME.y} L ${FOUL_POLE_L.x} ${FOUL_POLE_L.y}` +
  ` A ${FENCE.r} ${FENCE.r} 0 0 1 ${FOUL_POLE_R.x} ${FOUL_POLE_R.y} Z`

/** The outfield grass, one shade off the infield grass, the way a mow line reads. */
export const OUTFIELD_GRASS_PATH =
  `M ${MOW_L.x} ${MOW_L.y}` +
  ` A ${MOW.r} ${MOW.r} 0 0 1 ${MOW_R.x} ${MOW_R.y}` +
  ` L ${FOUL_POLE_R.x} ${FOUL_POLE_R.y}` +
  ` A ${FENCE.r} ${FENCE.r} 0 0 0 ${FOUL_POLE_L.x} ${FOUL_POLE_L.y} Z`

export const FENCE_PATH =
  `M ${FOUL_POLE_L.x} ${FOUL_POLE_L.y}` +
  ` A ${FENCE.r} ${FENCE.r} 0 0 1 ${FOUL_POLE_R.x} ${FOUL_POLE_R.y}`

/** Stroked thick in dirt to make the basepaths. */
export const BASEPATH_PATH =
  `M ${HOME.x} ${HOME.y} L ${FIRST.x} ${FIRST.y} L ${SECOND.x} ${SECOND.y}` +
  ` L ${THIRD.x} ${THIRD.y} Z`

export const BASEPATH_WIDTH = 17
export const BASE_CUTOUT_R = 21
export const HOME_CIRCLE_R = 32
export const MOUND_R = 17

export const FOUL_LINE_R = `M ${HOME.x} ${HOME.y} L ${FOUL_POLE_R.x} ${FOUL_POLE_R.y}`
export const FOUL_LINE_L = `M ${HOME.x} ${HOME.y} L ${FOUL_POLE_L.x} ${FOUL_POLE_L.y}`

/** Home plate, pointing down toward the catcher, the way a real plate does. */
export const HOME_PLATE_PATH = polygon([
  { x: HOME.x - 9, y: HOME.y - 8 },
  { x: HOME.x + 9, y: HOME.y - 8 },
  { x: HOME.x + 9, y: HOME.y + 2 },
  { x: HOME.x, y: HOME.y + 11 },
  { x: HOME.x - 9, y: HOME.y + 2 },
])

export const BASES: { name: 'first' | 'second' | 'third'; at: Pt }[] = [
  { name: 'first', at: FIRST },
  { name: 'second', at: SECOND },
  { name: 'third', at: THIRD },
]

// ---------------------------------------------------------------------------
// Point resolution
// ---------------------------------------------------------------------------

/** Anything a ball, a throw, or a fielder's job can point at. */
export type FieldRef = ZoneName | Position

/**
 * A position resolves to where that fielder is actually standing, which the
 * alignment can change. A throw drawn from the shortstop with the infield in
 * has to start on the grass, not at normal depth.
 */
export function refPoint(ref: FieldRef, alignment: Alignment = 'normal'): Pt {
  if (isPosition(ref)) return fielderSpot(ref, alignment)
  return ZONES[ref]
}

// ---------------------------------------------------------------------------
// Path builders
// ---------------------------------------------------------------------------

export function polygon(pts: Pt[]): string {
  return pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${round(p.x)} ${round(p.y)}`).join(' ') + ' Z'
}

/** A rotated square, for a base. */
export function baseDiamond(at: Pt, r = 8): string {
  return polygon([
    { x: at.x, y: at.y - r },
    { x: at.x + r, y: at.y },
    { x: at.x, y: at.y + r },
    { x: at.x - r, y: at.y },
  ])
}

export function straight(a: Pt, b: Pt): string {
  return `M ${round(a.x)} ${round(a.y)} L ${round(b.x)} ${round(b.y)}`
}

/**
 * A chain of half-circle hops from a to b. Seen from above, a rolling ball
 * cannot be drawn as a bouncing arc, so the scallop carries that meaning
 * instead: this is the shape for every ground ball and every bunt.
 */
export function scallop(a: Pt, b: Pt, hop = 24): string {
  const dx = b.x - a.x
  const dy = b.y - a.y
  const len = Math.hypot(dx, dy)
  if (len < 1) return straight(a, b)
  const hops = Math.max(2, Math.round(len / hop))
  // Radius wider than half the step flattens each hop, so the line reads as a
  // ball wobbling along the ground rather than as a coil.
  const r = (len / hops) * 0.8
  let d = `M ${round(a.x)} ${round(a.y)}`
  for (let i = 1; i <= hops; i++) {
    const t = i / hops
    d += ` A ${round(r)} ${round(r)} 0 0 1 ${round(a.x + dx * t)} ${round(a.y + dy * t)}`
  }
  return d
}

/**
 * A bowed curve from a to b. Fly balls and pop ups get this; the deeper the
 * bow, the higher the ball went, so a pop up bows much harder than a fly.
 */
export function bow(a: Pt, b: Pt, amount = 0.2): { d: string; ctrl: Pt } {
  const dx = b.x - a.x
  const dy = b.y - a.y
  const len = Math.hypot(dx, dy) || 1
  const ctrl: Pt = {
    x: (a.x + b.x) / 2 + (-dy / len) * len * amount,
    y: (a.y + b.y) / 2 + (dx / len) * len * amount,
  }
  return {
    d: `M ${round(a.x)} ${round(a.y)} Q ${round(ctrl.x)} ${round(ctrl.y)} ${round(b.x)} ${round(b.y)}`,
    ctrl,
  }
}

/** An arrowhead sitting at `tip`, pointing away from `from`. */
export function arrowHead(tip: Pt, from: Pt, size = 10): string {
  const angle = Math.atan2(tip.y - from.y, tip.x - from.x)
  const wing = 0.42
  return polygon([
    tip,
    { x: tip.x - size * Math.cos(angle - wing), y: tip.y - size * Math.sin(angle - wing) },
    { x: tip.x - size * 0.55 * Math.cos(angle), y: tip.y - size * 0.55 * Math.sin(angle) },
    { x: tip.x - size * Math.cos(angle + wing), y: tip.y - size * Math.sin(angle + wing) },
  ])
}

/**
 * Where a cut man or a relay man stands.
 *
 * Both jobs are the same idea — get on the line between the ball and the base
 * the throw is going to — and they differ only in how far along that line you
 * go. So the spot is computed from the play rather than looked up, which means
 * it is right for any ball and any target instead of only for the one target
 * a fixed name happened to assume.
 *
 * A **cut man** sets up a set distance in front of the base, wherever the ball
 * is. A **relay man** runs out toward the ball and takes a short throw.
 */

/**
 * Both distances are set from the ball or the base rather than as a share of
 * the throw, because the job is physical: the cut man sets up a set distance in
 * front of the bag, and the relay man goes out until the outfielder has a short
 * throw. A share of the line would put the relay man on the fence for a long
 * throw and in the infield for a short one.
 *
 * Note this drawing is not to a single scale — the infield is drawn oversized,
 * so a unit is about 1.8 units per foot near the bases and about 1.4 out in the
 * outfield. Each constant below is calibrated in the part of the field it
 * actually applies to.
 */

/** ~35 ft in front of the base. Short, because a 60 ft diamond is short. */
const CUT_FROM_BASE = 62

/** ~70 ft off the ball: one easy outfielder throw, which lands in shallow outfield. */
const RELAY_FROM_BALL = 96

export function lineUpSpot(ball: Pt, base: Pt, role: 'cut' | 'relay'): Pt {
  const len = Math.hypot(base.x - ball.x, base.y - ball.y) || 1
  // Fraction of the way from the ball toward the base. Both roles are held back
  // from the midpoint so a short throw can never put one player on top of the
  // other, or past the person throwing to them.
  const t =
    role === 'cut'
      ? 1 - Math.min(CUT_FROM_BASE / len, 0.5)
      : Math.min(0.55, RELAY_FROM_BALL / len)
  return { x: ball.x + (base.x - ball.x) * t, y: ball.y + (base.y - ball.y) * t }
}

/** Pull a line back from its endpoint so the arrowhead is not sitting on the base. */
export function shorten(a: Pt, b: Pt, by: number): Pt {
  const dx = b.x - a.x
  const dy = b.y - a.y
  const len = Math.hypot(dx, dy) || 1
  const t = Math.max(0, (len - by) / len)
  return { x: a.x + dx * t, y: a.y + dy * t }
}

function round(n: number): number {
  return Math.round(n * 10) / 10
}
