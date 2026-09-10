---
title: Servidores MCP
order: 10
---

# Servidores MCP

Plugins de servidores MCP (Model Context Protocol) permitem que o Koris se conecte
a ecossistemas externos de ferramentas e dashboards via Streamable HTTP, sem tocar
no código do core. Cada integração é um [plugin](/pt-br/docs/plugins) em
`plugins/mcps/`, estruturado em uma pasta independente.

## Como o Koris se conecta a um servidor MCP

Na inicialização, o Koris varre `plugins/mcps/` em busca de plugins de servidores
instalados. Cada plugin registra uma definição no ponto de extensão `MCP_SERVERS`.

Quando um servidor MCP está ativado:

1. O `McpManager` estabelece uma conexão Streamable HTTP para a URL configurada
   (por exemplo, `http://mac.local:3000/api/mcp`), enviando o token de autorização se configurado.
2. O servidor retorna a lista de ferramentas e esquemas disponíveis.
3. O Koris registra dinamicamente essas ferramentas no pipeline padrão de execução,
   com o prefixo `<servidor>__<ferramenta>` (por exemplo, `coredash__calendar`).
4. O modelo de IA pode chamar a ferramenta de forma transparente durante as respostas.
   As chamadas são encaminhadas de volta pelo transporte Streamable HTTP.

Se um servidor MCP ficar inacessível, o Koris registra um aviso e continua operando.
Uma falha de conexão nunca derruba o agente nem trava o chat. O Koris tenta reconectar
ao ser ativado/desativado, quando a configuração é atualizada ou na reinicialização do processo.

## Configuração

As configurações específicas de cada servidor ficam no arquivo `config.yml` do plugin
(com fallback para variáveis de ambiente definidas no `config.ts` do plugin):

```yaml
url: "http://mac.local:3000/api/mcp"
bearer_token: "seu_token_aqui"
```

A configuração pode ser atualizada em tempo real, sem reiniciar:
- No painel de **Plugins** do [Admin dashboard](/pt-br/docs/admin-dashboard) pelo modal **Configurar**.
- Via `PATCH /api/admin/mcps/<name>/config`.
- Editando diretamente `plugins/mcps/<name>/config.yml`.

## Ativação e desativação

Assim como ferramentas e canais, os servidores MCP têm seu estado armazenado no banco
de dados na tabela `plugin_settings`: `family: 'mcps'`, `name: '<slug>'`, `enabled: true|false`.

Servidores MCP vêm desativados por padrão ao serem baixados. Ative-os usando:
- **Chat**: `/mcps enable <name>` (apenas remetentes confiáveis)
- **Admin Dashboard**: Ative a chave correspondente no painel de **Plugins**
- **Admin API**: `PATCH /api/admin/plugins/mcps/<name>`

## Comandos slash

Remetentes autorizados podem inspecionar, baixar e ativar/desativar servidores MCP
diretamente pelo chat com o comando `/mcps`:

| Comando | Uso | Descrição |
| --- | --- | --- |
| `/mcps` | `/mcps` ou `/mcps list` | Lista os servidores MCP instalados e seu status de conexão |
| `/mcps remote` | `/mcps remote` | Lista servidores MCP disponíveis no Koris Hub |
| `/mcps download` | `/mcps download <name> [--force]` | Baixa e carrega um plugin MCP do Koris Hub a quente |
| `/mcps enable` | `/mcps enable <name>` | Ativa um servidor MCP instalado |
| `/mcps disable` | `/mcps disable <name>` | Desativa um servidor MCP instalado |

## Adicionando um plugin de servidor MCP

Para criar um novo plugin de servidor MCP:

1. Crie uma pasta sob `plugins/mcps/<slug>/`.
2. Defina uma configuração tipada usando `definePluginConfig` em `config.ts`.
3. Forneça o arquivo modelo `config.example.yml`.
4. Exporte uma função `create(context)` em `index.ts` que estende `MCP_SERVERS`.

```ts
import type { McpPluginContext, Plugin } from '../contracts';
import { MCP_SERVERS } from '../contracts';
import { myMcpConfig } from './config';

const SERVER_NAME = 'meu-servidor';

export function create(context?: McpPluginContext): Plugin | null {
  if (!context) return null;
  return {
    name: SERVER_NAME,
    setup(registry) {
      registry.extend(MCP_SERVERS, {
        name: SERVER_NAME,
        enabled: () => context.pluginEnablement.isEnabled(SERVER_NAME),
        loadConfig: () => myMcpConfig.load(),
        writeConfigPatch: (patch) => myMcpConfig.writePatch(patch),
      });
    },
  };
}
```

Para explorar os servidores MCP disponíveis ou contribuir com um novo, acesse o
[Marketplace](/pt-br/marketplace).
