# Ruan Fest – Protótipo do Sistema de Orçamentos

Protótipo do site da **Ruan Fest – Locação de Brinquedos**. O sistema organiza a tabela de preços de brinquedos e serviços e gera **orçamentos** para clientes, como a Prefeitura, com valor da locação, taxa de deslocamento, total por escola e total geral.

**Tecnologias do protótipo:** HTML, CSS e JavaScript.
**Tecnologias da API (Etapa 3):** Node.js, Express e Sequelize (SQLite).

## Grupo
- José Daniel de Lima Araújo
- João Pedro Araújo Alcântara
- Ruan Jardelino Marinho
- Victor Emanuel Alves Paulino

## Estrutura do repositório
```
Prototip-Ruan-Fest/
├── Prototip-Ruan-Fest-past/     # código do protótipo (HTML, CSS, JS)
├── api/                          # backend Node.js + Express + Sequelize (Etapa 3)
│   └── README.md                # instalação, rotas e regras de negócio implementadas
├── docs/
│   ├── modelagem.md             # MER + diagrama de classes
│   ├── dicionario-de-dados.md   # tabelas, campos, tipos e constraints
│   ├── schema.sql               # criação do banco (PostgreSQL)
│   ├── schema.dbml              # MER editável no dbdiagram.io
│   ├── seed_catalogo.sql        # preços, brinquedos, serviços e localidades
│   ├── seed_exemplo.sql         # orçamento de exemplo (Dia das Crianças)
│   └── img/                     # mer.png, diagrama-classes.png
└── README.md
```

## Instalação

## 1. Protótipo (front-end)

1. Clone o repositório:
   ```bash
   git clone https://github.com/JoseDaniel-67/Prototip-Ruan-Fest.git
   cd Prototip-Ruan-Fest/Prototip-Ruan-Fest-past
   ```
2. Abra o `index.html` no navegador (ou use a extensão *Live Server* do VS Code).

Por ser HTML/CSS/JS puro, não há etapa de build.

### 2. Banco de dados (modelagem em PostgreSQL)
Requer PostgreSQL 13+. Essa etapa serve para conferir a modelagem em SQL puro (schema, constraints e views); não é usada pela API Node.js (item 3), que roda em SQLite.
```bash
createdb ruanfest
psql -d ruanfest -f docs/schema.sql          # cria tabelas, índices e views
psql -d ruanfest -f docs/seed_catalogo.sql   # carrega preços e localidades
psql -d ruanfest -f docs/seed_exemplo.sql    # (opcional) orçamento de exemplo
```
Para conferir o exemplo: `SELECT * FROM vw_orcamento_totais;` deve retornar subtotal **13.460,00**, deslocamento **300,00** e total geral **13.760,00**.

### 3. API (Etapa 3 — Node.js + Sequelize)
```bash
cd api
npm install
cp .env.example .env
npm run seed   # opcional: mesmo catálogo + orçamento de exemplo do passo 2, mas gravado via Sequelize/SQLite
npm start      # http://localhost:3000
```
Detalhes de arquitetura, decisões e a lista completa de rotas: [`api/README.md`](api/README.md).

## Modelagem
- MER e diagrama de classes: [`docs/modelagem.md`](docs/modelagem.md)
- Dicionário de dados (contrato para o código): [`docs/dicionario-de-dados.md`](docs/dicionario-de-dados.md)

![MER](docs/img/mer.png)

### Regras de negócio
- Toda locação inclui: Pula-pula pequeno, Pula-pula grande, Multi Park, Tobogã, Pipoca e Algodão doce.
- Duração padrão de **2 horas**; **3 horas** para as escolas definidas pelo cliente. Pipoca e algodão doce mantêm o mesmo valor em qualquer duração.
- A **taxa de deslocamento** (carro de transporte de terceiros) é cobrada por viagem, aparece separada do valor dos brinquedos e só entra no total geral. Se o valor ainda não foi definido, fica em branco ("a informar").
- Os preços são **congelados** em cada item do orçamento, então alterar a tabela de preços não muda orçamentos antigos.

### Tabela de preços (2 e 3 horas)
| Brinquedo | 2 h | 3 h |

| Pula-pula pequeno (2,44 m) | R$ 120,00 | R$ 140,00 |
| Pula-pula grande (4,27 m) | R$ 140,00 | R$ 160,00 |
| Multi Park | R$ 200,00 | R$ 250,00 |
| Tobogã Premium | R$ 200,00 | R$ 250,00 |

| Serviço extra | Quantidade | Valor |

| Algodão doce | 120 unidades | R$ 150,00 |
| Pipoca | 200 unidades | R$ 150,00 |
| Máquina de crepe | durante o evento | R$ 150,00 |

## Rotas da API
 **Implementada** em `api/`. A tabela abaixo era a proposta inicial da modelagem; a lista final (com a rota exata de cada operação) está em [`api/README.md`](api/README.md). Duas rotas da proposta ficaram de fora por não serem o foco da Etapa 3: `POST /auth/login` (sem autenticação nesta etapa) e `GET /orcamentos/:id/pdf` (exportação em PDF, fica para uma próxima etapa). Base: sem prefixo `/api` (ex.: `localhost:3000/clientes`). Formato JSON; valores monetários como número com 2 casas.

| Método | Rota | Descrição |
|---|---|---|
| POST | `/auth/login` | Login (retorna token) — não implementado nesta etapa |
| GET / POST | `/clientes` | Listar / criar cliente |
| GET / PUT / DELETE | `/clientes/:id` | Ver / editar / remover cliente |
| GET / POST | `/escolas` | Listar / criar escola |
| GET / POST | `/localidades` | Listar / criar localidade |
| GET / POST | `/brinquedos` | Catálogo de brinquedos (com preços por duração) |
| PUT | `/brinquedos/:id/precos` | Atualizar preços por duração |
| GET / POST | `/servicos` | Serviços extras |
| GET / POST | `/orcamentos` | Listar / criar orçamento |
| GET / PUT / DELETE | `/orcamentos/:id` | Ver / editar / remover orçamento |
| GET | `/orcamentos/:id/totais` | Subtotal, deslocamento e total geral (`vw_orcamento_totais`) |
| GET | `/orcamentos/:id/totais-por-escola` | Total por escola (`vw_total_por_escola`) |
| POST | `/orcamentos/:id/locacoes` | Adicionar locação (escola, data, turno, alunos, duração) |
| PUT / DELETE | `/locacoes/:id` | Editar / remover locação |
| POST | `/locacoes/:id/itens` | Adicionar item (brinquedo **ou** serviço) |
| POST | `/orcamentos/:id/deslocamentos` | Cadastrar viagem (valor opcional) |
| PUT | `/deslocamentos/:id` | Informar/alterar o valor da taxa |
| GET | `/orcamentos/:id/pdf` | Exportar o orçamento em PDF — não implementado nesta etapa |

**Regras que a API respeita:** ao criar uma locação, os itens padrão já são criados com o preço da duração escolhida (`valor_unitario`); item com brinquedo **e** serviço ao mesmo tempo é rejeitado; totais são sempre calculados, nunca gravados.

## Exemplo de dados
`docs/seed_exemplo.sql` (SQL puro) e `api/src/seed.js` (via Sequelize) reproduzem o mesmo orçamento do **Dia das Crianças nas Escolas (02 a 09/10/2026)**: 13 locações, 822 alunos, **R$ 13.760,00** no total.
