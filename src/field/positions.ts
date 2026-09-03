import type { Pt } from './zones.ts'

export type Position = 'P' | 'C' | '1B' | '2B' | '3B' | 'SS' | 'LF' | 'CF' | 'RF'

/**
 * Where each fielder starts the play.
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

export const ALL_POSITIONS = Object.keys(POSITIONS) as Position[]

export function isPosition(name: string): name is Position {
  return Object.prototype.hasOwnProperty.call(POSITIONS, name)
}
