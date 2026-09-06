---
title: Ferramentas
order: 7
---

# Ferramentas

Ferramentas são as capacidades do agente de IA — as ações que ele pode tomar além de
responder com texto. Cada uma é um [plugin](/pt-br/docs/plugins) em `plugins/tools/`,
uma pasta por ferramenta, e cada pasta é dona do seu próprio schema exposto ao LLM, do
seu handler e das regras de quando ela é oferecida.

## Como uma chamada de ferramenta acontece

Na inicialização, o framework varre `plugins/tools/`, coleta cada `ToolDefinition` e
guarda a lista no `ToolPluginsSingleton`. Quando o modelo emite uma chamada de
ferramenta, o `AgnosticExecutionTool` compara o nome da chamada com essa lista e executa
o `handler` da definição correspondente.

Toda definição também carrega um filtro `enabled(opts)` que decide se a ferramenta é
sequer mostrada ao modelo naquele turno. Ele considera o nível de confiança do remetente,
se as figurinhas estão ativadas e — no caso das ferramentas de beat — se a chamada vem de
uma execução de heartbeat.

## Ferramentas nativas

| Ferramenta | O que faz |
| --- | --- |
| `curl_request` | Faz uma requisição HTTP. Restrita pela lista de domínios permitidos — veja [Segurança](/pt-br/docs/security). |
| `search_engine` | Busca na web por uma instância própria do SearXNG (`ai.searxng_url`). |
| `read_url` | Abre uma página e devolve o texto legível — o passo seguinte a um resultado do `search_engine`. Restrita pela lista de domínios permitidos; informa o comando `/allow` quando um host está bloqueado. |
| `restart_search_engine` | Recupera o `search_engine` de falhas de conexão ou 403. Exige confirmação; executa `scripts/run_search_engine.sh --restart`. |
| `issue` | Rastreamento de issues no GitHub. |
| `set_beat` | Cria um beat agendado por cron (um agente [heartbeat](/pt-br/docs/concepts)). |
| `list_beats` | Lista os beats configurados. |
| `update_beat` | Altera um beat existente. |
| `delete_beat` | Remove um beat. |
| `send_message` | Envia uma mensagem por um canal fora do turno atual. |
| `learn_sticker` | Registra uma regra de quando enviar uma figurinha. |
| `send_sticker` | Envia uma figurinha. |
| `unlearn_sticker` | Remove uma regra de figurinha. |
| `create_tool` | Cria o esqueleto de uma ferramenta nova pela conversa. Desativada por padrão, exige confirmação e nunca fica utilizável no mesmo processo — plugins só são descobertos na inicialização, então é preciso reiniciar. |

## Ativando e desativando

O estado de liga/desliga fica no banco, na tabela `plugin_settings` — não em um arquivo
de configuração. Toda ferramenta vem ativada por padrão, exceto a `create_tool`, que vem
desativada. A alternância vale na hora, sem reiniciar, pelo painel de Plugins ou pelo
assistente de configuração no [dashboard administrativo](/pt-br/docs/admin-dashboard).

Remetentes não confiáveis não recebem ferramenta alguma — nem busca, nem figurinhas.
Veja [Segurança](/pt-br/docs/security) para como a confiança é decidida.

## Adicionando uma ferramenta

Crie uma pasta em `plugins/tools/`, ou gere o esqueleto:

```bash
pnpm scaffold:tool <nome> --description "..."
```

Nenhuma alteração em `core/` é necessária — o scanner encontra a pasta nova na próxima
inicialização. Veja [Plugins](/pt-br/docs/plugins) para o contrato de plugin.

Para navegar pelas ferramentas que acompanham o Koris, veja o [marketplace](/pt-br/marketplace).
