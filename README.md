# PlanejAI

Aplicacao web para criacao de cronogramas de estudo personalizados utilizando Inteligencia Artificial.

---

## Sobre o Projeto

Muitos estudantes tem dificuldade em organizar seus estudos de forma eficiente, equilibrando tempo, metas e dificuldades. O PlanejAI ajuda a automatizar o planejamento por meio de uma plataforma web que gera cronogramas personalizados.

---

## Funcionalidades Principais

- Cadastro de disciplinas e preferencias
- Geracao de cronogramas personalizados (IA)
- Sugestoes de tecnicas (Pomodoro, revisao espacada)
- Lista de planos e itens relacionados

---

## Tecnologias Utilizadas

- Frontend: React (Vite, Tailwind CSS)
- Backend: Python (FastAPI, Uvicorn)
- Banco de Dados: PostgreSQL (ou SQLite para dev local)
- IA: API OpenAI (opcional)

---

## Estrutura do Projeto

```
PlanejAI/
├─ backend/                # API FastAPI
│  ├─ app/
│  └─ Dockerfile
├─ frontend/               # Aplicacao React
│  ├─ public/
│  ├─ src/
│  └─ Dockerfile
├─ docker-compose.yml      # Orquestracao (DB + API + Web)
└─ README.md
```

---

## Como Rodar (Docker)

Pre‑requisito: Docker Desktop instalado e aberto.

```bash
# na raiz do projeto
docker compose up --build
```
Acesse:
- Frontend: http://localhost:4173
- Backend (API/Docs): http://localhost:8000 e http://localhost:8000/docs
- Postgres: localhost:5432 (user: postgres, senha: postgres, db: planejai)

Observacoes
- Na primeira execucao, o backend cria tabelas e popula dados de demonstracao (um usuario e um plano com itens).
- Para limpar tudo e reiniciar: `docker compose down -v` e depois `docker compose up --build`.

---

## Execucao Local (opcional)

### Backend
```powershell
cd backend
py -m venv .venv  # ou: python -m venv .venv
.\.venv\Scripts\Activate
python -m pip install --upgrade pip
pip install -r app/requirements.txt
# SQLite (padrao):
python -m uvicorn app.main:app --reload
# Para usar Postgres, defina:
# $env:DATABASE_URL = "postgresql+psycopg2://postgres:postgres@localhost:5432/planejai"
```

### Frontend
```powershell
cd frontend
npm install
npm run dev
# Abra http://localhost:5173
```

---

## Variaveis de Ambiente

- Backend:
  - `DATABASE_URL` - ex.: `postgresql+psycopg2://postgres:postgres@db:5432/planejai`
  - `OPENAI_API_KEY` - chave da OpenAI (opcional; apenas para a rota de IA)
- Frontend:
  - `VITE_API_URL` - URL do backend (ex.: `http://localhost:8000`)

---

## Licenca

Projeto licenciado sob MIT (veja `LICENSE`).

---

## Autora

Ana Julia Rocha Gaspar - Universidade Estadual Paulista (UNESP)

---

## Prototipo

![Prototipo](docs/prototipo.png)