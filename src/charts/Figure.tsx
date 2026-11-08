import { Suspense, useId, useState, type ReactNode } from 'react'

interface FigureProps {
  caption: string
  chart: ReactNode
  /** The table of exact numbers the chart plots. */
  children: ReactNode
}

/**
 * One quadrant of the results: a caption, a chart, and a "Show numbers" toggle that swaps the
 * chart for the table of exact numbers behind it. The table stays in the DOM for screen readers.
 */
export function Figure({ caption, chart, children }: FigureProps) {
  const captionId = useId()
  const [showNumbers, setShowNumbers] = useState(false)
  return (
    <figure aria-labelledby={captionId} className="flex min-h-0 min-w-0 flex-col p-4">
      <div className="flex items-start justify-between gap-4">
        <figcaption id={captionId}>{caption}</figcaption>
        <button
          type="button"
          aria-pressed={showNumbers}
          onClick={() => setShowNumbers((shown) => !shown)}
          className="shrink-0 border border-ink px-2 py-0.5 text-sm whitespace-nowrap aria-pressed:bg-ink aria-pressed:text-paper"
        >
          Show numbers
        </button>
      </div>
      {/* Hidden from assistive technology: the table carries the same numbers. */}
      {!showNumbers && (
        <div aria-hidden="true" className="mt-2 h-72 lg:h-auto lg:min-h-0 lg:flex-1">
          <Suspense fallback={null}>{chart}</Suspense>
        </div>
      )}
      {/* Shown, a long table scrolls inside the quadrant; tabIndex lets keyboard users scroll it. */}
      <div
        tabIndex={showNumbers ? 0 : undefined}
        role={showNumbers ? 'group' : undefined}
        aria-labelledby={showNumbers ? captionId : undefined}
        className={
          showNumbers ? 'mt-2 min-h-0 flex-1 overflow-auto text-sm max-lg:max-h-96' : 'sr-only'
        }
      >
        {children}
      </div>
    </figure>
  )
}
