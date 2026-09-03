# Baseball IQ

A static web app that teaches situational baseball and Little League rules to
9 to 11 year old players. Phone first, offline after the first load, no
accounts, no server, no data collected.

Three modes: **make the play** (the ball is hit to you, where do you throw it),
**where do I go** (the ball is hit somewhere else, what is your job), and
**what is the call** (a rules situation happens, what is the result).

> **All rules content in this app must be checked against the current Little
> League rulebook and the LBLL local rules before it is put in front of
> players.** See [CONTENT.md](./CONTENT.md).

## Status: milestone 1

M1 is the field diagram and nothing else. There is no question flow, no
scoring, and nothing to tap yet. The app currently renders a proof sheet: every
shape the diagram can draw, on one scroll, plus the complete zone lookup table
plotted where each name lands.

| Milestone | What |
| --- | --- |
| **M1 ✅** | Vite scaffold, field SVG, zone lookup table, deployed to Pages |
| M2 | Scenario type, content files, session builder, question and results screens, validation in CI |
| M3 | Answer overlay animation, localStorage progress, coach mode, division filter, manifest and offline shell |
| M4 | 40+ scenarios and a reading-level pass on the copy |

The field diagram is the piece everything else depends on, so it is worth a
second look before M2 starts. Notes on what to look at are at the bottom of
this file.

## Running it

```bash
npm install
npm run dev        # http://localhost:5173/baseballIQ/
npm run validate   # content checks; CI runs this before the build
npm run build      # typecheck, then bundle to dist/
npm run preview    # serve the built bundle
```

Node 22.6 or newer. `npm run validate` runs a TypeScript file directly through
Node's type stripping, which is why there is no build step or extra dependency
for it.

## Layout

```
src/
  types.ts               the content contract: Scenario, GameState, PlayOverlay
  field/
    zones.ts             THE ZONE LOOKUP TABLE. Named spots to coordinates.
    positions.ts         where each fielder stands
    geometry.ts          field shapes and path builders. Nothing outside
                         src/field/ imports this.
    Field.tsx            the one field component, reused everywhere
    ZoneMap.tsx          every zone name plotted; a reference for authors
  content/scenarios/     the scenario bank (empty until M2)
scripts/
  validate-content.ts    fails the build on a broken scenario
```

The rule that shapes all of it: **adding a scenario must never require touching
a component.** Scenario authors write zone names in English; the type system
checks them; the validator checks the rest.

## Dependencies

React and React DOM. Nothing else at runtime, no UI kit, no router, no CSS
framework. Screen state will be a union type in a single reducer.

Type is two system stacks, not a webfont: a condensed stack for the scoreboard
numerals and headings, a plain sans for everything a kid reads. That keeps the
app genuinely offline-capable with no font fetch. The condensed stack falls
back to a normal-width face on Linux, so if the scoreboard voice matters, the
fix is one self-hosted woff2, not a Google Fonts link.

## Deploying

GitHub Pages from Actions, on push. The workflow runs `npm ci`, `npm run
validate`, `npm run build`, and uploads `dist`.

`vite.config.ts` reads `BASE_PATH`, and the workflow sets it from
`github.event.repository.name`, so the Pages base path cannot drift out of sync
with the URL GitHub actually serves. Local builds fall back to `/baseballIQ/`.

There is no client side routing, so no 404 fallback is needed. Keep it that
way.

## Design decisions worth arguing with

These are the calls made while building the diagram. Any of them can be
reversed cheaply now and expensively later.

**The infield is drawn larger than a scale drawing would put it.** A real
Little League field is about 200 ft to the fence and 60 ft between bases, which
on a phone leaves the infield tiny. Nearly every question in this app happens
in the infield, so it gets the room.

**Dirt is basepaths and base cutouts, not a filled skin.** The first attempt
drew the infield as a solid dirt wedge and it swallowed the outfield. A mow
line separates infield grass from outfield grass instead.

**Ball paths carry their type in their shape**, because a bird's eye view
cannot show height. Ground balls and bunts scallop, line drives are straight,
fly balls bow gently, pop ups bow hard.

**Throws are straight and solid; moves are curved and dashed and end in a
dashed ring.** A thrown ball travels straight; a player runs around whoever is
in the way. That difference stops a "go back up third" arrow from reading as a
throw to the third baseman it happens to pass.

**The ball path dims once the answer is on the field.** The play still makes
sense, but the thing being taught wins the picture.

**Draw order is turf, bases, ball, runners, fielders, answer.** A ball path
crossing a fielder must never be the reason a kid cannot read who that fielder
is, and the answer sits on top of everything because it is the point.

**Two tokens were added to the palette in the spec.** Gold marks you and marks
the answer; blue marks the other team's runners so they never read as you. The
spec's five colours had no way to say "this one is you".

**The answer overlay geometry landed early, in M1 rather than M3.** Only the
drawing, not the flow around it. The overlay is what proves the coordinates are
right, and the whole point of stopping at M1 is to find out whether the
coordinates are right.

### Open questions for the M1 review

1. **Fielder labels are about 10 CSS pixels on a 360px phone.** Legible in
   testing but small. They can be bigger, at the cost of infielders crowding
   each other. Worth checking outdoors, in sun, on a real phone.
2. **The cutoff-to-home spot is drawn deeper than it really is.** The true spot
   is just in front of the rubber, where the marker lands on top of the
   pitcher's own marker. Drawn correctly it is unreadable; drawn as it is now
   it is readable and slightly wrong.
3. **A ball hit right at a fielder ends underneath that fielder's marker.**
   Currently the marker wins. An offset landing mark is possible if the ball
   should stay visible.
4. **Should the diagram be shorter?** It is 384 by 400 units, about 310 CSS
   pixels tall at 360px wide. That leaves room for a prompt and four 48px
   answer rows without scrolling on most phones, but it is close.
