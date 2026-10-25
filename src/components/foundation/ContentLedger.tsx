import { createElement } from 'react';
import { asset, type ContentItem, type ContentSection } from '@/lib/content';
function visibility(item: ContentItem) {
  return Object.entries(item.profiles)
    .filter(([, shown]) => shown)
    .map(([key]) => 'show-' + key)
    .join(' ');
}
function Record({ item }: { item: ContentItem }) {
  const a = item.attributes ?? {};
  const copy = item.displayText;
  const shared = {
    'data-content-id': item.id,
    className: 'content-record ' + visibility(item),
  };
  if (item.kind === 'img')
    return (
      <img
        {...shared}
        src={asset(item.source!)}
        alt={a.alt ?? ''}
        width={item.width || 320}
        height={item.height || 160}
      />
    );
  if (item.kind === 'a')
    return (
      <a
        {...shared}
        href={a.href}
        target={a.target}
        rel={a.rel}
        aria-label={a['aria-label']}
      >
        {item.images?.map((img, i) => (
          <img
            key={i}
            className={
              img.source.includes('on-light') ? 'logo-light' : 'logo-dark'
            }
            src={asset(img.source)}
            alt={img.alt}
            width="148"
            height="24"
          />
        ))}
        {copy}
      </a>
    );
  if (item.kind === 'button')
    return (
      <button
        {...shared}
        type="button"
        aria-label={a['aria-label']}
        title={a.title}
      >
        {copy}
        {!copy && (
          <svg
            aria-hidden="true"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <circle cx="12" cy="12" r="5" />
          </svg>
        )}
      </button>
    );
  if (item.kind === 'input' || item.kind === 'textarea')
    return createElement(item.kind, {
      ...shared,
      name: a.name,
      type: a.type,
      placeholder: a.placeholder,
      'aria-label': a['aria-label'],
      readOnly: true,
    });
  if (/^h[1-6]$/.test(item.kind)) return createElement(item.kind, shared, copy);
  return <p {...shared}>{copy}</p>;
}
export function ContentLedger({ sections }: { sections: ContentSection[] }) {
  return (
    <>
      {sections.map((s) => (
        <section
          key={s.id}
          id={s.id}
          data-content-section={s.id}
          className="content-section"
        >
          {s.items.map((item) => (
            <Record key={item.id} item={item} />
          ))}
        </section>
      ))}
    </>
  );
}
