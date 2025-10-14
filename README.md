
# PlanejAI

Aplicação web para criação de cronogramas de estudo personalizados utilizando Inteligência Artificial.

---

## 📚 Sobre o Projeto

Muitos estudantes têm dificuldade em organizar seus estudos de forma eficiente, equilibrando o tempo, metas e dificuldades. O **PlanejAI** visa solucionar esse problema automatizando o planejamento de estudos por meio de uma plataforma web que utiliza Inteligência Artificial para gerar cronogramas personalizados.

---

## 🚀 Funcionalidades Principais

- Cadastro de disciplinas, provas e preferências do aluno  
- Geração automatizada de cronogramas personalizados usando IA  
- Reajustes automáticos com base no desempenho do estudante  
- Sugestões de técnicas de estudo personalizadas  
- Barra de progresso para acompanhamento do plano

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:** React.js  
- **Backend:** Python com FastAPI  
- **Banco de Dados:** PostgreSQL  
- **Inteligência Artificial:** API OpenAI (ChatGPT)  

---

## 📂 Estrutura do Projeto

```
PlanejAI/
├── backend/               # API em Python com FastAPI
│   ├── app/
│   ├── requirements.txt
│   └── README.md
├── frontend/              # Aplicação React
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── README.md
├── docs/                  # Documentação e prints do protótipo
│   └── prototipo.png
├── LICENSE                # Licença do projeto
└── README.md              # Este arquivo
```

---

## 📋 Como Rodar o Projeto

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

A API estará disponível em `http://localhost:8000`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

O frontend será aberto normalmente no navegador (geralmente `http://localhost:3000`).

---

## 📈 Próximos Passos

- Implementação completa das funcionalidades principais  
- Integração entre frontend e backend  
- Testes de usabilidade com usuários reais  
- Ajustes e melhorias baseados no feedback  

---

## 🤝 Contribuição

Contribuições são bem-vindas!  
.
Para contribuir, faça um fork do repositório, crie uma branch com sua feature ou correção, e envie um pull request.

---

## 📄 Licença

Este projeto está licenciado sob a licença MIT — veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👩‍💻 Autora

Ana Júlia Rocha Gaspar – Projeto de Final de Curso – Universidade Estadual Paulista (UNESP)

---

## 📷 Protótipo

![Protótipo](docs/prototipo.png)
## Rodar com Docker

Requisitos: Docker Desktop atualizado.

### Subir tudo (DB + API + Frontend)
```powershell
# na raiz do repo
docker compose up --build
```
- Frontend: http://localhost:4173
- Backend: http://localhost:8000
- Postgres: localhost:5432 (postgres/postgres, DB: planejai)

Observa��es
- O backend cria as tabelas e faz seed de dados m�nimos no startup (usu�rio demo e 1 plano com itens), ent�o a tela de Planos j� lista algo na primeira execu��o.
- Para reiniciar do zero (limpar dados): `docker compose down -v` e depois `docker compose up --build`.

### Vari�veis
- O frontend � buildado com `VITE_API_URL=http://localhost:8000`.
- Se quiser apontar para outro backend, ajuste `args.VITE_API_URL` em `docker-compose.yml` e re-build.
