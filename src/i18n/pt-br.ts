import type { Dictionary } from './index';

/**
 * Brazilian Portuguese.
 *
 * Translation choices worth reviewing: the product nouns "skill" and "tool"
 * stay as in the docs and plugin folder names — "skill" is left untranslated
 * (it is what the folder, the front-matter and the dashboard call it), while
 * "tool" reads as "ferramenta" in prose. "Channel" is "canal".
 */
export const ptBr: Dictionary = {
  nav: {
    marketplace: 'Marketplace',
    docs: 'Documentação',
    github: 'GitHub',
    switchLanguage: 'Mudar idioma',
  },

  hero: {
    badge: '✨ Framework de IA Autônomo e 100% Local',
    titleLead: 'Seus ',
    titleAccent: 'colegas de equipe de IA',
    titleTail: ', rodando na sua própria infraestrutura',
    subtitle:
      'O Koris Bot é um framework em TypeScript para criar assistentes de IA com canais plugáveis, skills extensíveis e memória que persiste entre sessões — não só dentro de uma janela de conversa.',
    readDocs: 'Ler a documentação',
    installCmd: 'git clone https://github.com/guilhermesalviano/koris-bot.git',
    copied: 'Copiado!',
    techTypescript: 'TypeScript',
    techSqlite: 'Memória Local SQLite',
    techChannels: 'Multi-Canal',
    techLocal: '100% Local-First',
    techLicense: 'Licença ISC',
  },

  featured: {
    tag: 'Arquitetura Principal',
    title: 'Recursos em Destaque',
    subtitle: 'Blocos fundamentais projetados para soberania local e controle profundo do agente.',
    cardChannelsTitle: 'Canais Plugáveis',
    cardChannelsDesc: 'Conecte Telegram, WhatsApp, Terminal UI e Painel Web simultaneamente sem duplicar estado.',
    cardChannelsBadge: '4 Canais Ativos',
    cardMemoryTitle: 'Memória Persistente SQLite',
    cardMemoryDesc: 'Conversas, árvores de sessões e memória episódica ficam no seu disco local — nunca em uma caixa preta.',
    cardMemoryBadge: 'Zero Armazenamento em Nuvem',
    cardSkillsTitle: 'Skills em Markdown',
    cardSkillsDesc: 'Ensine procedimentos de várias etapas e comandos CLI usando arquivos Markdown legíveis — zero código.',
    cardSkillsBadge: 'Hot-Reload Instantâneo',
    cardSecurityTitle: 'Confiança e Sandboxing',
    cardSecurityDesc: 'Permissões granulares por canal, allowlist de domínios e limites estritos de execução mantêm seu sistema seguro.',
    cardSecurityBadge: 'Allowlist Granular de Domínios',
    exploreDoc: 'Explorar documentação',
  },

  testimonials: {
    tag: 'Comunidade',
    title: 'Feito para quem ama construir.',
    subtitle: 'Como desenvolvedores, self-hosters e equipes transformam o Koris em seu assistente autônomo diário.',
    q1Text: 'Rodando o Koris no meu servidor caseiro com Ollama. Ter um assistente pessoal no WhatsApp que lembra de todo meu contexto sem vigilância em nuvem é incrível.',
    q1Author: 'Alex Oliveira',
    q1Role: 'Entusiasta de Homelab & Self-Host',
    q1Avatar: 'AO',
    q2Text: 'O sistema de skills em Markdown é genial. Basta colocar um arquivo com instruções e comandos curl que o bot executa tarefas de staging com precisão.',
    q2Author: 'João Pedro',
    q2Role: 'Líder de DevOps',
    q2Avatar: 'JP',
    q3Text: 'Diferente de frameworks pesados de IA, o Koris é puro TypeScript com SQLite local. Rápido de iniciar, sem lock-in e facílimo de customizar.',
    q3Author: 'Higor Santos',
    q3Role: 'Desenvolvedor Fullstack',
    q3Avatar: 'HS',
    q4Text: 'Mensagens unificadas no Telegram e Web UI apoiadas na mesma árvore de memória persistente. Exatamente o que nossa equipe precisava para automações internas.',
    q4Author: 'Robson Rocha',
    q4Role: 'Arquiteto de Sistemas',
    q4Avatar: 'RR',
  },

  faq: {
    tag: 'FAQ',
    title: 'Perguntas Frequentes',
    subtitle: 'Tudo o que você precisa saber sobre auto-hospedagem, arquitetura e execução do seu assistente.',
    q1: 'O Koris Bot é totalmente gratuito e de código aberto?',
    a1: 'Sim. O Koris Bot é 100% open source sob a permissiva Licença ISC. Você pode inspecionar, modificar, bifurcar e auto-hospedar em qualquer lugar com zero mensalidades ou telemetria.',
    q2: 'Onde meus dados e histórico de conversas são armazenados?',
    a2: 'Todas as conversas, árvores de sessões e memórias de longo prazo ficam salvas localmente no seu sistema de arquivos em SQLite. Nenhuma transcrição é enviada a terceiros, a menos que você configure uma API externa.',
    q3: 'Quais modelos e provedores de LLM são suportados?',
    a3: 'Você pode rodar totalmente offline com modelos locais via Ollama ou vLLM, ou conectar APIs como Anthropic Claude, OpenAI, DeepSeek ou qualquer endpoint compatível com OpenAI.',
    q4: 'Qual a diferença entre skills e ferramentas (tools)?',
    a4: 'Skills são arquivos Markdown (SKILL.md) que instruem o modelo sobre procedimentos em várias etapas. Ferramentas são funções TypeScript em plugins/tools/ que dão capacidades programáticas de execução ao agente.',
    q5: 'Quais plataformas são suportadas?',
    a5: 'O Koris Bot roda em Linux, macOS e Windows. Você pode baixar o aplicativo desktop pré-compilado, rodar diretamente via pnpm e Node.js 20+, ou implantar em um container Docker leve.',
    askQ: 'Tem uma pergunta que a documentação pode responder?',
    askHint: 'Pergunte sobre instalação, canais, ferramentas ou qualquer outro tema documentado — o Jev encontra a página.',
    askPlaceholder: 'Pergunte qualquer coisa',
    askSubmit: 'Perguntar',
    askLoading: 'Buscando na documentação…',
    askError: 'Não foi possível falar com o assistente. Tente novamente.',
    askShort: 'Digite uma pergunta primeiro.',
    askNotCovered: 'A documentação ainda não parece cobrir isso.',
    askYes: 'Sim',
    askNo: 'Não',
    askSupportedBy: 'Da documentação',
    askConfidence: 'de correspondência',
    askReadDoc: 'Ler a página completa',
    askPoweredBy: 'Roteado pelo Jev · docs de imkoris.com',
  },

  extend: {
    title: 'Estenda em minutos',
    subtitle:
      'Ensine algo novo ao agente com uma skill em Markdown que ele lê, ou uma ferramenta em TypeScript que ele chama. Nenhuma das duas mexe no core.',
    tabSkill: 'Skill',
    tabTool: 'Ferramenta',
    footnoteLead:
      'Sem alterar o core — basta colocar o arquivo na pasta que ele é carregado automaticamente. Guia completo:',
    docLabelSkill: 'documentação de skills',
    docLabelTool: 'documentação de ferramentas',
  },

  download: {
    title: 'Coloque o Koris Bot no ar',
    subtitle:
      'Instale o app desktop ou compile a partir do código-fonte. De qualquer forma, o primeiro acesso já abre o assistente de configuração no navegador — sem editar arquivo de config na mão.',
    tabDesktop: 'App desktop',
    tabSource: 'Do código-fonte',
    fromGitHub: 'Baixar do GitHub',
    yourOs: 'Seu sistema',
    latestRelease: 'Última versão',
    latestGitHubRelease: 'última release no GitHub',
    downloadFor: 'Baixar para',
    download: 'Baixar',
  },

  changelog: {
    tag: 'Versões',
    title: 'Changelog',
    subtitle: 'Todas as versões, direto do GitHub.',
    viewFull: 'Ver todas as versões',
    releaseNotes: 'Notas da versão',
    latest: 'Mais recente',
    stableBadge: 'Build verificado',
    allReleasesDesc: 'Veja o histórico completo de versões, assets e tags no GitHub.',
  },

  footer: {
    license: 'Licença ISC',
    builtBy: 'Feito com ❤️ pela Koaris',
    tagline: 'Seus colegas de equipe de IA rodando na sua própria infraestrutura.',
    product: 'Produto',
    marketplace: 'Marketplace',
    docs: 'Documentação',
    downloads: 'Downloads',
    changelog: 'Changelog',
    community: 'Comunidade',
    github: 'GitHub',
    issues: 'Reportar problema',
    releases: 'Versões',
    resources: 'Recursos',
    skills: 'Skills',
    tools: 'Ferramentas',
    channels: 'Canais',
    status: 'Sistema operacional · 100% local',
  },

  docs: {
    overview: 'Visão geral',
  },

  chatDemo: {
    adminPanel: 'Painel administrativo',
    newChat: 'Nova conversa',
    chats: 'Conversas',
    plugins: 'Plugins',
    configuration: 'Configuração',
    prompt: 'Como posso ajudar?',
    placeholder: 'Pergunte alguma coisa…',
    contextUsage: 'uso de contexto',
    active: 'ativo',
    switchingNote: 'Troca completa no dashboard real',
  },

  marketplace: {
    backToMarketplace: 'Marketplace',
    confirmationRequired: 'exige confirmação',
    offByDefault: 'desativado por padrão',
    toolName: 'nome da ferramenta:',
    parameters: 'Parâmetros',
    readWhen: 'Quando usar',
    setupGuidance: 'Guia de Configuração e Instalação',
    downloadTitle: 'Baixar pelo Koris Bot',
    downloadFromRepo: 'Execute este comando na raiz do repositório koris:',
    downloadFromChat: 'Remetentes confiáveis também podem baixá-lo pelo chat:',
    downloadOverwrite: 'Se o plugin já estiver instalado, adicione',
    downloadOverwriteSuffix: 'para substituí-lo.',
    downloadLocation: 'Os arquivos baixados vão para',
    downloadChannelNote: 'Canais são baixados como artefatos compilados da release channels-latest.',
    downloadToolsSkillsNote: 'Ferramentas, skills e servidores MCP são baixados da branch main.',
    configFields: 'Campos de Configuração',
    viewSource: 'Ver código-fonte',
    improveEntry: 'Melhorar esta entrada',
    noParameters: 'Sem parâmetros.',
    paramName: 'Nome',
    paramType: 'Tipo',
    paramRequired: 'Obrigatório',
    paramDescription: 'Descrição',
    paramYes: 'sim',
  },

  notFound: {
    heading: 'Até um agente com memória persistente esqueceu esta página.',
    body: 'Consultamos a memória de longo prazo, rodamos uma sincronização completa de skills e mandamos um heartbeat pedindo com jeitinho. Esta rota não está nos dados de treino — deve ter saído por aí para se resumir sozinha.',
    home: 'Voltar para o início',
    report: 'Relatar um problema',
    status: 'status: 404 · o heartbeat continua rodando, pode ficar tranquilo',
  },

  meta: {
    siteTitle: 'Koris Bot — framework de assistente de IA auto-hospedado',
    siteDescription:
      'O Koris Bot é um framework de agente de IA open source e auto-hospedado, escrito em TypeScript. Roda na sua própria infraestrutura, conversa por Telegram e WhatsApp, lembra entre sessões e se estende com ferramentas e skills em Markdown.',
    docsTitle: 'Documentação',
    docsDescription:
      'Documentação do Koris Bot — instale e configure o agente de IA auto-hospedado, conecte canais no Telegram ou WhatsApp e estenda com ferramentas e skills.',
    marketplaceTitle: 'Marketplace',
    marketplaceDescription:
      'Todas as ferramentas, canais, skills e servidores MCP que acompanham o Koris Bot — o que cada um faz, os parâmetros que aceita e um link para o código-fonte.',
    marketplaceIntroLead:
      'As ferramentas, canais, skills e servidores MCP que acompanham o Koris Bot hoje. Cada um vive no repositório',
    marketplaceIntroTail: '— este é um índice navegável, não um instalador.',
    notFoundTitle: '404 — página não encontrada',
  },
};
