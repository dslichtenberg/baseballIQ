/**
 * The zone lookup table.
 *
 * Scenario authors write zone names in English ("deep left center") and never
 * touch a coordinate. This file is the only place a *place on the field* is
 * defined, and every entry is written the way a coach would describe it: how
 * many feet from home, and how many degrees off the line to centre field.
 * Negative degrees are the left field side.
 *
 * That means these are checkable. "195 feet, 18 degrees left" is either the
 * left-centre gap or it is not; a pair of pixel coordinates is neither.
 *
 * Little League reference numbers used throughout: 60 ft between bases, so 84.9
 * ft from home to second, a 46 ft pitching distance, and a 205 ft fence.
 */

import { polar, type FieldPt } from './projection.ts'

export type { FieldPt } from './projection.ts'

/** Bases are 60 ft apart, so home to second across the diamond is 60 * root 2. */
export const BASE_FT = 60
export const HOME_TO_SECOND_FT = BASE_FT * Math.SQRT2
export const PITCHING_FT = 46
export const FENCE_FT = 205

/**
 * Zones a batted ball can be hit to. `BallPath.zone` must be one of these.
 *
 * The outfield sits on three arcs: shallow (a blooper just past the infield),
 * normal (where the outfielders stand), and deep (on the warning track).
 */
export const BALL_ZONES = {
  // --- infield ---
  home: polar(0, 0),
  'in front of plate': polar(18, 0),
  mound: polar(PITCHING_FT, 0),
  first: polar(BASE_FT, 45),
  second: polar(HOME_TO_SECOND_FT, 0),
  third: polar(BASE_FT, -45),
  'shortstop hole': polar(95, -32),
  '3-4 hole': polar(95, 32),
  'up the middle': polar(120, 0),

  // --- shallow outfield: bloopers and short flies ---
  'shallow left': polar(135, -30),
  'shallow center': polar(140, 0),
  'shallow right': polar(135, 30),

  // --- normal outfield depth ---
  left: polar(165, -32),
  'left center': polar(172, -15),
  center: polar(175, 0),
  'right center': polar(172, 15),
  right: polar(165, 32),

  // --- deep, at the fence ---
  'deep left': polar(190, -38),
  'deep left center': polar(195, -18),
  'deep center': polar(197, 0),
  'deep right center': polar(195, 18),
  'deep right': polar(190, 38),

  // --- fair, but down the line in the outfield corner ---
  // A ball slicing toward the line that an outfielder has to cut off is FAIR.
  // Sending one of those to a foul zone draws an obviously foul ball and makes
  // the question look broken, which is exactly what happened once.
  'left field corner': polar(195, -42),
  'right field corner': polar(195, 42),

  // --- foul territory: past 45 degrees ---
  'foul left': polar(85, -62),
  'foul right': polar(85, 62),
} as const satisfies Record<string, FieldPt>

/**
 * Spots that are not places a ball is hit, but places a player is supposed to
 * go. Overlay steps may target these as well as any ball zone.
 *
 * There are deliberately no cutoff or relay spots here. Where a cut man or a
 * relay man stands depends on where the ball is AND which base the throw is
 * going to, so a fixed name would be right for one target and wrong for the
 * others. Those are computed: see `lineUpSpot` in geometry.ts.
 */
export const PLAY_ZONES = {
  'backup first': polar(84, 52),
  'backup second': polar(112, 0),
  'backup third': polar(84, -52),
  'backup home': polar(30, 180),
} as const satisfies Record<string, FieldPt>

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
