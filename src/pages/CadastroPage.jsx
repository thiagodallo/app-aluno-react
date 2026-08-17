import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './auth.css'

function validarCPF(cpf) {
  const digitos = cpf.replace(/\D/g, '')
  if (digitos.length !== 11 || /^(\d)\1{10}$/.test(digitos)) return false

  function digitoVerificador(base) {
    const soma = base
      .split('')
      .reduce((acc, num, i) => acc + Number(num) * (base.length + 1 - i), 0)
    const resto = soma % 11
    return resto < 2 ? 0 : 11 - resto
  }

  const dv1 = digitoVerificador(digitos.slice(0, 9))
  const dv2 = digitoVerificador(digitos.slice(0, 9) + dv1)
  return digitos === digitos.slice(0, 9) + String(dv1) + String(dv2)
}

export default function CadastroPage() {
  const navigate = useNavigate()
  const [cpf, setCpf] = useState('')
  const [erro, setErro] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!cpf.trim()) { setErro('CPF é obrigatório.'); return }
    if (!validarCPF(cpf)) { setErro('Informe um CPF válido (000.000.000-00).'); return }
    navigate('/cadastro/dados', { state: { cpf } })
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
            Passo 1 de 2.<br />
            Por favor insira seu CPF para prosseguir.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            <label htmlFor="cpf">CPF</label>
            <input
              id="cpf"
              name="cpf"
              type="text"
              placeholder="000.000.000-00"
              value={cpf}
              onChange={e => { setCpf(e.target.value); setErro('') }}
              className={erro ? 'input--error' : ''}
            />
            {erro && <span className="field-error" role="alert">{erro}</span>}

            <button type="submit">Prosseguir</button>
          </form>

          <p className="registre-se">
            Já tem uma conta? <Link to="/login">Entrar</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
