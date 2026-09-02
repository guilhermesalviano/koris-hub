// Catalog schema for the Koris plugins marketplace.
//
// Each entry is one `<slug>.json` file in this directory. `slug` MUST equal the
// filename (without `.json`) and is also the URL segment at /marketplace/<slug>.
// See /docs/marketplace/adding-an-entry for the authoring guide.

export type Family = 'tool' | 'channel' | 'skill';

export const FAMILY_ORDER: Family[] = ['tool', 'channel', 'skill'];

export const FAMILY_LABELS: Record<Family, string> = {
  tool: 'Tools',
  channel: 'Channels',
  skill: 'Skills',
};

export type ParamType = 'string' | 'number' | 'boolean' | 'object' | 'array';

export interface CatalogParam {
  name: string;
  type: ParamType | ParamType[];
  required: boolean;
  description: string;
  enum?: string[];
}

export interface CatalogEntry {
  /** kebab-case id; equals the filename and the /marketplace/<slug> segment */
  slug: string;
  /** display name */
  name: string;
  family: Family;
  /** finer free-form label, e.g. "action" | "query" | "messaging" | "gateway" | "utility" */
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
