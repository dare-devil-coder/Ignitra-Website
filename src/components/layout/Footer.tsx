import { accessible } from '@/lib/content';
import {
  Container,
  ContentLink,
  Copy,
  ThemeMedia,
} from '@/components/ui/Primitives';
export function Footer() {
  return (
    <>
      <footer data-content-section="footer" className="footer">
        <Container>
          <ThemeMedia
            section="footer"
            dark={1}
            light={2}
            className="footer-wordmark"
          />
          <Copy section="footer" n={3} as="p" className="eyebrow" />
          <div className="footer-grid">
            <nav aria-label={accessible('footer', 'aria-label')}>
              <Copy section="footer" n={4} as="p" className="eyebrow" />
              {[5, 6, 7, 8].map((n) => (
                <ContentLink section="footer" n={n} key={n} />
              ))}
            </nav>
            <div className="footer-contact">
              <Copy section="footer" n={9} as="p" className="eyebrow" />
              {[10, 12, 14, 16].map((n) => (
                <div key={n}>
                  <Copy section="footer" n={n} as="p" className="meta" />
                  <ContentLink section="footer" n={n + 1} />
                </div>
              ))}
            </div>
          </div>
          <div className="footer-legal">
            {Array.from({ length: 12 }, (_, i) => (
              <Copy section="footer" n={18 + i} key={i} />
            ))}
          </div>
        </Container>
      </footer>
      <div className="mobile-actions" data-content-section="mobile-actions">
        <ContentLink
          section="mobile-actions"
          n={1}
          className="button button-primary"
        />
        <ContentLink
          section="mobile-actions"
          n={2}
          className="button button-secondary"
        />
      </div>
      <div data-content-section="intro" hidden />
    </>
  );
}
