import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './auth.css'

function validarEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export default function RecuperarSenhaPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [erro, setErro] = useState('')
  const [enviado, setEnviado] = useState(false)
  const [loading, setLoading] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (!email.trim()) { setErro('E-mail é obrigatório.'); return }
    if (!validarEmail(email)) { setErro('Informe um e-mail válido.'); return }

    setLoading(true)
    setTimeout(() => { setLoading(false); setEnviado(true) }, 700)
  }

  return (
    <div className="container">
      <div className="hero">
        <p>
          "Educação não é o aprendizado de fatos,
          mas treinamento da mente para pensar."
          <span>Albert Einstein</span>
        </p>
      </div>

      <div className="formulario">
        <div>
          <h1>Esqueci minha senha</h1>
          <p>Informe seu e-mail para enviarmos o link para redefinir sua senha.</p>

          {enviado ? (
            <div className="success-box">
              Link enviado! Verifique sua caixa de entrada em <strong>{email}</strong>.
              <button type="button" className="link-button" onClick={() => navigate('/nova-senha')}>
                Simular clique no link do e-mail
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <label htmlFor="email">Endereço de e-mail</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="user@email.com"
                value={email}
                onChange={e => { setEmail(e.target.value); setErro('') }}
                className={erro ? 'input--error' : ''}
              />
              {erro && <span className="field-error" role="alert">{erro}</span>}

              <button type="submit" disabled={loading}>
                {loading ? 'Enviando...' : 'Enviar'}
              </button>
            </form>
          )}

          <p className="back-link">
            <Link to="/login">← Voltar para o login</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
