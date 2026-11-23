import { useEffect, useId, useRef, useState } from 'react'
import { formatMoney, formatCompact, formatDay } from './format'

type Point = { date: string; revenue: number; orders: number }

const HEIGHT = 200
const PAD_TOP = 16
const PAD_BOTTOM = 6

function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [width, setWidth] = useState(0)
  useEffect(() => {
    if (!ref.current) return
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width))
    ro.observe(ref.current)
    return () => ro.disconnect()
  }, [])
  return [ref, width] as const
}

/** Redondea el máximo a un número "lindo" para la grilla (1, 2, 2.5, 5 × 10^n). */
function niceMax(v: number) {
  if (v <= 0) return 1
  const exp = Math.pow(10, Math.floor(Math.log10(v)))
  const f = v / exp
  const nice = f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10
  return nice * exp
}

export default function RevenueChart({ data }: { data: Point[] }) {
  const [wrapRef, width] = useWidth<HTMLDivElement>()
  const [active, setActive] = useState<number | null>(null)
  const gradId = useId()
  const n = data.length
  const max = niceMax(Math.max(...data.map((d) => d.revenue)))

  const x = (i: number) => (n <= 1 ? 0 : (i / (n - 1)) * width)
  const y = (v: number) => PAD_TOP + (1 - v / max) * (HEIGHT - PAD_TOP - PAD_BOTTOM)

  const line = data.map((d, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(d.revenue).toFixed(1)}`).join('')
  const area = `${line}L${width},${HEIGHT}L0,${HEIGHT}Z`

  const pick = (clientX: number, rect: DOMRect) => {
    const i = Math.round(((clientX - rect.left) / rect.width) * (n - 1))
    setActive(Math.max(0, Math.min(n - 1, i)))
  }

  const onKey = (e: React.KeyboardEvent) => {
    const cur = active ?? n - 1
    const next =
      e.key === 'ArrowLeft' ? cur - 1 :
      e.key === 'ArrowRight' ? cur + 1 :
      e.key === 'Home' ? 0 :
      e.key === 'End' ? n - 1 : null
    if (next === null) return
    e.preventDefault()
    setActive(Math.max(0, Math.min(n - 1, next)))
  }

  const point = active !== null ? data[active] : null
  const tipLeft = active !== null ? Math.max(72, Math.min(width - 72, x(active))) : 0

  return (
    <div>
      <div
        ref={wrapRef}
        className="relative rounded-md outline-none focus-visible:ring-2"
        style={{ height: HEIGHT, ['--tw-ring-color' as string]: 'var(--a-accent)' }}
        tabIndex={0}
        role="img"
        aria-label={`Gráfico de ingresos diarios de los últimos ${n} días. Usá las flechas para recorrer los días.`}
        onKeyDown={onKey}
        onFocus={() => active === null && setActive(n - 1)}
        onBlur={() => setActive(null)}
        onPointerMove={(e) => pick(e.clientX, e.currentTarget.getBoundingClientRect())}
        onPointerLeave={() => setActive(null)}
      >
        {width > 0 && (
          <svg width={width} height={HEIGHT} className="block overflow-visible" aria-hidden>
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--a-accent)" stopOpacity="0.18" />
                <stop offset="100%" stopColor="var(--a-accent)" stopOpacity="0" />
              </linearGradient>
            </defs>

            {[1, 0.66, 0.33].map((t) => (
              <line
                key={t}
                x1={0}
                x2={width}
                y1={y(max * t)}
                y2={y(max * t)}
                stroke="var(--a-border)"
                strokeOpacity={0.7}
                strokeDasharray="3 4"
              />
            ))}
            <text x={2} y={y(max) - 6} fontSize="10" fill="var(--a-text-3)" className="num">
              {formatCompact(max)}
            </text>
            <text x={2} y={y(max * 0.33) - 6} fontSize="10" fill="var(--a-text-3)" className="num">
              {formatCompact(max * 0.33)}
            </text>
            <line x1={0} x2={width} y1={HEIGHT - PAD_BOTTOM} y2={HEIGHT - PAD_BOTTOM} stroke="var(--a-border)" />

            <path d={area} fill={`url(#${gradId})`} className="chart-area" />
            <path
              d={line}
              fill="none"
              stroke="var(--a-accent)"
              strokeWidth={2}
              strokeLinejoin="round"
              strokeLinecap="round"
              pathLength={1}
              className="chart-line"
            />

            {active !== null && (
              <g>
                <line x1={x(active)} x2={x(active)} y1={PAD_TOP - 6} y2={HEIGHT - PAD_BOTTOM} stroke="var(--a-border-strong)" strokeWidth={1} />
                <circle cx={x(active)} cy={y(data[active].revenue)} r={4} fill="var(--a-surface)" stroke="var(--a-accent)" strokeWidth={2} />
              </g>
            )}
          </svg>
        )}

        {point && (
          <div
            className="pointer-events-none absolute -top-2 -translate-x-1/2 -translate-y-full rounded-md px-2.5 py-1.5 text-[12px] whitespace-nowrap"
            style={{ left: tipLeft, background: 'var(--a-text)', color: 'var(--a-surface)' }}
          >
            <div style={{ opacity: 0.65 }}>{formatDay(point.date, true)}</div>
            <div className="num mt-0.5 text-[13px] font-semibold">{formatMoney(point.revenue)}</div>
            <div style={{ opacity: 0.65 }}>
              {point.orders} {point.orders === 1 ? 'orden' : 'órdenes'}
            </div>
          </div>
        )}
      </div>

      <div className="mt-2 flex justify-between text-[11px] num" style={{ color: 'var(--a-text-3)' }} aria-hidden>
        <span>{formatDay(data[0].date)}</span>
        <span>{formatDay(data[Math.floor(n / 2)].date)}</span>
        <span>Hoy</span>
      </div>

      <p className="sr-only" aria-live="polite">
        {point ? `${formatDay(point.date, true)}: ${formatMoney(point.revenue)}, ${point.orders} órdenes` : ''}
      </p>
    </div>
  )
}
