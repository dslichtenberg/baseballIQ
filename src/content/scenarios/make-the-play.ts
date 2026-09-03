/*
 * ---------------------------------------------------------------------------
 * RULES ACCURACY WARNING — READ BEFORE EDITING
 *
 * Every rules fact in this file was written by a coach from memory, not
 * extracted from a rulebook. All of it must be checked against the CURRENT
 * Little League rulebook and the LBLL local rules for the division it is
 * tagged with, before this app is put in front of players.
 *
 * The scenarios here are about force plays and where the sure out is, which
 * do not diverge from the professional rules the way the "what is the call"
 * content does. That is not a reason to skip the check.
 *
 * See CONTENT.md for the full checklist.
 * ---------------------------------------------------------------------------
 */

import type { Scenario } from '../../types.ts'

export const MAKE_THE_PLAY: Scenario[] = [
  {
    id: 'a-force-at-second',
    mode: 'make-the-play',
    divisions: ['AAA', 'Majors'],
    state: { outs: 0, runners: { first: true, second: false, third: false } },
    ball: { type: 'ground', zone: 'shortstop hole', speed: 'hard' },
    youAre: 'SS',
    prompt: 'A hard ground ball comes right at you, so where do you throw it?',
    options: [
      { id: 'first', label: 'Throw to first' },
      { id: 'second', label: 'Throw to second for the force' },
      { id: 'chase', label: 'Run at the runner' },
      { id: 'third', label: 'Throw to third' },
    ],
    correctOptionId: 'second',
    explanation:
      'With nobody out, getting the lead runner is worth more than the easy out. He is forced, so second base only has to be touched, and there is no tag to miss.',
    overlay: {
      steps: [
        { kind: 'throw', from: 'SS', to: 'second' },
        { kind: 'touch', at: 'second' },
      ],
    },
    tags: ['force play', 'lead runner'],
  },
  {
    id: 'a-no-force-at-third',
    mode: 'make-the-play',
    divisions: ['AAA', 'Majors'],
    state: { outs: 1, runners: { first: false, second: true, third: false } },
    ball: { type: 'ground', zone: 'third' },
    youAre: '3B',
    prompt: 'A ground ball comes to you at third, so where do you throw it?',
    options: [
      { id: 'step', label: 'Step on third' },
      { id: 'first', label: 'Throw to first' },
      { id: 'tag-then-throw', label: 'Tag the runner, then throw' },
      { id: 'home', label: 'Throw home' },
    ],
    correctOptionId: 'first',
    explanation:
      'With a runner only on second, nobody is forced to run to third, so touching the bag does not get anyone out. The sure out is the batter at first.',
    overlay: {
      steps: [
        { kind: 'throw', from: '3B', to: 'first' },
        { kind: 'touch', at: 'first' },
      ],
    },
    tags: ['force play', 'sure out'],
  },
  {
    id: 'a-third-out-first-base',
    mode: 'make-the-play',
    divisions: ['AAA', 'Majors'],
    state: { outs: 2, runners: { first: false, second: false, third: true } },
    ball: { type: 'ground', zone: '3-4 hole' },
    youAre: '2B',
    prompt: 'A ground ball comes to you with two outs, so where do you throw it?',
    options: [
      { id: 'home', label: 'Throw home' },
      { id: 'first', label: 'Throw to first' },
      { id: 'run-second', label: 'Run it over to second' },
      { id: 'look', label: 'Look the runner back first' },
    ],
    correctOptionId: 'first',
    explanation:
      'The out at first is the third out, so the inning is over before the runner can cross the plate and the run does not count. Take the easy one.',
    overlay: {
      steps: [
        { kind: 'throw', from: '2B', to: 'first' },
        { kind: 'touch', at: 'first' },
      ],
    },
    tags: ['third out', 'sure out'],
  },
  {
    id: 'a-force-at-third',
    mode: 'make-the-play',
    divisions: ['AAA', 'Majors'],
    state: { outs: 1, runners: { first: true, second: true, third: false } },
    ball: { type: 'ground', zone: 'third' },
    youAre: '3B',
    prompt: 'A ground ball comes right to you a step from the bag, so what do you do?',
    options: [
      { id: 'step', label: 'Step on third' },
      { id: 'first', label: 'Throw to first' },
      { id: 'second', label: 'Throw to second' },
      { id: 'tag', label: 'Tag the runner' },
    ],
    correctOptionId: 'step',
    explanation:
      'With runners on first and second the lead runner is forced at third, and you are already standing there. It is the closest sure out and it takes the lead runner off the bases.',
    overlay: { steps: [{ kind: 'touch', at: 'third' }] },
    tags: ['force play', 'lead runner'],
  },
]
