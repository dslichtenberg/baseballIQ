/*
 * ---------------------------------------------------------------------------
 * RULES ACCURACY WARNING — READ BEFORE EDITING
 *
 * Every fact in this file was written by a coach from memory, not extracted
 * from a rulebook. All of it must be checked against the CURRENT Little League
 * rulebook and the LBLL local rules for the division it is tagged with, before
 * this app is put in front of players.
 *
 * This mode is about jobs on a play rather than about rules, so most of it is
 * coaching rather than rulebook. Coaching is still worth checking: a league
 * that teaches a different cutoff or backup assignment than the one here will
 * confuse a kid who learned it at practice.
 *
 * See CONTENT.md for the full checklist.
 * ---------------------------------------------------------------------------
 */

import type { Scenario } from '../../types.ts'

export const WHERE_DO_I_GO: Scenario[] = [
  {
    id: 'b-rf-backs-up-second',
    mode: 'where-do-i-go',
    divisions: ['AAA', 'Majors'],
    state: { outs: 0, runners: { first: true, second: false, third: false } },
    ball: { type: 'ground', zone: 'left' },
    youAre: 'RF',
    prompt: 'The ball is hit to left field, so what is your job?',
    options: [
      { id: 'stay', label: 'Stay in right field' },
      { id: 'backup', label: 'Back up the throw to second' },
      { id: 'first', label: 'Run to first base' },
      { id: 'cutoff', label: 'Go to the cutoff spot' },
    ],
    correctOptionId: 'backup',
    explanation:
      'The throw is coming to second from left field, and you are the one standing behind it. If it gets past the fielder, you are all that keeps the runner from taking another base.',
    overlay: { steps: [{ kind: 'move', who: 'RF', to: 'backup second' }] },
    tags: ['backup'],
  },
  {
    id: 'b-1b-cutoff-home',
    mode: 'where-do-i-go',
    divisions: ['AAA', 'Majors'],
    state: { outs: 1, runners: { first: false, second: true, third: false } },
    ball: { type: 'line', zone: 'shallow center' },
    youAre: '1B',
    prompt: 'A single drops in center and the runner from second is trying to score, so what is your job?',
    options: [
      { id: 'cover', label: 'Cover first base' },
      { id: 'cut', label: 'Be the cutoff man for the throw home' },
      { id: 'backup', label: 'Back up home plate' },
      { id: 'mound', label: 'Go stand by the mound' },
    ],
    correctOptionId: 'cut',
    explanation:
      'On a throw home from center, the first baseman is the cutoff. Line up between the center fielder and home so you give him a target, and so you can cut the ball off and get someone else if the run is already in.',
    overlay: { steps: [{ kind: 'cut', who: '1B', to: 'home' }] },
    tags: ['cutoff'],
  },
  {
    id: 'b-pitcher-backs-up-third',
    mode: 'where-do-i-go',
    divisions: ['AAA', 'Majors'],
    state: { outs: 0, runners: { first: true, second: false, third: false } },
    ball: { type: 'ground', zone: 'right' },
    youAre: 'P',
    prompt: 'A base hit goes to right field, so what is your job?',
    options: [
      { id: 'first', label: 'Cover first base' },
      { id: 'third', label: 'Back up third base' },
      { id: 'mound', label: 'Stay on the mound' },
      { id: 'second', label: 'Back up second base' },
    ],
    correctOptionId: 'third',
    explanation:
      'That runner is going first to third on a ball hit to right, so the throw is going to third. Your job is to get behind the bag before the ball does.',
    overlay: { steps: [{ kind: 'move', who: 'P', to: 'backup third' }] },
    tags: ['backup'],
  },
]
