import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUsuario } from '../context/UsuarioContext'
import { IconeRelogio, IconeTarefa, IconeChat } from '../components/icons'
import Sparkline from '../components/Sparkline'
import './DashboardPage.css'

function saudacao() {
  const h = new Date().getHours()
  if (h < 12) return 'Bom dia'
  if (h < 18) return 'Boa tarde'
  return 'Boa noite'
}

const EM_PROGRESSO = [
  {
    id: 1,
    nome: 'Front-end',
    aula: 'Aula 2: Conceitos do desenvolvimento Front-end e GIT + Github.',
    progresso: 65,
    proximaAula: 'Amanhã, 19h',
  },
  {
    id: 2,
    nome: 'UX Design',
    aula: 'Aula 3: Usabilidade.',
    progresso: 25,
    proximaAula: 'Sexta, 14h',
  },
]

const TAREFAS_INICIAIS = [
  { id: 1, titulo: 'Entregar exercício de Git', curso: 'Front-end', prazo: 'Amanhã', feita: false },
  { id: 2, titulo: 'Ler capítulo 3 de Usabilidade', curso: 'UX Design', prazo: 'Sexta', feita: false },
  { id: 3, titulo: 'Revisar wireframes do projeto final', curso: 'UX Design', prazo: 'Próxima semana', feita: false },
  { id: 4, titulo: 'Configurar ambiente com Vite', curso: 'Front-end', prazo: 'Concluída', feita: true },
]

const HISTORICO_ESTUDO = [1.5, 2, 0, 3, 1, 4, 2.5]
const HISTORICO_TAREFAS = [0, 1, 1, 0, 2, 1, 1]
const HISTORICO_DISCUSSOES = [1, 2, 0, 3, 1, 0, 2]

export default function DashboardPage() {
  const { usuario } = useUsuario()
  const navigate = useNavigate()
  const primeiroNome = (usuario?.nome || 'Aluno').split(' ')[0]

  const [tarefas, setTarefas] = useState(() => {
    const salvas = localStorage.getItem('tarefasDashboard')
    if (!salvas) return TAREFAS_INICIAIS
    try {
      return JSON.parse(salvas)
    } catch {
      return TAREFAS_INICIAIS
    }
  })

  function alternarTarefa(id) {
    setTarefas(prev => {
      const atualizadas = prev.map(t => (t.id === id ? { ...t, feita: !t.feita } : t))
      localStorage.setItem('tarefasDashboard', JSON.stringify(atualizadas))
      return atualizadas
    })
  }

  const pendentes = tarefas.filter(t => !t.feita).length

  const estatisticas = [
    { id: 1, Icone: IconeRelogio, label: 'Tempo de Estudo', valor: '12h 45m', desc: 'Esta semana', historico: HISTORICO_ESTUDO },
    {
      id: 2,
      Icone: IconeTarefa,
      label: 'Tarefas Pendentes',
      valor: String(pendentes),
      desc: pendentes === 0 ? 'Tudo em dia' : `${pendentes} para esta semana`,
      historico: HISTORICO_TAREFAS,
    },
    { id: 3, Icone: IconeChat, label: 'Discussões com IA', valor: '8', desc: 'Tópicos ativos', historico: HISTORICO_DISCUSSOES },
  ]

  return (
    <div className="dash">
      <h1 className="dash__greeting">{saudacao()}, {primeiroNome}.</h1>
      <p className="dash__intro">
        Bem-vindo de volta à sua sessão de estudo focado. Você tem {pendentes} {pendentes === 1 ? 'tarefa' : 'tarefas'} para
        esta semana e está atualmente adiantado em seu cronograma de leitura.
      </p>

      <h2 className="sr-only">Estatísticas</h2>
      <div className="dash__stats">
        {estatisticas.map(({ id, Icone, label, valor, desc, historico }) => (
          <div className="stat-card card" key={id}>
            <div className="stat-card__head">
              <Icone />
              <span>{label}</span>
            </div>
            <h3 className="stat-card__value">{valor}</h3>
            <p className="stat-card__desc">{desc}</p>
            <Sparkline valores={historico} />
          </div>
        ))}
      </div>

      <h2 className="sr-only">Cursos em progresso</h2>
      <div className="dash__cursos">
        {EM_PROGRESSO.map(curso => (
          <div className="progress-card card" key={curso.id}>
            <span className="badge badge--green">Em progresso</span>
            <h3 className="progress-card__title">{curso.nome}</h3>
            <p className="progress-card__sub">{curso.aula}</p>
            <p className="progress-card__proxima">
              <IconeRelogio />
              Próxima aula: {curso.proximaAula}
            </p>
            <div className="progress-card__bar">
              <div className="progress__track">
                <div className="progress__fill" style={{ width: `${curso.progresso}%` }} />
              </div>
              <span className="progress-card__pct">{curso.progresso}%</span>
            </div>
            <button className="btn btn--primary btn--block" onClick={() => navigate('/app/disciplinas')}>
              Retomar Estudo →
            </button>
          </div>
        ))}
      </div>

      <h2 className="dash__secao-titulo">Tarefas da semana</h2>
      <div className="card dash__tarefas">
        {tarefas.map(tarefa => (
          <label className={`tarefa ${tarefa.feita ? 'tarefa--feita' : ''}`} key={tarefa.id}>
            <input type="checkbox" checked={tarefa.feita} onChange={() => alternarTarefa(tarefa.id)} />
            <span className="tarefa__titulo">{tarefa.titulo}</span>
            <span className="badge badge--gray">{tarefa.curso}</span>
            <span className="tarefa__prazo">{tarefa.prazo}</span>
          </label>
        ))}
      </div>
    </div>
  )
}
