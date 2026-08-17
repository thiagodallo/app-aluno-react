import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUsuario } from '../context/UsuarioContext'
import { useTema } from '../context/ThemeContext'
import { useToast } from '../context/ToastContext'
import Toggle from '../components/Toggle'
import ConfirmModal from '../components/ConfirmModal'
import './PerfilPage.css'

const ABAS = [
  { nome: 'Dados Pessoais', id: 'dados-pessoais' },
  { nome: 'Configurações', id: 'configuracoes' },
  { nome: 'Segurança', id: 'seguranca' },
]

const ROTACOES_AVATAR = [0, 18, -18, 32, -32]

function corAvatar(nome) {
  let hash = 0
  for (let i = 0; i < nome.length; i++) hash = nome.charCodeAt(i) + ((hash << 5) - hash)
  const rotacao = ROTACOES_AVATAR[Math.abs(hash) % ROTACOES_AVATAR.length]
  return { filter: `hue-rotate(${rotacao}deg)` }
}

export default function PerfilPage() {
  const { usuario } = useUsuario()
  const [abaAtiva, setAbaAtiva] = useState(ABAS[0].id)

  const nome = usuario?.nome || 'João Silva'
  const iniciais = nome.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase()

  return (
    <div className="perfil">
      <div className="perfil__header">
        <div className="perfil__avatar" style={corAvatar(nome)}>{iniciais}</div>
        <div>
          <h1 className="perfil__nome">{nome}</h1>
          <p className="perfil__meta">
            {usuario?.curso || 'Engenharia de Software'} • {usuario?.ano || '3º Ano'}
          </p>
        </div>
      </div>

      <div className="perfil__tabs" role="tablist" aria-label="Seções do perfil">
        {ABAS.map(aba => (
          <button
            key={aba.id}
            id={`tab-${aba.id}`}
            role="tab"
            aria-selected={abaAtiva === aba.id}
            aria-controls={`painel-${aba.id}`}
            className={`perfil__tab ${abaAtiva === aba.id ? 'perfil__tab--active' : ''}`}
            onClick={() => setAbaAtiva(aba.id)}
          >
            {aba.nome}
          </button>
        ))}
      </div>

      <div id={`painel-${abaAtiva}`} role="tabpanel" aria-labelledby={`tab-${abaAtiva}`}>
        <h2 className="sr-only">{ABAS.find(aba => aba.id === abaAtiva).nome}</h2>
        {abaAtiva === 'dados-pessoais' && <DadosPessoais usuario={usuario} />}
        {abaAtiva === 'configuracoes' && <Configuracoes />}
        {abaAtiva === 'seguranca' && <Seguranca />}
      </div>
    </div>
  )
}

function DadosPessoais({ usuario }) {
  const linhas = [
    { rotulo: 'Nome Completo', valor: usuario?.nome || 'João Silva' },
    { rotulo: 'Nome de Preferência', valor: usuario?.preferencia || 'Jonh' },
    { rotulo: 'Endereço de E-mail', valor: usuario?.email || 'joao.silva@satc.edu.br' },
    { rotulo: 'Matrícula / CPF', valor: usuario?.cpf || '***.***.***-89' },
    { rotulo: 'Número de Telefone', valor: usuario?.telefone || 'Não fornecido', vazio: !usuario?.telefone },
  ]

  return (
    <div className="card dados">
      {linhas.map(linha => (
        <div className="dados__linha" key={linha.rotulo}>
          <span className="dados__rotulo">{linha.rotulo}</span>
          <span className={`dados__valor ${linha.vazio ? 'dados__valor--vazio' : ''}`}>
            {linha.valor}
          </span>
        </div>
      ))}
    </div>
  )
}

function Configuracoes() {
  const { tema, alternarTema } = useTema()
  const { notificar } = useToast()
  const [notificacoes, setNotificacoes] = useState(() => {
    const salvo = localStorage.getItem('notificacoesPush')
    return salvo === null ? true : salvo === 'true'
  })
  const [resumoEmail, setResumoEmail] = useState(() => {
    const salvo = localStorage.getItem('resumoEmail')
    return salvo === null ? false : salvo === 'true'
  })

  useEffect(() => {
    localStorage.setItem('notificacoesPush', notificacoes)
  }, [notificacoes])

  useEffect(() => {
    localStorage.setItem('resumoEmail', resumoEmail)
  }, [resumoEmail])

  function trocarTema(novoTema) {
    if (tema === novoTema) return
    alternarTema()
    notificar(`Tema ${novoTema === 'dark' ? 'escuro' : 'claro'} ativado.`, 'info')
  }

  return (
    <div className="card config">
      <div className="config__linha">
        <div className="config__texto">
          <h3>Aparência</h3>
          <p>Escolha entre o modo claro e o modo escuro.</p>
        </div>
        <div className="tema-switch">
          <button
            className={tema === 'light' ? 'tema-switch__btn tema-switch__btn--ativo' : 'tema-switch__btn'}
            onClick={() => trocarTema('light')}
          >
            ☀ Claro
          </button>
          <button
            className={tema === 'dark' ? 'tema-switch__btn tema-switch__btn--ativo' : 'tema-switch__btn'}
            onClick={() => trocarTema('dark')}
          >
            ☾ Escuro
          </button>
        </div>
      </div>

      <div className="config__linha">
        <div className="config__texto">
          <h3>Notificações push</h3>
          <p>Receba alertas sobre tarefas e prazos no navegador.</p>
        </div>
        <Toggle ligado={notificacoes} onChange={() => setNotificacoes(v => !v)} />
      </div>

      <div className="config__linha">
        <div className="config__texto">
          <h3>Resumo por e-mail</h3>
          <p>Receba um resumo semanal das suas atividades.</p>
        </div>
        <Toggle ligado={resumoEmail} onChange={() => setResumoEmail(v => !v)} />
      </div>
    </div>
  )
}

function Seguranca() {
  const { fazerLogout } = useUsuario()
  const { notificar } = useToast()
  const navigate = useNavigate()
  const [doisFatores, setDoisFatores] = useState(false)
  const [confirmandoSaida, setConfirmandoSaida] = useState(false)

  function sair() {
    fazerLogout()
    notificar('Sessão encerrada.', 'info')
    navigate('/login')
  }

  return (
    <div className="card config">
      <div className="config__linha">
        <div className="config__texto">
          <h3>Senha</h3>
          <p>Sua última alteração foi há 3 meses.</p>
        </div>
        <button className="btn btn--outline" onClick={() => navigate('/nova-senha')}>Alterar senha</button>
      </div>

      <div className="config__linha">
        <div className="config__texto">
          <h3>Autenticação em dois fatores</h3>
          <p>Adicione uma camada extra de segurança ao entrar.</p>
        </div>
        <Toggle ligado={doisFatores} onChange={() => setDoisFatores(v => !v)} />
      </div>

      <div className="config__linha">
        <div className="config__texto">
          <h3>Sair da conta</h3>
          <p>Encerrar a sessão neste dispositivo.</p>
        </div>
        <button className="btn btn--danger" onClick={() => setConfirmandoSaida(true)}>Sair</button>
      </div>

      <ConfirmModal
        aberto={confirmandoSaida}
        titulo="Sair da conta"
        mensagem="Você precisará entrar novamente para acessar o portal. Deseja continuar?"
        textoConfirmar="Sair"
        perigo
        onConfirmar={sair}
        onCancelar={() => setConfirmandoSaida(false)}
      />
    </div>
  )
}
