# SAFIRA

**Sistema de Análise Facilitada de Informações e Requerimentos Assistenciais**

Plataforma web modular para automação e conferência de análises de benefícios. O SAFIRA centraliza, em uma única aplicação, módulos especializados que transformam tarefas manuais e repetitivas — extração de dados de documentos, cruzamento de índices e preenchimento de sistemas de destino — em fluxos guiados, auditáveis e de baixo risco operacional.

---

## Sumário

1. [Visão Geral](#visão-geral)
2. [Tecnologias](#tecnologias)
3. [Pré-requisitos](#pré-requisitos)
4. [Como Rodar Localmente](#como-rodar-localmente)
5. [Estrutura de Pastas](#estrutura-de-pastas)
6. [Arquitetura e Princípios](#arquitetura-e-princípios)
7. [Scripts Disponíveis](#scripts-disponíveis)
8. [Contribuição](#contribuição)

---

## Visão Geral

O SAFIRA foi projetado como um **hub de módulos**: cada módulo resolve um problema de análise específico, compartilhando a mesma base de design, infraestrutura e componentes. A arquitetura privilegia:

- **Processamento local e sem persistência** — documentos são analisados em memória, na própria API da aplicação, e nenhum dado é armazenado.
- **Contrato único de tipos** — frontend e backend compartilham as mesmas definições TypeScript, eliminando divergências entre camadas.
- **Extensibilidade** — novos módulos são adicionados como rotas e bibliotecas independentes, sem impacto nos existentes.

### Módulo B94+

Primeiro módulo em produção. Recebe um texto tabular de índices anuais (CONREAJ) e um PDF de resumo de benefício, extrai as matrizes mês × ano do documento, cruza os períodos com contribuição contra os índices informados e devolve blocos prontos para exportação (cópia formatada para a área de transferência, compatível com o sistema de destino).

**Fluxo de alto nível**

```
Texto CONREAJ + PDF  ──►  POST /api/analyze-b94
                              │
                              ├─ extração de linhas do PDF (unpdf)
                              ├─ parsing dos índices anuais
                              ├─ detecção de matrizes M/A e meses
                              └─ agrupamento em blocos de 5 anos
                              │
                     ◄────────┘  { blocks: BlocoB94[] }
```

---

## Tecnologias

| Camada | Tecnologia | Versão | Finalidade |
|---|---|---|---|
| Framework | [Next.js](https://nextjs.org) (App Router, Turbopack) | 16.x | SSR, roteamento e API Routes |
| UI | [React](https://react.dev) | 19.x | Componentização |
| Linguagem | [TypeScript](https://www.typescriptlang.org) | 5.x | Tipagem estática (modo `strict`) |
| Estilos | [Tailwind CSS](https://tailwindcss.com) | 4.x | Design system utilitário |
| Estado | [Zustand](https://zustand-demo.pmnd.rs) | 5.x | Estado global leve do workspace |
| Primitivas UI | [Radix UI](https://www.radix-ui.com) · [CVA](https://cva.style) · `clsx` · `tailwind-merge` | — | Acessibilidade e variantes de componentes |
| Ícones | [Lucide](https://lucide.dev) | 1.x | Iconografia consistente |
| PDF | [unpdf](https://github.com/unjs/unpdf) | 1.x | Extração de texto server-side |
| Qualidade | ESLint 9 (`eslint-config-next`) | — | Lint e regras React/TS |
| Pacotes | [pnpm](https://pnpm.io) | 11.x | Gerenciamento de dependências |

---

## Pré-requisitos

| Requisito | Versão mínima | Observação |
|---|---|---|
| **Node.js** | 20.9 LTS | Requisito do Next.js 16 |
| **pnpm** | 11.x | Gerenciador oficial do projeto (`packageManager` em `package.json`) |
| **Git** | 2.x | Controle de versão |

Instalação do pnpm, caso necessário:

```bash
corepack enable
corepack prepare pnpm@latest --activate
```

> **Windows / PowerShell:** se a execução de scripts estiver bloqueada, utilize `pnpm.cmd` no lugar de `pnpm`, ou ajuste a política com `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`.

---

## Como Rodar Localmente

### 1. Clonar o repositório

```bash
git clone <URL_DO_REPOSITORIO> safira
cd safira
```

### 2. Instalar dependências

```bash
pnpm install
```

### 3. Configurar variáveis de ambiente (opcional)

A aplicação não exige variáveis de ambiente para execução local. Caso sejam introduzidas, utilize um arquivo `.env.local` (ignorado pelo Git) e documente as chaves em um `.env.example`.

### 4. Ambiente de desenvolvimento

```bash
pnpm dev
```

| Recurso | URL |
|---|---|
| Aplicação | http://localhost:3000 |
| Módulo B94+ | http://localhost:3000/b94+ |
| Health check da API | http://localhost:3000/api/health |

### 5. Build e execução em produção

```bash
pnpm build
pnpm start
```

O servidor de produção escuta em `0.0.0.0:3000` por padrão. Ajuste a porta com a variável `PORT`.

### 6. Verificações de qualidade

```bash
pnpm lint                # ESLint
pnpm exec tsc --noEmit   # Verificação de tipos
```

---

## Estrutura de Pastas

```text
safira/
├── public/                         # Ativos estáticos servidos na raiz
├── src/
│   ├── app/                        # App Router (rotas, layouts, API)
│   │   ├── api/
│   │   │   ├── analyze-b94/route.ts    # POST — análise CONREAJ + PDF
│   │   │   └── health/route.ts         # GET  — health check
│   │   ├── b94+/page.tsx           # Rota do módulo B94+
│   │   ├── sobre/page.tsx          # Guia de uso e créditos
│   │   ├── layout.tsx              # Layout raiz (fontes, tema, metadados)
│   │   ├── page.tsx                # Página inicial (hub de módulos)
│   │   └── globals.css             # Tokens de design e estilos globais
│   │
│   ├── components/
│   │   ├── ui/                     # Primitivas de UI reutilizáveis
│   │   │   ├── alert.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── icon-button.tsx
│   │   │   ├── table.tsx
│   │   │   ├── textarea.tsx
│   │   │   └── tooltip.tsx
│   │   ├── b94/                    # Componentes do módulo B94+
│   │   │   └── b94-mais-workspace.tsx
│   │   ├── app-header.tsx          # Cabeçalho global
│   │   ├── brand.tsx               # Identidade visual (logotipos e links)
│   │   ├── page-shell.tsx          # Casca padrão de página (fundo, cabeçalho, container)
│   │   ├── theme-provider.tsx      # Contexto de tema (claro/escuro)
│   │   └── theme-toggle.tsx        # Alternador de tema
│   │
│   ├── lib/
│   │   ├── cn.ts                   # Utilitário de composição de classes
│   │   └── b94/                    # Domínio B94+ (puro, sem dependência de UI)
│   │       ├── blocos.ts           # Agrupamento de anos em blocos
│   │       ├── conreaj.ts          # Parser dos índices CONREAJ
│   │       ├── copy.ts             # Serialização para área de transferência
│   │       ├── format.ts           # Formatação de valores
│   │       ├── inss-pdf.ts         # Extração de matrizes do PDF
│   │       ├── numero.ts           # Conversão numérica pt-BR
│   │       ├── pdf-text.ts         # Extração de linhas via unpdf
│   │       └── types.ts            # Contratos compartilhados (front/back)
│   │
│   └── store/
│       └── b94-store.ts            # Estado global do workspace (Zustand)
│
├── eslint.config.mjs
├── next.config.ts
├── postcss.config.mjs
├── tsconfig.json
├── pnpm-lock.yaml
└── package.json
```

---

## Arquitetura e Princípios

- **Separação por domínio.** A lógica de negócio do B94+ vive em `src/lib/b94` como funções puras e testáveis, sem acoplamento a React ou Next.js. A API Route e os componentes são apenas adaptadores.
- **Componentes de camada única.** `components/ui` contém primitivas agnósticas; `components/*` contém composições de aplicação; `components/<módulo>` contém telas específicas.
- **Design system centralizado.** Tokens de cor, tipografia e superfície ficam em `globals.css`; variações são expressas via CVA e classes utilitárias, evitando estilos ad hoc.
- **Sem estado servidor.** A API é stateless e opera exclusivamente em memória, o que simplifica escalabilidade horizontal e elimina requisitos de retenção de dados.
- **Convenção de nomenclatura.** Identificadores de domínio e componentes em português; APIs de framework e bibliotecas permanecem em inglês.

---

## Scripts Disponíveis

| Comando | Descrição |
|---|---|
| `pnpm dev` | Servidor de desenvolvimento com Turbopack e HMR |
| `pnpm build` | Build otimizado para produção |
| `pnpm start` | Servidor de produção |
| `pnpm lint` | Análise estática com ESLint |

---

## Contribuição

1. Crie uma branch a partir de `master` seguindo o padrão `feat/`, `fix/` ou `refactor/`.
2. Mantenha as mensagens de commit no formato [Conventional Commits](https://www.conventionalcommits.org).
3. Garanta que `pnpm lint` e `pnpm build` sejam executados com sucesso antes de abrir um Pull Request.
4. Novos módulos devem seguir a estrutura `app/<modulo>` + `components/<modulo>` + `lib/<modulo>`.
