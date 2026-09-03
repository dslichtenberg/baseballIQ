import { Fragment } from 'react'
import type { BallPath, PlayOverlay, Runners } from '../types.ts'
import {
  fielderSpots,
  POSITION_NAMES,
  ALIGNMENT_NAMES,
  ALL_POSITIONS,
  type Alignment,
  type Position,
} from './positions.ts'
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
  lineUpSpot,
} from './geometry.ts'
import './Field.css'

export interface FieldProps {
  runners: Runners
  ball?: BallPath
  youAre?: Position
  /** Only passed after the answer is revealed. */
  answerOverlay?: PlayOverlay
  outs: 0 | 1 | 2
  /** How the defense is set up. Moves the infielders; defaults to normal depth. */
  alignment?: Alignment
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
  alignment = 'normal',
  animateOverlay = true,
  className,
}: FieldProps) {
  return (
    <svg
      className={['field', className].filter(Boolean).join(' ')}
      viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
      role="img"
      aria-label={describe({ runners, ball, youAre, outs, alignment })}
    >
      <Turf />
      <Bases runners={runners} />
      {/* The ball goes under the players: a ball path crossing a fielder must
          never be the reason a kid can't read who that fielder is. */}
      {ball ? <BallTrack ball={ball} muted={Boolean(answerOverlay)} /> : null}
      <Runners runners={runners} />
      <Fielders youAre={youAre} alignment={alignment} />
      {/* The answer sits on top of everything. It is the point of the picture. */}
      {answerOverlay ? (
        <Overlay
          overlay={answerOverlay}
          ball={ball}
          alignment={alignment}
          animate={animateOverlay}
        />
      ) : null}
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

function Fielders({ youAre, alignment }: { youAre?: Position; alignment: Alignment }) {
  const spots = fielderSpots(alignment)
  return (
    <g aria-hidden="true">
      {ALL_POSITIONS.filter((p) => p !== youAre).map((p) => (
        <Fielder key={p} pos={p} at={spots[p]} />
      ))}
      {youAre ? <Fielder pos={youAre} at={spots[youAre]} you /> : null}
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

function Overlay({
  overlay,
  ball,
  alignment,
  animate,
}: {
  overlay: PlayOverlay
  ball?: BallPath
  alignment: Alignment
  animate: boolean
}) {
  const cls = animate ? 'f-overlay f-overlay--draw' : 'f-overlay'
  const at = (ref: Parameters<typeof refPoint>[0]) => refPoint(ref, alignment)

  return (
    <g aria-hidden="true" className={cls}>
      {overlay.steps.map((step, i) => {
        const delay = { animationDelay: `${i * 0.35}s` }

        if (step.kind === 'touch') {
          const p = at(step.at)
          return (
            <g key={i} className="f-step f-step--touch" style={delay}>
              <circle cx={p.x} cy={p.y} r={15} className="f-touch-ring" />
              <circle cx={p.x} cy={p.y} r={4} className="f-touch-dot" />
            </g>
          )
        }

        if (step.kind === 'cut' || step.kind === 'relay') {
          const source = step.ball ?? ball?.zone
          // A cut or relay with no ball anywhere is not a play, it is a typo.
          // The validator rejects it, so this is only the runtime guard.
          if (!source) return null
          const base = at(step.to)
          const spot = lineUpSpot(at(source), base, step.kind)
          return (
            <g key={i} className={`f-step f-step--${step.kind}`} style={delay}>
              <circle cx={spot.x} cy={spot.y} r={13} className="f-spot-ring" />
              {/* Both legs of the throw, so the spot explains itself: the ball
                  comes here, and from here it goes on to the base.
                  The spot sits ON the line by construction, so without a wide
                  break at that end the two legs render as one straight arrow
                  and the whole point — the ball stops here — disappears. */}
              {/* The throw is context; the spot and the run to it are the
                  answer, so the two legs are drawn back a step. */}
              <Arrow from={at(source)} to={spot} gap={22} assist />
              <Arrow from={spot} to={base} gap={22} assist />
              <Arrow from={at(step.from ?? step.who)} to={spot} curved gap={20} />
            </g>
          )
        }

        const start = at(step.kind === 'move' ? (step.from ?? step.who) : step.from)
        const end = at(step.to)

        return (
          <g key={i} className={`f-step f-step--${step.kind}`} style={delay}>
            {/* "Where do I go" is answered by a spot, not by an arrow that
                stops in open grass, so a move always marks its destination. */}
            {step.kind === 'move' ? (
              <circle cx={end.x} cy={end.y} r={13} className="f-spot-ring" />
            ) : null}
            <Arrow from={start} to={end} curved={step.kind === 'move'} />
          </g>
        )
      })}
    </g>
  )
}

/**
 * A thrown ball travels straight. A player runs around whoever is in the way,
 * so a move curves. That difference is doing real work: it keeps a "go back up
 * third" arrow from looking like a throw to the third baseman it happens to
 * pass.
 */
function Arrow({
  from,
  to,
  curved = false,
  gap: gapOverride,
  assist = false,
}: {
  from: Pt
  to: Pt
  curved?: boolean
  gap?: number
  assist?: boolean
}) {
  // Short hops (a first baseman stepping up to the cut spot) still need a
  // readable arrow, so never trim more than a quarter of the run.
  const gap = Math.min(gapOverride ?? 15, Math.hypot(to.x - from.x, to.y - from.y) * 0.25)
  const tip = shorten(from, to, gap)
  const start = shorten(to, from, gap * 0.85)
  const { d, ctrl } = curved
    ? bow(start, tip, 0.3)
    : { d: straight(start, tip), ctrl: start }

  const cls = ['f-arrow', curved && 'f-arrow--run', assist && 'f-arrow--assist']
    .filter(Boolean)
    .join(' ')

  return (
    <g className={cls}>
      <path d={d} className="f-arrow-halo" />
      <path d={d} className="f-arrow-line" />
      <path d={arrowHead(tip, ctrl)} className="f-arrow-head" />
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

function describe({
  runners,
  ball,
  youAre,
  outs,
  alignment,
}: Required<Pick<FieldProps, 'runners' | 'outs' | 'alignment'>> &
  Pick<FieldProps, 'ball' | 'youAre'>) {
  const on = BASES.filter(({ name }) => runners[name]).map(({ name }) => name)
  const bases = on.length === 0 ? 'bases empty' : `runners on ${list(on)}`
  const parts = [`${outs} ${outs === 1 ? 'out' : 'outs'}`, bases]
  if (alignment !== 'normal') parts.push(ALIGNMENT_NAMES[alignment])
  if (ball) parts.push(`${BALL_WORDS[ball.type]} to ${ball.zone}`)
  if (youAre) parts.push(`you are the ${POSITION_NAMES[youAre]}`)
  return `Baseball field: ${parts.join(', ')}.`
}

function list(items: string[]): string {
  if (items.length <= 1) return items.join('')
  if (items.length === 2) return `${items[0]} and ${items[1]}`
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`
}
