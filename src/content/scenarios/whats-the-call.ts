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
 * general baseball instinct gets wrong, and almost all of that divergence is in
 * BASE RUNNING: leaving early, stealing, sliding, the uncaught third strike.
 * Those scenarios carry localRuleSensitive and a TODO. The rest of this file is
 * deliberately built on the parts of baseball that do not vary — fair and foul,
 * what counts as a catch, force versus tag — because those are safe to teach.
 *
 * No rule number below is a real citation: where the number is not certain,
 * ruleRef is a plain description and carries a TODO. Do not replace a TODO with
 * a guessed number.
 *
 * See CONTENT.md for the full checklist.
 * ---------------------------------------------------------------------------
 */

import type { Scenario } from '../../types.ts'

const BOTH = ['AAA', 'Majors'] as const

export const WHATS_THE_CALL: Scenario[] = [
  // -------------------------------------------------------------------------
  // Little League divergences. All flagged, all to be verified.
  // -------------------------------------------------------------------------
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
    id: 'c-infield-fly-lands-foul',
    mode: 'whats-the-call',
    divisions: ['Majors'],
    state: { outs: 0, runners: { first: true, second: true, third: false } },
    ball: { type: 'popup', zone: 'foul left' },
    prompt: 'The umpire calls infield fly, but the ball drifts and lands foul untouched. What is the call?',
    options: [
      { id: 'foul', label: 'Foul ball, the batter is not out' },
      { id: 'out', label: 'Batter is out, the call was made' },
      { id: 'choice', label: 'The umpire decides either way' },
      { id: 'redo', label: 'Dead ball, pitch it again' },
    ],
    correctOptionId: 'foul',
    explanation:
      'Infield fly only applies to a fair ball, so a ball that lands foul and stays foul is just a foul ball. The call is made early on purpose, and it comes off if the ball goes foul.',
    ruleRef: 'Infield fly applies only to a fair ball. TODO: confirm rule number and AAA status.',
    localRuleSensitive: true,
    tags: ['infield fly', 'fair or foul'],
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
    id: 'c-head-first-diving-back',
    mode: 'whats-the-call',
    divisions: ['Majors'],
    state: { outs: 1, runners: { first: true, second: false, third: false } },
    prompt: 'The runner gets picked off and dives back into first base head first. What is the call?',
    options: [
      { id: 'legal', label: 'Legal, safe if he beats the tag' },
      { id: 'out', label: 'Out for diving head first' },
      { id: 'warning', label: 'Safe, but he gets a warning' },
      { id: 'back', label: 'Sent back to the dugout' },
    ],
    correctOptionId: 'legal',
    explanation:
      'The rule is about diving into a base you are advancing to, and he is going backward to one he already had. Going back head first is the fastest way to return and it is allowed.',
    ruleRef: 'Little League: head-first is legal returning to a base. TODO: confirm rule number.',
    localRuleSensitive: true,
    tags: ['sliding'],
  },
  {
    id: 'c-leaves-early',
    mode: 'whats-the-call',
    divisions: [...BOTH],
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
    id: 'c-no-leading-off',
    mode: 'whats-the-call',
    divisions: [...BOTH],
    state: { outs: 0, runners: { first: false, second: true, third: false } },
    prompt: 'The runner on second wants a walking lead before the pitch. When may he leave the base?',
    options: [
      { id: 'reaches', label: 'When the pitch reaches the batter' },
      { id: 'release', label: 'As soon as the pitcher lets go' },
      { id: 'windup', label: 'As soon as the pitcher starts moving' },
      { id: 'hit', label: 'Only after the batter hits it' },
    ],
    correctOptionId: 'reaches',
    explanation:
      'There is no leading off in Little League, so the base is the safest place to stand until the ball gets to the plate. Leaving one step early is how a runner gets called out without anybody touching him.',
    ruleRef: 'Little League: no leading off; a runner may leave when the pitch reaches the batter. TODO: confirm rule number.',
    localRuleSensitive: true,
    tags: ['leaving early', 'baserunning'],
  },
  {
    id: 'c-batter-hit-by-pitch-swinging',
    mode: 'whats-the-call',
    divisions: [...BOTH],
    state: { outs: 1, runners: { first: false, second: false, third: false }, count: { balls: 2, strikes: 1 } },
    prompt: 'The batter swings at a pitch and it hits him on the hand. What is the call?',
    options: [
      { id: 'strike', label: 'Strike, he swung at it' },
      { id: 'base', label: 'He gets first base' },
      { id: 'ball', label: 'Ball, it was inside' },
      { id: 'nothing', label: 'Nothing, play on' },
    ],
    correctOptionId: 'strike',
    explanation:
      'Swinging means he was trying to hit it, so getting hit does not earn him a base. It is a strike and the ball is dead, no matter how much it hurt.',
    ruleRef: 'Batter hit by a pitch he swung at. TODO: confirm rule number.',
    tags: ['batting', 'hit by pitch'],
  },
  {
    id: 'c-batter-does-not-move',
    mode: 'whats-the-call',
    divisions: [...BOTH],
    state: { outs: 0, runners: { first: false, second: false, third: false }, count: { balls: 1, strikes: 1 } },
    prompt: 'An inside pitch is coming and the batter stands there and lets it hit his arm. What is the call?',
    options: [
      { id: 'no-base', label: 'No base, he had to try to move' },
      { id: 'base', label: 'He gets first base anyway' },
      { id: 'strike', label: 'Automatic strike three' },
      { id: 'redo', label: 'Do the pitch over' },
    ],
    correctOptionId: 'no-base',
    explanation:
      'A batter has to make an effort to get out of the way to be awarded first. Standing still and wearing it is a ball or a strike depending on the pitch, not a free base.',
    ruleRef: 'Batter must attempt to avoid being hit by the pitch. TODO: confirm rule number.',
    tags: ['batting', 'hit by pitch'],
  },
  {
    id: 'c-foul-bunt-two-strikes',
    mode: 'whats-the-call',
    divisions: [...BOTH],
    state: { outs: 1, runners: { first: true, second: false, third: false }, count: { balls: 1, strikes: 2 } },
    ball: { type: 'bunt', zone: 'foul left' },
    prompt: 'With two strikes the batter bunts the ball foul. What is the call?',
    options: [
      { id: 'out', label: 'Batter is out' },
      { id: 'foul', label: 'Just a foul ball, keep hitting' },
      { id: 'ball', label: 'It counts as a ball' },
      { id: 'nothing', label: 'Nothing happens' },
    ],
    correctOptionId: 'out',
    explanation:
      'A normal foul with two strikes keeps you alive, but a bunted foul is a strikeout. That is why you take the bunt off with two strikes unless the coach says otherwise.',
    ruleRef: 'Bunt foul with two strikes is a strikeout. TODO: confirm rule number.',
    tags: ['batting', 'bunt'],
  },

  // -------------------------------------------------------------------------
  // Force versus tag: the same idea as Mode A, asked as a call
  // -------------------------------------------------------------------------
  {
    id: 'c-force-out-no-tag',
    mode: 'whats-the-call',
    divisions: [...BOTH],
    state: { outs: 0, runners: { first: true, second: false, third: false } },
    ball: { type: 'ground', zone: 'shortstop hole' },
    prompt: 'The shortstop throws to second and the fielder touches the bag without tagging the runner. What is the call?',
    options: [
      { id: 'out', label: 'Out, the runner was forced' },
      { id: 'safe', label: 'Safe, he was never tagged' },
      { id: 'appeal', label: 'Safe unless the defense appeals' },
      { id: 'umpire', label: 'The umpire decides' },
    ],
    correctOptionId: 'out',
    explanation:
      'The batter is running to first, so the runner has to leave first whether he wants to or not. When a runner has no choice, touching the base he is forced to is enough.',
    tags: ['force play'],
  },
  {
    id: 'c-tag-needed-no-force',
    mode: 'whats-the-call',
    divisions: [...BOTH],
    state: { outs: 1, runners: { first: false, second: true, third: false } },
    ball: { type: 'ground', zone: 'third' },
    prompt: 'The third baseman steps on third as the runner from second slides in, with no tag. What is the call?',
    options: [
      { id: 'safe', label: 'Safe, he had to be tagged' },
      { id: 'out', label: 'Out, the fielder had the bag' },
      { id: 'out-anyway', label: 'Out, he left second base' },
      { id: 'back', label: 'Sent back to second' },
    ],
    correctOptionId: 'safe',
    explanation:
      'Nobody was on first, so this runner never had to leave second and he is not forced. A runner who has a choice can only be put out by being tagged.',
    tags: ['force play', 'tag play'],
  },
  {
    id: 'c-runner-passes-runner',
    mode: 'whats-the-call',
    divisions: [...BOTH],
    state: { outs: 0, runners: { first: true, second: true, third: false } },
    prompt: 'The runner from first runs past the runner from second between the bases. What is the call?',
    options: [
      { id: 'passer-out', label: 'The one who passed is out' },
      { id: 'lead-out', label: 'The lead runner is out' },
      { id: 'both', label: 'Both of them are out' },
      { id: 'nothing', label: 'Nothing, keep playing' },
    ],
    correctOptionId: 'passer-out',
    explanation:
      'Runners have to stay in order, and the one behind is the one who broke the rule. He is out immediately and the runner in front keeps going.',
    ruleRef: 'A trailing runner who passes a preceding runner is out. TODO: confirm rule number.',
    tags: ['baserunning'],
  },
  {
    id: 'c-two-runners-one-base',
    mode: 'whats-the-call',
    divisions: [...BOTH],
    state: { outs: 1, runners: { first: false, second: true, third: false } },
    prompt: 'Two runners end up standing on second base and the fielder tags both of them. What is the call?',
    options: [
      { id: 'trailing', label: 'The runner who came second is out' },
      { id: 'lead', label: 'The runner who was there first is out' },
      { id: 'both', label: 'Both are out' },
      { id: 'neither', label: 'Neither, they sort it out' },
    ],
    correctOptionId: 'trailing',
    explanation:
      'The base belongs to whoever got there first, so he is safe standing on it. The one who arrived behind him has no right to be there and is the one tagged out.',
    ruleRef: 'Two runners occupying one base; the preceding runner is entitled to it. TODO: confirm rule number.',
    tags: ['baserunning', 'tag play'],
  },

  // -------------------------------------------------------------------------
  // Fair, foul, and what counts as a catch
  // -------------------------------------------------------------------------
  {
    id: 'c-ball-hits-the-line',
    mode: 'whats-the-call',
    divisions: [...BOTH],
    state: { outs: 0, runners: { first: false, second: false, third: false } },
    ball: { type: 'ground', zone: 'third' },
    prompt: 'A ground ball down the third base line clips the chalk line itself. What is the call?',
    options: [
      { id: 'fair', label: 'Fair ball' },
      { id: 'foul', label: 'Foul ball' },
      { id: 'umpire', label: "Whatever the umpire feels" },
      { id: 'redo', label: 'Dead ball, do it over' },
    ],
    correctOptionId: 'fair',
    explanation:
      'The line is part of fair territory, not a wall between fair and foul. If the ball touches any part of the chalk, it is fair and it is live.',
    tags: ['fair or foul'],
  },
  {
    id: 'c-bounces-fair-then-rolls-foul',
    mode: 'whats-the-call',
    divisions: [...BOTH],
    state: { outs: 0, runners: { first: false, second: false, third: false } },
    ball: { type: 'ground', zone: 'third', speed: 'hard' },
    prompt: 'A grounder bounces fair right on top of third base and then skips into foul ground. What is the call?',
    options: [
      { id: 'fair', label: 'Fair ball' },
      { id: 'foul', label: 'Foul ball' },
      { id: 'depends', label: 'It depends who touches it' },
      { id: 'dead', label: 'Dead ball, batter back up' },
    ],
    correctOptionId: 'fair',
    explanation:
      'Past first or third, the only thing that matters is whether it was fair when it got there, and a ball that hits the bag is always fair. What it does afterward does not undo that.',
    tags: ['fair or foul'],
  },
  {
    id: 'c-rolls-foul-before-first',
    mode: 'whats-the-call',
    divisions: [...BOTH],
    state: { outs: 0, runners: { first: false, second: false, third: false } },
    ball: { type: 'bunt', zone: 'foul right' },
    prompt: 'A bunt rolls up the first base line, stays in fair ground for a while, then trickles foul untouched before reaching first. What is the call?',
    options: [
      { id: 'foul', label: 'Foul ball' },
      { id: 'fair', label: 'Fair, it was fair first' },
      { id: 'live', label: 'Live ball either way' },
      { id: 'umpire', label: 'The umpire picks' },
    ],
    correctOptionId: 'foul',
    explanation:
      'In front of the bases, what matters is where the ball ends up or where it is first touched, not where it rolled on the way. Nobody touched it, so it settled foul and it is foul.',
    tags: ['fair or foul', 'bunt'],
  },
  {
    id: 'c-fielder-touches-it-in-fair-ground',
    mode: 'whats-the-call',
    divisions: [...BOTH],
    state: { outs: 0, runners: { first: false, second: false, third: false } },
    ball: { type: 'bunt', zone: 'third' },
    prompt: 'A slow roller is in fair ground near the line when the third baseman picks it up, and it was heading foul. What is the call?',
    options: [
      { id: 'fair', label: 'Fair, he touched it in fair ground' },
      { id: 'foul', label: 'Foul, it was going foul' },
      { id: 'choice', label: 'The fielder chooses' },
      { id: 'redo', label: 'Dead ball, do it over' },
    ],
    correctOptionId: 'fair',
    explanation:
      'Touching the ball ends the question right there, and where the fielder touches it is what decides it. That is why you let a ball roll if you think it is going foul.',
    tags: ['fair or foul'],
  },
  {
    id: 'c-caught-in-foul-ground',
    mode: 'whats-the-call',
    divisions: [...BOTH],
    state: { outs: 1, runners: { first: false, second: false, third: true } },
    ball: { type: 'fly', zone: 'foul left' },
    prompt: 'The third baseman catches a fly ball in foul territory. What is the call?',
    options: [
      { id: 'out-tag', label: 'Batter out, runners may tag up' },
      { id: 'foul', label: 'Foul ball, batter keeps hitting' },
      { id: 'out-stay', label: 'Batter out, runners must stay' },
      { id: 'dead', label: 'Out, and the ball is dead' },
    ],
    correctOptionId: 'out-tag',
    explanation:
      'A caught fly ball is an out anywhere on the field, fair or foul, and the ball stays live. That means the runner on third can tag and try to score, so the catch is not always free.',
    tags: ['fair or foul', 'tag up', 'catch'],
  },
  {
    id: 'c-catch-then-drops-it',
    mode: 'whats-the-call',
    divisions: [...BOTH],
    state: { outs: 0, runners: { first: false, second: false, third: false } },
    ball: { type: 'fly', zone: 'left' },
    prompt: 'The left fielder gets his glove on a fly ball, then falls down and the ball pops out. What is the call?',
    options: [
      { id: 'no-catch', label: 'No catch, the ball is live' },
      { id: 'catch', label: 'Out, he had it first' },
      { id: 'umpire', label: 'Umpire decides if he had it' },
      { id: 'dead', label: 'Dead ball, batter back up' },
    ],
    correctOptionId: 'no-catch',
    explanation:
      'A catch is not finished until the fielder has clear control and the fall is over. Losing it while he lands means he never held it, and everyone should be running.',
    ruleRef: 'A catch requires control that survives the fielder\'s fall. TODO: confirm rule number.',
    tags: ['catch'],
  },
  {
    id: 'c-tag-up-left-early',
    mode: 'whats-the-call',
    divisions: [...BOTH],
    state: { outs: 1, runners: { first: false, second: false, third: true } },
    ball: { type: 'fly', zone: 'center' },
    prompt: 'The runner on third leaves before the center fielder catches the ball, and the defense throws to third. What is the call?',
    options: [
      { id: 'out', label: 'He is out for leaving early' },
      { id: 'safe', label: 'Safe, he got back in time' },
      { id: 'run', label: 'The run counts anyway' },
      { id: 'nothing', label: 'Nothing, tagging is optional' },
    ],
    correctOptionId: 'out',
    explanation:
      'On a caught ball a runner has to be touching his base until the catch is made, then he can go. Leaving early means the defense can throw to that base and have him called out.',
    ruleRef: 'Runner must retouch after a catch. TODO: confirm rule number and how the appeal is made.',
    localRuleSensitive: true,
    tags: ['tag up', 'baserunning'],
  },

  // -------------------------------------------------------------------------
  // Balls that leave the field, and balls that hit people
  // -------------------------------------------------------------------------
  {
    id: 'c-over-the-fence',
    mode: 'whats-the-call',
    divisions: [...BOTH],
    state: { outs: 1, runners: { first: true, second: false, third: false } },
    ball: { type: 'fly', zone: 'deep center' },
    prompt: 'The batter hits it over the fence in fair ground on the fly. What is the call?',
    options: [
      { id: 'hr', label: 'Home run, both runners score' },
      { id: 'two', label: 'Two bases for everybody' },
      { id: 'batter-only', label: 'Only the batter scores' },
      { id: 'live', label: 'Live ball, run it out' },
    ],
    correctOptionId: 'hr',
    explanation:
      'A fair ball that clears the fence in the air is a home run, and everybody on base gets to walk home ahead of the batter. Nothing the defense does afterward matters.',
    tags: ['home run'],
  },
  {
    id: 'c-ball-under-the-fence',
    mode: 'whats-the-call',
    divisions: [...BOTH],
    state: { outs: 0, runners: { first: true, second: false, third: false } },
    ball: { type: 'ground', zone: 'deep right' },
    prompt: 'A ground ball rolls under the outfield fence and out of the field. What is the call?',
    options: [
      { id: 'two', label: 'Dead ball, two bases for each runner' },
      { id: 'hr', label: 'Home run' },
      { id: 'live', label: 'Live, go get it' },
      { id: 'one', label: 'One base for each runner' },
    ],
    correctOptionId: 'two',
    explanation:
      'Once the ball leaves the field nobody can make a play on it, so the umpire stops everything and awards bases instead of guessing. Two bases keeps it fair to both sides.',
    ruleRef: 'Ground rule double: batted ball leaving the playing field on the ground. TODO: confirm rule number and any local ground rules.',
    localRuleSensitive: true,
    tags: ['ground rule'],
  },
  {
    id: 'c-hit-by-batted-ball',
    mode: 'whats-the-call',
    divisions: [...BOTH],
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
  {
    id: 'c-hit-by-thrown-ball',
    mode: 'whats-the-call',
    divisions: [...BOTH],
    state: { outs: 1, runners: { first: true, second: false, third: false } },
    prompt: 'A throw to first hits the running batter in the back and bounces away. What is the call?',
    options: [
      { id: 'live', label: 'Nothing, the ball is still live' },
      { id: 'out', label: 'The runner is out' },
      { id: 'dead', label: 'Dead ball, everybody back' },
      { id: 'two', label: 'Two bases for the runner' },
    ],
    correctOptionId: 'live',
    explanation:
      'A thrown ball is not the same as a batted ball, and a runner running where he is supposed to has done nothing wrong. Play on, and everybody should be running while it rolls.',
    ruleRef: 'Runner hit by a thrown ball while running legally. TODO: confirm rule number and the interference exceptions.',
    tags: ['baserunning'],
  },
  {
    id: 'c-obstruction-by-fielder',
    mode: 'whats-the-call',
    divisions: [...BOTH],
    state: { outs: 1, runners: { first: true, second: false, third: false } },
    prompt: 'A fielder without the ball stands in the base path and the runner has to go around him. What is the call?',
    options: [
      { id: 'award', label: 'Obstruction, the runner gets the base' },
      { id: 'nothing', label: 'Nothing, run around him' },
      { id: 'runner-out', label: 'The runner is out' },
      { id: 'warn', label: 'A warning to the fielder' },
    ],
    correctOptionId: 'award',
    explanation:
      'A fielder only earns the right to stand in the path when he has the ball or is fielding it. Otherwise the base path belongs to the runner, and the umpire gives him what he lost.',
    ruleRef: 'Obstruction by a fielder not in possession of the ball. TODO: confirm rule number and the award.',
    tags: ['obstruction', 'baserunning'],
  },
  {
    id: 'c-overrun-first-straight-back',
    mode: 'whats-the-call',
    divisions: [...BOTH],
    state: { outs: 1, runners: { first: false, second: false, third: false } },
    prompt: 'The batter beats the throw, runs well past first, turns toward the dugout side and comes straight back. Can he be tagged out?',
    options: [
      { id: 'no', label: 'No, he came straight back' },
      { id: 'yes', label: 'Yes, he left the base' },
      { id: 'turn', label: 'Yes, because he turned at all' },
      { id: 'umpire', label: 'Only if the umpire saw it' },
    ],
    correctOptionId: 'no',
    explanation:
      'A batter is allowed to overrun first and come back without being in danger, which is why you never slow down before the bag. Turning toward the outfield side and heading for second is what gives that protection up.',
    ruleRef: 'Batter-runner overrunning first base. TODO: confirm rule number and the exact wording about attempting second.',
    localRuleSensitive: true,
    tags: ['baserunning'],
  },
  {
    id: 'c-run-scores-before-third-out',
    mode: 'whats-the-call',
    divisions: [...BOTH],
    state: { outs: 2, runners: { first: false, second: false, third: true } },
    ball: { type: 'ground', zone: 'shortstop hole' },
    prompt: 'With two outs the runner from third crosses the plate before the throw beats the batter to first. Does the run count?',
    options: [
      { id: 'no', label: 'No, the third out was at first' },
      { id: 'yes', label: 'Yes, he crossed first' },
      { id: 'umpire', label: 'Only if the umpire saw him cross' },
      { id: 'half', label: 'It counts as half a run' },
    ],
    correctOptionId: 'no',
    explanation:
      'When the third out is the batter being put out before reaching first, no runs count on that play at all, no matter who crossed the plate first. That is why you always take the out at first with two outs.',
    ruleRef: 'No run scores when the third out is made by the batter-runner before reaching first. TODO: confirm rule number.',
    tags: ['third out', 'scoring'],
  },
  {
    id: 'c-run-does-not-count-on-force',
    mode: 'whats-the-call',
    divisions: [...BOTH],
    state: { outs: 2, runners: { first: true, second: true, third: true } },
    ball: { type: 'ground', zone: '3-4 hole' },
    prompt: 'With two outs and the bases loaded, the second baseman steps on second as the runner from third crosses the plate. Does the run count?',
    options: [
      { id: 'no', label: 'No, the third out was a force' },
      { id: 'yes', label: 'Yes, he was already home' },
      { id: 'umpire', label: 'The umpire decides who was first' },
      { id: 'depends', label: 'Only if he slid' },
    ],
    correctOptionId: 'no',
    explanation:
      'A run never counts when the third out is a force out, even if the runner crossed the plate first. It is the one time the order of events does not matter.',
    ruleRef: 'No run scores when the third out is a force out. TODO: confirm rule number.',
    tags: ['third out', 'force play', 'scoring'],
  },
]
