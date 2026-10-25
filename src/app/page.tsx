import { sections } from '@/lib/content';
import { ContentLedger } from '@/components/foundation/ContentLedger';
// Stage 1 content proof only. Replace its layout in Stage 2 using the same locked data.
export default function Home() {
  return (
    <>
      <ContentLedger sections={sections.slice(0, 2)} />
      <main id="main">
        <ContentLedger sections={sections.slice(2, 10)} />
      </main>
      <ContentLedger sections={sections.slice(10)} />
    </>
  );
}
