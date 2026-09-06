---
title: Segurança
order: 13
---

# Segurança

O Koris roda na sua própria infraestrutura e conversa com pessoas não confiáveis por
canais públicos. Os controles abaixo limitam o que o agente alcança e quem pode conduzi-lo.

## Lista de domínios permitidos

Ferramentas que acessam a rede — `curl_request`, `read_url` e `search_engine` — são
verificadas contra uma lista de permissões antes de executar. A lista é o
`allowed_domains` no `koris.json`. Uma requisição a um host fora da lista devolve uma
mensagem de erro em vez de executar; uma lista vazia bloqueia todas essas requisições.

O gate fica em `core/src/services/security/gate.ts`. Plugins de ferramenta nunca o
importam diretamente — `core/src/app.ts` o injeta em cada ferramenta como
`context.security.gateUrl`.

Remetentes confiáveis podem estender a lista em tempo de execução com `/allow <domínio>`.
Veja [Comandos](/pt-br/docs/commands).

O `read_url` é construído em torno desse comando: uma página encontrada por busca
normalmente não está na lista, então, em vez de um erro seco, ele informa o host
bloqueado e a linha exata de `/allow` que o libera, e é orientado a não tentar de novo
até que alguém a execute.

## Modelo de confiança

A confiança é decidida por canal. Cada canal tem uma whitelist e uma flag
`allow_unlisted_senders`. Quando o remetente não está na whitelist:

- Com `allow_unlisted_senders` desligada, ele não recebe resposta.
- Com ela ligada, ele é respondido como não confiável e não recebe **ferramenta alguma**
  — nem figurinhas, nem busca — e **nenhuma skill aprendida**.

Os detalhes de configuração de cada canal estão em [Canais](/pt-br/docs/channels).

## Ferramentas que exigem confirmação

Algumas [ferramentas](/pt-br/docs/tools) nunca executam apenas por decisão do modelo:

- `restart_search_engine` — exige confirmação explícita do usuário. Ela recria a stack de
  busca própria para se recuperar de falhas de conexão ou 403.
- `create_tool` — exige confirmação, vem desativada por padrão e não pode ter efeito até
  o processo reiniciar, porque plugins só são descobertos na inicialização.

## Execução de comandos

Plugins de ferramenta que executam processos compartilham os utilitários de
`plugins/tools/runtime.ts`: `spawn` / `execFile` sem shell (uma defesa estrutural contra
injeção de shell) e um limite de 10 MB na saída capturada. Veja
[Plugins](/pt-br/docs/plugins).

## Tratamento de segredos

A API de configurações administrativas mascara segredos em profundidade nas suas
respostas, incluindo `BOT_TOKEN`, `API_TOKEN` e `SEARCH_API_KEY`. Os segredos de canal
ficam no `config.yml` de cada plugin de canal; apenas a flag de ativado/desativado foi
para o banco.
