import type { Pt } from './zones.ts'

export type Position = 'P' | 'C' | '1B' | '2B' | '3B' | 'SS' | 'LF' | 'CF' | 'RF'

/**
 * How the defense is set up before the pitch.
 *
 * This is a property of the situation, not something a player does during the
 * play, so it lives on the scenario's GameState. It has to move the markers,
 * because "infield in, ground ball to short, where do you throw it?" is a
 * different question from the same ground ball at normal depth, and a kid can
 * only see that if the shortstop is drawn where he is actually standing.
 */
export type Alignment = 'normal' | 'infield in' | 'corners in' | 'double play depth'

/**
 * Where each fielder starts the play at normal depth.
 *
 * Little League depth, not MLB: the outfielders play shallow because nobody at
 * this age can throw from the fence. The infielders are spaced far enough apart
 * that two markers plus the "you" ring never overlap.
 */
export const POSITIONS = {
  P: { x: 200, y: 238 },
  C: { x: 200, y: 352 },
  '1B': { x: 255, y: 226 },
  '2B': { x: 240, y: 196 },
  '3B': { x: 145, y: 226 },
  SS: { x: 160, y: 196 },
  LF: { x: 112, y: 120 },
  CF: { x: 200, y: 88 },
  RF: { x: 288, y: 120 },
} as const satisfies Record<Position, Pt>

/**
 * What each alignment changes. Anything not listed stays at normal depth.
 *
 * Infield in: all four infielders move onto the grass in front of the bases, so
 * a ground ball can be thrown home in time. Corners in: only the corners come
 * up, which is the bunt and squeeze look. Double play depth: the middle
 * infielders take a step in and a step toward second to turn two.
 */
const ALIGNMENT_SHIFTS: Record<Alignment, Partial<Record<Position, Pt>>> = {
  normal: {},
  'infield in': {
    // The corners come right up onto the line; the middle infielders come to
    // about mound depth. Spread far enough apart that neither one collides
    // with the pitcher's marker or with a runner standing on the bag.
    '1B': { x: 246, y: 278 },
    '2B': { x: 236, y: 250 },
    '3B': { x: 154, y: 278 },
    SS: { x: 164, y: 250 },
  },
  'corners in': {
    '1B': { x: 246, y: 278 },
    '3B': { x: 154, y: 278 },
  },
  'double play depth': {
    '2B': { x: 232, y: 192 },
    SS: { x: 168, y: 192 },
  },
}

/** Where every fielder stands under a given alignment. */
export function fielderSpots(alignment: Alignment = 'normal'): Record<Position, Pt> {
  return { ...POSITIONS, ...ALIGNMENT_SHIFTS[alignment] }
}

/** Where one fielder stands under a given alignment. */
export function fielderSpot(pos: Position, alignment: Alignment = 'normal'): Pt {
  return ALIGNMENT_SHIFTS[alignment][pos] ?? POSITIONS[pos]
}

export const POSITION_NAMES: Record<Position, string> = {
  P: 'pitcher',
  C: 'catcher',
  '1B': 'first baseman',
  '2B': 'second baseman',
  '3B': 'third baseman',
  SS: 'shortstop',
  LF: 'left fielder',
  CF: 'center fielder',
  RF: 'right fielder',
}

export const ALIGNMENT_NAMES: Record<Alignment, string> = {
  normal: 'normal depth',
  'infield in': 'infield in',
  'corners in': 'corners in',
  'double play depth': 'double play depth',
}

export const ALL_POSITIONS = Object.keys(POSITIONS) as Position[]

export const ALL_ALIGNMENTS = Object.keys(ALIGNMENT_SHIFTS) as Alignment[]

export function isPosition(name: string): name is Position {
  return Object.prototype.hasOwnProperty.call(POSITIONS, name)
}

export function isAlignment(name: string): name is Alignment {
  return Object.prototype.hasOwnProperty.call(ALIGNMENT_SHIFTS, name)
}
