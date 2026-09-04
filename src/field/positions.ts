import { polar, type FieldPt } from './projection.ts'

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
 * Where each fielder stands at normal depth, in feet from home and degrees off
 * the centre line. Little League depth, not MLB: the outfielders play shallow
 * because nobody at this age can throw from the fence.
 */
export const POSITIONS = {
  P: polar(50, 0),
  C: polar(16, 180),
  '1B': polar(72, 36),
  '2B': polar(115, 22),
  '3B': polar(70, -38),
  SS: polar(115, -22),
  LF: polar(142, -30),
  CF: polar(148, 0),
  RF: polar(142, 30),
} as const satisfies Record<Position, FieldPt>

/**
 * What each alignment changes. Anything not listed stays at normal depth.
 *
 * Infield in: all four move onto the grass in front of the bases so a ground
 * ball can be thrown home in time. Corners in: only the corners come up, the
 * bunt and squeeze look. Double play depth: the middle infielders take a step
 * in and a step toward second to turn two.
 */
const ALIGNMENT_SHIFTS: Record<Alignment, Partial<Record<Position, FieldPt>>> = {
  normal: {},
  'infield in': {
    '1B': polar(52, 40),
    '2B': polar(80, 26),
    '3B': polar(52, -40),
    SS: polar(80, -26),
  },
  'corners in': {
    '1B': polar(52, 40),
    '3B': polar(52, -40),
  },
  'double play depth': {
    '2B': polar(104, 20),
    SS: polar(104, -20),
  },
}

/** Where every fielder stands under a given alignment. */
export function fielderSpots(alignment: Alignment = 'normal'): Record<Position, FieldPt> {
  return { ...POSITIONS, ...ALIGNMENT_SHIFTS[alignment] }
}

/** Where one fielder stands under a given alignment. */
export function fielderSpot(pos: Position, alignment: Alignment = 'normal'): FieldPt {
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
