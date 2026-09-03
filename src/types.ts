/**
 * The content contract.
 *
 * The scenario bank is the product. These types exist to make a wrong scenario
 * fail to compile rather than fail in front of a kid, so keep them strict:
 * zone names and positions are literal unions, not `string`.
 */

import type { BallZone, ZoneName } from './field/zones.ts'
import type { Alignment, Position } from './field/positions.ts'

export type { Alignment, Position } from './field/positions.ts'
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
  /**
   * How the defense is set up before the pitch. Defaults to normal depth.
   * "Infield in" is a different question from the same ball at normal depth,
   * so it belongs to the situation, not to the answer.
   */
  alignment?: Alignment
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

/**
 * Shared by the steps where a named player goes somewhere. `from` defaults to
 * wherever `who` starts the play, so an author normally writes only `who`.
 */
interface PlayerStep {
  who: Position
  from?: FieldRef
  label?: string
}

/**
 * Cut and relay are two different jobs, and kids are taught them under two
 * different words, so they are two different step kinds here.
 *
 * Neither one names a place. Both name the ball and the base the throw is going
 * to, and the diagram works out where to stand — which is the actual coaching
 * point: get on the line between the ball and where the ball is going. `ball`
 * defaults to the scenario's own batted ball, so most steps just say who and
 * where the throw is headed.
 */
interface LineUpStep extends PlayerStep {
  ball?: BallZone
  to: FieldRef
}

export type OverlayStep =
  /** A throw. Draws a solid arrow. */
  | { kind: 'throw'; from: FieldRef; to: FieldRef; label?: string }
  /** A player moving to a spot: backup, covering a bag. Dashed curved arrow. */
  | ({ kind: 'move'; to: FieldRef } & PlayerStep)
  /** The cut man, set up in front of the base the throw is going to. */
  | ({ kind: 'cut' } & LineUpStep)
  /** The relay man, out toward the ball on a ball in the gap or to the fence. */
  | ({ kind: 'relay' } & LineUpStep)
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
