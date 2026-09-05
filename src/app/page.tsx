import { Hero } from '@/components/Hero';
import { Download } from '@/components/Download';
import { Extend } from '@/components/Extend';
import { Changelog } from '@/components/Changelog';
import { Footer } from '@/components/Footer';
import { ChatDemo } from '@/components/chat-demo/ChatDemo';

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12 sm:py-16">
      <Hero />

      <section id="demo" className="mt-24 scroll-mt-20">
        <ChatDemo />
      </section>

      <Extend />

      <Download />

      <Changelog />

      <Footer />
    </main>
  );
}
