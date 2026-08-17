import { createContext, useCallback, useContext, useState } from 'react'
import ToastContainer from '../components/Toast'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const remover = useCallback(id => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const notificar = useCallback((mensagem, tipo = 'info') => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, mensagem, tipo }])
    setTimeout(() => remover(id), 3500)
  }, [remover])

  return (
    <ToastContext.Provider value={{ notificar }}>
      {children}
      <ToastContainer toasts={toasts} onFechar={remover} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
