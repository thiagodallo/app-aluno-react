# App Aluno - React

Portabilidade do App Aluno de HTML/CSS/JS puro para React + Vite.
Projeto final (N3) - Disciplina: Front-end - Centro Universitário SATC.

## Tecnologias

- React 18
- Vite
- React Router DOM v6
- Context API (usuário logado, tema claro/escuro, notificações toast, chat do Tutor IA)

## Funcionalidades

- **Autenticação completa**: login, cadastro em 2 passos, recuperar e nova senha, com formulários controlados, validação inline e CPF verificado por dígito real. Sessão persistida no `localStorage`.
- **SPA com React Router**: navegação entre telas internas sem recarregar a página, com indicação da rota ativa.
- **Painel**: saudação dinâmica, cursos em progresso e cards de estatísticas, com animação de entrada.
- **Disciplinas**: lista renderizada a partir de uma coleção (`.map()` + `key`), com hover nos cards.
- **Perfil**: abas com semântica ARIA (`tablist`/`tab`/`tabpanel`), avatar colorido por hash do nome, preferências de notificação persistidas e logout com modal de confirmação.
- **Tutor IA**: chat com histórico guardado em Context (sobrevive à troca de página), ações por mensagem (ouvir, copiar, refazer, avaliar), atalho de teclado `/` para focar o campo de pergunta e rascunho salvo em `sessionStorage`. Um badge no menu avisa quando chega resposta nova com o usuário em outra tela.
- **Notificações toast**: feedback visual em login, cadastro, logout, troca de tema e ações do chat.
- **Tema claro/escuro**: alternável em Configurações, persistido no `localStorage`, com paleta própria ajustada tom a tom em cada modo.
- **Layout responsivo**: adaptado para desktop e celular (cabeçalho vira tab-bar no mobile).
- **Acessibilidade**: foco customizado com a cor da marca, labels associados aos campos e tooltips nos botões de ícone.

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
├── components/   # DisciplinaCard, ProtectedRoute, ConfirmModal, Toast, Toggle, icons
├── pages/        # LoginPage, DashboardPage, DisciplinasPage, PerfilPage, TutorIAPage...
├── context/      # UsuarioContext, ThemeContext, ToastContext, TutorIaContext
├── services/     # apiService.js
├── App.jsx
├── main.jsx
└── index.css
```

## Fluxo de uso

1. Acesse `/login` → entre com qualquer e-mail válido + senha (mín. 6 caracteres).
2. Ou acesse `/cadastro` → cadastro em 2 etapas, com CPF validado de verdade.
3. Após o login, o Painel abre e a sessão persiste entre recarregamentos.
4. Use o menu do topo para navegar entre Painel, Disciplinas, Tutor IA e Perfil.
5. No Tutor IA, pressione `/` em qualquer lugar da página para focar o campo de pergunta.
6. Em **Perfil → Configurações**, alterne entre tema claro e escuro.
7. Para sair, vá em **Perfil → Segurança → Sair** e confirme no modal.
