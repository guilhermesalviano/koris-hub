---
title: Provedores de IA
order: 6
---

# Provedores de IA

O Koris conversa com modelos de linguagem por um pequeno conjunto de implementações de
provedor. Você escolhe qual provedor atende cada papel no `koris.json`; o framework
resolve a partir daí o modelo, a janela de contexto e as credenciais.

## Provedores disponíveis

- **Ollama** — cliente nativo contra um endpoint `/api/chat` local. Envia a janela de
  contexto como `options.num_ctx`.
- **Mock** — um provedor de eco usado em testes. É forçado automaticamente sob o Vitest e
  é o fallback quando o nome do provedor não é reconhecido.
- **Compatível com OpenAI** — um cliente genérico de Chat Completions parametrizado por um
  preset. Os presets são `openai`, `openrouter`, `deepseek`, `groq`, `xai`, `mistral`,
  `together`, `gemini` e `nvidia`. Cada preset carrega uma base URL padrão e, na maioria
  dos casos, um modelo recomendado e links para as páginas de chave e de modelos do
  fornecedor. Este cliente envia a janela de contexto como o `max_tokens` da requisição.

## O bloco `ai` no `koris.json`

Cada provedor configurado aparece uma única vez em `ai.providers[]`. Uma entrada é
`{ provider, base_url, api_token, num_ctx?, model }` — um modelo por provedor, e o nome em
`provider` é a chave única da entrada.

```json
{
  "ai": {
    "providers": [
      {
        "provider": "ollama",
        "base_url": "http://localhost:11434",
        "api_token": "PROVIDER_API_TOKEN",
        "num_ctx": 16384,
        "model": "gemma4:e4b-it-q4_K_M"
      }
    ],
    "roles": {
      "manager": { "provider": "ollama" },
      "workers": { "provider": "ollama" }
    },
    "embed": { "enabled": true, "provider": "ollama", "model": "nomic-embed-text" }
  }
}
```

### Papéis

`ai.roles.<papel>` é apenas `{ provider }`, apontando para uma entrada em
`ai.providers[]`. O modelo é resolvido a partir dessa entrada, não repetido no ponteiro.

- `ai.roles.manager` — o agente principal, que responde a você.
- `ai.roles.workers` — os workers executores, o sub-agente summarizer e o sub-agente de
  heartbeat.

Você pode apontar os dois papéis para o mesmo provedor ou separá-los — por exemplo, um
modelo grande para o manager e um mais barato para os workers.

### Janela de contexto

O `num_ctx` assume `16384` quando omitido. O cliente compatível com OpenAI o envia como o
`max_tokens` da requisição; o cliente do Ollama o envia como `options.num_ctx`. Se
`base_url` ficar vazio, o provedor recorre à URL padrão que acompanha o preset.

### Embeddings

`ai.embed` é um ponteiro separado, `{ enabled, provider, model }`. Seu `base_url` e
`api_token` são reaproveitados da entrada correspondente em `ai.providers[]`, mas o
`model` fica no ponteiro, porque o modelo de embedding difere do modelo de chat.

Alguns provedores não têm endpoint `/embeddings` — `groq` e `xai`, por exemplo — e a
chamada `embed()` deles lança erro. Quem chama captura esse erro e apenas avisa, em vez de
falhar, então a memória semântica degrada silenciosamente para nenhum embedding. Se você
depende de recuperação semântica, aponte `ai.embed` para um provedor com suporte a
embeddings. Veja [Conceitos](/pt-br/docs/concepts) para como a memória usa embeddings.

### Sem migração de layouts antigos

Este é o único formato de `ai` que o Koris entende. Não há migração automática a partir de
layouts anteriores — se o arquivo divergir, gere o bloco `ai` de novo a partir do
`koris.example.json`.

## Erros e novas tentativas

As mensagens de erro dos provedores preservam um token de status `(NNN)` ou uma palavra-
chave reconhecida. O Koris as classifica em `aborted`, `timeout`, `authentication`,
`rate_limited`, `unavailable`, `malformed_response`, `context_length` ou `unknown`, e
repete as que valem a pena repetir.

Um erro de `context_length` enquanto a sessão está no modo manual do summarizer faz o
gateway compactar automaticamente, rotacionar para uma sessão nova semeada com o resumo e
tentar o turno mais uma vez. Veja [Conceitos](/pt-br/docs/concepts) para compactação de
sessão.

## Ordenação de chamadas

Duas flags independentes controlam como as chamadas ao LLM são agendadas.

- `ai.parallel` — no nível do provedor. O padrão `true` executa as chamadas ao LLM em
  paralelo. Defina como `false` para afunilar todas as chamadas em um único slot
  compartilhado, no qual as chamadas interativas (o manager e os workers executores)
  passam à frente das chamadas de segundo plano (o summarizer e o heartbeat), e o trabalho
  de segundo plano espera um curto período de carência após a última chamada interativa.
- `ai.subagents_parallel` — no nível dos sub-agentes, independente da anterior. O padrão
  `false` faz o heartbeat e o summarizer compartilharem uma única fila, de modo que nunca
  rodam ao mesmo tempo. Defina como `true` para dar uma fila a cada um.

Nem o heartbeat nem o summarizer executam suas próprias tarefas em paralelo,
independentemente dessas flags.

## Adicionando um provedor

- **Serviço compatível com OpenAI** — adicione uma linha em `openai-compatible/presets.ts`.
- **Provedor nativo** — crie `core/src/services/providers/<nome>/index.ts` exportando
  `providerManifest()` e então adicione-o ao array em
  `core/src/services/providers/index.ts`.

O onboarding, o assistente de configuração, a página de Providers e as verificações de
conectividade leem todos o registro de manifestos, então um provedor novo aparece em todos
eles sem ligação adicional. Veja o
[dashboard administrativo](/pt-br/docs/admin-dashboard) para a página de Providers.
