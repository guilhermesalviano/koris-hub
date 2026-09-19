import { describe, it, expect } from 'vitest';
import { buildResponseMessage } from './index';
import type { DocTopic } from './doc-topics.generated';

describe('buildResponseMessage', () => {
  const mockTopic: DocTopic = {
    slug: 'getting-started',
    title: 'Getting Started',
    url: '/docs/getting-started/',
    summary: 'How to install and configure Koris Bot.',
    excerpt: 'Detailed instructions on setting up...',
  };

  describe('English locale (en)', () => {
    it('generates affirmative message when answer >= 0.5', () => {
      const msg = buildResponseMessage(mockTopic, 0.95, 0.9, 'en');
      expect(msg).toBe('Yes. According to "Getting Started", this is supported: How to install and configure Koris Bot.');
    });

    it('generates negative message when answer < 0.5 with high confidence', () => {
      const msg = buildResponseMessage(mockTopic, 0.1, 0.8, 'en');
      expect(msg).toBe('No. According to "Getting Started", this is not supported: How to install and configure Koris Bot.');
    });

    it('generates uncertain message when confidence is low (< 0.5)', () => {
      const msg = buildResponseMessage(mockTopic, 0.2, 0.3, 'en');
      expect(msg).toBe('The documentation does not seem to cover this directly. You can review "Getting Started" for related details.');
    });

    it('handles missing topic', () => {
      const msg = buildResponseMessage(null, 0.8, 0.8, 'en');
      expect(msg).toBe('The documentation does not seem to cover this question yet.');
    });

    it('handles null answer', () => {
      const msg = buildResponseMessage(mockTopic, null, 0.8, 'en');
      expect(msg).toBe('The documentation does not seem to cover this question yet.');
    });
  });

  describe('Portuguese locale (pt-br)', () => {
    const mockPtTopic: DocTopic = {
      slug: 'getting-started',
      title: 'Primeiros Passos',
      url: '/pt-br/docs/getting-started/',
      summary: 'Como instalar e configurar o Koris Bot.',
      excerpt: 'Instruções detalhadas sobre configuração...',
    };

    it('generates affirmative message when answer >= 0.5', () => {
      const msg = buildResponseMessage(mockPtTopic, 0.85, 0.9, 'pt-br');
      expect(msg).toBe('Sim. De acordo com "Primeiros Passos", isso é suportado: Como instalar e configurar o Koris Bot.');
    });

    it('generates negative message when answer < 0.5 with high confidence', () => {
      const msg = buildResponseMessage(mockPtTopic, 0.15, 0.7, 'pt-br');
      expect(msg).toBe('Não. De acordo com "Primeiros Passos", isso não é suportado: Como instalar e configurar o Koris Bot.');
    });

    it('generates uncertain message when confidence is low (< 0.5)', () => {
      const msg = buildResponseMessage(mockPtTopic, 0.1, 0.3, 'pt-br');
      expect(msg).toBe('A documentação não parece cobrir isso diretamente. Você pode conferir "Primeiros Passos" para detalhes relacionados.');
    });

    it('handles missing topic', () => {
      const msg = buildResponseMessage(null, 0.8, 0.8, 'pt-br');
      expect(msg).toBe('A documentação ainda não parece cobrir essa pergunta.');
    });

    it('handles null answer', () => {
      const msg = buildResponseMessage(mockPtTopic, null, 0.8, 'pt-br');
      expect(msg).toBe('A documentação ainda não parece cobrir essa pergunta.');
    });
  });
});
