import { Field } from './field/Field.tsx'
import { ZoneMap } from './field/ZoneMap.tsx'
import type { FieldProps } from './field/Field.tsx'
import { BALL_ZONE_NAMES, ZONE_NAMES } from './field/zones.ts'
import './App.css'

/**
 * M1 is the field diagram and nothing else. This page is a static proof sheet:
 * every shape the diagram can draw, on one scroll, so it can be checked on a
 * phone before the question flow is built on top of it.
 */

interface Plate extends FieldProps {
  title: string
  note: string
}

const PLATES: Plate[] = [
  {
    title: 'Ground ball, force at second',
    note: 'Ground balls scallop, so a rolling ball reads as rolling from the top down. You are the shortstop, in gold.',
    outs: 0,
    runners: { first: true, second: false, third: false },
    youAre: 'SS',
    ball: { type: 'ground', zone: 'shortstop hole', speed: 'hard' },
    answerOverlay: {
      steps: [
        { kind: 'throw', from: 'SS', to: 'second' },
        { kind: 'touch', at: 'second' },
      ],
    },
  },
  {
    title: 'Cut man: base hit to right center, runner trying to score',
    note: 'The spot is not a name in a table. It is computed from the ball and the base the throw is going to, so it is right for any ball and any target.',
    outs: 1,
    runners: { first: false, second: true, third: false },
    youAre: '1B',
    ball: { type: 'line', zone: 'right center' },
    answerOverlay: {
      steps: [{ kind: 'cut', who: '1B', to: 'home' }],
    },
  },
  {
    title: 'Relay man: ball in the left center gap',
    note: 'Same idea, different job. The relay man runs out to the ball instead of setting up in front of the base, and the line is drawn to third because that is where the throw is going.',
    outs: 0,
    runners: { first: true, second: false, third: false },
    youAre: 'SS',
    ball: { type: 'line', zone: 'deep left center' },
    answerOverlay: {
      steps: [{ kind: 'relay', who: 'SS', to: 'third' }],
    },
  },
  {
    title: 'Infield in, play at the plate',
    note: 'All four infielders are drawn on the grass in front of the bases. The throw home starts from where the shortstop is actually standing, not from normal depth.',
    outs: 1,
    runners: { first: false, second: false, third: true },
    alignment: 'infield in',
    youAre: 'SS',
    ball: { type: 'ground', zone: 'shortstop hole' },
    answerOverlay: {
      steps: [
        { kind: 'throw', from: 'SS', to: 'home' },
        { kind: 'touch', at: 'home' },
      ],
    },
  },
  {
    title: 'Base hit to right, pitcher backs up third',
    note: 'The backup spot is a named zone, so the scenario author writes "backup third" and never a coordinate.',
    outs: 0,
    runners: { first: true, second: false, third: false },
    youAre: 'P',
    ball: { type: 'ground', zone: 'right' },
    answerOverlay: {
      steps: [{ kind: 'move', who: 'P', from: 'P', to: 'backup third' }],
    },
  },
  {
    title: 'Pop up, bases loaded, two outs',
    note: 'A pop up bows hard; a fly ball bows gently. All three bases filled, and both out pips lit.',
    outs: 2,
    runners: { first: true, second: true, third: true },
    ball: { type: 'popup', zone: 'shortstop hole' },
  },
  {
    title: 'Fly ball to deep left',
    note: 'The deep zones sit on the fence arc. Nothing here is clipped at 360 pixels wide.',
    outs: 1,
    runners: { first: false, second: false, third: true },
    youAre: 'LF',
    ball: { type: 'fly', zone: 'deep left' },
  },
  {
    title: 'Bunt in front of the plate',
    note: 'A bunt is a short, tight scallop. The catcher is the player in gold.',
    outs: 0,
    runners: { first: true, second: false, third: false },
    youAre: 'C',
    ball: { type: 'bunt', zone: 'in front of plate', speed: 'slow' },
    answerOverlay: {
      steps: [{ kind: 'throw', from: 'C', to: 'first' }],
    },
  },
]

export default function App() {
  return (
    <div className="shell">
      <header className="masthead">
        <p className="masthead-kicker">Milestone 1</p>
        <h1 className="masthead-title">Baseball IQ</h1>
        <p className="masthead-sub">
          The field diagram, on its own. No questions, no scoring, nothing to tap. Scroll and check the
          drawing.
        </p>
      </header>

      <main>
        {PLATES.map(({ title, note, ...field }) => (
          <section className="plate" key={title}>
            <div className="plate-head">
              <h2 className="plate-title">{title}</h2>
            </div>
            <Field {...field} />
            <p className="plate-note">{note}</p>
          </section>
        ))}

        <section className="plate">
          <div className="plate-head">
            <h2 className="plate-title">Zone table: where a ball is hit</h2>
          </div>
          <ZoneMap kind="ball" />
          <p className="plate-note">
            {BALL_ZONE_NAMES.length} names a scenario can give as a ball's destination. Nobody writes a
            coordinate.
          </p>
        </section>

        <section className="plate">
          <div className="plate-head">
            <h2 className="plate-title">Zone table: where a player is sent</h2>
          </div>
          <ZoneMap kind="play" />
          <p className="plate-note">
            {ZONE_NAMES.length - BALL_ZONE_NAMES.length} more names, for answer overlays only. An overlay
            can also point at a fielder, which resolves to wherever that fielder is standing.
          </p>
        </section>
      </main>

      <footer className="footer">
        <p>
          Rules content in this app must be checked against the current Little League rulebook and LBLL
          local rules before it is shared with players.
        </p>
      </footer>
    </div>
  )
}
