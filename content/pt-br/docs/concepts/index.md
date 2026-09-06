---
title: Conceitos
order: 4
---

# Conceitos

Como uma mensagem vira uma resposta no Koris, e as peças que mantêm o estado entre uma
mensagem e outra.

## Fluxo de mensagens

1. Um plugin de canal (Telegram, WhatsApp ou a TUI) recebe uma mensagem, normaliza para
   um `InboundChannelMessage` e entrega ao `IChannelHandler` genérico. Esse handler
   aplica as regras do canal — filtro de menção em grupo, liberação de ferramentas e
   skills aprendidas conforme a confiança, prefixo de prompt, divisão de respostas — e
   então chama `MessageGateway.handle`.
2. O `MessageGateway` resolve a sessão do remetente, verifica se a mensagem é um comando
   de barra e, caso não seja, delega ao **MainAgent**.
3. O **MainAgent** chama `ChatService.complete`. O prompt completo é montado pelo
   `PromptRepository` (prompt de sistema, contrato de execução de ferramentas, schemas
   das ferramentas, skills aprendidas, memórias recuperadas e histórico de mensagens) e
   enviado ao provedor de IA.
4. Se o modelo devolver chamadas de ferramenta, elas vão para o **ToolCallPipeline** e
   depois para o **ExecutorWorker**, que repete o ciclo chamada-resultado-nova chamada
   até o modelo devolver uma mensagem final.
5. Depois que a resposta é enviada, tarefas em segundo plano são disparadas: um
   **ConversationWorker** persiste a troca e o sub-agente **Summarizer** pode condensar o
   contexto mais antigo em memórias.

Veja [Provedores de IA](/pt-br/docs/ai-providers) para como cada agente é roteado a um
provedor e modelo, e como chamadas simultâneas ao modelo são ordenadas.

## Agentes e workers

- **MainAgent** — o orquestrador principal; dono da conversa com o modelo.
- **ExecutorWorker** — executa o ciclo de chamadas de ferramenta até a mensagem final.
- **Sub-agente Summarizer** — condensa o contexto em linhas de `memories`, em segundo plano.
- **Sub-agente Heartbeat** — executa os beats agendados (veja abaixo).

## Sessões

Uma sessão é uma conversa em andamento. Comandos de barra controlam seu ciclo de vida:

- `/clear` (apelido `/reset`) encerra a sessão e começa outra, vazia — nada é levado adiante.
- `/compact` resume a sessão na memória e rotaciona para uma sessão nova, semeada com esse resumo.

A lista completa de comandos está na [referência de comandos](/pt-br/docs/commands).

## Memória

O estado fica em um banco SQLite local (`better-sqlite3`, síncrono, modo WAL), com o
arquivo em `core/memory/`. Tabelas:

| Tabela | Guarda |
| --- | --- |
| `sessions` | uma linha por conversa |
| `messages` | histórico de curto prazo; `role` é `user`, `assistant` ou `system` |
| `memories` | anotações de longo prazo; `type` é `summary`, `fact`, `lesson` ou `reminder` |
| `images` | anexos em base64 referenciados por linhas de mensagem |
| `learned_skills` | skills sincronizadas da pasta `plugins/skills/` |
| `heartbeat` | beats agendados |
| `plugin_settings` | estado de ativação por plugin, para cada ferramenta e canal |

Todo acesso passa por `core/src/repositories/*` — não se escreve SQL em outro lugar. O
`pnpm clear:memory` apaga os arquivos do banco.

## Summarizer e compactação

Com `session.summarizer_mode: "manual"`, o resumo por turno fica desligado. Nesse modo o
`MessageGateway` aplica uma válvula de segurança:

- **Antes de um turno**, se a contagem estimada de tokens da sessão atingir
  `session.compact_threshold` (padrão `0.9`) vezes o `num_ctx` do gerenciador, ele
  compacta automaticamente: resume a sessão na memória e rotaciona para uma sessão nova
  semeada com o resumo.
- **De forma reativa**, diante de um erro de `context_length` vindo do provedor, faz a
  mesma compactação e tenta o turno mais uma vez.

Nos dois casos ele imprime um aviso de uma linha explicando o que aconteceu. No modo
padrão `auto` isso não se aplica, porque cada troca já é condensada.

## Heartbeats

Heartbeats são sub-agentes agendados por cron. O `core/heartbeats.default.json` é
semeado na tabela `heartbeat` a cada inicialização: os beats definidos em configuração
são marcados como `managed` e mantidos totalmente em sincronia (atualizados quando mudam,
removidos quando saem do arquivo), enquanto os beats criados por você pela ferramenta
`set_beat` ou pelo dashboard nunca são tocados.

O beat reservado `__koris_clear_images__` é tratado nativamente — sem chamada ao modelo —
e apenas esvazia a tabela `images`.

As ferramentas de beat (`set_beat`, `list_beats`, `update_beat`, `delete_beat`) estão
documentadas na [referência de ferramentas](/pt-br/docs/tools).
