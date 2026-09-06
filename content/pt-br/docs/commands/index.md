---
title: Comandos
order: 11
---

# Comandos

Comandos de barra são interceptados pelo `MessageGateway` antes de a mensagem chegar ao
agente. O reconhecimento, o preenchimento por canal e o texto do `/help` são todos
derivados de uma única lista, `SLASH_COMMANDS` em
`core/src/services/commands/registry.ts`, de modo que um comando é adicionado ou
aposentado em exatamente um lugar.

## Referência

| Comando | Uso | O que faz |
| --- | --- | --- |
| `/help` | `/help [comando]` | Mostra a ajuda; `/help <comando>` detalha um comando. |
| `/status` | | Conexão, provedor de IA, modelo e modo da sessão. |
| `/usage` | `/usage [dias\|today]` | Relatório de uso de tokens a partir do log de auditoria. |
| `/whoami` | | Como o agente enxerga você: canal e nível de acesso. |
| `/memory` | | O que do contexto anterior já foi resumido nesta sessão. |
| `/clear` | | Encerra esta sessão e começa outra, vazia. Nada é levado adiante. |
| `/compact` | | Resume esta sessão na memória e começa uma nova, semeada com o resumo. |
| `/allow` | `/allow <domínio>` | Adiciona um domínio ao `allowed_domains`. Apenas remetentes confiáveis. |
| `/exit` | | Como sair da sessão. Listado apenas na TUI. |

`/reset` é um apelido para `/clear`. `/quit` e `/bye` são apelidos para `/exit`.

## Observações

- **`/usage`** agrega chamadas ao LLM, chamadas de ferramentas, tokens e tempo de
  execução. `/usage` é o total geral, `/usage today` é desde a meia-noite e `/usage 7`
  são os últimos 7 dias.
- **`/clear` vs `/compact`** — o `/clear` descarta a conversa atual por completo; o
  `/compact` guarda um resumo. Veja [Conceitos](/pt-br/docs/concepts) para como sessões e
  resumos funcionam.
- **`/allow`** edita a lista de domínios que restringe as requisições de saída. Somente
  remetentes confiáveis podem executá-lo. Veja [Segurança](/pt-br/docs/security).
- **`/status`** informa qual provedor e modelo estão atendendo a sessão atual. Veja
  [Provedores de IA](/pt-br/docs/ai-providers).

## Acesso

Comandos marcados como confiáveis são restritos a usuários autorizados. Um remetente não
autorizado que executar um deles é orientado a pedir ao administrador para ser incluído
na lista de permitidos.
