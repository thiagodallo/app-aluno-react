import './Sparkline.css'

export default function Sparkline({ valores }) {
  const max = Math.max(...valores, 1)

  return (
    <div className="sparkline" aria-hidden="true">
      {valores.map((valor, i) => (
        <div
          key={i}
          className={`sparkline__barra ${i === valores.length - 1 ? 'sparkline__barra--hoje' : ''}`}
          style={{ height: `${Math.max((valor / max) * 100, 8)}%` }}
        />
      ))}
    </div>
  )
}
