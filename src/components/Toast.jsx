import './Toast.css'

const ICONES = {
  sucesso: '✓',
  erro: '!',
  info: 'i',
}

export default function ToastContainer({ toasts, onFechar }) {
  if (toasts.length === 0) return null

  return (
    <div className="toast-container" role="status" aria-live="polite">
      {toasts.map(toast => (
        <div key={toast.id} className={`toast toast--${toast.tipo}`}>
          <span className="toast__icone" aria-hidden="true">{ICONES[toast.tipo] || ICONES.info}</span>
          <span className="toast__texto">{toast.mensagem}</span>
          <button className="toast__fechar" aria-label="Fechar notificação" onClick={() => onFechar(toast.id)}>
            ×
          </button>
        </div>
      ))}
    </div>
  )
}
