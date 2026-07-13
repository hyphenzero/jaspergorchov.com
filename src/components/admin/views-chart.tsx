'use client'

import { getPageViewsTimeSeriesAction } from '@/actions/analytics'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/16/solid'
import { clsx } from 'clsx'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

type TimeRange = 'all' | 'year' | 'month' | 'week' | 'day'

interface Bucket {
  date: string
  count: number
}

interface Props {
  totalViews: number
}

function startOfDay(d: Date) {
  let r = new Date(d)
  r.setHours(0, 0, 0, 0)
  return r
}

function startOfWeek(d: Date) {
  let r = new Date(d)
  let day = r.getDay()
  let diff = day === 0 ? -6 : 1 - day
  r.setDate(r.getDate() + diff)
  r.setHours(0, 0, 0, 0)
  return r
}

function startOfMonth(d: Date) {
  let r = new Date(d)
  r.setDate(1)
  r.setHours(0, 0, 0, 0)
  return r
}

function startOfYear(d: Date) {
  return new Date(d.getFullYear(), 0, 1)
}

function addDays(d: Date, n: number) {
  let r = new Date(d)
  r.setDate(r.getDate() + n)
  return r
}

function addMonths(d: Date, n: number) {
  let r = new Date(d)
  r.setMonth(r.getMonth() + n)
  return r
}

function addYears(d: Date, n: number) {
  let r = new Date(d)
  r.setFullYear(r.getFullYear() + n)
  return r
}

function fmtDate(d: Date) {
  return d.toISOString().split('T')[0]
}

function monthName(d: Date) {
  return d.toLocaleString('en-US', { month: 'short' })
}

function fillBuckets(from: Date, to: Date, data: Bucket[]): Bucket[] {
  let map = new Map(data.map((b) => [b.date, b.count]))
  let result: Bucket[] = []
  let cur = new Date(from)
  while (cur < to) {
    let key = fmtDate(cur)
    result.push({ date: key, count: map.get(key) ?? 0 })
    cur = addDays(cur, 1)
  }
  return result
}

function getDateRange(
  range: TimeRange,
  ref: Date
): { from: Date; to: Date; periods: string[]; currentPeriod: string; periodIndex: number } {
  let now = startOfDay(new Date())

  switch (range) {
    case 'all': {
      return {
        from: startOfYear(now),
        to: addDays(now, 1),
        periods: [],
        currentPeriod: '',
        periodIndex: 0,
      }
    }
    case 'year': {
      let from = startOfYear(ref)
      let to = addDays(startOfYear(addYears(ref, 1)), -1)
      let years = Array.from({ length: 10 }, (_, i) => String(now.getFullYear() - 9 + i))
      return {
        from,
        to: addDays(to, 1),
        periods: years,
        currentPeriod: String(ref.getFullYear()),
        periodIndex: years.indexOf(String(ref.getFullYear())),
      }
    }
    case 'month': {
      let from = startOfMonth(ref)
      let to = addDays(startOfMonth(addMonths(ref, 1)), -1)
      let months = Array.from({ length: 12 }, (_, i) => {
        let d = new Date(ref.getFullYear(), i, 1)
        return d.toLocaleString('en-US', { month: 'long' })
      })
      return {
        from,
        to: addDays(to, 1),
        periods: months,
        currentPeriod: months[ref.getMonth()],
        periodIndex: ref.getMonth(),
      }
    }
    case 'week': {
      let from = startOfWeek(ref)
      let to = addDays(from, 7)
      let periods = Array.from({ length: 4 }, (_, i) => {
        let weekStart = addDays(from, i * 7)
        let weekEnd = addDays(weekStart, 6)
        return `${monthName(weekStart)} ${weekStart.getDate()} – ${monthName(weekEnd)} ${weekEnd.getDate()}`
      })
      let weekStart = startOfWeek(ref)
      let weekEnd = addDays(weekStart, 6)
      let currentPeriod = `${monthName(weekStart)} ${weekStart.getDate()} – ${monthName(weekEnd)} ${weekEnd.getDate()}`
      return {
        from,
        to,
        periods,
        currentPeriod,
        periodIndex: Math.min(3, Math.floor((ref.getTime() - from.getTime()) / (7 * 86400000))),
      }
    }
    case 'day': {
      return {
        from: startOfDay(ref),
        to: addDays(startOfDay(ref), 1),
        periods: [],
        currentPeriod: ref.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        periodIndex: 0,
      }
    }
  }
}

const RANGE_OPTIONS: { value: TimeRange; label: string }[] = [
  { value: 'all', label: 'All time' },
  { value: 'year', label: 'Year' },
  { value: 'month', label: 'Month' },
  { value: 'week', label: 'Week' },
  { value: 'day', label: 'Day' },
]

export function ViewsChart({ totalViews }: Props) {
  let [range, setRange] = useState<TimeRange>('all')
  let [ref, setRef] = useState(() => new Date())
  let [data, setData] = useState<Bucket[]>([])
  let [loading, setLoading] = useState(false)

  let { from, to, periods, currentPeriod, periodIndex } = useMemo(() => getDateRange(range, ref), [range, ref])

  useEffect(() => {
    setLoading(true)
    let cancelled = false
    getPageViewsTimeSeriesAction(fmtDate(from), fmtDate(to))
      .then((result) => {
        if (!cancelled) setData(result.data ?? [])
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [from, to])

  let filled = useMemo(() => fillBuckets(from, to, data), [from, to, data])

  let cappedTo = useMemo(() => {
    let today = startOfDay(new Date())
    if (to.getTime() <= today.getTime()) return to
    for (let i = filled.length - 1; i >= 0; i--) {
      if (filled[i].count > 0) {
        return addDays(new Date(filled[i].date), 1)
      }
    }
    return today
  }, [filled, to])

  let cappedFilled = useMemo(() => {
    if (cappedTo.getTime() >= to.getTime()) return filled
    return filled.filter((b) => new Date(b.date).getTime() < cappedTo.getTime())
  }, [filled, cappedTo, to])

  let handleRangeChange = useCallback((newRange: TimeRange) => {
    setRange(newRange)
    setRef(new Date())
  }, [])

  let navigatePeriod = useCallback(
    (dir: -1 | 1) => {
      setRef((prev) => {
        if (range === 'year') return addYears(prev, dir)
        if (range === 'month') return addMonths(prev, dir)
        if (range === 'week') return addDays(prev, dir * 7)
        if (range === 'day') return addDays(prev, dir)
        return prev
      })
    },
    [range]
  )

  let canNavigate = range !== 'all'

  function formatDateTick(dateStr: string) {
    let d = new Date(dateStr + 'T00:00:00')
    let spanDays = (cappedTo.getTime() - from.getTime()) / 86400000

    if (spanDays <= 1) return `${d.getHours()}:00`
    if (spanDays <= 7) return d.toLocaleString('en-US', { weekday: 'short', day: 'numeric' })
    if (spanDays <= 60) return d.toLocaleString('en-US', { month: 'short', day: 'numeric' })
    if (spanDays <= 400) return d.toLocaleString('en-US', { month: 'short' })
    return String(d.getFullYear())
  }

  let canGoForward = useMemo(() => {
    let now = new Date()
    if (range === 'day') return startOfDay(ref).getTime() < startOfDay(now).getTime()
    if (range === 'week') return startOfWeek(ref).getTime() < startOfWeek(now).getTime()
    if (range === 'month') return startOfMonth(ref).getTime() < startOfMonth(now).getTime()
    if (range === 'year') return startOfYear(ref).getTime() < startOfYear(now).getTime()
    return false
  }, [range, ref])

  return (
    <div className="">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {RANGE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleRangeChange(opt.value)}
              className={clsx(
                'rounded-full px-2.5 pt-0.75 pb-1 text-sm font-medium transition',
                range === opt.value
                  ? 'bg-zinc-200 text-zinc-950 dark:bg-zinc-700 dark:text-white'
                  : 'text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
        {canNavigate && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigatePeriod(-1)}
              className="rounded-md p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
            >
              <ChevronLeftIcon className="size-4" />
            </button>
            <span className="min-w-35 text-center text-sm font-medium text-zinc-700 tabular-nums dark:text-zinc-300">
              {currentPeriod}
            </span>
            <button
              type="button"
              onClick={() => navigatePeriod(1)}
              disabled={!canGoForward}
              className="rounded-md p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 disabled:pointer-events-none disabled:opacity-30 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
            >
              <ChevronRightIcon className="size-4" />
            </button>
          </div>
        )}
      </div>

      <div className="mt-5">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-zinc-400 dark:text-zinc-500">Loading…</div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={cappedFilled} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="area-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgb(59 130 246)" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="rgb(59 130 246)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <CartesianGrid
                stroke="currentColor"
                className="text-zinc-100 dark:text-zinc-800"
                strokeWidth={1}
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tick={({ x, y, payload }) => (
                  <text
                    x={x}
                    y={Number(y) + 4}
                    textAnchor="middle"
                    className="fill-zinc-400 text-[11px] dark:fill-zinc-500"
                    fontFamily="var(--font-geist-mono, monospace)"
                  >
                    {formatDateTick(payload.value)}
                  </text>
                )}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={32}
                domain={[0, 'auto']}
                allowDecimals={false}
                tick={({ x, y, payload }) => (
                  <text
                    x={Number(x) - 8}
                    y={Number(y) + 4}
                    textAnchor="end"
                    className="fill-zinc-400 text-[11px] dark:fill-zinc-500"
                    fontFamily="var(--font-geist-mono, monospace)"
                  >
                    {payload.value}
                  </text>
                )}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null
                  return (
                    <div className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
                      <span className="text-zinc-500 dark:text-zinc-400">{label}</span>{' '}
                      <span className="font-medium text-zinc-900 dark:text-zinc-100">{payload[0].value} views</span>
                    </div>
                  )
                }}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="rgb(59 130 246)"
                strokeWidth={2}
                fill="url(#area-fill)"
                dot={false}
                activeDot={{ r: 4, fill: 'rgb(59 130 246)' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
