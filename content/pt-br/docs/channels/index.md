---
title: Canais
order: 5
---

# Canais

Um canal é um ponto de entrada de mensagens. O Koris roda o mesmo agente por trás de
todos os canais; o plugin de canal cuida apenas do transporte e da normalização.

## Como uma mensagem entra

O plugin de canal recebe uma mensagem bruta da sua plataforma, normaliza para um
`InboundChannelMessage` e delega ao `IChannelHandler` genérico. O handler aplica as
regras do canal — filtro de menção em grupo, liberação de ferramentas e skills conforme
a confiança, prefixo de prompt, divisão de respostas — e então chama
`MessageGateway.handle`. Daí em diante o fluxo é idêntico, seja qual for o canal. Veja
[Conceitos](/pt-br/docs/concepts) para o restante do caminho.

## Canais nativos

- **Telegram** — via `@guilhermesalviano/telegram-bot`.
- **WhatsApp** — via Baileys (`@whiskeysockets/baileys`).
- **TUI** — a interface de terminal em `apps/tui/`. Rode com `pnpm app --tui`.
- **Chat do dashboard web** — servido na porta 3000. Veja [Dashboard administrativo](/pt-br/docs/admin-dashboard).

Veja o conjunto completo no [marketplace](/pt-br/marketplace).

## Confiança e remetentes não listados

O `config.yml` de cada canal guarda seus segredos — `bot_token`, `whitelist` e afins —
além de uma flag `allow_unlisted_senders` por canal no `telegram` e no `whatsapp`. Com
essa flag ligada, um remetente fora da whitelist ainda é respondido, mas como remetente
não confiável: nenhuma ferramenta (incluindo figurinhas e busca) e nenhuma skill
aprendida. A flag é lida sob demanda, então a mudança vale sem reiniciar, e há um botão
para ela na página de configurações de Canais. Veja
[Segurança](/pt-br/docs/security) para o que significa acesso não confiável.

## Ativando e desativando

O estado de liga/desliga de um canal fica no banco, na tabela `plugin_settings`, e não
no `config.yml`. Alterne ao vivo pelo painel de Plugins do dashboard ou pelo assistente
de configuração; não é preciso reiniciar. Só a flag `enabled` foi para o banco — os
segredos continuam no `config.yml`. Veja [Dashboard administrativo](/pt-br/docs/admin-dashboard).

## Adicionando um canal

Crie uma pasta em `plugins/channels/` que exponha `create(context)` e registre um
`ChannelDefinition` no ponto de extensão `ADAPTERS`. Nenhuma alteração no core é
necessária. Veja [Plugins](/pt-br/docs/plugins).
