import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUsuario } from '../context/UsuarioContext'
import { useToast } from '../context/ToastContext'
import './auth.css'

function validarEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export default function LoginPage() {
  const navigate = useNavigate()
  const { fazerLogin } = useUsuario()
  const { notificar } = useToast()

  const [form, setForm] = useState({ email: '', senha: '' })
  const [erros, setErros] = useState({})
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (erros[name]) setErros(prev => ({ ...prev, [name]: '' }))
  }

  function validar() {
    const novos = {}
    if (!form.email.trim()) novos.email = 'E-mail é obrigatório.'
    else if (!validarEmail(form.email)) novos.email = 'Informe um e-mail válido.'
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
      fazerLogin({
        nome: 'João Silva',
        preferencia: 'Jonh',
        email: form.email,
        curso: 'Engenharia de Software',
        ano: '3º Ano',
        cpf: '***.***.***-89',
        telefone: '',
      })
      notificar('Login realizado com sucesso.', 'sucesso')
      navigate('/app/dashboard')
    }, 700)
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
          <h1>Bem-vindo de volta</h1>
          <p>Por favor, insira suas credenciais para acessar seu painel acadêmico</p>

          <form onSubmit={handleSubmit} noValidate>
            <label htmlFor="email">Endereço de e-mail</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="user@email.com"
              value={form.email}
              onChange={handleChange}
              className={erros.email ? 'input--error' : ''}
            />
            {erros.email && <span className="field-error">{erros.email}</span>}

            <label htmlFor="senha">
              Senha
              <Link to="/recuperar-senha">Esqueceu?</Link>
            </label>
            <input
              id="senha"
              name="senha"
              type="password"
              value={form.senha}
              onChange={handleChange}
              className={erros.senha ? 'input--error' : ''}
            />
            {erros.senha && <span className="field-error">{erros.senha}</span>}

            <button type="submit" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <p className="registre-se">
            Não tem uma conta? <Link to="/cadastro">Registre-se agora.</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
