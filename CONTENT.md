# Adding a scenario

The scenario bank is the product. The code is the small part. This file is
what you read before adding to it.

Scenarios live in `src/content/scenarios/`, one file per mode, all re-exported
from `src/content/scenarios/index.ts`. Content is never fetched. It is imported
and bundled.

## Before you write anything: the rules checklist

Little League Majors and below diverge from professional rules in ways that
will silently corrupt a scenario if you write it from general baseball
knowledge, or from what an AI assistant thinks baseball is. Copy this list into
your pull request and tick it.

```
[ ] I checked this against the CURRENT Little League rulebook, not memory.
[ ] I checked this against the LBLL local rules for the division I tagged.
[ ] No leading off. A runner may not leave until the pitch reaches the batter.
    No pickoff, secondary lead, or MLB-style steal-jump content.
[ ] Leaving early: ball is dead and the runner is out, UNLESS the batter
    reaches base safely. I verified the exact wording and exceptions.
[ ] No uncaught third strike in Majors and below. The batter is out on strike
    three either way. There is no "run to first". Runners may still advance at
    their own risk if the ball gets away.
[ ] Head first sliding into a base a runner is advancing to is an out. Diving
    back to a base already occupied is legal.
[ ] No on-deck batter. Only the batter may have a bat outside the dugout.
[ ] Infield fly applies in Majors. I confirmed its status for AAA before
    tagging any AAA infield fly content.
[ ] Base stealing rules vary by division and by local league. I checked LBLL
    local rules for this specific division.
[ ] Continuous batting order, mandatory play, and pitch count limits are a mix
    of official rule and local option. I checked both.
[ ] Anything touching the above carries localRuleSensitive: true and a ruleRef.
[ ] I did not invent a rule citation. Where I am not certain of the number, the
    ruleRef is a plain description and there is a TODO comment.
```

## The shape of a scenario

```ts
{
  id: 'a-force-at-second',        // kebab-case, stable, NEVER reused.
                                  // Progress in localStorage is keyed on it.
  mode: 'make-the-play',
  divisions: ['Majors'],          // at least one. Sessions filter on this.
  state: { outs: 0, runners: { first: true, second: false, third: false } },
  ball: { type: 'ground', zone: 'shortstop hole', speed: 'hard' },
  youAre: 'SS',                   // required for make-the-play and where-do-i-go
  prompt: 'A hard ground ball comes right at you. Where do you throw it?',
  options: [                      // 3 or 4, each under 8 words
    { id: 'first',  label: 'Throw to first' },
    { id: 'second', label: 'Throw to second for the force' },
    { id: 'run',    label: 'Run at the runner' },
    { id: 'third',  label: 'Throw to third' },
  ],
  correctOptionId: 'second',
  explanation:
    'With nobody out the lead runner is worth more than the easy out, and ' +
    'he is forced, so second base just has to be touched.',
  overlay: {
    steps: [
      { kind: 'throw', from: 'SS', to: 'second' },
      { kind: 'touch', at: 'second' },
    ],
  },
  tags: ['force play'],
}
```

## Rules that are enforced, not suggested

`npm run validate` fails the build on all of these, so CI catches them before
they reach a kid:

- A duplicated `id`.
- A `correctOptionId` that matches no option.
- Fewer than 3 or more than 4 options.
- An empty `divisions` array.
- A missing `explanation`, or one under 20 characters.
- A missing `youAre` on a `make-the-play` or `where-do-i-go` scenario.
- A `ball.zone` or an overlay target that is not in the zone lookup table.

## Two rules the validator cannot check, so you have to

**Every scenario carries at least one division tag.** AAA and Majors rules will
diverge, and when they do, untagged content means a full rewrite instead of a
filter.

**The explanation gives a reason, not a restatement.** "Throw to first" is not
an explanation. "There is no force at third with a runner only on second, so
the sure out is at first" is. If you can delete the explanation and lose
nothing, it is not an explanation.

## Writing for a 9 to 11 year old

Short sentences. Common words. Say what happens.

- Good: "Throw to second for the force out."
- Bad: "Initiate the lead force at the keystone."

Prompts are one sentence. Options are under 8 words. Explanations are one or
two sentences and say *why*.

## Zone names

Ball destinations and overlay targets are written in English and validated
against `src/field/zones.ts`. You never write a coordinate.

Ball zones: `home`, `in front of plate`, `mound`, `first`, `second`, `third`,
`shortstop hole`, `3-4 hole`, `up the middle`, `shallow left`,
`shallow center`, `shallow right`, `left`, `left center`, `center`,
`right center`, `right`, `deep left`, `deep center`, `deep right`, `foul left`,
`foul right`.

Play zones, for overlay targets only: `cutoff left`, `cutoff center`,
`cutoff right`, `backup first`, `backup second`, `backup third`, `backup home`.

An overlay step may also target a fielding position (`P`, `C`, `1B`, `2B`,
`3B`, `SS`, `LF`, `CF`, `RF`), which resolves to where that fielder is
standing.

If you need a spot that is not listed, add it to `src/field/zones.ts` first,
with a name that reads like something a coach would shout. Never reach for a
coordinate from a scenario file.

## Overlay steps

- `{ kind: 'throw', from, to }` — a solid straight arrow. A thrown ball.
- `{ kind: 'move', who?, from, to }` — a dashed curved arrow ending in a
  dashed ring. A player running to a spot: cutoff, backup, covering a bag.
- `{ kind: 'touch', at }` — a solid ring. A base that gets touched, or a runner
  who gets tagged.

Steps draw in order, one after another, so write them in the order they happen.
