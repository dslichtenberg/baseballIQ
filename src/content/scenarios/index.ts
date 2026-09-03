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
 * M1 ships no scenarios. The bank arrives in M2; this file is the single
 * import point the session builder and the validation script both read, so
 * adding a mode file never means touching a component.
 */

import type { Scenario } from '../../types.ts'

export const SCENARIOS: Scenario[] = []
