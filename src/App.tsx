import { useReducer } from 'react'
import { INITIAL, reducer } from './app/state.ts'
import { Home } from './screens/Home.tsx'
import { Question } from './screens/Question.tsx'
import { Results } from './screens/Results.tsx'
import './App.css'

export default function App() {
  const [state, dispatch] = useReducer(reducer, INITIAL)
  const screen = state.screen

  return (
    <div className="shell">
      {screen.name === 'home' ? (
        <Home
          division={state.division}
          coachMode={state.coachMode}
          onDivision={(division) => dispatch({ type: 'set-division', division })}
          onCoachMode={(on) => dispatch({ type: 'set-coach-mode', on })}
          onStart={(mode) => dispatch({ type: 'start', mode })}
        />
      ) : null}

      {screen.name === 'question' ? (
        <Question
          key={screen.session.scenarios[screen.index].id}
          scenario={screen.session.scenarios[screen.index]}
          order={screen.order}
          picked={screen.picked}
          revealed={screen.revealed}
          coachMode={state.coachMode}
          number={screen.index + 1}
          total={screen.session.scenarios.length}
          onPick={(optionId) =>
            state.coachMode ? undefined : dispatch({ type: 'pick', optionId })
          }
          onReveal={() => dispatch({ type: 'reveal' })}
          onNext={() => dispatch({ type: 'next' })}
          nextLabel={
            screen.index + 1 >= screen.session.scenarios.length ? 'See how you did' : 'Next play'
          }
        />
      ) : null}

      {screen.name === 'results' ? (
        <Results
          session={screen.session}
          answered={screen.answered}
          coachMode={state.coachMode}
          onReview={(index) => dispatch({ type: 'review', index })}
          onAgain={() => dispatch({ type: 'play-again' })}
          onHome={() => dispatch({ type: 'home' })}
        />
      ) : null}

      {screen.name === 'review' ? (
        <Question
          key={`review-${screen.answered[screen.index].scenario.id}`}
          scenario={screen.answered[screen.index].scenario}
          order={screen.answered[screen.index].scenario.options.map((o) => o.id)}
          picked={screen.answered[screen.index].picked}
          revealed
          coachMode={state.coachMode}
          onPick={() => undefined}
          onReveal={() => undefined}
          onNext={() => dispatch({ type: 'back-to-results' })}
          nextLabel="Back to results"
        />
      ) : null}

      <footer className="footer">
        <p>
          Check every rule in this app against the current Little League rulebook and your LBLL
          local rules before you trust it.
        </p>
      </footer>
    </div>
  )
}
