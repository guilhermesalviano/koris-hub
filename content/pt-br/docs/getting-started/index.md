---
title: Primeiros passos
order: 3
---

# Primeiros passos

O Koris é um framework de agente de IA autônomo escrito em TypeScript. Ele recebe
mensagens por canais plugáveis (Telegram, WhatsApp, uma interface de terminal e um
dashboard web), processa cada uma com um LLM e pode executar ferramentas em seu nome.
O estado fica em um banco SQLite local, então memória e sessões sobrevivem a
reinicializações.

## Requisitos

- Node.js >= 24
- `pnpm` — o repositório é um workspace pnpm de pacote único. Nunca use `npm` ou `yarn`.

## Instalação e execução

```bash
pnpm install
pnpm build      # compila o TypeScript e o frontend web
pnpm app        # dashboard web em http://localhost:3000
```

O `pnpm build` é obrigatório antes do `pnpm app`. Para rodar outra interface:

- `pnpm app` — dashboard web
- `pnpm app --tui` — interface de terminal

## Configuração

Na primeira execução sem um `koris.json`, o app web abre um assistente de configuração
no navegador — não é preciso editar arquivo de config na mão. Dois pontos de entrada na
CLI cobrem o mesmo caminho:

- `pnpm onboard` — o fluxo de onboarding pela CLI
- `pnpm validate` — verifica o `koris.json` contra o schema esperado

Em um checkout normal, o `koris.json` fica no diretório de trabalho. A separação entre
`BASE_DIR` e `DATA_DIR` só importa para o app desktop empacotado. Não há migração
automática do bloco `ai` a partir de layouts antigos — se ele divergir, gere de novo a
partir do `koris.example.json`. Veja [Provedores de IA](/pt-br/docs/ai-providers) para o
formato atual.

## App desktop

`apps/desktop/` é uma casca fina em Electron. Ele não reimplementa a interface: gerencia
o servidor do Koris e carrega o dashboard web existente em uma janela nativa. É
empacotado com o electron-builder.

## Limpando o estado

```bash
pnpm clear:memory   # apaga os arquivos do banco SQLite local
```

## Próximos passos

- [Conceitos](/pt-br/docs/concepts) — fluxo de mensagens, sessões, memória, compactação, confiança
- [Canais](/pt-br/docs/channels) — Telegram, WhatsApp, TUI, dashboard web
- [Provedores de IA](/pt-br/docs/ai-providers) — provedores, papéis, embeddings, enfileiramento
- [Dashboard administrativo](/pt-br/docs/admin-dashboard) — a interface administrativa web
