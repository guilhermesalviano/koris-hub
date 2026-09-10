import { definePluginConfig } from '../../config/define-config';

export interface CoredashMcpConfig {
  url: string;
  bearerToken: string;
}

export const coredashMcpConfig = definePluginConfig<CoredashMcpConfig>({
  family: 'mcps',
  pluginName: 'coredash',
  fallbackDir: __dirname,
  schema: {
    url: {
      yamlKey: 'url',
      envKey: 'COREDASH_MCP_URL',
      fallback: 'http://mac.local:3000/api/mcp',
    },
    bearerToken: {
      yamlKey: 'bearer_token',
      envKey: 'COREDASH_MCP_BEARER_TOKEN',
      fallback: '',
    },
  },
});
