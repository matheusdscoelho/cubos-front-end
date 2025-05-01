---

```
# 🎬 Cubos Filmes - Frontend

Este é o frontend do projeto **Cubos Filmes**, desenvolvido com **Next.js** e **React**. Ele se conecta a uma API backend para permitir o gerenciamento de um catálogo de filmes com autenticação de usuários.

---

## 🔍 Funcionalidades

- ✅ Cadastro e login de usuários
- 🎞️ Listagem de filmes
- 📝 Criação e edição de filmes
- 🔍 Visualização de detalhes de um filme
- 📅 Visualização de orçamento, data de lançamento e duração

---

## 🚀 Tecnologias e Bibliotecas

| Biblioteca | Finalidade |
|------------|------------|
| **next** | Framework React com renderização híbrida (SSR, SSG, CSR). |
| **react** / **react-dom** | Biblioteca principal para construção da UI. |
| **@tanstack/react-query** | Gerencia o cache e estado das requisições HTTP de forma eficiente. |
| **axios** | Cliente HTTP para se comunicar com a API backend. |
| **react-hook-form** | Controle de formulários com excelente performance. |
| **@hookform/resolvers** | Integração entre `react-hook-form` e validadores como `zod`. |
| **zod** | Validação e tipagem de dados de formulários. |
| **next-themes** | Alternância entre temas claro/escuro (dark mode). |
| **lucide-react** | Ícones SVG modernos e acessíveis. |
| **js-cookie** | Manipulação de cookies no navegador (ex: salvar token JWT). |
| **jsonwebtoken** | Decodificação e verificação de tokens JWT no frontend. |
| **bcryptjs** | Criptografia (usado aqui provavelmente só para comparar senhas, embora geralmente isso seja feito no backend). |
| **@prisma/client** | (Mesmo estando listado, normalmente só se usa no backend com banco de dados. No frontend, raramente é necessário.) |

---

## 📦 Instalação

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/seu-repo-frontend.git
cd seu-repo-frontend
```

2. Instale as dependências:

```bash
npm install
```

3. Configure o arquivo `.env.local` com a URL da API:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

4. Rode o projeto:

```bash
npm run dev
```

---

## 🧭 Navegação

| Página | Caminho | Descrição |
|--------|---------|-----------|
| 🏠 Página inicial | `/movies` | Lista todos os filmes |
| 🔍 Detalhes do filme | `/movies/[id]` | Visualiza dados do filme selecionado |
| ➕ Novo filme | `/movies/new` | Formulário para adicionar um novo filme |
| ✏️ Editar filme | `/movies/[id]/edit` | Editar filme existente |
| 🔐 Login | `/login` | Página de autenticação |
| 🆕 Registro | `/register` | Cadastro de novos usuários |

---

## 💡 Sugestões

- A aplicação utiliza **React Query** para performance e cache de dados.
- A autenticação é feita com **JWT** armazenado em cookies via `js-cookie`.
- Os formulários são gerenciados com **React Hook Form** e validados com **Zod**.

---

## ✨ Autor

**Matheus Coelho**  
Desenvolvido como parte do projeto Cubos Filmes.

---

## 📄 Licença

Este projeto está sob a licença MIT.
```

---