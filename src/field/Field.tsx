import { Fragment } from 'react'
import type { BallPath, PlayOverlay, Runners } from '../types.ts'
import { POSITIONS, POSITION_NAMES, ALL_POSITIONS, type Position } from './positions.ts'
import type { Pt } from './zones.ts'
import {
  VIEW,
  HOME,
  BASES,
  MOUND,
  FAIR_PATH,
  OUTFIELD_GRASS_PATH,
  FENCE_PATH,
  FOUL_LINE_L,
  FOUL_LINE_R,
  BASEPATH_PATH,
  BASEPATH_WIDTH,
  BASE_CUTOUT_R,
  HOME_CIRCLE_R,
  MOUND_R,
  HOME_PLATE_PATH,
  baseDiamond,
  scallop,
  straight,
  bow,
  arrowHead,
  shorten,
  refPoint,
} from './geometry.ts'
import './Field.css'

export interface FieldProps {
  runners: Runners
  ball?: BallPath
  youAre?: Position
  /** Only passed after the answer is revealed. */
  answerOverlay?: PlayOverlay
  outs: 0 | 1 | 2
  /** The one piece of motion in the app. Reduced-motion users get it instantly. */
  animateOverlay?: boolean
  className?: string
}

export function Field({
  runners,
  ball,
  youAre,
  answerOverlay,
  outs,
  animateOverlay = true,
  className,
}: FieldProps) {
  return (
    <svg
      className={['field', className].filter(Boolean).join(' ')}
      viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
      role="img"
      aria-label={describe({ runners, ball, youAre, outs })}
    >
      <Turf />
      <Bases runners={runners} />
      {/* The ball goes under the players: a ball path crossing a fielder must
          never be the reason a kid can't read who that fielder is. */}
      {ball ? <BallTrack ball={ball} muted={Boolean(answerOverlay)} /> : null}
      <Runners runners={runners} />
      <Fielders youAre={youAre} />
      {/* The answer sits on top of everything. It is the point of the picture. */}
      {answerOverlay ? <Overlay overlay={answerOverlay} animate={animateOverlay} /> : null}
      <Outs outs={outs} />
    </svg>
  )
}

// ---------------------------------------------------------------------------

function Turf() {
  return (
    <g aria-hidden="true">
      <rect x="0" y="0" width={VIEW.w} height={VIEW.h} className="f-out-of-play" />
      <path d={FAIR_PATH} className="f-grass" />
      <path d={OUTFIELD_GRASS_PATH} className="f-grass-out" />
      <path d={BASEPATH_PATH} className="f-basepath" strokeWidth={BASEPATH_WIDTH} />
      {BASES.map(({ name, at }) => (
        <circle key={name} cx={at.x} cy={at.y} r={BASE_CUTOUT_R} className="f-dirt" />
      ))}
      <circle cx={HOME.x} cy={HOME.y} r={HOME_CIRCLE_R} className="f-dirt" />
      <circle cx={MOUND.x} cy={MOUND.y} r={MOUND_R} className="f-mound" />
      <path d={FENCE_PATH} className="f-fence" />
      <path d={FOUL_LINE_L} className="f-chalk-line" />
      <path d={FOUL_LINE_R} className="f-chalk-line" />
      <path d={HOME_PLATE_PATH} className="f-plate" />
    </g>
  )
}

function Bases({ runners }: { runners: Runners }) {
  return (
    <g aria-hidden="true">
      {BASES.map(({ name, at }) => (
        <path
          key={name}
          d={baseDiamond(at)}
          className={runners[name] ? 'f-base f-base--occupied' : 'f-base'}
        />
      ))}
    </g>
  )
}

function Runners({ runners }: { runners: Runners }) {
  return (
    <g aria-hidden="true">
      {BASES.filter(({ name }) => runners[name]).map(({ name, at }) => {
        // Sit the runner on the home-plate side of the bag, off the base itself,
        // so the filled base and the runner read as two separate facts.
        const spot = shorten(HOME, at, 15)
        return (
          <Fragment key={name}>
            <circle cx={spot.x} cy={spot.y} r={7.5} className="f-runner" />
            <circle cx={spot.x} cy={spot.y} r={3} className="f-runner-pip" />
          </Fragment>
        )
      })}
    </g>
  )
}

function Fielders({ youAre }: { youAre?: Position }) {
  return (
    <g aria-hidden="true">
      {ALL_POSITIONS.filter((p) => p !== youAre).map((p) => (
        <Fielder key={p} pos={p} at={POSITIONS[p]} />
      ))}
      {youAre ? <Fielder pos={youAre} at={POSITIONS[youAre]} you /> : null}
    </g>
  )
}

function Fielder({ pos, at, you = false }: { pos: Position; at: Pt; you?: boolean }) {
  const r = you ? 14 : 11
  return (
    <g className={you ? 'f-fielder f-fielder--you' : 'f-fielder'}>
      {you ? <circle cx={at.x} cy={at.y} r={r + 5} className="f-you-ring" /> : null}
      <circle cx={at.x} cy={at.y} r={r} className="f-fielder-dot" />
      <text x={at.x} y={at.y} className="f-fielder-label" dominantBaseline="central">
        {pos}
      </text>
    </g>
  )
}

function BallTrack({ ball, muted }: { ball: BallPath; muted: boolean }) {
  const to = refPoint(ball.zone)
  const rolling = ball.type === 'ground' || ball.type === 'bunt'
  const d = rolling
    ? scallop(HOME, to, ball.type === 'bunt' ? 14 : 26)
    : ball.type === 'line'
      ? straight(HOME, to)
      : bow(HOME, to, ball.type === 'popup' ? 0.45 : 0.2).d

  // Once the answer is on the field the ball is history: it stays visible so the
  // play still makes sense, but it stops competing with the thing being taught.
  const cls = ['f-ball', `f-ball--${ball.type}`, muted && 'f-ball--muted'].filter(Boolean).join(' ')

  return (
    <g aria-hidden="true" className={cls}>
      <path d={d} className="f-ball-halo" />
      <path d={d} className="f-ball-line" />
      <circle cx={to.x} cy={to.y} r={5.5} className="f-ball-mark" />
    </g>
  )
}

function Overlay({ overlay, animate }: { overlay: PlayOverlay; animate: boolean }) {
  const cls = animate ? 'f-overlay f-overlay--draw' : 'f-overlay'
  return (
    <g aria-hidden="true" className={cls}>
      {overlay.steps.map((step, i) => {
        const delay = { animationDelay: `${i * 0.35}s` }
        if (step.kind === 'touch') {
          const at = refPoint(step.at)
          return (
            <g key={i} className="f-step f-step--touch" style={delay}>
              <circle cx={at.x} cy={at.y} r={15} className="f-touch-ring" />
              <circle cx={at.x} cy={at.y} r={4} className="f-touch-dot" />
            </g>
          )
        }
        const from = refPoint(step.from)
        const raw = refPoint(step.to)
        // Short hops (a first baseman stepping to the cutoff spot) still need a
        // readable arrow, so never trim more than a quarter of the run.
        const gap = Math.min(15, Math.hypot(raw.x - from.x, raw.y - from.y) * 0.25)
        const tip = shorten(from, raw, gap)
        const start = shorten(raw, from, gap * 0.85)

        // A thrown ball travels straight. A player runs around whoever is in
        // the way, so a move curves. That difference is doing real work: it
        // keeps a "go back up third" arrow from looking like a throw to the
        // third baseman it happens to pass.
        const curved = step.kind === 'move'
        const { d, ctrl } = curved
          ? bow(start, tip, 0.3)
          : { d: straight(start, tip), ctrl: start }

        return (
          <g key={i} className={`f-step f-step--${step.kind}`} style={delay}>
            {/* "Where do I go" is answered by a spot, not by an arrow that
                stops in open grass, so a move always marks its destination. */}
            {curved ? <circle cx={raw.x} cy={raw.y} r={13} className="f-spot-ring" /> : null}
            <path d={d} className="f-arrow-halo" />
            <path d={d} className="f-arrow-line" />
            <path d={arrowHead(tip, ctrl)} className="f-arrow-head" />
          </g>
        )
      })}
    </g>
  )
}

function Outs({ outs }: { outs: 0 | 1 | 2 }) {
  return (
    <g aria-hidden="true" className="f-outs">
      <text x={16} y={22} className="f-outs-label">
        OUTS
      </text>
      {[0, 1, 2].map((i) => (
        <circle
          key={i}
          cx={78 + i * 15}
          cy={18}
          r={5}
          className={i < outs ? 'f-out-pip f-out-pip--on' : 'f-out-pip'}
        />
      ))}
    </g>
  )
}

// ---------------------------------------------------------------------------

const BALL_WORDS: Record<BallPath['type'], string> = {
  ground: 'ground ball',
  line: 'line drive',
  fly: 'fly ball',
  popup: 'pop up',
  bunt: 'bunt',
}

function describe({ runners, ball, youAre, outs }: Pick<FieldProps, 'runners' | 'ball' | 'youAre' | 'outs'>) {
  const on = BASES.filter(({ name }) => runners[name]).map(({ name }) => name)
  const bases = on.length === 0 ? 'bases empty' : `runners on ${list(on)}`
  const parts = [`${outs} ${outs === 1 ? 'out' : 'outs'}`, bases]
  if (ball) parts.push(`${BALL_WORDS[ball.type]} to ${ball.zone}`)
  if (youAre) parts.push(`you are the ${POSITION_NAMES[youAre]}`)
  return `Baseball field: ${parts.join(', ')}.`
}

function list(items: string[]): string {
  if (items.length <= 1) return items.join('')
  if (items.length === 2) return `${items[0]} and ${items[1]}`
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`
}
