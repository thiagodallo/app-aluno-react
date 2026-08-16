import { useState, useRef, useEffect } from 'react'
import { useUsuario } from '../context/UsuarioContext'
import { buscarRespostaTutor } from '../services/apiService'
import './TutorIAPage.css'

function AvatarTutor() {
  const raios = Array.from({ length: 12 })
  return (
    <div className="msg__avatar msg__avatar--tutor">
      <svg viewBox="0 0 32 32" width="20" height="20" aria-hidden="true">
        {raios.map((_, i) => (
          <rect
            key={i}
            x="15"
            y="4"
            width="2"
            height="9"
            rx="1"
            fill="currentColor"
            transform={`rotate(${i * 30} 16 16)`}
          />
        ))}
      </svg>
    </div>
  )
}

function AcoesMensagem({ texto, curtida, onOuvir, onCopiar, onRefazer, onCurtida }) {
  return (
    <div className="msg__acoes">
      <button aria-label="Ouvir" onClick={onOuvir}>
        <svg viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M4 8v4h3l4 3V5L7 8H4Z" strokeLinejoin="round" />
          <path d="M14 8a3 3 0 0 1 0 4" strokeLinecap="round" />
        </svg>
      </button>
      <button aria-label="Copiar" onClick={onCopiar}>
        <svg viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="7" y="7" width="9" height="9" rx="1.5" />
          <path d="M13 7V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h2" />
        </svg>
      </button>
      <button aria-label="Refazer" onClick={onRefazer}>
        <svg viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M15 6a6 6 0 1 0 1.5 4" strokeLinecap="round" />
          <path d="M16 3v3h-3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button aria-label="Não gostei" aria-pressed={curtida === 'negativa'} onClick={onCurtida}>
        <svg viewBox="0 0 20 20" width="15" height="15" fill={curtida === 'negativa' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
          <path d="M13 4v8M6 4h5v8l-3 4a1.5 1.5 0 0 1-1.4-2l.6-2H4a1.5 1.5 0 0 1-1.4-2l1-4A1.5 1.5 0 0 1 5 4h1Z" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  )
}

export default function TutorIAPage() {
  const { usuario } = useUsuario()
  const [mensagens, setMensagens] = useState([
    {
      id: 1,
      autor: 'tutor',
      texto: 'Olá! Sou o Tutor IA. Pergunte qualquer coisa sobre suas disciplinas e eu te ajudo.',
      inicial: true,
    },
  ])
  const [pergunta, setPergunta] = useState('')
  const [carregando, setCarregando] = useState(false)
  const fimRef = useRef(null)

  useEffect(() => {
    fimRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [mensagens, carregando])

  async function enviar(e) {
    e.preventDefault()
    const texto = pergunta.trim()
    if (!texto || carregando) return

    setMensagens(prev => [...prev, { id: Date.now(), autor: 'user', texto }])
    setPergunta('')
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
    }
  }

  function ouvir(texto) {
    if (!('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const fala = new SpeechSynthesisUtterance(texto)
    fala.lang = 'pt-BR'
    window.speechSynthesis.speak(fala)
  }

  function copiar(texto) {
    navigator.clipboard?.writeText(texto)
  }

  function curtir(id) {
    setMensagens(prev => prev.map(m =>
      m.id === id ? { ...m, curtida: m.curtida === 'negativa' ? null : 'negativa' } : m
    ))
  }

  async function refazer(id) {
    setCarregando(true)
    try {
      const resposta = await buscarRespostaTutor()
      setMensagens(prev => prev.map(m => (m.id === id ? { ...m, texto: resposta } : m)))
    } catch {
      setMensagens(prev => prev.map(m =>
        m.id === id ? { ...m, texto: 'Desculpe, não consegui responder agora. Tente novamente.' } : m
      ))
    } finally {
      setCarregando(false)
    }
  }

  const nomeUsuario = usuario?.nome || 'Aluno'
  const inicialUsuario = nomeUsuario[0].toUpperCase()

  return (
    <div className="chat">
      <div className="chat__mensagens">
        {mensagens.map(m => (
          <div className="msg" key={m.id}>
            {m.autor === 'tutor'
              ? <AvatarTutor />
              : <div className="msg__avatar msg__avatar--user">{inicialUsuario}</div>}

            <div className="msg__corpo">
              <span className="msg__autor">{m.autor === 'tutor' ? 'Tutor IA' : nomeUsuario}</span>
              <p className="msg__texto">{m.texto}</p>
              {m.autor === 'tutor' && !m.inicial && (
                <AcoesMensagem
                  texto={m.texto}
                  curtida={m.curtida}
                  onOuvir={() => ouvir(m.texto)}
                  onCopiar={() => copiar(m.texto)}
                  onRefazer={() => refazer(m.id)}
                  onCurtida={() => curtir(m.id)}
                />
              )}
            </div>
          </div>
        ))}

        {carregando && (
          <div className="msg">
            <AvatarTutor />
            <div className="msg__corpo">
              <span className="msg__autor">Tutor IA</span>
              <div className="msg__digitando">
                <span /><span /><span />
              </div>
            </div>
          </div>
        )}

        <div ref={fimRef} />
      </div>

      <form className="chat__input" onSubmit={enviar}>
        <label htmlFor="pergunta-tutor" className="sr-only">Pergunte alguma coisa ao Tutor IA</label>
        <input
          id="pergunta-tutor"
          type="text"
          placeholder="Pergunte alguma coisa"
          value={pergunta}
          onChange={e => setPergunta(e.target.value)}
        />
        <button type="submit" className="chat__enviar" disabled={!pergunta.trim() || carregando} aria-label="Enviar">
          <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10 16V5M5 10l5-5 5 5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </form>

      <p className="chat__aviso">
        O Tutor pode cometer erros. Considere verificar informações importantes.
      </p>
    </div>
  )
}
