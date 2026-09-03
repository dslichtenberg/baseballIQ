/**
 * What the app remembers about a player, keyed by scenario id.
 *
 * Nothing here identifies anybody: no name, no device id, no timestamps beyond
 * "when did I last see this question". That is deliberate and it is the whole
 * privacy story of the app.
 *
 * M2 runs with an empty record. M3 loads and saves this from localStorage.
 */

export interface ScenarioProgress {
  seen: number
  correct: number
  /** How the player did the last time this one came up. */
  last: 'right' | 'wrong'
  /** Epoch millis, used only to break ties when picking questions. */
  at: number
}

export type Progress = Record<string, ScenarioProgress>

export const EMPTY_PROGRESS: Progress = {}

export function record(progress: Progress, id: string, right: boolean, now = Date.now()): Progress {
  const prev = progress[id]
  return {
    ...progress,
    [id]: {
      seen: (prev?.seen ?? 0) + 1,
      correct: (prev?.correct ?? 0) + (right ? 1 : 0),
      last: right ? 'right' : 'wrong',
      at: now,
    },
  }
}
