import { BALL_ZONES, PLAY_ZONES } from './zones.ts'
import {
  VIEW,
  BASES,
  HOME,
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
} from './geometry.ts'
import './Field.css'
import './ZoneMap.css'

/**
 * Every zone name plotted where it lands. Not part of the app a kid sees; this
 * is the reference a scenario author checks before writing `zone: 'deep left'`.
 *
 * Ball zones and play zones are drawn as two separate maps because several of
 * them sit close together on purpose — "backup second" is a few strides behind
 * second base — and a single map cannot label both without them colliding.
 */
export function ZoneMap({ kind }: { kind: 'ball' | 'play' }) {
  const zones = Object.entries(kind === 'ball' ? BALL_ZONES : PLAY_ZONES)
  const label = kind === 'ball' ? 'Zones a ball can be hit to.' : 'Spots a player is sent to.'

  return (
    <svg className="zonemap" viewBox={`0 0 ${VIEW.w} ${VIEW.h}`} role="img" aria-label={label}>
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
      {zones.map(([name, p]) => (
        <g key={name} className={kind === 'ball' ? 'zm-zone' : 'zm-zone zm-zone--play'}>
          <circle cx={p.x} cy={p.y} r={3} className="zm-dot" />
          <text x={p.x} y={p.y - 7} className="zm-text">
            {name}
          </text>
        </g>
      ))}
    </svg>
  )
}
