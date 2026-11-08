import { useEffect, useRef, useSyncExternalStore, type MouseEvent } from 'react'
import Learn from './Learn.tsx'
import Play from './Play.tsx'
import Tournament from './Tournament.tsx'

const SITE_TITLE = 'Iterated Prisoner’s Dilemma'

const screens = [
  { id: 'learn', name: 'Learn', heading: 'How the game works' },
  { id: 'tournament', name: 'Tournament', heading: 'Run a tournament' },
  { id: 'play', name: 'Play', heading: 'Play a match' },
] as const

type ScreenId = (typeof screens)[number]['id']

/** The screen named by the URL hash; Learn when the hash is empty or unknown. */
function screenFromHash(hash: string): ScreenId {
  return screens.find(({ id }) => `#${id}` === hash)?.id ?? 'learn'
}

function subscribeToHash(onChange: () => void) {
  window.addEventListener('hashchange', onChange)
  return () => window.removeEventListener('hashchange', onChange)
}

const readHash = () => location.hash

export default function App() {
  const current = screenFromHash(useSyncExternalStore(subscribeToHash, readHash))
  const headings = useRef(new Map<ScreenId, HTMLHeadingElement>())
  // Focus moves only when the screen changes, not on first load (and not on StrictMode's re-run).
  const focused = useRef(current)

  useEffect(() => {
    const { name } = screens.find(({ id }) => id === current)!
    document.title = `${name} – ${SITE_TITLE}`
    if (focused.current === current) return
    focused.current = current
    headings.current.get(current)?.focus()
  }, [current])

  // The URL hash selects the screen, so the skip link moves focus itself instead of navigating.
  function skipToContent(event: MouseEvent) {
    event.preventDefault()
    headings.current.get(current)?.focus()
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-page flex-col px-4 sm:px-8 lg:h-dvh">
      <a
        href="#content"
        onClick={skipToContent}
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:bg-paper focus:px-2 focus:py-1"
      >
        Skip to content
      </a>
      <header className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 border-b border-ink py-4">
        <h1 className="text-lg">{SITE_TITLE}</h1>
        <nav aria-label="Screens">
          <ul className="flex gap-6">
            {screens.map(({ id, name }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  aria-current={id === current ? 'page' : undefined}
                  className="inline-block py-0.5 text-muted aria-[current=page]:text-ink"
                >
                  {name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      {/* From laptop width the screen fits the window. If a short window cannot hold it, main
          scrolls rather than clipping; the side padding keeps focus rings inside that scroll box. */}
      <main
        id="content"
        className="flex flex-1 flex-col py-6 lg:-mx-2 lg:min-h-0 lg:overflow-y-auto lg:px-2"
      >
        {screens.map(({ id, heading }) => (
          <section
            key={id}
            hidden={id !== current}
            aria-labelledby={`${id}-heading`}
            className="flex flex-1 flex-col lg:min-h-0"
          >
            <h2
              id={`${id}-heading`}
              ref={(el) => {
                if (el) headings.current.set(id, el)
              }}
              tabIndex={-1}
              className="mb-4 self-start text-lg"
            >
              {heading}
            </h2>
            {id === 'learn' && <Learn />}
            {id === 'tournament' && <Tournament />}
            {id === 'play' && <Play active={current === 'play'} />}
          </section>
        ))}
      </main>
      <footer className="py-3 text-sm text-muted">
        Made by <a href="https://www.vishnuroshan.com/">Vishnu Roshan</a>
      </footer>
    </div>
  )
}
