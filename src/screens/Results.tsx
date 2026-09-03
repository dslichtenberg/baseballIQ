import type { Answered } from '../app/state.ts'
import type { Session } from '../session/build.ts'
import { SESSION_SIZE } from '../session/build.ts'
import './Results.css'

/**
 * Say something true. Telling a kid "nice work" for three out of ten is the
 * kind of praise they see straight through, and it makes the praise for a good
 * round worth nothing.
 */
function heading(played: number, scored: number, right: number): string {
  if (played === 0) return 'Nothing here yet'
  if (scored === 0) return 'That is the set'
  if (right === scored) return 'Perfect'
  const share = right / scored
  if (share >= 0.7) return 'Nice work'
  if (share >= 0.4) return 'Good session'
  return 'Now you know'
}

export function Results({
  session,
  answered,
  coachMode,
  onReview,
  onAgain,
  onHome,
}: {
  session: Session
  answered: Answered[]
  coachMode: boolean
  onReview: (index: number) => void
  onAgain: () => void
  onHome: () => void
}) {
  const scored = answered.filter((a) => a.picked !== null)
  const right = scored.filter((a) => a.right).length
  const missed = answered
    .map((a, i) => ({ a, i }))
    .filter(({ a }) => a.picked !== null && !a.right)

  const short = session.available > 0 && session.available < SESSION_SIZE

  return (
    <div className="results">
      <header className="masthead">
        <h1 className="masthead-title">{heading(session.scenarios.length, scored.length, right)}</h1>
      </header>

      {session.scenarios.length === 0 ? (
        <p className="results-note">
          There are no plays for {session.division} in this mode yet. Try the other division, or
          pick a different mode.
        </p>
      ) : coachMode ? (
        <p className="results-note">
          You went through {answered.length} {answered.length === 1 ? 'play' : 'plays'} in coach
          mode, so nothing was scored.
        </p>
      ) : (
        <p className="score">
          <span className="score-big">{right}</span>
          <span className="score-of"> of {scored.length}</span>
        </p>
      )}

      {short ? (
        <p className="results-note">
          That is every {session.division} play in this mode so far — {session.available} of them.
          More are on the way.
        </p>
      ) : null}

      {missed.length > 0 ? (
        <section className="missed">
          <h2 className="results-heading">Worth another look</h2>
          <div className="missed-list">
            {missed.map(({ a, i }) => (
              <button key={a.scenario.id} type="button" className="missed-row" onClick={() => onReview(i)}>
                <span className="missed-mark" aria-hidden="true">
                  ✗
                </span>
                <span className="missed-text">{a.scenario.prompt}</span>
              </button>
            ))}
          </div>
        </section>
      ) : null}

      {session.scenarios.length > 0 ? (
        <button type="button" className="big-button" onClick={onAgain}>
          Play again
        </button>
      ) : null}
      <button type="button" className="plain-button" onClick={onHome}>
        Back to home
      </button>
    </div>
  )
}
