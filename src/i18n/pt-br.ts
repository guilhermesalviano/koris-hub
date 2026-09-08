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
    titleLead: 'Um ',
    titleAccent: 'assistente de IA autônomo',
    titleTail: ', rodando na sua própria infraestrutura',
    subtitle:
      'O Koris Assistant é um framework em TypeScript para criar assistentes de IA com canais plugáveis, skills extensíveis e memória que persiste entre sessões — não só dentro de uma janela de conversa.',
    readDocs: 'Ler a documentação',
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
    title: 'Coloque o Koris no ar',
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
    title: 'Changelog',
    subtitle: 'Todas as versões, direto do GitHub.',
    viewFull: 'Ver changelog completo',
  },

  footer: {
    license: 'Licença ISC',
    builtBy: 'Feito com ❤️ pela Koaris',
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
    siteTitle: 'Koris — framework de assistente de IA auto-hospedado',
    siteDescription:
      'O Koris é um framework de agente de IA open source e auto-hospedado, escrito em TypeScript. Roda na sua própria infraestrutura, conversa por Telegram e WhatsApp, lembra entre sessões e se estende com ferramentas e skills em Markdown.',
    docsTitle: 'Documentação',
    docsDescription:
      'Documentação do Koris — instale e configure o agente de IA auto-hospedado, conecte canais no Telegram ou WhatsApp e estenda com ferramentas e skills.',
    marketplaceTitle: 'Marketplace',
    marketplaceDescription:
      'Todas as ferramentas, canais e skills que acompanham o Koris — o que cada um faz, os parâmetros que aceita e um link para o código-fonte.',
    marketplaceIntroLead:
      'As ferramentas, canais e skills que acompanham o Koris hoje. Cada um vive no repositório',
    marketplaceIntroTail: '— este é um índice navegável, não um instalador.',
    notFoundTitle: '404 — página não encontrada',
  },
};
