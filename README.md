# App Aluno - React

Portabilidade do App Aluno de HTML/CSS/JS puro para React + Vite.
Projeto final (N3) - Disciplina: Front-end - Centro Universitário SATC.

## Tecnologias

- React 18
- Vite
- React Router DOM v6
- Context API (usuário logado + tema claro/escuro)

## Funcionalidades

- **Autenticação completa**: login, cadastro em 2 passos, recuperar e nova senha, com formulários controlados e validação.
- **SPA com React Router**: navegação entre telas internas sem recarregar a página, com indicação da rota ativa.
- **Painel**: saudação dinâmica, cursos em progresso e cards de estatísticas.
- **Disciplinas**: lista renderizada a partir de uma coleção (`.map()` + `key`).
- **Perfil**: abas de Dados Pessoais, Configurações e Segurança (alternadas com `useState`).
- **Tutor IA**: chat que consome uma API externa a cada pergunta, tratando os estados de carregando / erro / dados (`fetch` + `try/catch/finally`).
- **Tema claro/escuro**: alternável em Configurações, persistido no `localStorage`.
- **Layout responsivo**: adaptado para desktop e celular (cabeçalho vira tab-bar no mobile).

## Instalação e execução

```bash
# 1. Instalar as dependências
npm install

# 2. Rodar em modo de desenvolvimento
npm run dev
```

Acesse em: http://localhost:5173

## Estrutura de pastas

```
src/
├── components/   # InputField, Botao, Card, DisciplinaCard, ProtectedRoute
├── pages/        # LoginPage, DashboardPage, DisciplinasPage, PerfilPage, TutorIAPage...
├── context/      # UsuarioContext.jsx, ThemeContext.jsx
├── services/     # apiService.js
├── App.jsx
├── main.jsx
└── index.css
```

## Fluxo de uso

1. Acesse `/login` → entre com qualquer e-mail válido + senha (mín. 6 caracteres).
2. Ou acesse `/cadastro` → cadastro em 2 etapas.
3. Após o login, o Painel é aberto automaticamente.
4. Use o menu do topo para navegar entre Painel, Disciplinas, Tutor IA e Perfil.
5. Em **Perfil → Configurações**, alterne entre tema claro e escuro.
6. Para sair, vá em **Perfil → Segurança → Sair**.
