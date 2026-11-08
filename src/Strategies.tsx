import { listStrategies } from './engine'

const strategies = listStrategies()

export default function Strategies() {
  return (
    <>
      <p className="mt-4">
        A strategy decides each move from the history of the current match alone. It does not know
        how many rounds remain or which strategy it faces.
      </p>
      <dl className="mt-4">
        {strategies.map(({ id, name, origin, description }) => (
          <div key={id} className="mt-4">
            <dt className="font-bold">{name}</dt>
            <dd className="pl-6">{description}</dd>
            <dd className="pl-6">Origin: {origin}</dd>
          </div>
        ))}
      </dl>
    </>
  )
}
