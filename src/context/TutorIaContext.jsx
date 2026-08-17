import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { buscarRespostaTutor } from '../services/apiService'

const TutorIaContext = createContext(null)

const ROTA_TUTOR = '/app/tutor-ia'
const CHAVE_SESSAO = 'tutorIaConversas'
const LIMITE_TITULO = 32

const MENSAGEM_INICIAL = {
  id: 1,
  autor: 'tutor',
  texto: 'Olá! Sou o Tutor IA. Pergunte qualquer coisa sobre suas disciplinas e eu te ajudo.',
  inicial: true,
}

function criarConversa() {
  return {
    id: Date.now(),
    titulo: 'Nova conversa',
    mensagens: [MENSAGEM_INICIAL],
    criadaEm: Date.now(),
  }
}

function carregarSessao() {
  const salva = sessionStorage.getItem(CHAVE_SESSAO)
  if (!salva) return null
  try {
    const dados = JSON.parse(salva)
    if (Array.isArray(dados.conversas) && dados.conversas.length > 0) return dados
    return null
  } catch {
    return null
  }
}

function truncarTitulo(texto) {
  return texto.length > LIMITE_TITULO ? `${texto.slice(0, LIMITE_TITULO).trimEnd()}…` : texto
}

export function TutorIaProvider({ children }) {
  const [conversas, setConversas] = useState(() => carregarSessao()?.conversas ?? [criarConversa()])
  const [conversaAtivaId, setConversaAtivaId] = useState(() => carregarSessao()?.conversaAtivaId ?? conversas[0].id)
  const [carregandoId, setCarregandoId] = useState(null)
  const [refazendo, setRefazendo] = useState(null)
  const [naoLida, setNaoLida] = useState(false)

  const location = useLocation()
  const pathnameRef = useRef(location.pathname)

  useEffect(() => {
    pathnameRef.current = location.pathname
    if (location.pathname === ROTA_TUTOR) setNaoLida(false)
  }, [location.pathname])

  useEffect(() => {
    sessionStorage.setItem(CHAVE_SESSAO, JSON.stringify({ conversas, conversaAtivaId }))
  }, [conversas, conversaAtivaId])

  function avisarSeAusente() {
    if (pathnameRef.current !== ROTA_TUTOR) setNaoLida(true)
  }

  const conversaAtiva = conversas.find(c => c.id === conversaAtivaId) ?? conversas[0]

  function novaConversa() {
    const semPerguntas = conversaAtiva.mensagens.every(m => m.autor !== 'user')
    if (semPerguntas) return
    const conversa = criarConversa()
    setConversas(prev => [conversa, ...prev])
    setConversaAtivaId(conversa.id)
  }

  function selecionarConversa(id) {
    setConversaAtivaId(id)
  }

  async function perguntar(texto) {
    const idAlvo = conversaAtivaId
    setConversas(prev => prev.map(c => (
      c.id === idAlvo
        ? {
          ...c,
          titulo: c.titulo === 'Nova conversa' ? truncarTitulo(texto) : c.titulo,
          mensagens: [...c.mensagens, { id: Date.now(), autor: 'user', texto }],
        }
        : c
    )))
    setCarregandoId(idAlvo)

    try {
      const resposta = await buscarRespostaTutor()
      setConversas(prev => prev.map(c => (
        c.id === idAlvo
          ? { ...c, mensagens: [...c.mensagens, { id: Date.now() + 1, autor: 'tutor', texto: resposta }] }
          : c
      )))
    } catch {
      setConversas(prev => prev.map(c => (
        c.id === idAlvo
          ? {
            ...c,
            mensagens: [...c.mensagens, {
              id: Date.now() + 1,
              autor: 'tutor',
              texto: 'Desculpe, não consegui responder agora. Tente novamente.',
            }],
          }
          : c
      )))
    } finally {
      setCarregandoId(null)
      avisarSeAusente()
    }
  }

  async function refazer(id) {
    const idAlvo = conversaAtivaId
    setRefazendo({ conversaId: idAlvo, mensagemId: id })

    try {
      const resposta = await buscarRespostaTutor()
      setConversas(prev => prev.map(c => (
        c.id === idAlvo
          ? { ...c, mensagens: c.mensagens.map(m => (m.id === id ? { ...m, texto: resposta } : m)) }
          : c
      )))
    } catch {
      setConversas(prev => prev.map(c => (
        c.id === idAlvo
          ? {
            ...c,
            mensagens: c.mensagens.map(m => (
              m.id === id ? { ...m, texto: 'Desculpe, não consegui responder agora. Tente novamente.' } : m
            )),
          }
          : c
      )))
    } finally {
      setRefazendo(null)
      avisarSeAusente()
    }
  }

  function curtir(id) {
    setConversas(prev => prev.map(c => (
      c.id === conversaAtivaId
        ? {
          ...c,
          mensagens: c.mensagens.map(m => (
            m.id === id ? { ...m, curtida: m.curtida === 'negativa' ? null : 'negativa' } : m
          )),
        }
        : c
    )))
  }

  return (
    <TutorIaContext.Provider
      value={{
        conversas,
        conversaAtiva,
        carregando: carregandoId === conversaAtivaId,
        refazendoId: refazendo?.conversaId === conversaAtivaId ? refazendo.mensagemId : null,
        naoLida,
        novaConversa,
        selecionarConversa,
        perguntar,
        refazer,
        curtir,
      }}
    >
      {children}
    </TutorIaContext.Provider>
  )
}

export function useTutorIa() {
  return useContext(TutorIaContext)
}
