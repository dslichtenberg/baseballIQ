import type { Division } from '../types.ts'
import type { Progress, ScenarioProgress } from './progress.ts'

/**
 * Everything the app remembers, under one namespaced key.
 *
 * What is stored: per scenario id, how many times it has been seen, how many
 * times it was right, how it went last time, and when. Plus the division and
 * coach-mode switches so a kid does not re-pick them every time.
 *
 * What is not stored, and must never be: names, ages, teams, device ids, or
 * anything that could identify a child. That is the whole privacy story of this
 * app and it is worth keeping boring.
 *
 * Every path here is defensive. localStorage can be missing, can throw on
 * access in a private window, can be full, and can contain whatever an older
 * version of this app or a curious kid put there. None of that is allowed to
 * stop the app from working; it just stops it from remembering.
 */

const KEY = 'bballiq.v1'

export interface Remembered {
  progress: Progress
  division: Division
  coachMode: boolean
}

/**
 * Reading `window.localStorage` is itself what throws when storage is blocked,
 * so even getting a reference to it has to be guarded.
 */
function storage(): Storage | null {
  try {
    const s = window.localStorage
    // Safari in private mode hands back an object whose setItem always throws,
    // so prove it works rather than trusting that it exists.
    const probe = `${KEY}.probe`
    s.setItem(probe, '1')
    s.removeItem(probe)
    return s
  } catch {
    return null
  }
}

export function load(): Partial<Remembered> {
  const s = storage()
  if (!s) return {}
  try {
    const raw = s.getItem(KEY)
    if (!raw) return {}
    return parse(JSON.parse(raw))
  } catch {
    // Corrupt or from a shape we no longer understand. Start clean rather than
    // crash, and let the next save overwrite it.
    return {}
  }
}

export function save(value: Remembered): void {
  const s = storage()
  if (!s) return
  try {
    s.setItem(KEY, JSON.stringify(value))
  } catch {
    // Quota, or storage revoked mid-session. The app keeps playing; this
    // session just will not be remembered.
  }
}

/** Take only the fields we recognise, in the shape we expect. */
function parse(raw: unknown): Partial<Remembered> {
  if (typeof raw !== 'object' || raw === null) return {}
  const obj = raw as Record<string, unknown>
  const out: Partial<Remembered> = {}

  if (obj.division === 'AAA' || obj.division === 'Majors') out.division = obj.division
  if (typeof obj.coachMode === 'boolean') out.coachMode = obj.coachMode

  if (typeof obj.progress === 'object' && obj.progress !== null) {
    const progress: Progress = {}
    for (const [id, value] of Object.entries(obj.progress as Record<string, unknown>)) {
      const entry = parseEntry(value)
      if (entry) progress[id] = entry
    }
    out.progress = progress
  }

  return out
}

function parseEntry(value: unknown): ScenarioProgress | null {
  if (typeof value !== 'object' || value === null) return null
  const v = value as Record<string, unknown>
  if (typeof v.seen !== 'number' || !Number.isFinite(v.seen)) return null
  if (typeof v.correct !== 'number' || !Number.isFinite(v.correct)) return null
  if (v.last !== 'right' && v.last !== 'wrong') return null
  if (typeof v.at !== 'number' || !Number.isFinite(v.at)) return null
  return { seen: v.seen, correct: v.correct, last: v.last, at: v.at }
}
