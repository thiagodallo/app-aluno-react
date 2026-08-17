import './Toggle.css'

export default function Toggle({ ligado, onChange }) {
  return (
    <button
      type="button"
      className={`toggle ${ligado ? 'toggle--on' : ''}`}
      onClick={onChange}
      aria-pressed={ligado}
    >
      <span className="toggle__bola" />
    </button>
  )
}
