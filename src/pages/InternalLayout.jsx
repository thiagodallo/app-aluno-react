import { NavLink, Outlet } from 'react-router-dom'
import { IconePainel, IconeDisciplinas, IconeTutor, IconePerfil } from '../components/icons'
import { useTutorIa } from '../context/TutorIaContext'
import './InternalLayout.css'

const ITENS = [
  { to: '/app/dashboard', label: 'Painel', Icone: IconePainel },
  { to: '/app/disciplinas', label: 'Disciplinas', Icone: IconeDisciplinas },
  { to: '/app/tutor-ia', label: 'Tutor IA', Icone: IconeTutor },
  { to: '/app/perfil', label: 'Perfil', Icone: IconePerfil },
]

function classeLink({ isActive }) {
  return isActive ? 'menu__item menu__item--active' : 'menu__item'
}

export default function InternalLayout() {
  const { naoLida } = useTutorIa()

  return (
    <div className="app-shell">
      <header className="menu">
        <div className="menu__body">
          <div className="menu__brand">
            <p className="menu__title">Academia</p>
            <span className="menu__subtitle">Portal do Aluno</span>
          </div>

          <nav className="menu__links">
            {ITENS.map(({ to, label, Icone }) => {
              const mostrarBadge = to === '/app/tutor-ia' && naoLida
              return (
                <NavLink key={to} to={to} className={classeLink}>
                  <span className="menu__icon">
                    <Icone />
                    {mostrarBadge && <span className="menu__badge" aria-hidden="true" />}
                  </span>
                  {label}
                  {mostrarBadge && <span className="sr-only"> (nova resposta)</span>}
                </NavLink>
              )
            })}
          </nav>
        </div>
      </header>

      <main className="app-content">
        <Outlet />
      </main>
    </div>
  )
}
