# SAFIRA

Aplicação em TypeScript (Next.js) para ferramentas previdenciárias. O primeiro módulo é o **B94 Easy**, portado do protótipo Python + Next.js.

## Stack

- Next.js 16 + React 19 + TypeScript
- Tailwind CSS
- Parsers CONREAJ / PDF INSS em TypeScript (`src/lib/b94`)
- API no próprio Next.js (`/api/analyze-b94`)

Não há Python. Front e back compartilham os mesmos tipos e a mesma pasta.

## Setup

```bash
cd SAFIRA/safira
pnpm install
pnpm dev
```

- App: http://localhost:3000
- B94 Easy: http://localhost:3000/b94easy
- Saúde da API: http://localhost:3000/api/health

## Estrutura

```text
src/
  app/                 # rotas Next.js e API
  components/          # UI (design do B94 Easy preservado)
  lib/b94/             # lógica que era Python
  store/               # estado do workspace B94
```
