import { item } from '@/lib/content';
import {
  Card,
  ContentLink,
  Copy,
  Media,
  Section,
  SectionHeader,
  ThemeMedia,
} from '@/components/ui/Primitives';
export function Hero() {
  return (
    <Section id="hero" className="hero">
      <div className="hero-copy">
        <Copy section="hero" n={1} as="p" className="eyebrow" />
        <Copy section="hero" n={2} as="h1" id="hero-h" />
        <Copy section="hero" n={3} as="p" className="hero-intro" />
        <div className="button-row">
          <ContentLink
            section="hero"
            n={4}
            className="button button-primary"
            icon
          />
          <ContentLink
            section="hero"
            n={5}
            className="button button-secondary"
          />
        </div>
      </div>
      <div className="hero-visual">
        <div className="orbit orbit-one" aria-hidden="true" />
        <div className="orbit orbit-two" aria-hidden="true" />
        <ThemeMedia section="hero" dark={6} light={7} eager />
        <Copy section="hero" n={8} as="p" className="eyebrow hero-caption" />
      </div>
    </Section>
  );
}
export function Problem() {
  return (
    <Section id="problem" className="problem">
      <SectionHeader section="problem" intro={3} />
      <div className="problem-table">
        <div className="problem-table-head">
          <Copy section="problem" n={4} />
          <Copy section="problem" n={5} />
        </div>
        {Array.from({ length: 6 }, (_, i) => {
          const n = 6 + i * 4;
          return (
            <div className="problem-row" key={n}>
              <Copy section="problem" n={n} className="ordinal" />
              <Copy section="problem" n={n + 1} className="problem-name" />
              <Copy section="problem" n={n + 2} className="problem-have" />
              <Copy section="problem" n={n + 3} className="problem-gap" />
            </div>
          );
        })}
      </div>
    </Section>
  );
}
export function Services() {
  return (
    <Section id="services" className="services">
      <SectionHeader section="services" />
      {[3, 9, 15].map((n) => (
        <article className="service-row" key={n}>
          <Copy section="services" n={n} className="service-number" />
          <div className="service-main">
            <Copy section="services" n={n + 1} as="h3" />
            <Copy section="services" n={n + 2} as="p" className="meta" />
            <Copy section="services" n={n + 3} as="p" />
          </div>
          <div className="service-includes">
            <Copy section="services" n={n + 4} as="p" className="eyebrow" />
            <Copy section="services" n={n + 5} as="p" />
          </div>
        </article>
      ))}
    </Section>
  );
}
export function Engine() {
  return (
    <Section id="engine" className="engine">
      <ThemeMedia
        section="engine"
        dark={1}
        light={2}
        className="engine-visual"
      />
      <SectionHeader section="engine" label={3} heading={4} intro={5} />
      <div className="engine-steps">
        {Array.from({ length: 7 }, (_, i) => {
          const n = 19 + i * 6;
          return (
            <article className="engine-step" key={n}>
              <Copy section="engine" n={n} className="ordinal" />
              <div className="engine-step-name">
                <Copy section="engine" n={n + 1} as="h3" />
                <Copy section="engine" n={n + 2} as="p" />
              </div>
              <div className="engine-step-copy">
                <Copy section="engine" n={n + 3} as="p" />
                <p className="meta">
                  <Copy section="engine" n={n + 4} />{' '}
                  <Copy section="engine" n={n + 5} />
                </p>
              </div>
            </article>
          );
        })}
      </div>
      <div className="compounding">
        <div className="compounding-head">
          <Copy section="engine" n={61} as="p" className="eyebrow" />
          <Copy section="engine" n={62} as="p" className="meta" />
        </div>
        {[63, 65, 67, 69].map((n) => (
          <div className="compound-row" tabIndex={0} key={n}>
            <Copy section="engine" n={n} className="meta" />
            <Copy section="engine" n={n + 1} className="compound-result" />
          </div>
        ))}
      </div>
    </Section>
  );
}
export function Why() {
  return (
    <Section id="why">
      <SectionHeader section="why" />
      <div className="why-grid">
        {Array.from({ length: 7 }, (_, i) => {
          const n = 3 + i * 4;
          return (
            <Card key={n} className={'why-card why-card-' + i}>
              <Copy section="why" n={n} className="ordinal" />
              <Copy section="why" n={n + 1} as="h3" />
              <Copy section="why" n={n + 2} as="p" />
              <Media record={item('why', n + 3)} />
            </Card>
          );
        })}
      </div>
    </Section>
  );
}
export function Start() {
  return (
    <Section id="start" className="start">
      <SectionHeader section="start" intro={3} />
      <div className="start-grid">
        <div className="packages">
          <Copy section="start" n={4} as="p" className="eyebrow" />
          {[5, 6, 7].map((n) => (
            <Copy key={n} section="start" n={n} as="p" />
          ))}
        </div>
        <div className="brief">
          <Media record={item('start', 8)} className="spark" />
          <div className="brief-head">
            <Copy section="start" n={9} as="p" className="eyebrow" />
            <Copy section="start" n={10} as="p" className="meta" />
          </div>
          {[11, 16, 21, 26, 31].map((n) => (
            <div className="brief-row" key={n}>
              <Copy section="start" n={n} className="brief-check" />
              <Copy section="start" n={n + 1} className="ordinal" />
              <Copy section="start" n={n + 2} />
              <Copy section="start" n={n + 4} className="brief-status" />
            </div>
          ))}
          <div className="brief-result">
            <Copy section="start" n={36} as="p" className="eyebrow" />
            <Copy section="start" n={37} as="p" />
          </div>
        </div>
      </div>
    </Section>
  );
}
export function CTA() {
  return (
    <Section id="cta" className="cta">
      <Media record={item('cta', 1)} className="cta-spark" />
      <Copy section="cta" n={2} as="p" className="eyebrow" />
      <Copy section="cta" n={3} as="h2" id="cta-h" />
      <Copy section="cta" n={4} as="p" className="cta-intro" />
      <div className="button-row">
        <ContentLink
          section="cta"
          n={5}
          className="button button-primary"
          icon
        />
        <ContentLink
          section="cta"
          n={6}
          className="button button-secondary"
          icon
        />
      </div>
    </Section>
  );
}
