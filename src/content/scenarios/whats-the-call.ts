/*
 * ---------------------------------------------------------------------------
 * RULES ACCURACY WARNING — READ BEFORE EDITING
 *
 * Every rules fact in this file was written by a coach from memory, not
 * extracted from a rulebook. All of it must be checked against the CURRENT
 * Little League rulebook and the LBLL local rules for the division it is
 * tagged with, before this app is put in front of players.
 *
 * Little League Majors and below diverge from professional rules in ways a
 * general baseball instinct gets wrong. No rule number below is a real
 * citation: where the number is not certain, ruleRef is a plain description
 * and carries a TODO. Do not replace a TODO with a guessed number.
 *
 * See CONTENT.md for the full checklist.
 * ---------------------------------------------------------------------------
 */

import type { Scenario } from '../../types.ts'

export const WHATS_THE_CALL: Scenario[] = [
  {
    id: 'c-dropped-third-strike',
    mode: 'whats-the-call',
    // TODO: verify for AAA. The brief says no uncaught third strike applies in
    // "Majors and below", which would make this valid for AAA too, but the
    // seed content tagged it Majors and that has not been checked.
    divisions: ['Majors'],
    state: { outs: 1, runners: { first: true, second: false, third: false } },
    prompt:
      'The batter swings and misses strike three, and the catcher does not catch it cleanly. What is the call?',
    options: [
      { id: 'runs', label: 'Batter runs to first' },
      { id: 'out', label: 'Batter is out' },
      { id: 'out-stay', label: 'Batter is out, runner must stay' },
      { id: 'dead', label: 'Dead ball, do it over' },
    ],
    correctOptionId: 'out',
    explanation:
      'In Little League Majors there is no dropped third strike, so the batter is out whether the catcher holds it or not. The ball is still live, so the runner on first can try for second if it gets away.',
    ruleRef: 'Little League Majors and below: no uncaught third strike. TODO: confirm rule number.',
    localRuleSensitive: true,
    tags: ['strikeout', 'third strike'],
  },
  {
    id: 'c-infield-fly',
    mode: 'whats-the-call',
    // TODO: confirm whether the infield fly rule is in force in AAA before
    // adding that tag. The brief says it applies in Majors and says to check.
    divisions: ['Majors'],
    state: { outs: 1, runners: { first: true, second: true, third: false } },
    ball: { type: 'popup', zone: 'shortstop hole' },
    prompt:
      'The batter pops it up over the shortstop and the umpire yells "infield fly, batter is out." What happens to the runners?',
    options: [
      { id: 'stay', label: 'They have to stay put' },
      { id: 'own-risk', label: 'They may go at their own risk' },
      { id: 'all-out', label: 'They are out too' },
      { id: 'forced', label: 'They are forced to advance' },
    ],
    correctOptionId: 'own-risk',
    explanation:
      'The batter is out the moment the call is made, so the force is gone. Runners can go if they want, but nobody is making them.',
    ruleRef: 'Little League infield fly rule. TODO: confirm rule number and AAA status.',
    localRuleSensitive: true,
    tags: ['infield fly', 'force play'],
  },
  {
    id: 'c-head-first',
    mode: 'whats-the-call',
    // TODO: the head-first rule itself is league-wide, but this scenario is
    // built on a steal, and stealing rules vary by division and local league.
    // Check LBLL local rules for AAA before adding that tag.
    divisions: ['Majors'],
    state: { outs: 0, runners: { first: true, second: false, third: false } },
    prompt: 'The runner from first steals second and dives in head first, and the tag is late. What is the call?',
    options: [
      { id: 'safe', label: 'Safe' },
      { id: 'out', label: 'Out for diving head first' },
      { id: 'back', label: 'Safe, but sent back to first' },
      { id: 'umpire', label: "The umpire's choice" },
    ],
    correctOptionId: 'out',
    explanation:
      'In Little League you cannot slide head first into a base you are running to, so beating the tag does not matter. Diving back to a base you already had is fine.',
    ruleRef: 'Little League: head-first slide advancing to a base is an out. TODO: confirm rule number.',
    localRuleSensitive: true,
    tags: ['sliding', 'stealing'],
  },
  {
    id: 'c-leaves-early',
    mode: 'whats-the-call',
    divisions: ['AAA', 'Majors'],
    state: { outs: 0, runners: { first: true, second: false, third: false }, count: { balls: 3, strikes: 1 } },
    prompt:
      'The runner on first leaves the base before the pitch reaches the batter, and the batter takes ball four. What is the call?',
    options: [
      { id: 'runner-out', label: 'The runner is out' },
      { id: 'nothing', label: 'Nothing, the batter walked' },
      { id: 'back', label: 'The runner goes back to first' },
      { id: 'both', label: 'Both runners are out' },
    ],
    correctOptionId: 'nothing',
    explanation:
      'Leaving early normally gets the runner called out, but the penalty goes away when the batter reaches base safely anyway. The walk puts him on first, so there is nothing to call.',
    ruleRef:
      'Little League: leaving the base before the pitch reaches the batter, and the exception when the batter reaches base safely. TODO: verify the exact wording and every exception in the current rulebook.',
    localRuleSensitive: true,
    tags: ['leaving early', 'baserunning'],
  },
  {
    id: 'c-hit-by-batted-ball',
    mode: 'whats-the-call',
    divisions: ['AAA', 'Majors'],
    state: { outs: 0, runners: { first: false, second: true, third: false } },
    ball: { type: 'ground', zone: 'up the middle' },
    prompt:
      'A ground ball up the middle hits the runner going to third before any fielder touches it. What is the call?',
    options: [
      { id: 'runner-out', label: 'Runner is out, batter gets first' },
      { id: 'live', label: 'Nothing, the ball is live' },
      { id: 'batter-out', label: 'The batter is out' },
      { id: 'both', label: 'Both of them are out' },
    ],
    correctOptionId: 'runner-out',
    explanation:
      'A runner hit by a fair batted ball is out, because he took away the fielder’s chance to make the play. The batter did nothing wrong, so he is awarded first base.',
    ruleRef: 'Runner hit by a fair batted ball before it passes a fielder. TODO: confirm rule number.',
    tags: ['batted ball', 'baserunning'],
  },
]
