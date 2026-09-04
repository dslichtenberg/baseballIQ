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

## Status: milestone 3

The app plays, remembers, and works with no signal. Pick a division and a mode,
answer ten plays one thumb at a time, see the correct play drawn on the field
with a reason, and get a results screen you can tap back into. Add it to a home
screen and it opens in a dugout with the bars at zero.

| Milestone | What |
| --- | --- |
| **M1 ✅** | Vite scaffold, field SVG, zone lookup table, deployed to Pages |
| **M2 ✅** | Content files, session builder, question and feedback screens, results and review, validation in CI |
| **M3 ✅** | localStorage progress, coach mode, division filter, answer overlay, manifest and offline shell |
| **M4 ◑** | 112 scenarios in the bank. Reading-level pass still to do. |

The bank is 112 scenarios: 41 make-the-play, 42 where-do-i-go, 29 what's-the-call.
98 are eligible for AAA and all 112 for Majors, so every mode fills a ten-play
session in either division.

Eighteen carry `localRuleSensitive`, and those are concentrated where Little
League actually diverges: leaving early, stealing, sliding, the uncaught third
strike. The rest of the rules content is deliberately built on the parts of
baseball that do not vary between divisions — fair and foul, what counts as a
catch, force versus tag.

**None of the rules content has been checked against a rulebook.** No `ruleRef`
is a real citation; each is a plain description with a TODO. That check is a
coach's job, not the code's.

## What is stored, and what is not

One localStorage key, `bballiq.v1`, holding three things: per scenario id, how
many times it has been seen, how many times it was right, how it went last
time, and when; plus the division and coach-mode switches so a kid does not
re-pick them every session.

No names, no ages, no teams, no device ids, nothing that could identify a child.
Nothing leaves the device — there is no server to send it to. The session in
flight is deliberately not saved, so a refresh mid-round starts clean at home
rather than restoring a half-finished session it might get wrong.

If localStorage is missing, blocked, throwing, full, or full of garbage from an
older version, the app plays exactly the same. It just does not remember.

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
  app/state.ts           every screen in one union and one reducer. No router.
  session/
    build.ts             which ten questions this session asks
    progress.ts          what the app remembers, keyed by scenario id
    storage.ts           localStorage, defensively. Never allowed to break the app.
  screens/               Home, Question (also does feedback and review), Results
  components/            SituationStrip: the little scoreboard
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

**One manual step is needed before the first deploy can succeed:** a repo admin
has to turn Pages on under *Settings → Pages → Source: GitHub Actions*. The
workflow token is not permitted to create the Pages site itself, so until that
switch is flipped the `configure-pages` step fails and the deploy job is
skipped. Everything before it — install, validate, build — passes. Note that
Pages on a **private** repo requires a paid GitHub plan; on a free plan the
repo has to be public.

`vite.config.ts` reads `BASE_PATH`, and the workflow sets it from
`github.event.repository.name`, so the Pages base path cannot drift out of sync
with the URL GitHub actually serves. Local builds fall back to `/baseballIQ/`.

There is no client side routing, so no 404 fallback is needed. Keep it that
way.

`public/sw.js` is a deliberately dumb service worker: cache the shell on
install, then network first with a cache fallback, caching each asset the first
time it is fetched. No precache manifest, no build step, no Workbox. Vite hashes
asset filenames, which is also what keeps a stale cache from serving an old
bundle — a new build fetches new URLs, and the fresh `index.html` points at the
fresh assets. Bump `CACHE` in that file if its own logic changes.

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

**Cut and relay spots are computed, not named.** They are two different jobs
under two different words, and neither one is a fixed place: where you stand
depends on where the ball is *and* which base the throw is going to. So a
scenario names the ball and the target, and the diagram puts the player on the
line between them — which is the actual coaching point. A fixed name would teach
a location, and would be right for one throwing target and wrong for the rest.
This replaced three named `cutoff` zones that only ever modelled the throw home.

**The drawing is not to a single scale, and the cut and relay distances know
it.** A unit is about 1.8 per foot near the bases and about 1.4 out in the
outfield, because the infield is drawn oversized. The cut distance is calibrated
in infield units and the relay distance in outfield units. Getting this wrong
once put the relay man out past the left fielder.

**Defensive alignment lives on the situation, not the answer.** `infield in`,
`corners in`, and `double play depth` move the infielders, and every overlay
point resolves against the alignment, so a throw from the shortstop with the
infield in starts on the grass. "Infield in, ground ball to short" is a
different question from the same ball at normal depth, and a kid can only see
that if the shortstop is drawn where he is actually standing.

**The ball path dims once the answer is on the field.** The play still makes
sense, but the thing being taught wins the picture.

**Draw order is turf, bases, ball, runners, fielders, answer.** A ball path
crossing a fielder must never be the reason a kid cannot read who that fielder
is, and the answer sits on top of everything because it is the point.

**Two tokens were added to the palette in the spec.** Gold marks you and marks
the answer; blue marks the other team's runners so they never read as you. The
spec's five colours had no way to say "this one is you".

**The field is lit rather than flat.** Asked to look closer to a broadcast
graphic, the turf and the clay each ramp between a far and a near shade, the
outfield sits a shade darker than the infield, and there is a warning track
inside the fence. Every addition is a shade of a colour the spec already chose.
Mow stripes were tried and cut: at phone size they read as a target, and what
makes these graphics look expensive is restraint, not more decoration.

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
