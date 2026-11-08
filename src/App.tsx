import type { ReactNode } from 'react'
import Introduction from './Introduction.tsx'
import Payoffs from './Payoffs.tsx'
import Play from './Play.tsx'
import Strategies from './Strategies.tsx'
import Tournament from './Tournament.tsx'

const sections: { id: string; title: string; content?: ReactNode }[] = [
  { id: 'introduction', title: 'Introduction', content: <Introduction /> },
  { id: 'payoffs', title: 'Payoffs', content: <Payoffs /> },
  { id: 'strategies', title: 'Strategies', content: <Strategies /> },
  { id: 'tournament', title: 'Tournament', content: <Tournament /> },
  { id: 'play', title: 'Play', content: <Play /> },
]

export default function App() {
  return (
    <main className="mx-auto max-w-text px-4 py-12 leading-relaxed">
      <h1 className="text-3xl">The Iterated Prisoner&rsquo;s Dilemma</h1>

      <nav aria-labelledby="contents" className="mt-8">
        <h2 id="contents" className="text-xl">
          Contents
        </h2>
        <ol className="mt-2 list-decimal pl-6">
          {sections.map(({ id, title }) => (
            <li key={id}>
              <a href={`#${id}`}>{title}</a>
            </li>
          ))}
        </ol>
      </nav>

      {sections.map(({ id, title, content }) => (
        <section key={id} id={id} className="mt-12">
          <h2 className="text-xl">{title}</h2>
          {content}
        </section>
      ))}
    </main>
  )
}
