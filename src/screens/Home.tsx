import type { Division } from '../types.ts'
import type { ModeChoice } from '../session/build.ts'
import './Home.css'

const MODES: { id: ModeChoice; title: string; blurb: string }[] = [
  { id: 'make-the-play', title: 'Make the play', blurb: 'The ball comes to you. Where do you throw it?' },
  { id: 'where-do-i-go', title: 'Where do I go', blurb: 'The ball goes somewhere else. What is your job?' },
  { id: 'whats-the-call', title: "What's the call", blurb: 'Something happens. What does the umpire say?' },
  { id: 'mixed', title: 'Mixed', blurb: 'A little of all three.' },
]

const DIVISIONS: Division[] = ['AAA', 'Majors']

export function Home({
  division,
  coachMode,
  onDivision,
  onCoachMode,
  onStart,
}: {
  division: Division
  coachMode: boolean
  onDivision: (d: Division) => void
  onCoachMode: (on: boolean) => void
  onStart: (mode: ModeChoice) => void
}) {
  return (
    <>
      <header className="masthead">
        <h1 className="masthead-title">Baseball IQ</h1>
        <p className="masthead-sub">Ten plays. Pick what you would do.</p>
      </header>

      <section className="home-block">
        <h2 className="home-heading" id="division-heading">
          Division
        </h2>
        <div className="segmented" role="group" aria-labelledby="division-heading">
          {DIVISIONS.map((d) => (
            <button
              key={d}
              type="button"
              className={d === division ? 'seg seg--on' : 'seg'}
              aria-pressed={d === division}
              onClick={() => onDivision(d)}
            >
              {d}
            </button>
          ))}
        </div>
      </section>

      <section className="home-block">
        <h2 className="home-heading">Pick a mode</h2>
        <div className="mode-list">
          {MODES.map((m) => (
            <button key={m.id} type="button" className="mode" onClick={() => onStart(m.id)}>
              <span className="mode-title">{m.title}</span>
              <span className="mode-blurb">{m.blurb}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="home-block">
        <label className="coach">
          <input
            type="checkbox"
            className="coach-box"
            checked={coachMode}
            onChange={(e) => onCoachMode(e.target.checked)}
          />
          <span>
            <span className="coach-title">Coach mode</span>
            <span className="coach-blurb">
              Nobody guesses. Talk it over, then tap to show the answer.
            </span>
          </span>
        </label>
      </section>
    </>
  )
}
