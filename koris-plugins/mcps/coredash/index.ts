import type { McpPluginContext, Plugin } from '../contracts';
import { MCP_SERVERS } from '../contracts';
import { coredashMcpConfig } from './config';

const SERVER_NAME = 'coredash';

export function create(context?: McpPluginContext): Plugin | null {
  if (!context) return null;
  return {
    name: SERVER_NAME,
    setup(registry) {
      registry.extend(MCP_SERVERS, {
        name: SERVER_NAME,
        enabled: () => context.pluginEnablement.isEnabled(SERVER_NAME),
        loadConfig: () => coredashMcpConfig.load(),
        writeConfigPatch: (patch) => coredashMcpConfig.writePatch(patch),
      });
    },
  };
}
