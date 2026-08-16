import { createContext, useContext, useState } from 'react'

const UsuarioContext = createContext(null)

export function UsuarioProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const salvo = localStorage.getItem('usuario')
    return salvo ? JSON.parse(salvo) : null
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
