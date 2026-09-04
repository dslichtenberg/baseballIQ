/*
 * ---------------------------------------------------------------------------
 * ACCURACY WARNING — READ BEFORE EDITING
 *
 * This file is coaching, not rulebook: where the sure out is, when a runner is
 * forced, which out is worth more. It should still be checked by a coach who
 * runs this division, because a league that teaches a play differently than
 * this file will confuse a kid who learned it at practice.
 *
 * The one thing here that IS rulebook is the force: a runner is forced only
 * when every base behind him is occupied. Every scenario below depends on that
 * being right. See CONTENT.md for the full checklist.
 * ---------------------------------------------------------------------------
 */

import type { Scenario } from '../../types.ts'

const BOTH = ['AAA', 'Majors'] as const

export const MAKE_THE_PLAY: Scenario[] = [
  // -------------------------------------------------------------------------
  // Force plays: who is forced, and why that changes the answer
  // -------------------------------------------------------------------------
  {
    id: 'a-force-at-second',
    mode: 'make-the-play',
    divisions: [...BOTH],
    state: { outs: 0, runners: { first: true, second: false, third: false } },
    ball: { type: 'ground', zone: 'shortstop hole', speed: 'hard' },
    youAre: 'SS',
    prompt: 'A hard ground ball comes right at you. Where do you throw it?',
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
    divisions: [...BOTH],
    state: { outs: 1, runners: { first: false, second: true, third: false } },
    ball: { type: 'ground', zone: 'third' },
    youAre: '3B',
    prompt: 'A ground ball comes to you at third. Where do you throw it?',
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
    divisions: [...BOTH],
    state: { outs: 2, runners: { first: false, second: false, third: true } },
    ball: { type: 'ground', zone: '3-4 hole' },
    youAre: '2B',
    prompt: 'A ground ball comes to you. Where do you throw it?',
    options: [
      { id: 'home', label: 'Throw home' },
      { id: 'first', label: 'Throw to first' },
      { id: 'run-second', label: 'Run it over to second' },
      { id: 'look', label: 'Look the runner back first' },
    ],
    correctOptionId: 'first',
    explanation:
      'The out at first is the third out, so the inning ends before the runner can cross the plate. The run does not count. Take the easy one.',
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
    divisions: [...BOTH],
    state: { outs: 1, runners: { first: true, second: true, third: false } },
    ball: { type: 'ground', zone: 'third' },
    youAre: '3B',
    prompt: 'A ground ball comes right to you a step from the bag. What do you do?',
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
  {
    id: 'a-bases-loaded-force-home',
    mode: 'make-the-play',
    divisions: [...BOTH],
    state: { outs: 0, runners: { first: true, second: true, third: true } },
    ball: { type: 'ground', zone: 'mound', speed: 'normal' },
    youAre: 'P',
    prompt: 'The bases are loaded and the ball comes back to you. Where do you throw?',
    options: [
      { id: 'home', label: 'Throw home for the force' },
      { id: 'first', label: 'Throw to first' },
      { id: 'second', label: 'Throw to second' },
      { id: 'hold', label: 'Hold the ball' },
    ],
    correctOptionId: 'home',
    explanation:
      'With the bases loaded every runner is forced, including the one going home, so the catcher only has to touch the plate. That is the one out that also keeps a run off the board.',
    overlay: {
      steps: [
        { kind: 'throw', from: 'P', to: 'home' },
        { kind: 'touch', at: 'home' },
      ],
    },
    tags: ['force play', 'play at the plate'],
  },
  {
    id: 'a-first-and-third-force-at-second',
    mode: 'make-the-play',
    divisions: [...BOTH],
    state: { outs: 1, runners: { first: true, second: false, third: true } },
    ball: { type: 'ground', zone: 'shortstop hole' },
    youAre: 'SS',
    prompt: 'Runners are on first and third. A ground ball comes to you. Where do you throw it?',
    options: [
      { id: 'second', label: 'Throw to second for the force' },
      { id: 'home', label: 'Throw home' },
      { id: 'third', label: 'Throw to third' },
      { id: 'hold', label: 'Hold it and look around' },
    ],
    correctOptionId: 'second',
    explanation:
      'Only the runner from first is forced, so second is the one base you can just touch. The runner on third is not forced, so a throw home would need a tag and could miss.',
    overlay: {
      steps: [
        { kind: 'throw', from: 'SS', to: 'second' },
        { kind: 'touch', at: 'second' },
      ],
    },
    tags: ['force play'],
  },
  {
    id: 'a-two-outs-closest-force',
    mode: 'make-the-play',
    divisions: [...BOTH],
    state: { outs: 2, runners: { first: true, second: true, third: true } },
    ball: { type: 'ground', zone: '3-4 hole' },
    youAre: '2B',
    prompt: 'The ball comes to you right next to the bag. What do you do?',
    options: [
      { id: 'second', label: 'Step on second' },
      { id: 'home', label: 'Throw home' },
      { id: 'first', label: 'Throw to first' },
      { id: 'third', label: 'Throw to third' },
    ],
    correctOptionId: 'second',
    explanation:
      'With the bases loaded you can force a runner at any base. Take the one closest to you and do not risk a throw. Any third out on a force means no run scores.',
    overlay: { steps: [{ kind: 'touch', at: 'second' }] },
    tags: ['force play', 'third out'],
  },
  {
    id: 'a-runner-on-second-only',
    mode: 'make-the-play',
    divisions: [...BOTH],
    state: { outs: 0, runners: { first: false, second: true, third: false } },
    ball: { type: 'ground', zone: 'up the middle' },
    youAre: 'SS',
    prompt: 'The only runner is on second. A ground ball comes to you. Where do you throw it?',
    options: [
      { id: 'first', label: 'Throw to first' },
      { id: 'third', label: 'Throw to third' },
      { id: 'second', label: 'Step on second' },
      { id: 'home', label: 'Throw home' },
    ],
    correctOptionId: 'first',
    explanation:
      'Nobody is forced except the batter, so first is the only base you can get an out by touching. Chasing the runner to third means a tag, and if you miss you have nothing.',
    overlay: {
      steps: [
        { kind: 'throw', from: 'SS', to: 'first' },
        { kind: 'touch', at: 'first' },
      ],
    },
    tags: ['force play', 'sure out'],
  },
  {
    id: 'a-force-is-off-after-first',
    mode: 'make-the-play',
    divisions: ['Majors'],
    state: { outs: 0, runners: { first: true, second: false, third: false } },
    ball: { type: 'ground', zone: 'first', speed: 'hard' },
    youAre: '1B',
    prompt: 'You field it standing on first base. What happens to the runner going to second?',
    options: [
      { id: 'still-forced', label: 'He is still forced at second' },
      { id: 'must-tag', label: 'He has to be tagged now' },
      { id: 'automatic', label: 'He is automatically out' },
      { id: 'back', label: 'He must go back to first' },
    ],
    correctOptionId: 'must-tag',
    explanation:
      'The runner was only forced because the batter was coming to first. The moment you touch first the batter is out, the force disappears, and second base has to tag him.',
    tags: ['force play', 'tag play'],
  },

  // -------------------------------------------------------------------------
  // Double plays and when not to try for two
  // -------------------------------------------------------------------------
  {
    id: 'a-turn-two-from-short',
    mode: 'make-the-play',
    divisions: ['Majors'],
    state: { outs: 0, runners: { first: true, second: false, third: false }, alignment: 'double play depth' },
    ball: { type: 'ground', zone: 'shortstop hole', speed: 'hard' },
    youAre: 'SS',
    prompt: 'A clean ground ball comes to you. What is the play?',
    options: [
      { id: 'two', label: 'Flip to second, then on to first' },
      { id: 'first-only', label: 'Throw straight to first' },
      { id: 'run-it', label: 'Run the ball to second' },
      { id: 'third', label: 'Throw to third' },
    ],
    correctOptionId: 'two',
    explanation:
      'You are close enough to second that the flip is short and safe, and the runner is forced. Two outs on one ground ball is the best thing that can happen to a defense.',
    overlay: {
      steps: [
        { kind: 'throw', from: 'SS', to: 'second' },
        { kind: 'throw', from: 'second', to: 'first' },
      ],
    },
    tags: ['double play', 'force play'],
  },
  {
    id: 'a-slow-roller-take-the-one',
    mode: 'make-the-play',
    divisions: [...BOTH],
    state: { outs: 0, runners: { first: true, second: false, third: false } },
    ball: { type: 'ground', zone: 'third', speed: 'slow' },
    youAre: '3B',
    prompt: 'A slow roller dies in front of you. What do you do?',
    options: [
      { id: 'first', label: 'Throw to first' },
      { id: 'second', label: 'Throw to second' },
      { id: 'two', label: 'Try to get both runners' },
      { id: 'hold', label: 'Hold on to it' },
    ],
    correctOptionId: 'first',
    explanation:
      'The ball took too long to reach you, so the lead runner is already there. A rushed throw turns a one-out play into nobody out. Take the out you know you have.',
    overlay: {
      steps: [
        { kind: 'throw', from: '3B', to: 'first' },
        { kind: 'touch', at: 'first' },
      ],
    },
    tags: ['sure out', 'slow roller'],
  },
  {
    id: 'a-second-baseman-flip',
    mode: 'make-the-play',
    divisions: ['Majors'],
    state: { outs: 0, runners: { first: true, second: false, third: false }, alignment: 'double play depth' },
    ball: { type: 'ground', zone: '3-4 hole' },
    youAre: '2B',
    prompt: 'A ground ball comes to you. Who covers second for your throw?',
    options: [
      { id: 'ss', label: 'The shortstop' },
      { id: 'p', label: 'The pitcher' },
      { id: 'first', label: 'The first baseman' },
      { id: 'nobody', label: 'Nobody, run it there yourself' },
    ],
    correctOptionId: 'ss',
    explanation:
      'You are on the first base side of the bag, so the shortstop crosses to cover and gives you a short throw. Somebody has to be standing there before the ball is.',
    overlay: {
      steps: [
        { kind: 'move', who: 'SS', to: 'second' },
        { kind: 'throw', from: '2B', to: 'second' },
      ],
    },
    tags: ['double play', 'covering a base'],
  },

  // -------------------------------------------------------------------------
  // Infield in, and the play at the plate
  // -------------------------------------------------------------------------
  {
    id: 'a-infield-in-throw-home',
    mode: 'make-the-play',
    divisions: [...BOTH],
    state: { outs: 1, runners: { first: false, second: false, third: true }, alignment: 'infield in' },
    ball: { type: 'ground', zone: 'shortstop hole' },
    youAre: 'SS',
    prompt: 'The infield is in. The runner breaks for home and the ball comes to you. Where do you throw?',
    options: [
      { id: 'home', label: 'Throw home' },
      { id: 'first', label: 'Throw to first' },
      { id: 'second', label: 'Throw to second' },
      { id: 'run-at', label: 'Run at the runner' },
    ],
    correctOptionId: 'home',
    explanation:
      'Playing in is the whole reason you are close enough to beat him to the plate, so use it. Getting the run is worth more here than getting the batter.',
    overlay: {
      steps: [
        { kind: 'throw', from: 'SS', to: 'home' },
        { kind: 'touch', at: 'home' },
      ],
    },
    tags: ['infield in', 'play at the plate'],
  },
  {
    id: 'a-infield-in-runner-holds',
    mode: 'make-the-play',
    divisions: [...BOTH],
    state: { outs: 1, runners: { first: false, second: false, third: true }, alignment: 'infield in' },
    ball: { type: 'ground', zone: 'third' },
    youAre: '3B',
    prompt: 'The infield is in but the runner freezes on third. Where do you throw?',
    options: [
      { id: 'home', label: 'Throw home anyway' },
      { id: 'first', label: 'Throw to first' },
      { id: 'tag-runner', label: 'Run over and tag him' },
      { id: 'hold', label: 'Hold the ball' },
    ],
    correctOptionId: 'first',
    explanation:
      'He is not forced, so throwing home only works if he is running. Once he stops, look him back and take the out you can actually get.',
    overlay: {
      steps: [
        { kind: 'throw', from: '3B', to: 'first' },
        { kind: 'touch', at: 'first' },
      ],
    },
    tags: ['infield in', 'sure out'],
  },
  {
    id: 'a-normal-depth-concede-the-run',
    mode: 'make-the-play',
    divisions: [...BOTH],
    state: { outs: 1, runners: { first: false, second: false, third: true } },
    ball: { type: 'ground', zone: 'shortstop hole' },
    youAre: 'SS',
    prompt: 'You are playing at normal depth. The ball comes to you. Where do you throw it?',
    options: [
      { id: 'first', label: 'Throw to first' },
      { id: 'home', label: 'Throw home' },
      { id: 'hold', label: 'Hold it and freeze him' },
      { id: 'third', label: 'Throw to third' },
    ],
    correctOptionId: 'first',
    explanation:
      'From normal depth you are too far back to beat a runner who left on contact. A throw home is a race you already lost. Take the out and let the run score.',
    overlay: {
      steps: [
        { kind: 'throw', from: 'SS', to: 'first' },
        { kind: 'touch', at: 'first' },
      ],
    },
    tags: ['sure out', 'play at the plate'],
  },
  {
    id: 'a-two-outs-runner-on-third',
    mode: 'make-the-play',
    divisions: [...BOTH],
    state: { outs: 2, runners: { first: false, second: false, third: true } },
    ball: { type: 'ground', zone: 'third' },
    youAre: '3B',
    prompt: 'The ball comes to you. Where do you throw it?',
    options: [
      { id: 'first', label: 'Throw to first' },
      { id: 'home', label: 'Throw home' },
      { id: 'step', label: 'Step on third' },
      { id: 'tag', label: 'Chase him back and tag him' },
    ],
    correctOptionId: 'first',
    explanation:
      'The out at first ends the inning, and a run only counts if it crosses before the third out. Beat the batter to first and the run never happens.',
    overlay: {
      steps: [
        { kind: 'throw', from: '3B', to: 'first' },
        { kind: 'touch', at: 'first' },
      ],
    },
    tags: ['third out', 'sure out'],
  },
  {
    id: 'a-catcher-force-at-home',
    mode: 'make-the-play',
    divisions: [...BOTH],
    state: { outs: 1, runners: { first: true, second: true, third: true } },
    ball: { type: 'bunt', zone: 'in front of plate', speed: 'slow' },
    youAre: 'C',
    prompt: 'The bases are loaded. A bunt dies in front of the plate. What is the quickest out?',
    options: [
      { id: 'step-home', label: 'Step on home plate' },
      { id: 'first', label: 'Throw to first' },
      { id: 'tag-runner', label: 'Tag the runner coming home' },
      { id: 'third', label: 'Throw to third' },
    ],
    correctOptionId: 'step-home',
    explanation:
      'With the bases loaded the runner from third is forced. The plate only has to be touched, and you are standing on it. No throw means nothing to throw away.',
    overlay: { steps: [{ kind: 'touch', at: 'home' }] },
    tags: ['force play', 'bunt', 'play at the plate'],
  },
  {
    id: 'a-catcher-must-tag',
    mode: 'make-the-play',
    divisions: [...BOTH],
    state: { outs: 1, runners: { first: false, second: false, third: true } },
    youAre: 'C',
    prompt: 'The runner from third is coming home and the throw beats him. How do you get him out?',
    options: [
      { id: 'tag', label: 'Tag him with the ball' },
      { id: 'plate', label: 'Touch home plate' },
      { id: 'block', label: 'Stand in front of the plate' },
      { id: 'show', label: 'Hold the ball up for the umpire' },
    ],
    correctOptionId: 'tag',
    explanation:
      'Nobody is on first or second, so this runner is not forced and touching the plate does nothing. He is only out when the ball touches him.',
    overlay: { steps: [{ kind: 'touch', at: 'home' }] },
    tags: ['tag play', 'play at the plate'],
  },

  // -------------------------------------------------------------------------
  // Bunts and slow rollers
  // -------------------------------------------------------------------------
  {
    id: 'a-bunt-catcher-to-first',
    mode: 'make-the-play',
    divisions: [...BOTH],
    state: { outs: 0, runners: { first: false, second: false, third: false } },
    ball: { type: 'bunt', zone: 'in front of plate' },
    youAre: 'C',
    prompt: 'Nobody is on base. A bunt rolls out in front of the plate. What do you do?',
    options: [
      { id: 'first', label: 'Pounce on it, throw to first' },
      { id: 'wait', label: 'Wait and see if it goes foul' },
      { id: 'second', label: 'Throw to second' },
      { id: 'hold', label: 'Pick it up and hold it' },
    ],
    correctOptionId: 'first',
    explanation:
      'There is only one runner to get and every step you wait is a step he gains. Get on top of the ball and make one good throw.',
    overlay: {
      steps: [
        { kind: 'throw', from: 'C', to: 'first' },
        { kind: 'touch', at: 'first' },
      ],
    },
    tags: ['bunt'],
  },
  {
    id: 'a-bunt-lead-runner-at-second',
    mode: 'make-the-play',
    divisions: [...BOTH],
    state: { outs: 0, runners: { first: true, second: false, third: false } },
    ball: { type: 'bunt', zone: 'mound', speed: 'normal' },
    youAre: 'P',
    prompt: 'A bunt comes right back at you off the mound. Where do you throw it?',
    options: [
      { id: 'second', label: 'Throw to second for the force' },
      { id: 'first', label: 'Throw to first' },
      { id: 'third', label: 'Throw to third' },
      { id: 'hold', label: 'Hold it, nobody is covering' },
    ],
    correctOptionId: 'second',
    explanation:
      'You got to the ball fast and the runner is forced, so the lead out is there for the taking. Getting the lead runner is the whole reason the defense fields a bunt hard.',
    overlay: {
      steps: [
        { kind: 'throw', from: 'P', to: 'second' },
        { kind: 'touch', at: 'second' },
      ],
    },
    tags: ['bunt', 'force play', 'lead runner'],
  },
  {
    id: 'a-bunt-too-slow-for-the-lead',
    mode: 'make-the-play',
    divisions: [...BOTH],
    state: { outs: 0, runners: { first: true, second: true, third: false } },
    ball: { type: 'bunt', zone: 'third', speed: 'slow' },
    youAre: '3B',
    prompt: 'A soft bunt dribbles down the line and you barely reach it. Where do you throw?',
    options: [
      { id: 'first', label: 'Throw to first' },
      { id: 'third', label: 'Step back on third' },
      { id: 'second', label: 'Throw to second' },
      { id: 'nowhere', label: 'Eat it, no play' },
    ],
    correctOptionId: 'first',
    explanation:
      'You had to leave the bag to get it, so nobody is at third to take your throw. The lead runner is already standing there. First is the only out left.',
    overlay: {
      steps: [
        { kind: 'throw', from: '3B', to: 'first' },
        { kind: 'touch', at: 'first' },
      ],
    },
    tags: ['bunt', 'sure out'],
  },
  {
    id: 'a-slow-roller-charge-it',
    mode: 'make-the-play',
    divisions: [...BOTH],
    state: { outs: 1, runners: { first: false, second: false, third: false } },
    ball: { type: 'ground', zone: 'third', speed: 'slow' },
    youAre: '3B',
    prompt: 'A slow roller is trickling toward you with nobody on. What do you do?',
    options: [
      { id: 'charge', label: 'Charge it and throw on the run' },
      { id: 'wait', label: 'Wait for it to come to you' },
      { id: 'set', label: 'Field it, set your feet, then throw' },
      { id: 'let-go', label: 'Let it roll foul' },
    ],
    correctOptionId: 'charge',
    explanation:
      'A slow roller is a race, and standing still hands the runner the two steps that beat your throw. Attack the ball so you still have time to make a play.',
    tags: ['slow roller'],
  },

  // -------------------------------------------------------------------------
  // Tags, rundowns, and holding runners
  // -------------------------------------------------------------------------
  {
    id: 'a-rundown-run-at-him',
    mode: 'make-the-play',
    divisions: [...BOTH],
    state: { outs: 1, runners: { first: false, second: true, third: false } },
    youAre: 'SS',
    prompt: 'You have the ball and a runner is stuck between second and third. What do you do?',
    options: [
      { id: 'run-at', label: 'Run hard at him toward second' },
      { id: 'wait', label: 'Stand still and wait' },
      { id: 'throw-lots', label: 'Throw back and forth a few times' },
      { id: 'fake', label: 'Fake a throw to freeze him' },
    ],
    correctOptionId: 'run-at',
    explanation:
      'Running him back toward the base he came from means the worst thing that happens is he ends up where he started. Every extra throw is another chance to drop it.',
    tags: ['rundown', 'tag play'],
  },
  {
    id: 'a-look-the-runner-back',
    mode: 'make-the-play',
    divisions: [...BOTH],
    state: { outs: 1, runners: { first: false, second: false, third: true } },
    ball: { type: 'ground', zone: 'up the middle', speed: 'slow' },
    youAre: 'P',
    prompt: 'You field a slow roller. The runner on third is a few steps off the bag. What do you do first?',
    options: [
      { id: 'look', label: 'Look him back, then throw to first' },
      { id: 'first', label: 'Throw to first right away' },
      { id: 'home', label: 'Throw home' },
      { id: 'third', label: 'Throw to third' },
    ],
    correctOptionId: 'look',
    explanation:
      'One hard look freezes him long enough that he cannot break for home while the ball is in the air. Then take the out you were always going to take.',
    overlay: {
      steps: [
        { kind: 'throw', from: 'P', to: 'first' },
        { kind: 'touch', at: 'first' },
      ],
    },
    tags: ['play at the plate', 'sure out'],
  },

  // -------------------------------------------------------------------------
  // Pop ups and fly balls
  // -------------------------------------------------------------------------
  {
    id: 'a-popup-call-it-loud',
    mode: 'make-the-play',
    divisions: [...BOTH],
    state: { outs: 0, runners: { first: false, second: false, third: false } },
    ball: { type: 'popup', zone: 'shortstop hole' },
    youAre: 'SS',
    prompt: 'A pop up goes straight up between you and the third baseman. What do you do?',
    options: [
      { id: 'call', label: 'Call for it loudly and take it' },
      { id: 'wave', label: 'Wave the third baseman off silently' },
      { id: 'let', label: 'Let the third baseman have it' },
      { id: 'both', label: 'Both go and see who gets there' },
    ],
    correctOptionId: 'call',
    explanation:
      'Two players running at the same ball in silence is how somebody gets hurt and the ball lands. Whoever calls first owns it, and everyone else peels off.',
    tags: ['pop up', 'communication'],
  },
  {
    id: 'a-infield-fly-still-catch-it',
    mode: 'make-the-play',
    divisions: ['Majors'],
    state: { outs: 1, runners: { first: true, second: true, third: false } },
    ball: { type: 'popup', zone: 'up the middle' },
    youAre: 'SS',
    prompt: 'The umpire calls infield fly and you are camped under it. What do you do?',
    options: [
      { id: 'catch', label: 'Catch it like normal' },
      { id: 'drop', label: 'Let it drop for a double play' },
      { id: 'step', label: 'Let it drop, then step on second' },
      { id: 'walk', label: 'Walk off, the batter is already out' },
    ],
    correctOptionId: 'catch',
    explanation:
      'The batter is out either way, but a dropped ball is live and runners can take off on it. Catching it ends the play with everyone standing still.',
    ruleRef: 'Little League infield fly rule. TODO: confirm rule number and AAA status.',
    localRuleSensitive: true,
    tags: ['infield fly', 'pop up'],
  },
  {
    id: 'a-catch-and-throw-home',
    mode: 'make-the-play',
    divisions: [...BOTH],
    state: { outs: 1, runners: { first: false, second: false, third: true } },
    ball: { type: 'fly', zone: 'shallow left' },
    youAre: 'LF',
    prompt: 'You catch a shallow fly ball. The runner on third is tagging. What do you do?',
    options: [
      { id: 'home', label: 'Come up throwing to home' },
      { id: 'second', label: 'Throw to second' },
      { id: 'jog', label: 'Jog it back to the infield' },
      { id: 'third', label: 'Throw behind him to third' },
    ],
    correctOptionId: 'home',
    explanation:
      'It was shallow, so you have a real chance to beat him to the plate if the throw goes right away. Catch it moving toward home so your momentum is already going the right way.',
    overlay: { steps: [{ kind: 'cut', who: '3B', to: 'home' }] },
    tags: ['tag up', 'play at the plate'],
  },
  {
    id: 'a-fly-ball-third-out',
    mode: 'make-the-play',
    divisions: [...BOTH],
    state: { outs: 2, runners: { first: true, second: true, third: false } },
    ball: { type: 'fly', zone: 'center' },
    youAre: 'CF',
    prompt: 'Two outs and you settle under a routine fly ball. What happens after you catch it?',
    options: [
      { id: 'nothing', label: 'Nothing, the inning is over' },
      { id: 'second', label: 'Throw to second quickly' },
      { id: 'home', label: 'Throw home' },
      { id: 'third', label: 'Throw to third' },
    ],
    correctOptionId: 'nothing',
    explanation:
      'The catch is the third out, so the inning ends the moment the ball hits your glove and nothing after that counts. Squeeze it and run in.',
    tags: ['third out', 'fly ball'],
  },
  {
    id: 'a-outfielder-priority',
    mode: 'make-the-play',
    divisions: [...BOTH],
    state: { outs: 0, runners: { first: false, second: false, third: false } },
    ball: { type: 'fly', zone: 'shallow center' },
    youAre: 'CF',
    prompt: 'A blooper drops between you and the second baseman and you both call it. Who takes it?',
    options: [
      { id: 'cf', label: 'You do, coming in is easier' },
      { id: '2b', label: 'The second baseman' },
      { id: 'closest', label: 'Whoever is closest to it' },
      { id: 'neither', label: 'Let it drop and play the hop' },
    ],
    correctOptionId: 'cf',
    explanation:
      'You are running in and can see the whole play in front of you. The infielder is running away from everything with his back turned. The outfielder gets the ball whenever both can reach it.',
    tags: ['pop up', 'communication'],
  },

  // -------------------------------------------------------------------------
  // Outfield decisions
  // -------------------------------------------------------------------------
  {
    id: 'a-hit-the-cutoff-man',
    mode: 'make-the-play',
    divisions: [...BOTH],
    state: { outs: 1, runners: { first: false, second: true, third: false } },
    ball: { type: 'ground', zone: 'deep right' },
    youAre: 'RF',
    prompt: 'You run down a ball near the fence and the runner is rounding third. Where do you throw?',
    options: [
      { id: 'cutoff', label: 'To the cutoff man' },
      { id: 'home', label: 'All the way home on the fly' },
      { id: 'third', label: 'Back to third base' },
      { id: 'run-in', label: 'Run it in yourself' },
    ],
    correctOptionId: 'cutoff',
    explanation:
      'A throw that far in the air lands late and short, and it lets everybody else move up. The cutoff man turns one long weak throw into two strong ones.',
    overlay: { steps: [{ kind: 'relay', who: '2B', to: 'home' }] },
    tags: ['cutoff', 'outfield throw'],
  },
  {
    id: 'a-throw-ahead-of-the-runner',
    mode: 'make-the-play',
    divisions: [...BOTH],
    state: { outs: 1, runners: { first: true, second: false, third: false } },
    ball: { type: 'ground', zone: 'right' },
    youAre: 'RF',
    prompt: 'A single gets through to you. The runner from first is digging for third. Where do you throw?',
    options: [
      { id: 'third', label: 'Ahead of him, to third' },
      { id: 'second', label: 'Behind him, to second' },
      { id: 'first', label: 'To first base' },
      { id: 'hold', label: 'Hold it and walk in' },
    ],
    correctOptionId: 'third',
    explanation:
      'You cannot out-run a runner from behind, so throw to the base he is going to and let it beat him there. Throwing behind a moving runner just concedes the base.',
    overlay: { steps: [{ kind: 'relay', who: 'SS', to: 'third' }] },
    tags: ['outfield throw'],
  },
  {
    id: 'a-keep-the-batter-off-second',
    mode: 'make-the-play',
    divisions: [...BOTH],
    state: { outs: 1, runners: { first: false, second: true, third: false } },
    ball: { type: 'ground', zone: 'left' },
    youAre: 'LF',
    prompt: 'A single scores the runner easily and the batter is rounding first. Where do you throw?',
    options: [
      { id: 'second', label: 'To second, keep the batter there' },
      { id: 'home', label: 'Home, try to get the run' },
      { id: 'third', label: 'To third base' },
      { id: 'first', label: 'Back to first base' },
    ],
    correctOptionId: 'second',
    explanation:
      'That run is already in and a throw home cannot take it back, so stop worrying about it. Keeping the batter at first means the next single does not score another one.',
    overlay: { steps: [{ kind: 'relay', who: 'SS', to: 'second' }] },
    tags: ['outfield throw'],
  },
  {
    id: 'a-block-the-ball-in-the-gap',
    mode: 'make-the-play',
    divisions: [...BOTH],
    state: { outs: 0, runners: { first: false, second: false, third: false } },
    ball: { type: 'ground', zone: 'left center', speed: 'hard' },
    youAre: 'CF',
    prompt: 'A hard ground ball is skipping into the gap. What do you do?',
    options: [
      { id: 'front', label: 'Get in front and keep it close' },
      { id: 'dive', label: 'Dive at it sideways' },
      { id: 'backhand', label: 'Backhand it on the run' },
      { id: 'chase', label: 'Chase it to the fence' },
    ],
    correctOptionId: 'front',
    explanation:
      'A ball that gets past you in the gap rolls to the fence and turns a double into a triple. Blocking it costs one base; missing it costs two.',
    tags: ['outfield', 'keep it in front'],
  },
  {
    id: 'a-fielder-charges-the-single',
    mode: 'make-the-play',
    divisions: [...BOTH],
    state: { outs: 0, runners: { first: false, second: true, third: false } },
    ball: { type: 'ground', zone: 'shallow left' },
    youAre: 'LF',
    prompt: 'A soft single drops in front of you. The runner is going first to third. How do you play it?',
    options: [
      { id: 'charge', label: 'Charge it and come up throwing' },
      { id: 'wait', label: 'Let it stop rolling first' },
      { id: 'safe', label: 'Play it safe on one knee' },
      { id: 'circle', label: 'Circle around behind it' },
    ],
    correctOptionId: 'charge',
    explanation:
      'The runner is going the whole way whether you hurry or not. The only thing you control is how soon the ball leaves your hand. Nobody on base is threatening to run past you here.',
    tags: ['outfield throw'],
  },

  // -------------------------------------------------------------------------
  // Pitcher and catcher plays
  // -------------------------------------------------------------------------
  {
    id: 'a-catcher-blocks-then-checks',
    mode: 'make-the-play',
    divisions: ['Majors'],
    state: { outs: 1, runners: { first: false, second: true, third: false }, count: { balls: 1, strikes: 2 } },
    youAre: 'C',
    prompt: 'A pitch bounces in the dirt and you knock it down. What is the very next thing?',
    options: [
      { id: 'find', label: 'Find the ball, then find the runner' },
      { id: 'throw', label: 'Throw to third right away' },
      { id: 'stay', label: 'Stay down and cover up' },
      { id: 'appeal', label: 'Ask the umpire for time' },
    ],
    correctOptionId: 'find',
    explanation:
      'Blocking it is only half the job, because a ball on the ground three feet away is still a free base. Get your eyes on it, then decide whether the runner gave you a play.',
    localRuleSensitive: true,
    tags: ['catcher', 'blocking'],
  },
  {
    id: 'a-first-baseman-stretch',
    mode: 'make-the-play',
    divisions: [...BOTH],
    state: { outs: 0, runners: { first: false, second: false, third: false } },
    ball: { type: 'ground', zone: 'shortstop hole' },
    youAre: '1B',
    prompt: 'The throw from short is coming and it is going to be close. What do you do?',
    options: [
      { id: 'stretch', label: 'Stretch toward the throw' },
      { id: 'wait', label: 'Stand on the bag and wait' },
      { id: 'step-off', label: 'Step off and catch it safely' },
      { id: 'jump', label: 'Jump for it' },
    ],
    correctOptionId: 'stretch',
    explanation:
      'Reaching out means the ball arrives a full step sooner with your foot still on the bag. A step is exactly how close these plays are. Stretch toward the ball, not always toward the shortstop.',
    tags: ['covering a base'],
  },
  {
    id: 'a-bobble-take-the-sure-out',
    mode: 'make-the-play',
    divisions: [...BOTH],
    state: { outs: 0, runners: { first: true, second: false, third: false } },
    ball: { type: 'ground', zone: '3-4 hole' },
    youAre: '2B',
    prompt: 'You bobble the ball and pick it up late. Where do you throw it?',
    options: [
      { id: 'first', label: 'Throw to first' },
      { id: 'second', label: 'Throw to second anyway' },
      { id: 'two', label: 'Still try to turn two' },
      { id: 'hold', label: 'Hold on to it' },
    ],
    correctOptionId: 'first',
    explanation:
      'The bobble cost you the time you needed for the lead runner, and forcing it now turns one mistake into two. Take the out that is still there and start the next play.',
    overlay: {
      steps: [
        { kind: 'throw', from: '2B', to: 'first' },
        { kind: 'touch', at: 'first' },
      ],
    },
    tags: ['sure out'],
  },
  {
    id: 'a-catcher-throws-to-second',
    mode: 'make-the-play',
    divisions: ['Majors'],
    state: { outs: 1, runners: { first: true, second: false, third: false } },
    youAre: 'C',
    prompt: 'The runner takes off for second on the pitch. What do you do with the ball?',
    options: [
      { id: 'second', label: 'Come up and throw to second' },
      { id: 'hold', label: 'Hold it, he has the base' },
      { id: 'first', label: 'Throw to first' },
      { id: 'chase', label: 'Run at him' },
    ],
    correctOptionId: 'second',
    explanation:
      'You catch and throw in one motion, because the runner is already moving and every wasted step is a step he gains. Even a throw that does not get him keeps him honest next time.',
    overlay: {
      steps: [
        { kind: 'throw', from: 'C', to: 'second' },
        { kind: 'touch', at: 'second' },
      ],
    },
    ruleRef: 'Stealing rules vary by division and by local league. TODO: check LBLL local rules.',
    localRuleSensitive: true,
    tags: ['catcher', 'stealing'],
  },
  {
    id: 'a-outfielder-get-behind-it',
    mode: 'make-the-play',
    divisions: [...BOTH],
    state: { outs: 1, runners: { first: false, second: true, third: false } },
    ball: { type: 'ground', zone: 'center' },
    youAre: 'CF',
    prompt: 'A single is coming to you and a runner is trying to score. How do you set up to throw?',
    options: [
      { id: 'through', label: 'Get behind it and step through it' },
      { id: 'sideways', label: 'Field it sideways and flick it' },
      { id: 'knee', label: 'Drop to a knee, then stand up' },
      { id: 'flat', label: 'Field it flat footed and throw' },
    ],
    correctOptionId: 'through',
    explanation:
      'Coming through the ball toward your target puts your whole body into the throw instead of just your arm. A strong throw on a line beats a rushed one every time.',
    tags: ['outfield throw'],
  },
  {
    id: 'a-comebacker-two-outs',
    mode: 'make-the-play',
    divisions: [...BOTH],
    state: { outs: 2, runners: { first: true, second: true, third: false } },
    ball: { type: 'ground', zone: 'mound', speed: 'hard' },
    youAre: 'P',
    prompt: 'A hard comebacker sticks in your glove. Where do you throw it?',
    options: [
      { id: 'first', label: 'Throw to first' },
      { id: 'third', label: 'Throw to third' },
      { id: 'second', label: 'Throw to second' },
      { id: 'home', label: 'Throw home' },
    ],
    correctOptionId: 'first',
    explanation:
      'Any of those is a force with two outs. First is the throw you have made a thousand times, and the fielder is already there. With the inning on the line, pick the routine one.',
    overlay: {
      steps: [
        { kind: 'throw', from: 'P', to: 'first' },
        { kind: 'touch', at: 'first' },
      ],
    },
    tags: ['third out', 'sure out'],
  },
]
