import type { Division, Scenario } from '../types.ts'
import { SCENARIOS } from '../content/scenarios/index.ts'
import { buildSession, shuffle, type ModeChoice, type Session } from '../session/build.ts'
import { EMPTY_PROGRESS, record, type Progress } from '../session/progress.ts'

/**
 * All of the app's screen state, in one union and one reducer. There is no
 * router: what is on screen is a field, and going back is an action.
 */

export interface Answered {
  scenario: Scenario
  /** The option the player tapped, or null in coach mode where nobody guessed. */
  picked: string | null
  right: boolean
}

export type Screen =
  | { name: 'home' }
  | {
      name: 'question'
      session: Session
      index: number
      /** Option ids in the order they are shown. Shuffled once, when the question opens. */
      order: string[]
      picked: string | null
      revealed: boolean
      answered: Answered[]
    }
  | { name: 'results'; session: Session; answered: Answered[] }
  | { name: 'review'; session: Session; answered: Answered[]; index: number }

export interface AppState {
  division: Division
  coachMode: boolean
  progress: Progress
  screen: Screen
}

export type Action =
  | { type: 'set-division'; division: Division }
  | { type: 'set-coach-mode'; on: boolean }
  | { type: 'start'; mode: ModeChoice }
  | { type: 'pick'; optionId: string }
  | { type: 'reveal' }
  | { type: 'next' }
  | { type: 'review'; index: number }
  | { type: 'back-to-results' }
  | { type: 'play-again' }
  | { type: 'home' }

export const INITIAL: AppState = {
  division: 'Majors',
  coachMode: false,
  progress: EMPTY_PROGRESS,
  screen: { name: 'home' },
}

function openQuestion(
  session: Session,
  index: number,
  answered: Answered[],
): Extract<Screen, { name: 'question' }> {
  return {
    name: 'question',
    session,
    index,
    // Shuffled here rather than at render time so the order cannot change under
    // a player's thumb between reading the options and tapping one.
    order: shuffle(session.scenarios[index].options.map((o) => o.id)),
    picked: null,
    revealed: false,
    answered,
  }
}

function startSession(state: AppState, mode: ModeChoice): AppState {
  const session = buildSession(SCENARIOS, mode, state.division, state.progress)
  if (session.scenarios.length === 0) {
    return { ...state, screen: { name: 'results', session, answered: [] } }
  }
  return { ...state, screen: openQuestion(session, 0, []) }
}

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'set-division':
      return { ...state, division: action.division }

    case 'set-coach-mode':
      return { ...state, coachMode: action.on }

    case 'start':
      return startSession(state, action.mode)

    case 'play-again':
      if (state.screen.name !== 'results' && state.screen.name !== 'review') return state
      return startSession(state, state.screen.session.mode)

    case 'pick': {
      const s = state.screen
      if (s.name !== 'question' || s.revealed) return state
      const scenario = s.session.scenarios[s.index]
      const right = action.optionId === scenario.correctOptionId
      return {
        ...state,
        progress: record(state.progress, scenario.id, right),
        screen: {
          ...s,
          picked: action.optionId,
          revealed: true,
          answered: [...s.answered, { scenario, picked: action.optionId, right }],
        },
      }
    }

    case 'reveal': {
      // Coach mode: the answer is shown on a button press so a group can talk
      // it through first. Nobody guessed, so nothing is scored and nothing is
      // written to progress.
      const s = state.screen
      if (s.name !== 'question' || s.revealed) return state
      const scenario = s.session.scenarios[s.index]
      return {
        ...state,
        screen: {
          ...s,
          revealed: true,
          answered: [...s.answered, { scenario, picked: null, right: false }],
        },
      }
    }

    case 'next': {
      const s = state.screen
      if (s.name !== 'question' || !s.revealed) return state
      const next = s.index + 1
      if (next >= s.session.scenarios.length) {
        return { ...state, screen: { name: 'results', session: s.session, answered: s.answered } }
      }
      return { ...state, screen: openQuestion(s.session, next, s.answered) }
    }

    case 'review': {
      const s = state.screen
      if (s.name !== 'results') return state
      return { ...state, screen: { name: 'review', session: s.session, answered: s.answered, index: action.index } }
    }

    case 'back-to-results': {
      const s = state.screen
      if (s.name !== 'review') return state
      return { ...state, screen: { name: 'results', session: s.session, answered: s.answered } }
    }

    case 'home':
      return { ...state, screen: { name: 'home' } }
  }
}
