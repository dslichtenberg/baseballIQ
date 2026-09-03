/**
 * The zone lookup table.
 *
 * Scenario authors write zone names in English ("deep left center") and never
 * touch a coordinate. This file is the only place SVG numbers for a *place on
 * the field* live. If a scenario needs a spot that is not here, add it here
 * first.
 *
 * Coordinate system: the field SVG viewBox is 0 0 400 384, home plate at the
 * bottom centre, the outfield toward the top, the foul lines at a true 45
 * degrees. See geometry.ts for the shapes these coordinates sit inside.
 */

export interface Pt {
  x: number
  y: number
}

/**
 * Zones a batted ball can be hit to. `BallPath.zone` must be one of these.
 *
 * The outfield zones sit on three arcs struck from home plate: shallow (a
 * blooper just past the infielders), normal (where the outfielders are
 * standing), and deep (on the warning track).
 */
export const BALL_ZONES = {
  // --- infield ---
  home: { x: 200, y: 326 },
  'in front of plate': { x: 200, y: 298 },
  mound: { x: 200, y: 244 },
  first: { x: 276, y: 250 },
  second: { x: 200, y: 174 },
  third: { x: 124, y: 250 },
  'shortstop hole': { x: 150, y: 212 },
  '3-4 hole': { x: 250, y: 212 },
  'up the middle': { x: 200, y: 196 },

  // --- shallow outfield: bloopers and short flies ---
  'shallow left': { x: 113, y: 162 },
  'shallow center': { x: 200, y: 140 },
  'shallow right': { x: 287, y: 162 },

  // --- normal outfield depth ---
  left: { x: 96, y: 128 },
  'left center': { x: 145, y: 107 },
  center: { x: 200, y: 100 },
  'right center': { x: 255, y: 107 },
  right: { x: 304, y: 128 },

  // --- deep, at the fence ---
  'deep left': { x: 77, y: 95 },
  'deep center': { x: 200, y: 64 },
  'deep right': { x: 323, y: 95 },

  // --- foul territory ---
  'foul left': { x: 86, y: 280 },
  'foul right': { x: 314, y: 280 },
} as const satisfies Record<string, Pt>

/**
 * Spots that are not places a ball is hit, but places a player is supposed to
 * go. Overlay steps may target these as well as any ball zone.
 *
 * Each cutoff spot sits on the straight line from that outfielder to home
 * plate, a bit under halfway in, which is where a Little League cutoff man
 * actually stands.
 */
export const PLAY_ZONES = {
  'cutoff left': { x: 167, y: 248 },
  // Drawn a touch deeper than the geometric spot. The real cutoff for a throw
  // home from centre stands just in front of the rubber, and a marker there
  // lands on top of the pitcher's own marker, which teaches nobody anything.
  'cutoff center': { x: 200, y: 208 },
  'cutoff right': { x: 233, y: 248 },
  'backup first': { x: 312, y: 228 },
  // Backing up second means standing just behind the bag, which is nearer than
  // where a blooper drops, so this sits inside "shallow center", not past it.
  'backup second': { x: 200, y: 152 },
  'backup third': { x: 88, y: 228 },
  'backup home': { x: 200, y: 370 },
} as const satisfies Record<string, Pt>

export const ZONES = { ...BALL_ZONES, ...PLAY_ZONES }

export type BallZone = keyof typeof BALL_ZONES
export type PlayZone = keyof typeof PLAY_ZONES
export type ZoneName = keyof typeof ZONES

export const BALL_ZONE_NAMES = Object.keys(BALL_ZONES) as BallZone[]
export const ZONE_NAMES = Object.keys(ZONES) as ZoneName[]

export function isBallZone(name: string): name is BallZone {
  return Object.prototype.hasOwnProperty.call(BALL_ZONES, name)
}

export function isZone(name: string): name is ZoneName {
  return Object.prototype.hasOwnProperty.call(ZONES, name)
}
