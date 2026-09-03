/**
 * The content contract.
 *
 * The scenario bank is the product. These types exist to make a wrong scenario
 * fail to compile rather than fail in front of a kid, so keep them strict:
 * zone names and positions are literal unions, not `string`.
 */

import type { BallZone, ZoneName } from './field/zones.ts'
import type { Position } from './field/positions.ts'

export type { Position } from './field/positions.ts'
export type { BallZone, PlayZone, ZoneName } from './field/zones.ts'

export type Division = 'AAA' | 'Majors'

export type Mode = 'make-the-play' | 'where-do-i-go' | 'whats-the-call'

export interface Runners {
  first: boolean
  second: boolean
  third: boolean
}

export interface GameState {
  outs: 0 | 1 | 2
  runners: Runners
  count?: { balls: 0 | 1 | 2 | 3; strikes: 0 | 1 | 2 }
  inning?: number
  half?: 'top' | 'bottom'
  score?: { us: number; them: number }
}

export interface BallPath {
  type: 'ground' | 'line' | 'fly' | 'popup' | 'bunt'
  zone: BallZone
  speed?: 'slow' | 'normal' | 'hard'
}

/** Anything an overlay step can point at: a named spot, or a fielder. */
export type FieldRef = ZoneName | Position

export type OverlayStep =
  /** A throw. Draws a solid arrow. */
  | { kind: 'throw'; from: FieldRef; to: FieldRef; label?: string }
  /** A player moving to a spot: cutoff, backup, covering a bag. Dashed arrow. */
  | { kind: 'move'; who?: Position; from: FieldRef; to: FieldRef; label?: string }
  /** A base that gets touched, or a runner that gets tagged. Draws a ring. */
  | { kind: 'touch'; at: FieldRef; label?: string }

export interface PlayOverlay {
  steps: OverlayStep[]
  /** Optional short caption drawn under the diagram, e.g. "6-4 force". */
  caption?: string
}

export interface AnswerOption {
  id: string
  /** Plain language, under 8 words. */
  label: string
}

export interface Scenario {
  /** Stable, kebab-case, never reused. Progress is keyed on this. */
  id: string
  mode: Mode
  /** At least one. Session building filters on the selected division. */
  divisions: Division[]
  state: GameState
  ball?: BallPath
  /** Required for make-the-play and where-do-i-go. */
  youAre?: Position
  prompt: string
  options: AnswerOption[]
  correctOptionId: string
  /** One or two sentences. Must say WHY, not restate the answer. */
  explanation: string
  overlay?: PlayOverlay
  /** e.g. "LL Rule 6.05", or a plain description if the number is not certain. */
  ruleRef?: string
  /** True if a local league option can change the answer. */
  localRuleSensitive?: boolean
  tags?: string[]
}
