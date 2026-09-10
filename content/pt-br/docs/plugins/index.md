---
title: Plugins
order: 9
---

# Plugins

Plugins são a forma de estender o Koris sem tocar no core. Há três famílias de plugin —
[canais](/pt-br/docs/channels), [ferramentas](/pt-br/docs/tools) e [servidores MCP](/pt-br/docs/mcps) —
que compartilham o mesmo formato e o mesmo kernel, descritos abaixo. A pasta `plugins/` também abriga
[skills](/pt-br/docs/skills), mas skills são um tipo diferente de extensão: Markdown
puro, sincronizado pelo `SkillSyncService` em vez do kernel descrito nesta página.

## O kernel

`plugins/registry.ts` contém o núcleo agnóstico de família: `ExtensionPoint`,
`PluginRegistry` e `buildRegistry`. As três famílias se apoiam nele. Na inicialização,
`core/src/app.ts` monta um único `PluginRegistry` compartilhado a partir dos plugins de
canal, ferramenta e servidores MCP juntos.

## Inversão de dependência

Um plugin importa **somente** do `contracts.ts` da sua própria família e do
`plugins/registry.ts` compartilhado. Ele nunca importa de `core/src/`, nem do
`contracts.ts` de outra família.

O core depende dos SDKs e injeta serviços concretos no sentido contrário, por um
`PluginContext` (canais), `ToolPluginContext` (ferramentas) ou `McpPluginContext` (mcps)
montado na raiz de composição, `core/src/app.ts`. Cada pasta de plugin expõe uma função
`create(context)` que recebe esse contexto.

A única exceção documentada é `plugins/tools/create-tool/`, que acessa
`scripts/scaffold-tool.ts` para gerar novas pastas de ferramenta.

## Descoberta

O scanner carrega todo subdiretório da pasta de uma família — `plugins/channels/`,
`plugins/tools/` e `plugins/mcps/`. Arquivos soltos nessas pastas, como o `contracts.ts`,
são ignorados. Adicionar um plugin significa adicionar uma pasta; para ferramentas, o
`pnpm scaffold:tool <nome>` cria uma para você. Nenhuma alteração no core é necessária.
(`plugins/skills/` fica ao lado dessas, mas não é varrida aqui — veja
[Skills](/pt-br/docs/skills) para como é sincronizada.)

## Estado de liga/desliga

A ativação fica no banco, na tabela `plugin_settings`: `family`, `name` e `enabled`, com
chave primária `(family, name)`. O `resolvePluginEnabled` lê a linha e recorre a um
padrão definido em código quando ainda não existe registro.

A alternância vale ao vivo — sem reiniciar. O `PluginCatalogSingleton` mantém cada par
`{ family, name }` registrado para que a API administrativa liste os plugins sem
revarrer o disco. Veja o [dashboard administrativo](/pt-br/docs/admin-dashboard) para o
painel de Plugins.

Plugins de canal e MCP continuam guardando seus segredos e configurações de endpoint no
`config.yml` de cada pasta; apenas a flag `enabled` foi para o banco.
