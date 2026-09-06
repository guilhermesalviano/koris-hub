---
title: Dashboard administrativo
order: 12
---

# Dashboard administrativo

O Koris inclui um dashboard no navegador para conversar com o agente e gerenciar sua
configuração.

## O que o serve

A interface é uma SPA em React 19 (Vite, React Router, Tailwind) em `apps/web/`. O lado
servidor é um app Express em `core/src/dashboard/` escutando na porta 3000; ele serve o
bundle compilado de `dist-web/` e recorre ao `index.html` em qualquer rota não
reconhecida, de modo que o roteamento fica com a SPA. Abrir `/` redireciona para
`/admin`, que cai na visão de conversa.

## Navegação

O menu à esquerda leva a:

- **Overview** (`/admin/overview`) — o status em um relance.
- **Memories** (`/admin/memories`) — as linhas de `memories` de longo prazo.
- **Beats** (`/admin/heartbeats`) — cria, atualiza e remove beats agendados; expressões
  cron são validadas ao salvar.
- **Skills** (`/admin/skills`) — a lista combinada de skills em disco e no banco; ative ou
  desative cada uma, ou dispare uma sincronização manual.
- **Queue** (`/admin/queue`) — o estado da fila de provedores e sub-agentes.
- **Audit** (`/admin/audit`) — o log de auditoria de uso de tokens e de chamadas.

Um painel de conversas lista suas sessões; cada uma abre em `/admin/chat/<sessionId>`, e
iniciar uma conversa nova vai para `/admin/chat`.

## Conversa

O histórico anterior é carregado pela API administrativa. As respostas chegam por
streaming em Server-Sent Events a partir de `/api/chat`, que aceita um `sessionId`
opcional para mirar uma sessão específica. Uma barra de contexto mostra o uso estimado de
tokens da sessão em relação ao `num_ctx` do gerenciador.

## Configurações

A configuração fica em um modal com quatro abas:

- **Providers** — o catálogo de provedores com um botão de testar conexão. Ativar um
  provedor para um papel grava um patch parcial de configurações, então trocar um papel
  nunca descarta as credenciais de outro provedor. Veja
  [Provedores de IA](/pt-br/docs/ai-providers).
- **Channels** — configurações por canal e o botão de confiança para remetentes não
  listados. Veja [Canais](/pt-br/docs/channels).
- **Sessions** — opções no nível da sessão, como o modo do summarizer.
- **General** — todo o resto.

Segredos nas respostas de configuração são mascarados em profundidade. Um modal separado
de Plugins lista cada plugin de ferramenta e de canal com um botão de liga/desliga ao
vivo; veja [ferramentas](/pt-br/docs/tools) e [plugins](/pt-br/docs/plugins).

## Primeira execução

Sem um `koris.json`, a primeira visita abre um assistente de configuração em `/setup`,
que percorre provedores, canais e uma etapa de plugins antes de escrever a configuração
inicial.

## API e fluxo de desenvolvimento

A API administrativa fica em `/api/admin`. `POST /api/admin/sessions` cria uma sessão
nova sem encerrar a atual.

- `pnpm dev:client` — servidor de desenvolvimento do Vite na porta 5173, com proxy de
  `/api` e `/health` para `localhost:3000`.
- `pnpm build:client` — compila o frontend em `dist-web/`.
- `pnpm lint:client` — checagem de tipos em `apps/web/`.
