import { ContentLink } from '@/components/ui/Primitives';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';
import { Consultation } from '@/components/layout/Consultation';
import { Difference } from '@/components/sections/Difference';
import {
  Hero,
  Problem,
  Services,
  Engine,
  Why,
  Start,
  CTA,
} from '@/components/sections/Sections';
export default function Home() {
  return (
    <>
      <div data-content-section="skip" className="skip-wrap">
        <ContentLink section="skip" n={1} className="skip-link" />
      </div>
      <Navigation />
      <main id="main" tabIndex={-1}>
        <Hero />
        <Problem />
        <Difference />
        <Services />
        <Engine />
        <Why />
        <Start />
        <CTA />
      </main>
      <Footer />
      <Consultation />
    </>
  );
}
