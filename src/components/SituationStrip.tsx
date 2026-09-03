import type { GameState } from '../types.ts'
import { ALIGNMENT_NAMES } from '../field/positions.ts'
import './SituationStrip.css'

/**
 * The small ballpark scoreboard. These kids read a real one every game, so the
 * situation is shown the way that object shows it rather than as a sentence.
 */
export function SituationStrip({ state }: { state: GameState }) {
  const { outs, runners, count, alignment } = state
  const on = [runners.first && '1st', runners.second && '2nd', runners.third && '3rd'].filter(Boolean)

  return (
    <div className="strip">
      <div className="strip-cell">
        <span className="strip-label">Outs</span>
        <span className="strip-value">
          <span className="strip-pips" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <span key={i} className={i < outs ? 'pip pip--on' : 'pip'} />
            ))}
          </span>
          <span className="sr-only">
            {outs} {outs === 1 ? 'out' : 'outs'}
          </span>
        </span>
      </div>

      <div className="strip-cell">
        <span className="strip-label">On base</span>
        <span className="strip-value">{on.length ? on.join(' · ') : 'Nobody'}</span>
      </div>

      {count ? (
        <div className="strip-cell">
          <span className="strip-label">Count</span>
          <span className="strip-value">
            {count.balls}-{count.strikes}
          </span>
        </div>
      ) : null}

      {alignment && alignment !== 'normal' ? (
        <div className="strip-cell strip-cell--wide">
          <span className="strip-label">Defense</span>
          <span className="strip-value">{ALIGNMENT_NAMES[alignment]}</span>
        </div>
      ) : null}
    </div>
  )
}
