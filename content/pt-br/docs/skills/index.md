---
title: Skills
order: 8
---

# Skills

Uma skill é um arquivo Markdown que ensina o agente a lidar com um tipo específico de
pedido. Skills são instruções, não código — quando uma skill está ativa, seu conteúdo é
incorporado ao contexto do agente para que o modelo saiba o que fazer. Compare com as
[ferramentas](/pt-br/docs/tools), que são handlers executáveis que o modelo chama.

## Anatomia

Cada skill é uma pasta em `plugins/skills/` contendo um `SKILL.md`:

```
plugins/skills/
  weather/
    SKILL.md
```

O `SKILL.md` tem front-matter YAML com `name` e `description`, seguido de um corpo de
instruções:

```md
---
name: weather
description: "Get current weather and forecasts. Use when the user asks about weather,
  temperature, or forecasts for a location. No API key needed."
---

As instruções para o agente vão aqui.
```

A `description` é o que o agente usa para decidir se a skill é relevante, então seja
específico sobre quando usá-la e quando não usar.

## Como as skills são carregadas

O `SkillSyncService` (`core/src/services/skills/skill-sync.ts`) sincroniza
`plugins/skills/` com a tabela `learned_skills` na inicialização e novamente a cada
alteração de arquivo, usando um watch de sistema de arquivos com debounce de 500 ms.
Linhas cuja pasta de skill foi removida são descartadas na sincronização seguinte.

Na sincronização, o corpo de cada skill é envolvido pelo `SKILL_LEARNING_PROMPT`, com o
marcador `<GATEWAY_HOST>` resolvido para `config.GATEWAY_HOST`.

## Confiança

Apenas remetentes confiáveis recebem skills aprendidas. Um remetente não confiável recebe
uma resposta simples, sem skills e sem ferramentas. Veja
[Segurança](/pt-br/docs/security) para como a confiança é decidida por canal.

## Skills que acompanham o Koris

- `weather`
- `cat-fact`
- `calendar-coredash`
- `emails-coredash`
- `todo-coredash`
- `koris-help`

## Adicionando uma skill

1. Crie `plugins/skills/<nome>/SKILL.md` com front-matter `name` e `description` e um corpo.
2. Salve o arquivo — o watcher detecta a mudança, ou reinicie o app.
3. Na página de Skills do dashboard administrativo você pode ativar ou desativar skills
   individualmente e disparar uma sincronização manual. Veja o
   [dashboard administrativo](/pt-br/docs/admin-dashboard).

Para publicar uma skill no catálogo, siga
[Adicionando uma entrada no marketplace](/pt-br/docs/marketplace/adding-an-entry); ela
aparecerá no [marketplace](/pt-br/marketplace) ao lado de ferramentas e canais.
