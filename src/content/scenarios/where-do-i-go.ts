/*
 * ---------------------------------------------------------------------------
 * ACCURACY WARNING — READ BEFORE EDITING
 *
 * This file is coaching, not rulebook. Backup and cutoff assignments are
 * conventions, and leagues teach them slightly differently. Check these against
 * how this division actually runs practice: a kid told one thing here and
 * another at the field will trust neither.
 *
 * The conventions used throughout, checked against published 12U/youth coaching
 * guidance (qcbaseball.com defensive situations, Pro Baseball Insider, and the
 * 12U/13U Playbook) in September 2026:
 *
 *   - SINGLE, runner scoring: a CORNER cuts the throw home. Third baseman on a
 *     ball to left, first baseman on a ball to centre or right. He sets up
 *     about 45 ft in front of the plate, on the line from the outfielder.
 *   - GAP OR FENCE: the MIDDLE INFIELDER on the ball side runs out for the
 *     relay. Shortstop on anything left-centre, second baseman right-centre.
 *     The other middle infielder covers second.
 *   - The pitcher backs up third OR home, whichever base the throw is going to.
 *     He does not cut, and the first baseman does not back up home.
 *   - The catcher backs up first when the bases are empty.
 *   - The outfielder nearest the ball backs up the outfielder fielding it.
 *
 * The distinction that catches people is the first two: on a ball to right, the
 * FIRST baseman cuts a single and the SECOND baseman relays one to the wall.
 * Same side of the field, different job, decided by how deep the ball is.
 * b-single-or-deep-who-goes-out teaches exactly that.
 *
 * See CONTENT.md for the full checklist.
 * ---------------------------------------------------------------------------
 */

import type { Scenario } from '../../types.ts'

const BOTH = ['AAA', 'Majors'] as const

export const WHERE_DO_I_GO: Scenario[] = [
  // -------------------------------------------------------------------------
  // Backing up a throw
  // -------------------------------------------------------------------------
  {
    id: 'b-rf-backs-up-second',
    mode: 'where-do-i-go',
    divisions: [...BOTH],
    state: { outs: 0, runners: { first: true, second: false, third: false } },
    ball: { type: 'ground', zone: 'left' },
    youAre: 'RF',
    prompt: 'The ball is hit to left field. What is your job?',
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
    id: 'b-pitcher-backs-up-third',
    mode: 'where-do-i-go',
    divisions: [...BOTH],
    state: { outs: 0, runners: { first: true, second: false, third: false } },
    ball: { type: 'ground', zone: 'right' },
    youAre: 'P',
    prompt: 'A base hit goes to right field. What is your job?',
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
  {
    id: 'b-pitcher-backs-up-home',
    mode: 'where-do-i-go',
    divisions: [...BOTH],
    state: { outs: 1, runners: { first: false, second: true, third: false } },
    ball: { type: 'line', zone: 'center' },
    youAre: 'P',
    prompt: 'A single to center sends the runner from second racing home. Where do you go?',
    options: [
      { id: 'home', label: 'Back up home plate' },
      { id: 'third', label: 'Back up third base' },
      { id: 'cutoff', label: 'Be the cutoff man' },
      { id: 'mound', label: 'Stay on the mound' },
    ],
    correctOptionId: 'home',
    explanation:
      'The throw is going home, so that is the base that needs somebody behind it. Get well back of the plate, because a throw that gets past the catcher lets the batter take second.',
    overlay: { steps: [{ kind: 'move', who: 'P', to: 'backup home' }] },
    tags: ['backup'],
  },
  {
    id: 'b-pitcher-picks-one-base',
    mode: 'where-do-i-go',
    divisions: [...BOTH],
    state: { outs: 0, runners: { first: false, second: true, third: false } },
    ball: { type: 'ground', zone: 'left center' },
    youAre: 'P',
    prompt: 'The runner might stop at third or might go home. Which base do you back up?',
    options: [
      { id: 'watch', label: 'Watch the runner, then pick one' },
      { id: 'both', label: 'Stand between third and home' },
      { id: 'third', label: 'Always back up third' },
      { id: 'home', label: 'Always back up home' },
    ],
    correctOptionId: 'watch',
    explanation:
      'You can only be behind one base, and standing between two means you are behind neither. Read where the runner is going, then commit and get deep.',
    tags: ['backup'],
  },
  {
    id: 'b-catcher-backs-up-first',
    mode: 'where-do-i-go',
    divisions: [...BOTH],
    state: { outs: 1, runners: { first: false, second: false, third: false } },
    ball: { type: 'ground', zone: 'shortstop hole' },
    youAre: 'C',
    prompt: 'A routine grounder goes to short. What is your job?',
    options: [
      { id: 'backup', label: 'Run down and back up first' },
      { id: 'plate', label: 'Stay at the plate' },
      { id: 'mound', label: 'Go talk to the pitcher' },
      { id: 'third', label: 'Back up third base' },
    ],
    correctOptionId: 'backup',
    explanation:
      'With the bases empty there is nothing to guard at home. An overthrow at first with nobody behind it turns a routine out into a double. It is the hardest hustle play a catcher has.',
    overlay: { steps: [{ kind: 'move', who: 'C', to: 'backup first' }] },
    tags: ['backup'],
  },
  {
    id: 'b-catcher-stays-home',
    mode: 'where-do-i-go',
    divisions: [...BOTH],
    state: { outs: 1, runners: { first: false, second: true, third: false } },
    ball: { type: 'ground', zone: 'shortstop hole' },
    youAre: 'C',
    prompt: 'A ground ball goes to short. What is your job?',
    options: [
      { id: 'home', label: 'Stay home and guard the plate' },
      { id: 'first', label: 'Back up first base' },
      { id: 'third', label: 'Back up third base' },
      { id: 'cutoff', label: 'Be the cutoff man' },
    ],
    correctOptionId: 'home',
    explanation:
      'With a runner in scoring position, leaving the plate is how a bad throw becomes a run. You only chase down to first when there is nobody who can score.',
    tags: ['backup', 'covering a base'],
  },
  {
    id: 'b-lf-backs-up-third',
    mode: 'where-do-i-go',
    divisions: [...BOTH],
    state: { outs: 0, runners: { first: false, second: true, third: false } },
    ball: { type: 'ground', zone: '3-4 hole' },
    youAre: 'LF',
    prompt: 'A grounder to the right side sends the runner to third. Where do you go?',
    options: [
      { id: 'third', label: 'Back up third base' },
      { id: 'stay', label: 'Stay where you are' },
      { id: 'second', label: 'Back up second base' },
      { id: 'cutoff', label: 'Come in as the cutoff man' },
    ],
    correctOptionId: 'third',
    explanation:
      'The throw is crossing the whole infield to third, which is the throw most likely to get away. You are the only one behind that bag.',
    overlay: { steps: [{ kind: 'move', who: 'LF', to: 'backup third' }] },
    tags: ['backup'],
  },
  {
    id: 'b-rf-backs-up-first',
    mode: 'where-do-i-go',
    divisions: [...BOTH],
    state: { outs: 0, runners: { first: false, second: false, third: false } },
    ball: { type: 'ground', zone: 'third' },
    youAre: 'RF',
    prompt: 'A ground ball to third means a long throw to first. Where do you go?',
    options: [
      { id: 'first', label: 'Back up first base' },
      { id: 'stay', label: 'Stay in right field' },
      { id: 'second', label: 'Back up second base' },
      { id: 'foul', label: 'Move toward foul ground' },
    ],
    correctOptionId: 'first',
    explanation:
      'The longest throw in the infield is the one most likely to sail. Behind first base is foul ground, where the ball keeps rolling. Get over there on every ground ball to the left side.',
    overlay: { steps: [{ kind: 'move', who: 'RF', to: 'backup first' }] },
    tags: ['backup'],
  },
  {
    id: 'b-cf-backs-up-second',
    mode: 'where-do-i-go',
    divisions: ['Majors'],
    state: { outs: 0, runners: { first: true, second: false, third: false } },
    youAre: 'CF',
    prompt: 'The runner on first takes off to steal second. Where do you go?',
    options: [
      { id: 'second', label: 'Come in and back up second' },
      { id: 'stay', label: 'Stay at normal depth' },
      { id: 'first', label: 'Back up first base' },
      { id: 'watch', label: 'Watch the play from center' },
    ],
    correctOptionId: 'second',
    explanation:
      'You are lined up straight behind the bag. A throw that gets past the tag comes right to you. If nobody backs it up, that steal becomes a runner on third.',
    overlay: { steps: [{ kind: 'move', who: 'CF', to: 'backup second' }] },
    ruleRef: 'Stealing rules vary by division and by local league. TODO: check LBLL local rules.',
    localRuleSensitive: true,
    tags: ['backup', 'stealing'],
  },
  {
    id: 'b-lf-backs-up-second',
    mode: 'where-do-i-go',
    divisions: [...BOTH],
    state: { outs: 1, runners: { first: true, second: false, third: false } },
    ball: { type: 'ground', zone: 'right' },
    youAre: 'LF',
    prompt: 'A single to right sends the throw to second. Where do you go?',
    options: [
      { id: 'second', label: 'Come across and back up second' },
      { id: 'third', label: 'Back up third base' },
      { id: 'stay', label: 'Hold your position' },
      { id: 'cutoff', label: 'Come in as the cutoff man' },
    ],
    correctOptionId: 'second',
    explanation:
      'A throw coming from right field toward second is heading straight at left field if it gets by. Center is busy backing up the ball, so second is yours.',
    overlay: { steps: [{ kind: 'move', who: 'LF', to: 'backup second' }] },
    tags: ['backup'],
  },
  {
    id: 'b-cf-backs-up-the-corner',
    mode: 'where-do-i-go',
    divisions: [...BOTH],
    state: { outs: 0, runners: { first: false, second: false, third: false } },
    ball: { type: 'ground', zone: 'left' },
    youAre: 'CF',
    prompt: 'A base hit rolls to the left fielder. What is your job?',
    options: [
      { id: 'backup', label: 'Run over and get behind him' },
      { id: 'stay', label: 'Stay in center in case it gets by' },
      { id: 'second', label: 'Go back up second base' },
      { id: 'cutoff', label: 'Come in as the cutoff man' },
    ],
    correctOptionId: 'backup',
    explanation:
      'A ball that skips past him with nobody there rolls to the fence and costs two extra bases. Standing in center is not backing up; you have to get behind the play.',
    tags: ['backup'],
  },
  {
    id: 'b-rf-backs-up-center',
    mode: 'where-do-i-go',
    divisions: [...BOTH],
    state: { outs: 1, runners: { first: false, second: false, third: false } },
    ball: { type: 'fly', zone: 'right center' },
    youAre: 'RF',
    prompt: 'The center fielder calls off for a ball in the gap. What do you do?',
    options: [
      { id: 'backup', label: 'Peel off and back him up' },
      { id: 'keep', label: 'Keep going for it anyway' },
      { id: 'stop', label: 'Stop and watch' },
      { id: 'line', label: 'Go cover the right field line' },
    ],
    correctOptionId: 'backup',
    explanation:
      'Once he calls it, you stop competing for the ball and start protecting against it being dropped. Getting behind him costs you nothing and saves a base if it pops out.',
    tags: ['backup', 'communication'],
  },

  // -------------------------------------------------------------------------
  // Covering a base
  // -------------------------------------------------------------------------
  {
    id: 'b-pitcher-covers-first',
    mode: 'where-do-i-go',
    divisions: [...BOTH],
    state: { outs: 1, runners: { first: false, second: false, third: false } },
    ball: { type: 'ground', zone: 'first' },
    youAre: 'P',
    prompt: 'A ground ball pulls the first baseman well off the bag. Where do you go?',
    options: [
      { id: 'first', label: 'Sprint to cover first base' },
      { id: 'ball', label: 'Go help him field it' },
      { id: 'mound', label: 'Stay on the mound' },
      { id: 'second', label: 'Cover second base' },
    ],
    correctOptionId: 'first',
    explanation:
      'He cannot field the ball and stand on the bag at the same time, so the base is empty until you get there. Run to a spot up the line and turn, do not run at the bag.',
    overlay: { steps: [{ kind: 'move', who: 'P', to: 'first' }] },
    tags: ['covering a base'],
  },
  {
    id: 'b-2b-covers-first-on-bunt',
    mode: 'where-do-i-go',
    divisions: [...BOTH],
    state: { outs: 0, runners: { first: false, second: true, third: false } },
    ball: { type: 'bunt', zone: 'first' },
    youAre: '2B',
    prompt: 'The batter bunts and the first baseman charges hard. Where do you go?',
    options: [
      { id: 'first', label: 'Cover first base' },
      { id: 'second', label: 'Cover second base' },
      { id: 'ball', label: 'Charge the ball too' },
      { id: 'backup', label: 'Back up the plate' },
    ],
    correctOptionId: 'first',
    explanation:
      'The first baseman is fielding the bunt, so the bag behind him is empty and there is nobody to throw to. You are the closest player who is not chasing the ball.',
    overlay: { steps: [{ kind: 'move', who: '2B', to: 'first' }] },
    tags: ['bunt', 'covering a base'],
  },
  {
    id: 'b-ss-covers-third-on-bunt',
    mode: 'where-do-i-go',
    divisions: [...BOTH],
    state: { outs: 0, runners: { first: false, second: true, third: false } },
    ball: { type: 'bunt', zone: 'third' },
    youAre: 'SS',
    prompt: 'The third baseman charges a bunt down the line. Where do you go?',
    options: [
      { id: 'third', label: 'Cover third base' },
      { id: 'second', label: 'Cover second base' },
      { id: 'ball', label: 'Go help with the ball' },
      { id: 'stay', label: 'Stay where you are' },
    ],
    correctOptionId: 'third',
    explanation:
      'The runner from second is heading to a base nobody is standing on, because the man who plays it just ran in. Beat him there and the bunt costs them an out instead of a base.',
    overlay: { steps: [{ kind: 'move', who: 'SS', to: 'third' }] },
    tags: ['bunt', 'covering a base'],
  },
  {
    id: 'b-2b-covers-second-ball-to-left',
    mode: 'where-do-i-go',
    divisions: [...BOTH],
    state: { outs: 0, runners: { first: false, second: false, third: false } },
    ball: { type: 'ground', zone: 'left' },
    youAre: '2B',
    prompt: 'A base hit goes to left field and the batter is thinking about two. Where do you go?',
    options: [
      { id: 'second', label: 'Cover second base' },
      { id: 'out', label: 'Go out for the relay throw' },
      { id: 'first', label: 'Cover first base' },
      { id: 'backup', label: 'Back up the shortstop' },
    ],
    correctOptionId: 'second',
    explanation:
      'The shortstop is on the ball side and goes out to take the throw, which leaves the bag empty. Whichever middle infielder is away from the ball covers second.',
    overlay: { steps: [{ kind: 'move', who: '2B', to: 'second' }] },
    tags: ['covering a base'],
  },
  {
    id: 'b-ss-covers-second-ball-to-right',
    mode: 'where-do-i-go',
    divisions: [...BOTH],
    state: { outs: 0, runners: { first: false, second: false, third: false } },
    ball: { type: 'ground', zone: 'right' },
    youAre: 'SS',
    prompt: 'A base hit goes to right field and the batter rounds first hard. Where do you go?',
    options: [
      { id: 'second', label: 'Cover second base' },
      { id: 'out', label: 'Go out for the relay throw' },
      { id: 'third', label: 'Cover third base' },
      { id: 'stay', label: 'Stay at shortstop' },
    ],
    correctOptionId: 'second',
    explanation:
      'The second baseman is on the ball side and goes out to meet the throw, so second is yours. The rule never changes: the one away from the ball takes the bag.',
    overlay: { steps: [{ kind: 'move', who: 'SS', to: 'second' }] },
    tags: ['covering a base'],
  },
  {
    id: 'b-3b-stays-home-on-relay',
    mode: 'where-do-i-go',
    divisions: [...BOTH],
    state: { outs: 0, runners: { first: true, second: false, third: false } },
    ball: { type: 'line', zone: 'deep left' },
    youAre: '3B',
    prompt: 'A ball rolls to the fence in left. The shortstop runs out for the relay. Where do you go?',
    options: [
      { id: 'third', label: 'Stay and cover third base' },
      { id: 'out', label: 'Go out and help with the relay' },
      { id: 'cutoff', label: 'Line up as a second cutoff man' },
      { id: 'home', label: 'Go back up home plate' },
    ],
    correctOptionId: 'third',
    explanation:
      'The runner from first is going to third on a ball that deep. The throw needs somebody standing on the bag. Two players chasing the same relay leaves the base wide open.',
    overlay: { steps: [{ kind: 'move', who: '3B', to: 'third' }] },
    tags: ['covering a base', 'relay'],
  },
  {
    id: 'b-1b-covers-after-the-throw',
    mode: 'where-do-i-go',
    divisions: [...BOTH],
    state: { outs: 1, runners: { first: false, second: false, third: false } },
    ball: { type: 'ground', zone: 'shortstop hole' },
    youAre: '1B',
    prompt: 'A routine grounder goes to the shortstop. Where do you go?',
    options: [
      { id: 'bag', label: 'Get to the bag and give a target' },
      { id: 'ball', label: 'Move toward the ball' },
      { id: 'stay', label: 'Stay at normal depth' },
      { id: 'second', label: 'Cover second base' },
    ],
    correctOptionId: 'bag',
    explanation:
      'The throw is coming whether you are ready or not, and a fielder still walking to the bag drops it. Get there early, put your foot on the corner and hold up a target.',
    overlay: { steps: [{ kind: 'move', who: '1B', to: 'first' }] },
    tags: ['covering a base'],
  },
  {
    id: 'b-pitcher-covers-home',
    mode: 'where-do-i-go',
    divisions: [...BOTH],
    state: { outs: 1, runners: { first: false, second: false, third: true } },
    youAre: 'P',
    prompt: 'The ball gets past the catcher and he chases it to the backstop. Where do you go?',
    options: [
      { id: 'home', label: 'Cover home plate' },
      { id: 'ball', label: 'Chase the ball too' },
      { id: 'mound', label: 'Stay on the mound' },
      { id: 'third', label: 'Cover third base' },
    ],
    correctOptionId: 'home',
    explanation:
      'The catcher has to go get the ball, so somebody else has to be standing on the plate to take his throw. That is always you, and you have to get there before the runner does.',
    overlay: { steps: [{ kind: 'move', who: 'P', to: 'home' }] },
    localRuleSensitive: true,
    tags: ['covering a base', 'play at the plate'],
  },
  {
    id: 'b-3b-covers-third-on-a-hit',
    mode: 'where-do-i-go',
    divisions: [...BOTH],
    state: { outs: 1, runners: { first: true, second: false, third: false } },
    ball: { type: 'ground', zone: 'right center' },
    youAre: '3B',
    prompt: 'A ball rolls into the gap. The runner from first is coming all the way. Where do you go?',
    options: [
      { id: 'third', label: 'Get to third and wait for the throw' },
      { id: 'cutoff', label: 'Go out and be the cutoff man' },
      { id: 'ball', label: 'Head toward the outfield' },
      { id: 'home', label: 'Back up home plate' },
    ],
    correctOptionId: 'third',
    explanation:
      'The whole relay is pointless if nobody is standing on the base when the ball arrives. On a ball to the right side you are not the cutoff, so your only job is the bag.',
    overlay: { steps: [{ kind: 'move', who: '3B', to: 'third' }] },
    tags: ['covering a base'],
  },

  // -------------------------------------------------------------------------
  // Cutoff: setting up in front of the base the throw is going to
  // -------------------------------------------------------------------------
  {
    id: 'b-1b-cutoff-home',
    mode: 'where-do-i-go',
    divisions: [...BOTH],
    state: { outs: 1, runners: { first: false, second: true, third: false } },
    ball: { type: 'line', zone: 'shallow center' },
    youAre: '1B',
    prompt: 'A single drops in center and the runner from second is trying to score. What is your job?',
    options: [
      { id: 'cover', label: 'Cover first base' },
      { id: 'cut', label: 'Be the cutoff man for the throw home' },
      { id: 'backup', label: 'Back up home plate' },
      { id: 'mound', label: 'Go stand by the mound' },
    ],
    correctOptionId: 'cut',
    explanation:
      'On a throw home from center, the first baseman is the cutoff. Line up between the center fielder and home so he has a target. If the run is already in, cut it and get somebody else.',
    overlay: { steps: [{ kind: 'cut', who: '1B', to: 'home' }] },
    tags: ['cutoff'],
  },
  {
    id: 'b-3b-cutoff-home-from-left',
    mode: 'where-do-i-go',
    divisions: [...BOTH],
    state: { outs: 1, runners: { first: false, second: true, third: false } },
    ball: { type: 'line', zone: 'left' },
    youAre: '3B',
    prompt: 'A single to left sends the runner from second home. What is your job?',
    options: [
      { id: 'cut', label: 'Be the cutoff man for the throw home' },
      { id: 'third', label: 'Stay and cover third base' },
      { id: 'backup', label: 'Back up home plate' },
      { id: 'ball', label: 'Go out toward the ball' },
    ],
    correctOptionId: 'cut',
    explanation:
      'On a throw home from left field, the third baseman is the cutoff and the first baseman stays out of it. Get on the line between the left fielder and the plate so the throw has somewhere to stop.',
    overlay: { steps: [{ kind: 'cut', who: '3B', to: 'home' }] },
    tags: ['cutoff'],
  },
  {
    id: 'b-1b-cutoff-home-from-right',
    mode: 'where-do-i-go',
    divisions: [...BOTH],
    state: { outs: 0, runners: { first: false, second: true, third: false } },
    ball: { type: 'line', zone: 'right' },
    youAre: '1B',
    prompt: 'A base hit to right field sends the runner home. What is your job?',
    options: [
      { id: 'cut', label: 'Be the cutoff man for the throw home' },
      { id: 'first', label: 'Cover first base' },
      { id: 'backup', label: 'Back up second base' },
      { id: 'ball', label: 'Go out toward the ball' },
    ],
    correctOptionId: 'cut',
    explanation:
      'Throws home from centre and right are yours, the same as from left they belong to the third baseman. Line up so the outfielder can throw straight through you to the plate.',
    overlay: { steps: [{ kind: 'cut', who: '1B', to: 'home' }] },
    tags: ['cutoff'],
  },
  {
    id: 'b-ss-cutoff-throw-to-third',
    mode: 'where-do-i-go',
    divisions: [...BOTH],
    state: { outs: 0, runners: { first: true, second: false, third: false } },
    ball: { type: 'ground', zone: 'left' },
    youAre: 'SS',
    prompt: 'A single to left and the runner from first is trying for third. What is your job?',
    options: [
      { id: 'cut', label: 'Line up as the cutoff to third' },
      { id: 'second', label: 'Cover second base' },
      { id: 'third', label: 'Cover third base' },
      { id: 'backup', label: 'Back up the third baseman' },
    ],
    correctOptionId: 'cut',
    explanation:
      'The third baseman has to stay on the bag to make the tag. Somebody else has to be the middle of that throw. You are the closest infielder to the ball.',
    overlay: { steps: [{ kind: 'cut', who: 'SS', to: 'third' }] },
    tags: ['cutoff'],
  },
  {
    id: 'b-cutoff-line-up-straight',
    mode: 'where-do-i-go',
    divisions: [...BOTH],
    state: { outs: 1, runners: { first: false, second: true, third: false } },
    ball: { type: 'line', zone: 'right center' },
    youAre: '1B',
    prompt: 'You are the cutoff man for a throw home. Where exactly do you stand?',
    options: [
      { id: 'line', label: 'On a straight line, ball to plate' },
      { id: 'halfway', label: 'Halfway to the outfielder' },
      { id: 'near-home', label: 'Right next to the catcher' },
      { id: 'anywhere', label: 'Wherever you can see the ball' },
    ],
    correctOptionId: 'line',
    explanation:
      'If you are off the line, a perfect throw through you misses the plate. Standing on the line gives the outfielder one target. The ball goes the right way whether you cut it or let it through.',
    overlay: { steps: [{ kind: 'cut', who: '1B', to: 'home' }] },
    tags: ['cutoff'],
  },
  {
    id: 'b-cutoff-hands-up',
    mode: 'where-do-i-go',
    divisions: [...BOTH],
    state: { outs: 0, runners: { first: false, second: true, third: false } },
    ball: { type: 'line', zone: 'center' },
    youAre: '1B',
    prompt: 'You are lined up as the cutoff man and the outfielder has the ball. What do you do with your arms?',
    options: [
      { id: 'up', label: 'Both hands high so he can see you' },
      { id: 'down', label: 'Keep them down and stay still' },
      { id: 'point', label: 'Point at where you want it' },
      { id: 'wave', label: 'Wave him off entirely' },
    ],
    correctOptionId: 'up',
    explanation:
      'He is looking up from a long way away and needs something to aim at that is not the ground. Hands high also tells him you are ready, so he throws instead of hesitating.',
    tags: ['cutoff', 'communication'],
  },

  // -------------------------------------------------------------------------
  // Relay: going out to the ball on a ball in the gap or at the fence
  // -------------------------------------------------------------------------
  {
    id: 'b-single-or-deep-who-goes-out',
    mode: 'where-do-i-go',
    divisions: [...BOTH],
    state: { outs: 1, runners: { first: false, second: true, third: false } },
    ball: { type: 'line', zone: 'right' },
    youAre: '2B',
    prompt: 'A single lands in front of the right fielder and the runner is scoring. What is your job?',
    options: [
      { id: 'first', label: 'Cover first base' },
      { id: 'relay', label: 'Run out and take the relay' },
      { id: 'cut', label: 'Line up as the cutoff for home' },
      { id: 'second', label: 'Cover second base' },
    ],
    correctOptionId: 'first',
    explanation:
      'A single comes in on one throw, so the first baseman cuts it and you are not needed out there. You go out for the relay only when the ball gets past him and rolls.',
    overlay: {
      steps: [
        { kind: 'move', who: '2B', to: 'first' },
        { kind: 'cut', who: '1B', to: 'home' },
      ],
    },
    tags: ['cutoff', 'relay', 'covering a base'],
  },
  {
    id: 'b-ss-relay-deep-left',
    mode: 'where-do-i-go',
    divisions: [...BOTH],
    state: { outs: 0, runners: { first: true, second: false, third: false } },
    ball: { type: 'line', zone: 'deep left' },
    youAre: 'SS',
    prompt: 'The ball rolls all the way to the fence in left. What is your job?',
    options: [
      { id: 'relay', label: 'Run out and take the relay throw' },
      { id: 'second', label: 'Cover second base' },
      { id: 'third', label: 'Cover third base' },
      { id: 'cutoff', label: 'Set up near the mound' },
    ],
    correctOptionId: 'relay',
    explanation:
      'That is much too far for one throw, and a long one arrives late and off line. Go out until he only has a short throw to make, then turn and fire.',
    overlay: { steps: [{ kind: 'relay', who: 'SS', to: 'third' }] },
    tags: ['relay'],
  },
  {
    id: 'b-2b-relay-deep-right',
    mode: 'where-do-i-go',
    divisions: [...BOTH],
    state: { outs: 1, runners: { first: false, second: true, third: false } },
    ball: { type: 'line', zone: 'deep right' },
    youAre: '2B',
    prompt: 'A ball gets by the right fielder and rolls to the wall. What is your job?',
    options: [
      { id: 'relay', label: 'Go out and take the relay throw' },
      { id: 'second', label: 'Cover second base' },
      { id: 'first', label: 'Cover first base' },
      { id: 'backup', label: 'Back up the right fielder' },
    ],
    correctOptionId: 'relay',
    explanation:
      'Balls to your side of the field are yours to go get, and the shortstop stays in to cover second. Meeting the throw out there saves the runner an entire base.',
    overlay: { steps: [{ kind: 'relay', who: '2B', to: 'home' }] },
    tags: ['relay'],
  },
  {
    id: 'b-ss-relay-left-center-gap',
    mode: 'where-do-i-go',
    divisions: [...BOTH],
    state: { outs: 0, runners: { first: false, second: false, third: false } },
    ball: { type: 'line', zone: 'deep left center' },
    youAre: 'SS',
    prompt: 'A ball splits the gap in left center and rolls. Where do you go?',
    options: [
      { id: 'relay', label: 'Out toward the ball for the relay' },
      { id: 'second', label: 'Straight to second base' },
      { id: 'stay', label: 'Stay at your position' },
      { id: 'third', label: 'Straight to third base' },
    ],
    correctOptionId: 'relay',
    explanation:
      'The gap is your half of the outfield, so you go and the second baseman takes the bag. The whole point is to be somewhere the outfielder can reach with an easy throw.',
    overlay: { steps: [{ kind: 'relay', who: 'SS', to: 'third' }] },
    tags: ['relay'],
  },
  {
    id: 'b-relay-how-far-out',
    mode: 'where-do-i-go',
    divisions: [...BOTH],
    state: { outs: 0, runners: { first: false, second: false, third: false } },
    ball: { type: 'line', zone: 'deep right center' },
    youAre: '2B',
    prompt: 'You are going out for a relay throw. How far out do you go?',
    options: [
      { id: 'easy', label: 'Far enough for an easy throw to you' },
      { id: 'edge', label: 'Just onto the outfield grass' },
      { id: 'all', label: 'All the way to the outfielder' },
      { id: 'bag', label: 'Only a step or two off the bag' },
    ],
    correctOptionId: 'easy',
    explanation:
      'Going too far means your own throw is the long weak one, and not going far enough means his is. You want two medium throws instead of one long one.',
    tags: ['relay'],
  },
  {
    id: 'b-relay-open-to-the-field',
    mode: 'where-do-i-go',
    divisions: [...BOTH],
    state: { outs: 1, runners: { first: true, second: false, third: false } },
    ball: { type: 'line', zone: 'deep left' },
    youAre: 'SS',
    prompt: 'You are running out for the relay throw. Which way do you face while you wait?',
    options: [
      { id: 'open', label: 'Turned so you can see the bases' },
      { id: 'square', label: 'Square to the outfielder only' },
      { id: 'back', label: 'Back to the infield' },
      { id: 'home', label: 'Facing home plate' },
    ],
    correctOptionId: 'open',
    explanation:
      'Catch it facing straight out and you still have to turn before you know where to throw. That turn is the runner taking another base. Open up so you already know.',
    tags: ['relay'],
  },

  // -------------------------------------------------------------------------
  // Reading the play and trailing the runner
  // -------------------------------------------------------------------------
  {
    id: 'b-trail-the-runner',
    mode: 'where-do-i-go',
    divisions: [...BOTH],
    state: { outs: 0, runners: { first: false, second: false, third: false } },
    ball: { type: 'line', zone: 'deep center' },
    youAre: '1B',
    prompt: 'The batter is rounding first hard on a ball to the wall. Where do you go?',
    options: [
      { id: 'trail', label: 'Trail him toward second' },
      { id: 'first', label: 'Stay on first base' },
      { id: 'cut', label: 'Line up as the cutoff man' },
      { id: 'second', label: 'Go stand on second base' },
    ],
    correctOptionId: 'trail',
    explanation:
      'He is not coming back to first, so guarding it is guarding nothing. Following him gives you somewhere to throw if he gets caught between bases.',
    tags: ['trail runner'],
  },
  {
    id: 'b-first-and-third-look-him-back',
    mode: 'where-do-i-go',
    divisions: ['Majors'],
    state: { outs: 1, runners: { first: true, second: false, third: true } },
    youAre: 'C',
    prompt: 'The runner on first takes off for second. What do you do?',
    options: [
      { id: 'look', label: 'Check the runner on third first' },
      { id: 'throw', label: 'Throw straight through to second' },
      { id: 'nothing', label: 'Hold the ball, give them the base' },
      { id: 'third', label: 'Throw to third base' },
    ],
    correctOptionId: 'look',
    explanation:
      'They may be giving you second on purpose so the runner on third can score behind your throw. One look freezes him, and second base is worth less than the run.',
    ruleRef: 'Stealing rules vary by division and by local league. TODO: check LBLL local rules.',
    localRuleSensitive: true,
    tags: ['stealing', 'play at the plate'],
  },
  {
    id: 'b-nobody-on-still-move',
    mode: 'where-do-i-go',
    divisions: [...BOTH],
    state: { outs: 0, runners: { first: false, second: false, third: false } },
    ball: { type: 'fly', zone: 'right' },
    youAre: 'SS',
    prompt: 'A routine fly ball is caught in right field with the bases empty. What do you do?',
    options: [
      { id: 'move', label: 'Move toward second for the throw in' },
      { id: 'stand', label: 'Stand still, the play is over' },
      { id: 'clap', label: 'Clap and stay where you are' },
      { id: 'dugout', label: 'Head toward the dugout' },
    ],
    correctOptionId: 'move',
    explanation:
      'Every ball in play has somewhere for you to be, even when nothing is likely to happen. Getting used to moving on every pitch is what makes you get there on the ones that matter.',
    tags: ['habits'],
  },
  {
    id: 'b-outfielder-hits-the-cut',
    mode: 'where-do-i-go',
    divisions: [...BOTH],
    state: { outs: 1, runners: { first: false, second: true, third: false } },
    ball: { type: 'ground', zone: 'left center' },
    youAre: 'LF',
    prompt: 'You field a single in the gap. The cutoff man has his hands up. Where do you throw?',
    options: [
      { id: 'chest', label: 'At his chest, hard and straight' },
      { id: 'over', label: 'Over his head toward the plate' },
      { id: 'bounce', label: 'Bounce it in front of him' },
      { id: 'hold', label: 'Hold it and run it in' },
    ],
    correctOptionId: 'chest',
    explanation:
      'He is standing on the line, so a throw at his chest either gets cut or carries through to the plate. A throw over his head takes the decision away from everybody.',
    overlay: { steps: [{ kind: 'cut', who: '3B', to: 'home' }] },
    tags: ['cutoff', 'outfield throw'],
  },
  {
    id: 'b-corner-of-covers-the-line',
    mode: 'where-do-i-go',
    divisions: [...BOTH],
    state: { outs: 0, runners: { first: false, second: false, third: false } },
    ball: { type: 'ground', zone: 'foul right' },
    youAre: 'RF',
    prompt: 'A ball is slicing toward the line in your corner. What do you do?',
    options: [
      { id: 'cut-off', label: 'Cut it off before it reaches the corner' },
      { id: 'follow', label: 'Follow it into the corner' },
      { id: 'wait', label: 'Wait for it to stop' },
      { id: 'line', label: 'Let it go and cover the line' },
    ],
    correctOptionId: 'cut-off',
    explanation:
      'A ball that beats you to the corner is a triple. You have to run in there and then throw all the way back. Angle to head it off instead of chasing behind it.',
    tags: ['outfield'],
  },
  {
    id: 'b-ss-covers-second-on-steal',
    mode: 'where-do-i-go',
    divisions: ['Majors'],
    state: { outs: 1, runners: { first: true, second: false, third: false } },
    youAre: 'SS',
    prompt: 'The runner on first breaks for second and the catcher is throwing. Where do you go?',
    options: [
      { id: 'cover', label: 'Get to second and give a target' },
      { id: 'backup', label: 'Back up the second baseman' },
      { id: 'stay', label: 'Stay at shortstop' },
      { id: 'third', label: 'Cover third base' },
    ],
    correctOptionId: 'cover',
    explanation:
      'The catcher is throwing to a base, not to a person, so somebody has to be standing on it with a glove up. You and the second baseman decide before the pitch which of you it is.',
    overlay: { steps: [{ kind: 'move', who: 'SS', to: 'second' }] },
    ruleRef: 'Stealing rules vary by division and by local league. TODO: check LBLL local rules.',
    localRuleSensitive: true,
    tags: ['covering a base', 'stealing'],
  },
  {
    id: 'b-cf-has-priority',
    mode: 'where-do-i-go',
    divisions: [...BOTH],
    state: { outs: 0, runners: { first: false, second: false, third: false } },
    ball: { type: 'fly', zone: 'left center' },
    youAre: 'LF',
    prompt: 'A fly ball is in the gap. You hear the center fielder call for it. What do you do?',
    options: [
      { id: 'yield', label: 'Give way and back him up' },
      { id: 'take', label: 'Take it, you called it first' },
      { id: 'stop', label: 'Pull up and watch' },
      { id: 'both', label: 'Both keep going for it' },
    ],
    correctOptionId: 'yield',
    explanation:
      'The center fielder has the best angle on anything in the gaps, so he gets the ball whenever he wants it. Deciding that ahead of time is what stops two players running into each other.',
    tags: ['communication', 'backup'],
  },
  {
    id: 'b-3b-covers-on-passed-ball',
    mode: 'where-do-i-go',
    divisions: [...BOTH],
    state: { outs: 1, runners: { first: false, second: true, third: false } },
    youAre: '3B',
    prompt: 'A pitch gets past the catcher. The runner on second takes off. Where do you go?',
    options: [
      { id: 'third', label: 'Get to third for the throw' },
      { id: 'ball', label: 'Go help chase the ball' },
      { id: 'home', label: 'Back up home plate' },
      { id: 'stay', label: 'Stay at your position' },
    ],
    correctOptionId: 'third',
    explanation:
      'The catcher will have the ball in a second and needs somebody standing on third to throw to. If nobody is there, a passed ball turns into a runner ninety feet from home.',
    overlay: { steps: [{ kind: 'move', who: '3B', to: 'third' }] },
    localRuleSensitive: true,
    tags: ['covering a base'],
  },
  {
    id: 'b-pitcher-clears-out-on-a-popup',
    mode: 'where-do-i-go',
    divisions: [...BOTH],
    state: { outs: 0, runners: { first: false, second: false, third: false } },
    ball: { type: 'popup', zone: 'mound' },
    youAre: 'P',
    prompt: 'A pop up goes straight up over the infield. An infielder calls for it. What do you do?',
    options: [
      { id: 'clear', label: 'Point at it and get clear' },
      { id: 'catch', label: 'Catch it, it is right there' },
      { id: 'stand', label: 'Stand still and watch' },
      { id: 'call', label: 'Call for it yourself' },
    ],
    correctOptionId: 'clear',
    explanation:
      'Infielders come in on a pop up looking up, and a pitcher standing in the middle is something they will run into. Point at the ball so everyone can find it, then get out of their way.',
    tags: ['pop up', 'communication'],
  },
  {
    id: 'b-know-before-the-pitch',
    mode: 'where-do-i-go',
    divisions: [...BOTH],
    state: { outs: 1, runners: { first: true, second: true, third: false } },
    youAre: '2B',
    prompt: 'The pitcher is coming set with runners on first and second. What should you already know?',
    options: [
      { id: 'plan', label: 'Where you throw it on a grounder' },
      { id: 'batter', label: 'What the batter did last time' },
      { id: 'count', label: 'What the count is' },
      { id: 'score', label: 'What the score is' },
    ],
    correctOptionId: 'plan',
    explanation:
      'Once the ball is hit there is no time to work out who is forced and where the lead runner is. Deciding before the pitch is what makes the play look easy.',
    tags: ['habits'],
  },
]
