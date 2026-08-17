import { useState, useRef, useEffect } from 'react'
import { useUsuario } from '../context/UsuarioContext'
import { useToast } from '../context/ToastContext'
import { useTutorIa } from '../context/TutorIaContext'
import './TutorIAPage.css'

const ROTACOES_AVATAR = [0, 18, -18, 32, -32]

function corAvatar(nome) {
  let hash = 0
  for (let i = 0; i < nome.length; i++) hash = nome.charCodeAt(i) + ((hash << 5) - hash)
  const rotacao = ROTACOES_AVATAR[Math.abs(hash) % ROTACOES_AVATAR.length]
  return { filter: `hue-rotate(${rotacao}deg)` }
}

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

function AcoesMensagem({ curtida, onOuvir, onCopiar, onRefazer, onCurtida }) {
  const [copiado, setCopiado] = useState(false)

  function aoCopiar() {
    onCopiar()
    setCopiado(true)
    setTimeout(() => setCopiado(false), 1500)
  }

  return (
    <div className="msg__acoes">
      <button aria-label="Ouvir" data-tooltip="Ouvir" onClick={onOuvir}>
        <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M4 8v4h3l4 3V5L7 8H4Z" strokeLinejoin="round" />
          <path d="M14 8a3 3 0 0 1 0 4" strokeLinecap="round" />
        </svg>
      </button>
      <button aria-label={copiado ? 'Copiado' : 'Copiar'} data-tooltip={copiado ? 'Copiado!' : 'Copiar'} onClick={aoCopiar}>
        {copiado ? (
          <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M4 10l4 4 8-8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="7" y="7" width="9" height="9" rx="1.5" />
            <path d="M13 7V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h2" />
          </svg>
        )}
      </button>
      <button aria-label="Refazer" data-tooltip="Refazer" onClick={onRefazer}>
        <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M15 6a6 6 0 1 0 1.5 4" strokeLinecap="round" />
          <path d="M16 3v3h-3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button
        aria-label="Não gostei"
        data-tooltip="Não gostei"
        aria-pressed={curtida === 'negativa'}
        onClick={onCurtida}
      >
        <svg viewBox="0 0 20 20" width="18" height="18" fill={curtida === 'negativa' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
          <path d="M13 4v8M6 4h5v8l-3 4a1.5 1.5 0 0 1-1.4-2l.6-2H4a1.5 1.5 0 0 1-1.4-2l1-4A1.5 1.5 0 0 1 5 4h1Z" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  )
}

export default function TutorIAPage() {
  const { usuario } = useUsuario()
  const { notificar } = useToast()
  const {
    conversas,
    conversaAtiva,
    carregando,
    refazendoId,
    novaConversa,
    selecionarConversa,
    perguntar,
    refazer,
    curtir,
  } = useTutorIa()
  const [pergunta, setPergunta] = useState(() => sessionStorage.getItem('tutorIaRascunho') || '')
  const fimRef = useRef(null)
  const inputRef = useRef(null)
  const mensagens = conversaAtiva.mensagens

  useEffect(() => {
    const reduzirMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    fimRef.current?.scrollIntoView({ behavior: reduzirMovimento ? 'auto' : 'smooth' })
  }, [mensagens, carregando])

  useEffect(() => {
    sessionStorage.setItem('tutorIaRascunho', pergunta)
  }, [pergunta])

  useEffect(() => {
    function aoTeclar(e) {
      if (e.key !== '/' && e.code !== 'Slash') return
      const digitando = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA'
      if (digitando) return
      e.preventDefault()
      inputRef.current?.focus()
    }
    document.addEventListener('keydown', aoTeclar)
    return () => document.removeEventListener('keydown', aoTeclar)
  }, [])

  const ocupado = carregando || refazendoId !== null

  async function enviar(e) {
    e.preventDefault()
    const texto = pergunta.trim()
    if (!texto || ocupado) return

    setPergunta('')
    await perguntar(texto)
  }

  function ouvir(texto) {
    if (!('speechSynthesis' in window)) {
      notificar('Seu navegador não suporta leitura em voz alta.', 'erro')
      return
    }
    window.speechSynthesis.cancel()
    const fala = new SpeechSynthesisUtterance(texto)
    fala.lang = 'pt-BR'
    window.speechSynthesis.speak(fala)
  }

  function copiar(texto) {
    navigator.clipboard?.writeText(texto)
    notificar('Resposta copiada.', 'sucesso')
  }

  const nomeUsuario = usuario?.nome || 'Aluno'
  const inicialUsuario = nomeUsuario[0].toUpperCase()

  return (
    <div className="chat-layout">
      <aside className="chat-sidebar">
        <button type="button" className="chat-sidebar__nova" onClick={novaConversa}>
          <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10 4v12M4 10h12" strokeLinecap="round" />
          </svg>
          Nova conversa
        </button>
        <nav className="chat-sidebar__lista" aria-label="Conversas anteriores">
          {conversas.map(c => (
            <button
              key={c.id}
              type="button"
              className={`chat-sidebar__item ${c.id === conversaAtiva.id ? 'chat-sidebar__item--ativa' : ''}`}
              aria-current={c.id === conversaAtiva.id ? 'true' : undefined}
              onClick={() => selecionarConversa(c.id)}
            >
              {c.titulo}
            </button>
          ))}
        </nav>
      </aside>

      <div className="chat">
        <div className="chat__mensagens">
          {mensagens.map(m => (
            <div className="msg" key={m.id}>
              {m.autor === 'tutor'
                ? <AvatarTutor />
                : (
                  <div className="msg__avatar msg__avatar--user" style={corAvatar(nomeUsuario)}>
                    {inicialUsuario}
                  </div>
                )}

              <div className="msg__corpo">
                <span className="msg__autor">{m.autor === 'tutor' ? 'Tutor IA' : nomeUsuario}</span>
                {m.id === refazendoId ? (
                  <div className="msg__digitando">
                    <span /><span /><span />
                  </div>
                ) : (
                  <p className="msg__texto">{m.texto}</p>
                )}
                {m.autor === 'tutor' && !m.inicial && m.id !== refazendoId && (
                  <AcoesMensagem
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
            ref={inputRef}
            type="text"
            placeholder="Pergunte alguma coisa (atalho: /)"
            value={pergunta}
            onChange={e => setPergunta(e.target.value)}
          />
          <button type="submit" className="chat__enviar" disabled={!pergunta.trim() || ocupado} aria-label="Enviar">
            <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10 16V5M5 10l5-5 5 5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </form>

        <p className="chat__aviso">
          O Tutor pode cometer erros. Considere verificar informações importantes.
        </p>
      </div>
    </div>
  )
}
