import type { Division, Mode, Scenario } from '../types.ts'
import type { Progress } from './progress.ts'

export const SESSION_SIZE = 10

/** The mode picked on the home screen. "mixed" draws from all three. */
export type ModeChoice = Mode | 'mixed'

export interface Session {
  scenarios: Scenario[]
  mode: ModeChoice
  division: Division
  /** How many matched the filter, so results can say "that is all there is". */
  available: number
}

/**
 * Pick the questions for one session.
 *
 * Unseen questions come first, then ones the player got wrong last time, then
 * everything else. Within each group the order is random, so two sessions in a
 * row do not feel identical. No scenario repeats inside a session; if fewer
 * than ten match the filter the session is just shorter, and the results screen
 * says so rather than padding it out with repeats.
 */
export function buildSession(
  all: Scenario[],
  mode: ModeChoice,
  division: Division,
  progress: Progress,
  size = SESSION_SIZE,
): Session {
  const matching = all.filter(
    (s) => s.divisions.includes(division) && (mode === 'mixed' || s.mode === mode),
  )

  const unseen: Scenario[] = []
  const missed: Scenario[] = []
  const rest: Scenario[] = []
  for (const s of matching) {
    const p = progress[s.id]
    if (!p) unseen.push(s)
    else if (p.last === 'wrong') missed.push(s)
    else rest.push(s)
  }

  const scenarios = [...shuffle(unseen), ...shuffle(missed), ...shuffle(rest)].slice(0, size)

  return { scenarios, mode, division, available: matching.length }
}

/** Fisher-Yates, on a copy. */
export function shuffle<T>(items: readonly T[]): T[] {
  const out = items.slice()
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}
