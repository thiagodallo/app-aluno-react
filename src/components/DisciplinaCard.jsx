import { useNavigate } from 'react-router-dom'
import './DisciplinaCard.css'

export default function DisciplinaCard({ nome, professor, status, progresso }) {
  const navigate = useNavigate()
  const emCurso = status === 'curso'

  return (
    <div className="disc-card card">
      <div className="disc-card__head">
        <div>
          <h2 className="disc-card__nome">{nome}</h2>
          <p className="disc-card__prof">{professor}</p>
        </div>
        <span className={`badge ${emCurso ? 'badge--green' : 'badge--gray'}`}>
          {emCurso ? 'Em curso' : 'Próximo semestre'}
        </span>
      </div>

      <div className="disc-card__progress">
        <div className="disc-card__progress-row">
          <span>{emCurso ? 'Progresso' : 'Disponibilidade'}</span>
          <span>{progresso}%</span>
        </div>
        <div className="progress__track">
          <div className="progress__fill" style={{ width: `${progresso}%` }} />
        </div>
      </div>

      <button className="btn btn--primary btn--block" onClick={() => navigate('/app/tutor-ia')}>
        Acessar Disciplina
      </button>
    </div>
  )
}
