'use client';
import { useState } from 'react';
import { accessible, item, state } from '@/lib/content';
import {
  Copy,
  Media,
  Section,
  SectionHeader,
} from '@/components/ui/Primitives';
export function Difference() {
  const [selected, setSelected] = useState<number | null>(null);
  const details =
    selected === null ? null : state('loop-' + (selected + 1)).items.slice(-6);
  return (
    <Section id="difference">
      <SectionHeader section="difference" intro={3} />
      <div className="difference-grid">
        <div className="usual-panel">
          <Copy section="difference" n={4} as="p" className="eyebrow" />
          {[5, 10, 15].map((n, index) => (
            <div className="handoff" key={n}>
              <Copy section="difference" n={n} as="p" className="meta" />
              <div className="handoff-flow">
                {[n + 1, n + 2, n + 3].map((m) => (
                  <Copy section="difference" n={m} key={m} />
                ))}
              </div>
              {index < 2 && (
                <Copy
                  section="difference"
                  n={n + 4}
                  as="p"
                  className="handoff-note"
                />
              )}
            </div>
          ))}
        </div>
        <div className="loop-panel">
          <Media record={item('difference', 19)} className="spark" />
          <Copy section="difference" n={20} as="p" className="eyebrow" />
          <div
            className="loop-controls"
            role="group"
            aria-label={accessible('difference', 'aria-label')}
          >
            {Array.from({ length: 7 }, (_, i) => (
              <button
                key={i}
                type="button"
                aria-label={accessible('difference', 'aria-label', i + 1)}
                aria-pressed={selected === i}
                onClick={() => setSelected(i)}
                onMouseEnter={() => setSelected(i)}
                onFocus={() => setSelected(i)}
              >
                <Copy section="difference" n={i + 21} />
                <span className="loop-dot" aria-hidden="true" />
              </button>
            ))}
          </div>
          {details && (
            <div className="loop-detail" data-loop-detail>
              <p className="meta">
                {details.slice(0, 4).map((d, i) => (
                  <span key={i}>
                    {d.displayText}
                    {i < 3 ? ' ' : null}
                  </span>
                ))}
              </p>
              <p className="loop-title">{details[4].displayText}</p>
              <p>{details[5].displayText}</p>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}
