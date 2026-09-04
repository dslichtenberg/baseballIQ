/**
 * The camera.
 *
 * Everything about the field is described in FEET on real ground, and this
 * module is the only thing that turns those into pixels. That inversion is the
 * point: the first version of this diagram placed 2D coordinates by hand, and
 * it showed — arcs struck from different centres did not nest, and base cutouts
 * sat on the basepaths like discs rather than being part of them. Describe the
 * field once, project it once, and those problems cannot happen.
 *
 * Field space: the origin is home plate, +fy runs out toward centre field, and
 * +fx runs toward the first base side. A third axis, height in feet, is what
 * lets a fly ball arc and a fence have a wall.
 *
 * The camera sits behind home plate and above it, so the outfield foreshortens:
 * the infield takes about half the height even though it is a quarter of the
 * depth. That is what a kid sees on TV, and it puts the picture's space where
 * the questions happen.
 */

export interface Pt {
  x: number
  y: number
}

/** A point on the ground, in feet, origin at home plate. */
export interface FieldPt {
  fx: number
  fy: number
}

export const VIEW = { w: 330, h: 154 }

const CAM = {
  /**
   * Degrees above the horizon. Lower foreshortens harder, but too low and the
   * outfield collapses to a sliver with the fielders pressed against the wall.
   * These four were compared numerically; 38 gives the infield about half the
   * height while leaving the outfield room to be a place.
   */
  pitch: 38,
  /** Camera height and how far back it sits, in feet. */
  height: 135,
  behind: 170,
  /** Scales the picture so the foul poles land just inside the frame. */
  focal: 343,
  /** Where field-space straight-ahead lands on screen. */
  cx: 165,
  cy: 129,
}

const RAD = Math.PI / 180
const COS = Math.cos(CAM.pitch * RAD)
const SIN = Math.sin(CAM.pitch * RAD)

/**
 * Ground point (plus optional height in feet) to screen.
 *
 * A pinhole camera pitched down by CAM.pitch. Depth is distance along the view
 * axis, so everything divides by it and the far side of the field compresses.
 */
export function project(p: FieldPt, heightFt = 0): Pt {
  const ahead = p.fy + CAM.behind
  const up = heightFt - CAM.height

  const depth = ahead * COS - up * SIN
  const vertical = ahead * SIN + up * COS

  // Nothing in this drawing is behind the camera, but a scenario author could
  // in principle put something there, and dividing by ~0 would explode.
  const safe = Math.max(depth, 1)

  return {
    x: round(CAM.cx + (CAM.focal * p.fx) / safe),
    y: round(CAM.cy - (CAM.focal * vertical) / safe),
  }
}

/**
 * How much the ground shrinks at this depth, relative to home plate. Used to
 * scale things that sit ON the ground, like a shadow, so they belong to the
 * spot they are drawn at.
 */
export function depthScale(p: FieldPt): number {
  const here = (p.fy + CAM.behind) * COS + CAM.height * SIN
  const atHome = CAM.behind * COS + CAM.height * SIN
  return round(atHome / here)
}

/**
 * A point at `dist` feet from home, `deg` degrees off the line to centre field.
 * Negative is the left field side. The whole zone table is written this way,
 * because "195 feet out, 18 degrees to the left" is a thing you can check.
 */
export function polar(dist: number, deg: number): FieldPt {
  return {
    fx: round(dist * Math.sin(deg * RAD)),
    fy: round(dist * Math.cos(deg * RAD)),
  }
}

/** Fair territory is inside the two 45 degree foul lines. */
export function isFair(p: FieldPt): boolean {
  return Math.abs(p.fx) <= p.fy + 1e-6
}

/** How far from home, in feet. */
export function distanceFt(p: FieldPt): number {
  return Math.hypot(p.fx, p.fy)
}

// ---------------------------------------------------------------------------
// Building paths out of field-space geometry
// ---------------------------------------------------------------------------

/**
 * Points along an arc struck from home plate. Every arc on this field is struck
 * from home, which is why they nest instead of crossing each other.
 */
export function arcPoints(radiusFt: number, fromDeg: number, toDeg: number, stepDeg = 3): Pt[] {
  const steps = Math.max(1, Math.ceil(Math.abs(toDeg - fromDeg) / stepDeg))
  const out: Pt[] = []
  for (let i = 0; i <= steps; i++) {
    out.push(project(polar(radiusFt, fromDeg + ((toDeg - fromDeg) * i) / steps)))
  }
  return out
}

export function polyline(pts: Pt[], close = false): string {
  if (pts.length === 0) return ''
  const body = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  return close ? `${body} Z` : body
}

/** An arc as a closed wedge back to home plate: the shape of a fan of the field. */
export function wedge(radiusFt: number, fromDeg: number, toDeg: number): string {
  const home = project({ fx: 0, fy: 0 })
  return `M ${home.x} ${home.y} ` + polyline(arcPoints(radiusFt, fromDeg, toDeg)).slice(2) + ' Z'
}

/** The ring between two radii: outfield grass, a warning track, a mow band. */
export function band(innerFt: number, outerFt: number, fromDeg: number, toDeg: number): string {
  const inner = arcPoints(innerFt, fromDeg, toDeg)
  const outer = arcPoints(outerFt, toDeg, fromDeg)
  return polyline([...inner, ...outer], true)
}

function round(n: number): number {
  return Math.round(n * 100) / 100
}
