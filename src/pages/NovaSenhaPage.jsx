import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './auth.css'

export default function NovaSenhaPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ senha: '', confirmar: '' })
  const [erros, setErros] = useState({})
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (erros[name]) setErros(prev => ({ ...prev, [name]: '' }))
  }

  function validar() {
    const novos = {}
    if (!form.senha) novos.senha = 'Nova senha é obrigatória.'
    else if (form.senha.length < 8) novos.senha = 'Mínimo de 8 caracteres.'
    if (!form.confirmar) novos.confirmar = 'Confirme a nova senha.'
    else if (form.senha !== form.confirmar) novos.confirmar = 'As senhas não coincidem.'
    return novos
  }

  function handleSubmit(e) {
    e.preventDefault()
    const novos = validar()
    if (Object.keys(novos).length > 0) { setErros(novos); return }
    setLoading(true)
    setTimeout(() => navigate('/login'), 800)
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
          <h1>Nova senha</h1>
          <p>Escolha uma nova senha para sua conta.</p>

          <form onSubmit={handleSubmit} noValidate>
            <label htmlFor="senha">Nova senha</label>
            <input
              id="senha"
              name="senha"
              type="password"
              placeholder="Mínimo 8 caracteres"
              value={form.senha}
              onChange={handleChange}
              className={erros.senha ? 'input--error' : ''}
            />
            {erros.senha && <span className="field-error" role="alert">{erros.senha}</span>}

            <label htmlFor="confirmar">Confirmar nova senha</label>
            <input
              id="confirmar"
              name="confirmar"
              type="password"
              placeholder="Repita a senha"
              value={form.confirmar}
              onChange={handleChange}
              className={erros.confirmar ? 'input--error' : ''}
            />
            {erros.confirmar && <span className="field-error" role="alert">{erros.confirmar}</span>}

            <button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : 'Redefinir senha'}
            </button>
          </form>

          <p className="back-link">
            <Link to="/login">← Voltar para o login</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
