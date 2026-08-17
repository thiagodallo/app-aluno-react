import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import './ConfirmModal.css'

export default function ConfirmModal({
  aberto,
  titulo,
  mensagem,
  textoConfirmar = 'Confirmar',
  textoCancelar = 'Cancelar',
  perigo = false,
  onConfirmar,
  onCancelar,
}) {
  const botaoConfirmarRef = useRef(null)
  const elementoAnteriorRef = useRef(null)

  useEffect(() => {
    if (!aberto) return

    elementoAnteriorRef.current = document.activeElement
    botaoConfirmarRef.current?.focus()

    function aoTeclar(e) {
      if (e.key === 'Escape') onCancelar()
    }

    document.addEventListener('keydown', aoTeclar)
    return () => {
      document.removeEventListener('keydown', aoTeclar)
      elementoAnteriorRef.current?.focus?.()
    }
  }, [aberto, onCancelar])

  if (!aberto) return null

  return createPortal(
    <div className="modal-overlay" onClick={onCancelar}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-titulo"
        aria-describedby="modal-mensagem"
        onClick={e => e.stopPropagation()}
      >
        <h2 id="modal-titulo" className="modal__titulo">{titulo}</h2>
        <p id="modal-mensagem" className="modal__mensagem">{mensagem}</p>
        <div className="modal__acoes">
          <button className="btn btn--outline" onClick={onCancelar}>{textoCancelar}</button>
          <button
            ref={botaoConfirmarRef}
            className={`btn ${perigo ? 'btn--danger' : 'btn--primary'}`}
            onClick={onConfirmar}
          >
            {textoConfirmar}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
