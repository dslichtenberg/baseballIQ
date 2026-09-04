/**
 * The shapes of the field and the paths drawn on it, all built from field-space
 * feet and put through the camera in projection.ts.
 *
 * Nothing outside src/field/ should import from here. Scenario content talks in
 * zone names (see zones.ts); components talk in props.
 */

import {
  project,
  polar,
  arcPoints,
  polyline,
  wedge,
  band,
  depthScale,
  distanceFt,
  type FieldPt,
  type Pt,
} from './projection.ts'
import {
  ZONES,
  BASE_FT,
  HOME_TO_SECOND_FT,
  PITCHING_FT,
  FENCE_FT,
  type ZoneName,
} from './zones.ts'
import { fielderSpot, isPosition, type Alignment, type Position } from './positions.ts'

export { VIEW } from './projection.ts'
export type { Pt } from './projection.ts'

// ---------------------------------------------------------------------------
// The field, in feet
// ---------------------------------------------------------------------------

/** Foul lines run at 45 degrees, so fair territory is this fan. */
const FOUL = 45

/** Where the infield grass ends and the outfield begins. */
const MOW_FT = 128
/** The dirt strip that tells an outfielder the wall is close. */
const TRACK_FT = 192
/** How tall the outfield wall is. Gives the fence a face you can see. */
const WALL_FT = 8

export const HOME_FT: FieldPt = { fx: 0, fy: 0 }
export const FIRST_FT = polar(BASE_FT, 45)
export const SECOND_FT = polar(HOME_TO_SECOND_FT, 0)
export const THIRD_FT = polar(BASE_FT, -45)
export const MOUND_FT = polar(PITCHING_FT, 0)

export const BASES: { name: 'first' | 'second' | 'third'; at: FieldPt }[] = [
  { name: 'first', at: FIRST_FT },
  { name: 'second', at: SECOND_FT },
  { name: 'third', at: THIRD_FT },
]

// --- turf ------------------------------------------------------------------

/** All of fair territory, home plate out to the fence. */
export const FAIR_PATH = wedge(FENCE_FT, -FOUL, FOUL)

/** Infield grass: the fan inside the mow line. */
export const INFIELD_PATH = wedge(MOW_FT, -FOUL, FOUL)

/** Outfield grass: mow line to the warning track. */
export const OUTFIELD_PATH = band(MOW_FT, TRACK_FT, -FOUL, FOUL)

/** Warning track: track edge to the wall. */
export const TRACK_PATH = band(TRACK_FT, FENCE_FT, -FOUL, FOUL)

/**
 * The face of the outfield wall: the fence at ground level and the same arc
 * eight feet up, joined into a band. This is the one thing in the drawing that
 * is not flat on the ground, and it is most of what makes the field read as a
 * place rather than a diagram.
 */
export const WALL_PATH = polyline(
  [
    ...arcPoints(FENCE_FT, -FOUL, FOUL),
    ...arcPoints(FENCE_FT, FOUL, -FOUL).map((_, i, all) =>
      project(polar(FENCE_FT, FOUL - ((FOUL * 2) / (all.length - 1)) * i), WALL_FT),
    ),
  ],
  true,
)

/** The top edge of the wall, picked out so the wall has a lip. */
export const WALL_TOP_PATH = polyline(
  arcPoints(FENCE_FT, -FOUL, FOUL).map((_, i, all) =>
    project(polar(FENCE_FT, -FOUL + ((FOUL * 2) / (all.length - 1)) * i), WALL_FT),
  ),
)

export const FOUL_LINE_L = polyline([project(HOME_FT), project(polar(FENCE_FT, -FOUL))])
export const FOUL_LINE_R = polyline([project(HOME_FT), project(polar(FENCE_FT, FOUL))])

// --- dirt ------------------------------------------------------------------

/**
 * How far the dirt reaches past second base, and how much of the turn it takes
 * to get there. Struck around the bag itself, not around home, so the two legs
 * arrive within about six degrees of the arc's tangent and the join reads as
 * one continuous edge rather than a corner with something stuck on it.
 */
const SECOND_ROUND_FT = 10
const SECOND_ROUND_DEG = 60

/**
 * The basepaths as one stroked ribbon with round joins, so the corners at each
 * base are part of the path instead of separate discs sitting on top of it.
 * Drawing them as circles was what made the old field look assembled rather
 * than built.
 *
 * Second is the exception to the diamond: a real skinned infield carries the
 * dirt around behind the bag, and a hard point there was the one corner that
 * looked drawn rather than played on.
 */
export const BASEPATH_PATH = polyline(
  [
    project(HOME_FT),
    project(FIRST_FT),
    ...aroundBase(SECOND_FT, SECOND_ROUND_FT, SECOND_ROUND_DEG, -SECOND_ROUND_DEG),
    project(THIRD_FT),
  ],
  true,
)

/**
 * Points on a circle struck from a base, swept from one bearing to another.
 * Zero degrees is straight out from home, so a sweep from +deg to -deg passes
 * behind the bag.
 */
function aroundBase(centre: FieldPt, radiusFt: number, fromDeg: number, toDeg: number): Pt[] {
  const steps = Math.max(1, Math.ceil(Math.abs(toDeg - fromDeg) / 8))
  return Array.from({ length: steps + 1 }, (_, i) => {
    const a = ((fromDeg + ((toDeg - fromDeg) * i) / steps) * Math.PI) / 180
    return project({
      fx: centre.fx + radiusFt * Math.sin(a),
      fy: centre.fy + radiusFt * Math.cos(a),
    })
  })
}

/** Home plate's dirt, and the mound. Both are real circles on real ground. */
export const HOME_CIRCLE_PATH = polyline(circleFt(HOME_FT, 13), true)
export const MOUND_PATH = polyline(circleFt(MOUND_FT, 9), true)

/** Home plate itself, pointing back at the catcher the way a real plate does. */
export const HOME_PLATE_PATH = polyline(
  [
    project({ fx: -1.4, fy: 1.4 }),
    project({ fx: 1.4, fy: 1.4 }),
    project({ fx: 1.4, fy: -0.7 }),
    project({ fx: 0, fy: -2.1 }),
    project({ fx: -1.4, fy: -0.7 }),
  ],
  true,
)

/** A base, drawn well over life size so it is findable on a phone. */
export function basePath(at: FieldPt): string {
  const r = 4.5
  return polyline(
    [
      project({ fx: at.fx, fy: at.fy + r }),
      project({ fx: at.fx + r, fy: at.fy }),
      project({ fx: at.fx, fy: at.fy - r }),
      project({ fx: at.fx - r, fy: at.fy }),
    ],
    true,
  )
}

function circleFt(centre: FieldPt, radiusFt: number, steps = 40): Pt[] {
  return Array.from({ length: steps + 1 }, (_, i) => {
    const a = (i / steps) * Math.PI * 2
    return project({
      fx: centre.fx + radiusFt * Math.sin(a),
      fy: centre.fy + radiusFt * Math.cos(a),
    })
  })
}

// ---------------------------------------------------------------------------
// Point resolution
// ---------------------------------------------------------------------------

/** Anything a ball, a throw, or a fielder's job can point at. */
export type FieldRef = ZoneName | Position

/** Where the thing is, in feet. Alignment can move a fielder. */
export function refFt(ref: FieldRef, alignment: Alignment = 'normal'): FieldPt {
  if (isPosition(ref)) return fielderSpot(ref, alignment)
  return ZONES[ref]
}

/** Where the thing is on screen. */
export function refPoint(ref: FieldRef, alignment: Alignment = 'normal'): Pt {
  return project(refFt(ref, alignment))
}

/** How tall a person is drawn here: a marker floats at head height. */
export const STANDING_FT = 5.5

export { project, depthScale, distanceFt, polar }

// ---------------------------------------------------------------------------
// Ball flight
// ---------------------------------------------------------------------------

/**
 * How high each kind of batted ball gets, as a share of how far it travels,
 * with a ceiling in feet.
 *
 * Proportional, not fixed: a fixed 42 ft apex made a short foul fly arc clean
 * out of the frame, because 42 ft over 85 ft of ground is almost vertical. A
 * pop up is the exception and really does go nearly straight up, so its share
 * is high and its cap is what holds it in.
 */
const FLIGHT: Record<string, { share: number; capFt: number }> = {
  ground: { share: 0.02, capFt: 3 },
  bunt: { share: 0.02, capFt: 1.5 },
  line: { share: 0.06, capFt: 12 },
  fly: { share: 0.28, capFt: 55 },
  popup: { share: 0.85, capFt: 75 },
}

/**
 * The actual flight of the ball through the air, projected.
 *
 * A fly ball is a real parabola and a ground ball really bounces, so the shapes
 * that tell them apart come out of the physics rather than being drawn on. In a
 * flat overhead diagram the ball's type had to be faked with a squiggle; from
 * this camera it can just be true.
 */
export function ballPath(type: string, to: FieldPt, steps = 48): string {
  const flight = FLIGHT[type] ?? FLIGHT.line
  const apex = Math.min(distanceFt(to) * flight.share, flight.capFt)
  const rolling = type === 'ground' || type === 'bunt'
  const pts: Pt[] = []

  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const at: FieldPt = { fx: to.fx * t, fy: to.fy * t }
    pts.push(project(at, rolling ? bounceHeight(t, apex) : apex * 4 * t * (1 - t)))
  }
  return polyline(pts)
}

/** Decaying bounces: each hop lower and closer than the one before. */
function bounceHeight(t: number, apex: number): number {
  const hops = 4
  const phase = (t * hops) % 1
  const decay = Math.pow(0.55, Math.floor(t * hops))
  return apex * decay * Math.sin(phase * Math.PI)
}

// ---------------------------------------------------------------------------
// Cut and relay
// ---------------------------------------------------------------------------

/**
 * Where a cut man or a relay man stands.
 *
 * Both jobs are the same idea — get on the line between the ball and the base
 * the throw is going to — and they differ only in how far along that line you
 * go. The spot is computed from the play, so it is right for any ball and any
 * target instead of only the one a fixed name happened to assume.
 *
 * Now that the field is in feet, these are real distances rather than numbers
 * tuned against a drawing: a cut man sets up 35 ft in front of the bag, and a
 * relay man goes out until the outfielder has a 70 ft throw.
 */
const CUT_FROM_BASE_FT = 35
const RELAY_FROM_BALL_FT = 70

export function lineUpSpot(ball: FieldPt, base: FieldPt, role: 'cut' | 'relay'): FieldPt {
  const len = Math.hypot(base.fx - ball.fx, base.fy - ball.fy) || 1
  // Both are held back from the midpoint, so a short throw can never put one
  // player on top of the other or past the person throwing to them.
  const t =
    role === 'cut'
      ? 1 - Math.min(CUT_FROM_BASE_FT / len, 0.5)
      : Math.min(0.55, RELAY_FROM_BALL_FT / len)
  return {
    fx: ball.fx + (base.fx - ball.fx) * t,
    fy: ball.fy + (base.fy - ball.fy) * t,
  }
}

// ---------------------------------------------------------------------------
// Screen-space helpers, for arrows drawn between two projected points
// ---------------------------------------------------------------------------

export function straight(a: Pt, b: Pt): string {
  return `M ${a.x} ${a.y} L ${b.x} ${b.y}`
}

export function bow(a: Pt, b: Pt, amount = 0.2): { d: string; ctrl: Pt } {
  const dx = b.x - a.x
  const dy = b.y - a.y
  const len = Math.hypot(dx, dy) || 1
  const ctrl: Pt = {
    x: (a.x + b.x) / 2 + (-dy / len) * len * amount,
    y: (a.y + b.y) / 2 + (dx / len) * len * amount,
  }
  return { d: `M ${a.x} ${a.y} Q ${ctrl.x} ${ctrl.y} ${b.x} ${b.y}`, ctrl }
}

/** An arrowhead sitting at `tip`, pointing away from `from`. */
export function arrowHead(tip: Pt, from: Pt, size = 9): string {
  const angle = Math.atan2(tip.y - from.y, tip.x - from.x)
  const wing = 0.42
  return polyline(
    [
      tip,
      { x: tip.x - size * Math.cos(angle - wing), y: tip.y - size * Math.sin(angle - wing) },
      { x: tip.x - size * 0.55 * Math.cos(angle), y: tip.y - size * 0.55 * Math.sin(angle) },
      { x: tip.x - size * Math.cos(angle + wing), y: tip.y - size * Math.sin(angle + wing) },
    ],
    true,
  )
}

/** Pull a line back from its endpoint so the arrowhead is not on top of the base. */
export function shorten(a: Pt, b: Pt, by: number): Pt {
  const dx = b.x - a.x
  const dy = b.y - a.y
  const len = Math.hypot(dx, dy) || 1
  const t = Math.max(0, (len - by) / len)
  return { x: a.x + dx * t, y: a.y + dy * t }
}
