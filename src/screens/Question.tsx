import type { Scenario } from '../types.ts'
import { Field } from '../field/Field.tsx'
import { SituationStrip } from '../components/SituationStrip.tsx'
import { POSITION_NAMES } from '../field/positions.ts'
import './Question.css'

export interface QuestionProps {
  scenario: Scenario
  /** Option ids in the order to show them. */
  order: string[]
  picked: string | null
  revealed: boolean
  coachMode: boolean
  /** 1-based, for the "3 of 10" counter. Omitted while reviewing a past question. */
  number?: number
  total?: number
  onPick: (optionId: string) => void
  onReveal: () => void
  onNext: () => void
  nextLabel: string
}

export function Question({
  scenario,
  order,
  picked,
  revealed,
  coachMode,
  number,
  total,
  onPick,
  onReveal,
  onNext,
  nextLabel,
}: QuestionProps) {
  const byId = new Map(scenario.options.map((o) => [o.id, o]))
  const options = order.map((id) => byId.get(id)).filter((o) => o !== undefined)
  const right = picked === scenario.correctOptionId

  return (
    <div className="question">
      {number && total ? (
        <p className="counter">
          Play {number} of {total}
        </p>
      ) : null}

      <SituationStrip state={scenario.state} />

      <Field
        runners={scenario.state.runners}
        outs={scenario.state.outs}
        alignment={scenario.state.alignment}
        ball={scenario.ball}
        youAre={scenario.youAre}
        answerOverlay={revealed ? scenario.overlay : undefined}
      />

      {scenario.youAre ? (
        <p className="you-are">
          You are the <strong>{POSITION_NAMES[scenario.youAre]}</strong>.
        </p>
      ) : null}

      <p className="prompt">{scenario.prompt}</p>

      <div className="options">
        {options.map((o) => {
          const isCorrect = o.id === scenario.correctOptionId
          const isPicked = o.id === picked
          const cls = ['option']
          if (revealed && isCorrect) cls.push('option--correct')
          if (revealed && isPicked && !isCorrect) cls.push('option--wrong')
          if (revealed && !isCorrect && !isPicked) cls.push('option--muted')

          return (
            <button
              key={o.id}
              type="button"
              className={cls.join(' ')}
              disabled={revealed}
              onClick={() => onPick(o.id)}
            >
              {/* Never colour alone: every marked row also carries a glyph and
                  a word, so it reads the same in greyscale. */}
              <span className="option-mark" aria-hidden="true">
                {revealed && isCorrect ? '✓' : revealed && isPicked ? '✗' : ''}
              </span>
              <span className="option-label">{o.label}</span>
              {revealed && isCorrect ? <span className="option-tag">Right</span> : null}
              {revealed && isPicked && !isCorrect ? (
                <span className="option-tag">Your pick</span>
              ) : null}
            </button>
          )
        })}
      </div>

      {!revealed && coachMode ? (
        <button type="button" className="big-button" onClick={onReveal}>
          Show the answer
        </button>
      ) : null}

      {revealed ? (
        <div className="feedback" role="status">
          {picked ? (
            <p className={right ? 'verdict verdict--right' : 'verdict verdict--wrong'}>
              <span aria-hidden="true">{right ? '✓' : '✗'}</span> {right ? 'Right' : 'Not this time'}
            </p>
          ) : null}
          <p className="why">{scenario.explanation}</p>
          {scenario.localRuleSensitive ? (
            <p className="local-rule">
              Your league can change this one. Ask your coach how your division plays it.
            </p>
          ) : null}
          <button type="button" className="big-button" onClick={onNext}>
            {nextLabel}
          </button>
        </div>
      ) : null}
    </div>
  )
}
