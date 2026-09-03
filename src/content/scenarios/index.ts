/*
 * ---------------------------------------------------------------------------
 * RULES ACCURACY WARNING
 *
 * Every rules fact in src/content/ was written by a coach from memory, not
 * extracted from a rulebook. All of it must be checked against the CURRENT
 * Little League rulebook and the LBLL local rules for the division it is
 * tagged with, before this app is put in front of players.
 *
 * Little League Majors and below diverge from professional rules in ways that
 * a general baseball instinct gets wrong. See CONTENT.md before adding or
 * editing anything here.
 * ---------------------------------------------------------------------------
 *
 * The single import point the session builder and the validation script both
 * read, so adding a mode file never means touching a component.
 */

import type { Scenario } from '../../types.ts'
import { MAKE_THE_PLAY } from './make-the-play.ts'
import { WHERE_DO_I_GO } from './where-do-i-go.ts'
import { WHATS_THE_CALL } from './whats-the-call.ts'

export const SCENARIOS: Scenario[] = [...MAKE_THE_PLAY, ...WHERE_DO_I_GO, ...WHATS_THE_CALL]
