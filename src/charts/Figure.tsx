import { useId, type ReactNode } from 'react'

interface FigureProps {
  caption: string
  /** Chart height in px. Responsive Nivo charts render nothing inside a parent without a definite height. */
  height: number
  chart: ReactNode
  /** The table of exact numbers the chart plots. */
  children: ReactNode
}

/** A chart with its caption and a table of the exact numbers behind it. */
export function Figure({ caption, height, chart, children }: FigureProps) {
  const captionId = useId()
  return (
    <figure aria-labelledby={captionId} className="mt-8">
      <figcaption id={captionId}>{caption}</figcaption>
      {/* Hidden from assistive technology: the table below carries the same numbers. */}
      <div aria-hidden="true" style={{ height }}>
        {chart}
      </div>
      <div className="overflow-x-auto">{children}</div>
    </figure>
  )
}
