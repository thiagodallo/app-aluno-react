import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { buscarRespostaTutor } from '../services/apiService'

const TutorIaContext = createContext(null)

const ROTA_TUTOR = '/app/tutor-ia'

const MENSAGEM_INICIAL = {
  id: 1,
  autor: 'tutor',
  texto: 'Olá! Sou o Tutor IA. Pergunte qualquer coisa sobre suas disciplinas e eu te ajudo.',
  inicial: true,
}

export function TutorIaProvider({ children }) {
  const [mensagens, setMensagens] = useState([MENSAGEM_INICIAL])
  const [carregando, setCarregando] = useState(false)
  const [refazendoId, setRefazendoId] = useState(null)
  const [naoLida, setNaoLida] = useState(false)

  const location = useLocation()
  const pathnameRef = useRef(location.pathname)

  useEffect(() => {
    pathnameRef.current = location.pathname
    if (location.pathname === ROTA_TUTOR) setNaoLida(false)
  }, [location.pathname])

  function avisarSeAusente() {
    if (pathnameRef.current !== ROTA_TUTOR) setNaoLida(true)
  }

  async function perguntar(texto) {
    setMensagens(prev => [...prev, { id: Date.now(), autor: 'user', texto }])
    setCarregando(true)
    try {
      const resposta = await buscarRespostaTutor()
      setMensagens(prev => [...prev, { id: Date.now() + 1, autor: 'tutor', texto: resposta }])
    } catch {
      setMensagens(prev => [
        ...prev,
        { id: Date.now() + 1, autor: 'tutor', texto: 'Desculpe, não consegui responder agora. Tente novamente.' },
      ])
    } finally {
      setCarregando(false)
      avisarSeAusente()
    }
  }

  async function refazer(id) {
    setRefazendoId(id)
    try {
      const resposta = await buscarRespostaTutor()
      setMensagens(prev => prev.map(m => (m.id === id ? { ...m, texto: resposta } : m)))
    } catch {
      setMensagens(prev => prev.map(m =>
        m.id === id ? { ...m, texto: 'Desculpe, não consegui responder agora. Tente novamente.' } : m
      ))
    } finally {
      setRefazendoId(null)
      avisarSeAusente()
    }
  }

  function curtir(id) {
    setMensagens(prev => prev.map(m =>
      m.id === id ? { ...m, curtida: m.curtida === 'negativa' ? null : 'negativa' } : m
    ))
  }

  return (
    <TutorIaContext.Provider value={{ mensagens, carregando, refazendoId, naoLida, perguntar, refazer, curtir }}>
      {children}
    </TutorIaContext.Provider>
  )
}

export function useTutorIa() {
  return useContext(TutorIaContext)
}
