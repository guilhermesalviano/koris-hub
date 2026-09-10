// Catalog schema for the Koris plugins marketplace.
//
// Each entry is one `<family-dir>/<slug>.json` file under this directory, grouped
// by family (see FAMILY_DIRS below), e.g. `tools/issue.json`, `skills/weather.json`.
// `slug` MUST equal the filename (without `.json`) and is also the URL segment at
// /marketplace/<slug> — the family folder is not part of the slug or the route.
// See /docs/marketplace/adding-an-entry for the authoring guide.

export type Family = 'tool' | 'channel' | 'mcp' | 'skill';

export const FAMILY_ORDER: Family[] = ['tool', 'channel', 'mcp', 'skill'];

export const FAMILY_LABELS: Record<Family, string> = {
  tool: 'Tools',
  channel: 'Channels',
  mcp: 'MCP Servers',
  skill: 'Skills',
};

/** subdirectory of content/marketplace/ each family's entries live in */
export const FAMILY_DIRS: Record<Family, string> = {
  tool: 'tools',
  channel: 'channels',
  mcp: 'mcps',
  skill: 'skills',
};

export type ParamType = 'string' | 'number' | 'boolean' | 'object' | 'array';

export interface CatalogParam {
  name: string;
  type: ParamType | ParamType[];
  required: boolean;
  description: string;
  enum?: string[];
}

/**
 * Channels only: short setup / lifecycle guidance strings, surfaced on the
 * detail page and reused verbatim by koris's setup wizard. Every field is
 * optional — render only the ones present.
 */
export interface ChannelHints {
  /** Guidance shown before download/installation */
  uninstalled?: string;
  /** Guidance shown when installed but inactive */
  inactive?: string;
  /** General runtime guidance when active */
  active?: string;
  /** QR code pairing instructions (WhatsApp) */
  pairing?: string;
  /** Bot phone number guidance */
  botNumber?: string;
  /** Unlisted sender policy note */
  allowUnlisted?: string;
  /** Whitelist input note */
  whitelist?: string;
}

/**
 * Channels and MCP servers: editable config inputs, so koris's setup wizard
 * can render forms from the catalog instead of hard-coding them. `name` is
 * the config key written to the plugin's `config.yml`.
 */
export interface ChannelConfigField {
  name: string;
  label: string;
  type: 'text' | 'password' | 'boolean' | 'number';
  placeholder?: string;
  description?: string;
  required?: boolean;
}

export interface CatalogEntry {
  /** kebab-case id; equals the filename and the /marketplace/<slug> segment */
  slug: string;
  /** display name */
  name: string;
  family: Family;
  /** finer free-form label, e.g. "action" | "query" | "messaging" | "coredash" | "utility" */
  type?: string;
  /** one line, shown on cards */
  summary: string;
  /** markdown, shown on the detail page */
  description: string;
  tags: string[];
  /** path inside the koris repo, e.g. "plugins/tools/issue" */
  sourcePath: string;
  /** full GitHub URL to sourcePath */
  sourceUrl: string;
  /** tools only: the LLM-facing tool name, e.g. "issue" */
  toolName?: string;
  /** tools only */
  params?: CatalogParam[];
  /** skills only: SKILL.md `read_when` triggers */
  readWhen?: string[];
  /** true when the plugin demands explicit user confirmation before it runs */
  requiresConfirmation?: boolean;
  /** default enablement in a fresh koris install */
  defaultEnabled?: boolean;
  /** optional: the koris git ref this snapshot was captured from */
  capturedFrom?: string;
  /** channels only: setup / lifecycle guidance strings */
  hints?: ChannelHints;
  /** channels only: editable config inputs for the setup wizard form */
  configFields?: ChannelConfigField[];
  /**
   * Translations of the prose fields, keyed by locale. English lives in the
   * top-level fields; anything absent here falls back to them, so a partly
   * translated catalog still renders.
   */
  i18n?: Record<string, CatalogTranslation | undefined>;
}

/** Per-locale overrides of an entry's prose. All optional — missing keys fall back to English. */
export interface CatalogTranslation {
  name?: string;
  summary?: string;
  description?: string;
  /** channels only: per-locale overrides of individual hint strings */
  hints?: ChannelHints;
}

export const REQUIRED_KEYS: (keyof CatalogEntry)[] = [
  'slug',
  'name',
  'family',
  'summary',
  'description',
  'tags',
  'sourcePath',
  'sourceUrl',
];
