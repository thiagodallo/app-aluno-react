import { createContext, useContext, useState } from 'react'

const UsuarioContext = createContext(null)

export function UsuarioProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const salvo = localStorage.getItem('usuario')
    if (!salvo) return null
    try {
      return JSON.parse(salvo)
    } catch {
      return null
    }
  })

  function fazerLogin(dados) {
    setUsuario(dados)
    localStorage.setItem('usuario', JSON.stringify(dados))
  }

  function fazerLogout() {
    setUsuario(null)
    localStorage.removeItem('usuario')
  }

  return (
    <UsuarioContext.Provider value={{ usuario, fazerLogin, fazerLogout }}>
      {children}
    </UsuarioContext.Provider>
  )
}

export function useUsuario() {
  return useContext(UsuarioContext)
}
