import { useNavigate } from 'react-router-dom'
import { useUsuario } from '../context/UsuarioContext'
import { IconeRelogio, IconeTarefa, IconeChat } from '../components/icons'
import './DashboardPage.css'

function saudacao() {
  const h = new Date().getHours()
  if (h < 12) return 'Bom dia'
  if (h < 18) return 'Boa tarde'
  return 'Boa noite'
}

const EM_PROGRESSO = [
  { id: 1, nome: 'Front-end', aula: 'Aula 2: Conceitos do desenvolvimento Front-end e GIT + Github.', progresso: 65 },
  { id: 2, nome: 'UX Design', aula: 'Aula 3: Usabilidade.', progresso: 25 },
]

const ESTATISTICAS = [
  { id: 1, Icone: IconeRelogio, label: 'Tempo de Estudo', valor: '12h 45m', desc: 'Esta semana' },
  { id: 2, Icone: IconeTarefa, label: 'Tarefas Pendentes', valor: '2', desc: 'Próximo vencimento em 2 dias' },
  { id: 3, Icone: IconeChat, label: 'Discussões com IA', valor: '8', desc: 'Tópicos ativos' },
]

export default function DashboardPage() {
  const { usuario } = useUsuario()
  const navigate = useNavigate()
  const primeiroNome = (usuario?.nome || 'Aluno').split(' ')[0]

  return (
    <div className="dash">
      <h1 className="dash__greeting">{saudacao()}, {primeiroNome}.</h1>
      <p className="dash__intro">
        Bem-vindo de volta à sua sessão de estudo focado. Você tem 2 tarefas para esta
        semana e está atualmente adiantado em seu cronograma de leitura.
      </p>

      {EM_PROGRESSO.map(curso => (
        <div className="progress-card card" key={curso.id}>
          <div className="progress-card__info">
            <span className="badge badge--green">Em progresso</span>
            <h3 className="progress-card__title">{curso.nome}</h3>
            <p className="progress-card__sub">{curso.aula}</p>
            <div className="progress-card__bar">
              <div className="progress__track">
                <div className="progress__fill" style={{ width: `${curso.progresso}%` }} />
              </div>
              <span className="progress-card__pct">{curso.progresso}%</span>
            </div>
          </div>
          <button className="btn btn--primary" onClick={() => navigate('/app/disciplinas')}>Retomar Estudo →</button>
        </div>
      ))}

      <div className="dash__stats">
        {ESTATISTICAS.map(({ id, Icone, label, valor, desc }) => (
          <div className="stat-card card" key={id}>
            <div className="stat-card__head">
              <Icone />
              <span>{label}</span>
            </div>
            <h3 className="stat-card__value">{valor}</h3>
            <p className="stat-card__desc">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
