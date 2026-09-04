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
import type { FieldPt } from './zones.ts'
import {
  VIEW,
  HOME_FT,
  BASES,
  FAIR_PATH,
  INFIELD_PATH,
  OUTFIELD_PATH,
  TRACK_PATH,
  WALL_PATH,
  WALL_TOP_PATH,
  FOUL_LINE_L,
  FOUL_LINE_R,
  BASEPATH_PATH,
  HOME_CIRCLE_PATH,
  MOUND_PATH,
  HOME_PLATE_PATH,
  STANDING_FT,
  basePath,
  ballPath,
  project,
  depthScale,
  straight,
  bow,
  arrowHead,
  shorten,
  refFt,
  refPoint,
  lineUpSpot,
  type Pt,
} from './geometry.ts'
import './Field.css'

export interface FieldProps {
  runners: Runners
  ball?: BallPath
  youAre?: Position
  /** Only passed after the answer is revealed. */
  answerOverlay?: PlayOverlay
  /**
   * Not drawn on the field — the situation strip above it is a real scoreboard
   * and says this better. Kept because the count belongs in the diagram's
   * description for anyone reading it with a screen reader.
   */
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
    </svg>
  )
}

// ---------------------------------------------------------------------------

/**
 * The ballpark. Every shape here is real ground put through the camera, so the
 * arcs nest instead of crossing and the basepaths are one continuous ribbon
 * rather than a band with discs stuck on it.
 */
function Turf() {
  return (
    <g aria-hidden="true">
      <defs>
        {/* Light falls off toward the back of the field. */}
        <linearGradient id="bq-grass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--grass-far)" />
          <stop offset="100%" stopColor="var(--grass-near)" />
        </linearGradient>
        <linearGradient id="bq-infield" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--grass)" />
          <stop offset="100%" stopColor="var(--grass-near)" />
        </linearGradient>
        <linearGradient id="bq-dirt" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--dirt-far)" />
          <stop offset="100%" stopColor="var(--dirt-near)" />
        </linearGradient>
        <linearGradient id="bq-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--wall-top)" />
          <stop offset="100%" stopColor="var(--wall-face)" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width={VIEW.w} height={VIEW.h} className="f-out-of-play" />

      {/* The wall goes down first, so the turf laps over its foot. */}
      <path d={WALL_PATH} className="f-wall" />
      <path d={WALL_TOP_PATH} className="f-wall-top" />

      <path d={FAIR_PATH} className="f-grass" />
      <path d={TRACK_PATH} className="f-track" />
      <path d={OUTFIELD_PATH} className="f-outfield" />
      <path d={INFIELD_PATH} className="f-infield" />

      <path d={BASEPATH_PATH} className="f-basepath" />
      <path d={HOME_CIRCLE_PATH} className="f-dirt" />
      <path d={MOUND_PATH} className="f-mound" />

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
          d={basePath(at)}
          className={runners[name] ? 'f-base f-base--occupied' : 'f-base'}
        />
      ))}
    </g>
  )
}

/**
 * Anybody standing on the field: a shadow where their feet are and a marker at
 * head height. The gap between the two is the perspective doing the work, so a
 * player near the camera stands taller than one in the outfield without
 * anything having to be tuned.
 */
function Standing({
  at,
  r,
  className,
  label,
}: {
  at: FieldPt
  r: number
  className: string
  label?: string
}) {
  const feet = project(at)
  const head = project(at, STANDING_FT)
  const s = depthScale(at)
  return (
    <g className={className}>
      <ellipse cx={feet.x} cy={feet.y} rx={r * 0.85 * s} ry={r * 0.34 * s} className="f-shadow" />
      <line x1={feet.x} y1={feet.y} x2={head.x} y2={head.y} className="f-stand" />
      <circle cx={head.x} cy={head.y} r={r} className="f-marker" />
      {label ? (
        <text x={head.x} y={head.y} className="f-marker-label" dominantBaseline="central">
          {label}
        </text>
      ) : null}
    </g>
  )
}

function Runners({ runners }: { runners: Runners }) {
  return (
    <g aria-hidden="true">
      {BASES.filter(({ name }) => runners[name]).map(({ name, at }) => (
        <Standing key={name} at={at} r={6} className="f-runner" />
      ))}
    </g>
  )
}

function Fielders({ youAre, alignment }: { youAre?: Position; alignment: Alignment }) {
  const spots = fielderSpots(alignment)
  return (
    <g aria-hidden="true">
      {ALL_POSITIONS.filter((p) => p !== youAre).map((p) => (
        <Standing key={p} at={spots[p]} r={10.5} className="f-fielder" label={p} />
      ))}
      {youAre ? (
        <Fragment>
          <circle
            cx={project(spots[youAre], STANDING_FT).x}
            cy={project(spots[youAre], STANDING_FT).y}
            r={21}
            className="f-you-glow"
          />
          <Standing at={spots[youAre]} r={12.5} className="f-fielder f-fielder--you" label={youAre} />
        </Fragment>
      ) : null}
    </g>
  )
}

function BallTrack({ ball, muted }: { ball: BallPath; muted: boolean }) {
  const to = refFt(ball.zone)
  const d = ballPath(ball.type, to)
  const land = project(to)

  // Once the answer is on the field the ball is history: it stays visible so the
  // play still makes sense, but it stops competing with the thing being taught.
  const cls = ['f-ball', `f-ball--${ball.type}`, muted && 'f-ball--muted'].filter(Boolean).join(' ')

  return (
    <g aria-hidden="true" className={cls}>
      <path d={d} className="f-ball-halo" />
      <path d={d} className="f-ball-line" />
      <ellipse cx={land.x} cy={land.y} rx={4} ry={1.8} className="f-ball-shadow" />
      <circle cx={land.x} cy={land.y - 2} r={3.4} className="f-ball-mark" />
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
              <ellipse cx={p.x} cy={p.y} rx={13} ry={6} className="f-touch-ring" />
              <circle cx={p.x} cy={p.y} r={3} className="f-touch-dot" />
            </g>
          )
        }

        if (step.kind === 'cut' || step.kind === 'relay') {
          const source = step.ball ?? ball?.zone
          // A cut or relay with no ball anywhere is not a play, it is a typo.
          // The validator rejects it, so this is only the runtime guard.
          if (!source) return null
          const spotFt = lineUpSpot(refFt(source, alignment), refFt(step.to, alignment), step.kind)
          const spot = project(spotFt)
          return (
            <g key={i} className={`f-step f-step--${step.kind}`} style={delay}>
              <ellipse cx={spot.x} cy={spot.y} rx={13} ry={6} className="f-spot-ring" />
              {/* Both legs of the throw, so the spot explains itself: the ball
                  comes here, and from here it goes on to the base. The spot sits
                  ON the line by construction, so without a break at that end the
                  two legs render as one arrow and the point disappears. */}
              <Arrow from={at(source)} to={spot} gap={18} assist />
              <Arrow from={spot} to={at(step.to)} gap={18} assist />
              <Arrow from={at(step.from ?? step.who)} to={spot} curved gap={16} />
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
              <ellipse cx={end.x} cy={end.y} rx={13} ry={6} className="f-spot-ring" />
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
  const gap = Math.min(gapOverride ?? 12, Math.hypot(to.x - from.x, to.y - from.y) * 0.25)
  const tip = shorten(from, to, gap)
  const start = shorten(to, from, gap * 0.85)
  const { d, ctrl } = curved ? bow(start, tip, 0.28) : { d: straight(start, tip), ctrl: start }

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

// Home plate is the origin; re-exported so callers do not import projection.
export { HOME_FT }
