import { useState } from 'react'
import { Link, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { useUsuario } from '../context/UsuarioContext'
import { useToast } from '../context/ToastContext'
import './auth.css'

export default function CadastroDadosPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { fazerLogin } = useUsuario()
  const { notificar } = useToast()

  const [form, setForm] = useState({ nome: '', telefone: '', email: '', senha: '' })
  const [erros, setErros] = useState({})
  const [loading, setLoading] = useState(false)

  const cpf = location.state?.cpf ?? ''
  if (!cpf) return <Navigate to="/cadastro" replace />

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (erros[name]) setErros(prev => ({ ...prev, [name]: '' }))
  }

  function validar() {
    const novos = {}
    if (!form.nome.trim()) novos.nome = 'Nome é obrigatório.'
    if (!form.telefone.trim()) novos.telefone = 'Telefone é obrigatório.'
    if (!form.email.trim()) novos.email = 'E-mail é obrigatório.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) novos.email = 'E-mail inválido.'
    if (!form.senha) novos.senha = 'Senha é obrigatória.'
    else if (form.senha.length < 6) novos.senha = 'Mínimo de 6 caracteres.'
    return novos
  }

  function handleSubmit(e) {
    e.preventDefault()
    const novos = validar()
    if (Object.keys(novos).length > 0) { setErros(novos); return }

    setLoading(true)
    setTimeout(() => {
      fazerLogin({ nome: form.nome, email: form.email, cpf })
      notificar('Cadastro concluído com sucesso.', 'sucesso')
      navigate('/app/dashboard')
    }, 800)
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
          <h1>Cadastre-se</h1>
          <p>
            Passo 2 de 2.<br />
            Por favor insira seus dados para finalizar e prosseguir.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            <label htmlFor="nome">Nome</label>
            <input
              id="nome" name="nome" type="text" placeholder="Nome completo"
              value={form.nome} onChange={handleChange}
              className={erros.nome ? 'input--error' : ''}
            />
            {erros.nome && <span className="field-error">{erros.nome}</span>}

            <label htmlFor="telefone">Telefone</label>
            <input
              id="telefone" name="telefone" type="tel" placeholder="(99) 99999-9999"
              value={form.telefone} onChange={handleChange}
              className={erros.telefone ? 'input--error' : ''}
            />
            {erros.telefone && <span className="field-error">{erros.telefone}</span>}

            <label htmlFor="email">E-mail</label>
            <input
              id="email" name="email" type="email" placeholder="user@email.com"
              value={form.email} onChange={handleChange}
              className={erros.email ? 'input--error' : ''}
            />
            {erros.email && <span className="field-error">{erros.email}</span>}

            <label htmlFor="senha">Senha</label>
            <input
              id="senha" name="senha" type="password"
              value={form.senha} onChange={handleChange}
              className={erros.senha ? 'input--error' : ''}
            />
            {erros.senha && <span className="field-error">{erros.senha}</span>}

            <button type="submit" disabled={loading}>
              {loading ? 'Cadastrando...' : 'Cadastrar'}
            </button>
          </form>

          <p className="back-link">
            <Link to="/cadastro">← Voltar ao passo 1</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
