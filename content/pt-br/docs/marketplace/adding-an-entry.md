---
title: Adicionando uma entrada no marketplace
order: 1
---

# Adicionando uma entrada no marketplace

O catálogo do [marketplace](/pt-br/marketplace) é JSON puro neste repositório — um
arquivo por entrada em `content/marketplace/<pasta-da-família>/<slug>.json`, agrupado por
família:

```
content/marketplace/
  schema.ts
  tools/       family: "tool"      ex.: tools/issue.json
  channels/    family: "channel"   ex.: channels/telegram.json
  skills/      family: "skill"     ex.: skills/weather.json
  mcps/        family: "mcp"       ex.: mcps/coredash.json
```

Sem etapa de build, sem banco de dados.

## Passos

1. **Copie uma entrada existente** parecida com a que você vai adicionar, por exemplo
   `content/marketplace/tools/issue.json` para uma ferramenta ou
   `content/marketplace/skills/weather.json` para uma skill.
2. **Renomeie** para `<slug>.json` e coloque na pasta correspondente à `family` (veja o
   layout acima). O campo `slug` dentro do arquivo **precisa** ser igual ao nome do
   arquivo sem o `.json`, e o arquivo **precisa** ficar na pasta da sua `family` — caso
   contrário o loader quebra o build com erro.
3. **Preencha os campos** (veja o schema abaixo).
4. Rode `pnpm dev` e abra `http://localhost:3000/marketplace/<slug>` para conferir o card
   e a página de detalhe.
5. `pnpm lint` e `pnpm build` precisam passar.

## Schema

O tipo completo fica em `content/marketplace/schema.ts`.

| Campo | Obrigatório | Observações |
| --- | --- | --- |
| `slug` | ✅ | kebab-case; igual ao nome do arquivo e ao segmento da URL |
| `name` | ✅ | nome de exibição |
| `family` | ✅ | `tool` \| `channel` \| `mcp` \| `skill` |
| `type` | | rótulo mais fino: `action`, `query`, `messaging`, `coredash`, `utility`, … |
| `summary` | ✅ | uma linha, exibida nos cards |
| `description` | ✅ | markdown, exibido na página de detalhe |
| `tags` | ✅ | array de strings |
| `sourcePath` | ✅ | caminho dentro do repositório koris, ex.: `plugins/tools/issue` |
| `sourceUrl` | ✅ | URL completa do GitHub para o `sourcePath` |
| `toolName` | ferramentas | o nome exposto ao LLM, ex.: `issue` |
| `params` | ferramentas | `{ name, type, required, description, enum? }[]` |
| `readWhen` | skills | os gatilhos `read_when` do `SKILL.md` |
| `requiresConfirmation` | | `true` se o plugin exige confirmação explícita do usuário |
| `defaultEnabled` | | estado de ativação em uma instalação nova do koris |
| `capturedFrom` | | opcional: o ref git do koris de onde este snapshot veio |
| `i18n` | | traduções dos campos de texto, por locale (ex.: `pt-br`) |

## Mantendo em sincronia

Os arquivos JSON são a fonte da verdade — são escritos e revisados à mão. Um utilitário
de apoio, `scripts/generate-catalog.ts`, consegue rederivar `params` / `readWhen` a partir
de um checkout local do `koris` e mesclar nos arquivos existentes sem sobrescrever o
texto escrito à mão. A análise do código-fonte é frágil, então sempre revise a saída.
