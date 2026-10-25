import { createElement, type ReactNode } from 'react';
import { asset, item, type ContentItem } from '@/lib/content';
export function Copy({
  section,
  n,
  as = 'span',
  className = '',
  id,
}: {
  section: string;
  n: number;
  as?: string;
  className?: string;
  id?: string;
}) {
  const record = item(section, n);
  return createElement(
    as,
    { className, id, 'data-content-id': record.id },
    record.displayText,
  );
}
export function Container({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={'container ' + className}>{children}</div>;
}
export function Section({
  children,
  id,
  className = '',
}: {
  children: ReactNode;
  id: string;
  className?: string;
}) {
  return (
    <section
      id={id}
      data-content-section={id}
      aria-labelledby={id + '-h'}
      className={'section ' + className}
    >
      <Container>{children}</Container>
    </section>
  );
}
export function SectionHeader({
  section: s,
  label = 1,
  heading = 2,
  intro,
}: {
  section: string;
  label?: number;
  heading?: number;
  intro?: number;
}) {
  return (
    <div className="section-header">
      <Copy section={s} n={label} as="p" className="eyebrow" />
      <Copy section={s} n={heading} as="h2" id={s + '-h'} />
      {intro && <Copy section={s} n={intro} as="p" className="section-intro" />}
    </div>
  );
}
export function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d={diagonal ? 'M5 19 19 5M5 5h14v14' : 'M4 12h16m-6-6 6 6-6 6'} />
    </svg>
  );
}
export function CloseIcon() {
  return (
    <svg
      aria-hidden="true"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="m6 6 12 12M6 18 18 6" />
    </svg>
  );
}
export function Media({
  record,
  className = '',
  eager = false,
}: {
  record: ContentItem;
  className?: string;
  eager?: boolean;
}) {
  return (
    <img
      data-content-id={record.id}
      src={asset(record.source!)}
      alt={record.attributes?.alt ?? ''}
      width={record.width || 600}
      height={record.height || 300}
      className={className}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
    />
  );
}
export function ThemeMedia({
  section: s,
  dark,
  light,
  className = '',
  eager = false,
}: {
  section: string;
  dark: number;
  light: number;
  className?: string;
  eager?: boolean;
}) {
  return (
    <div className={'theme-media ' + className}>
      <Media record={item(s, dark)} className="only-dark" eager={eager} />
      <Media record={item(s, light)} className="only-light" eager={eager} />
    </div>
  );
}
export function Card({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return <article className={'card ' + className}>{children}</article>;
}
export function ContentLink({
  section: s,
  n,
  className = '',
  icon = false,
}: {
  section: string;
  n: number;
  className?: string;
  icon?: boolean;
}) {
  const r = item(s, n),
    a = r.attributes;
  return (
    <a
      data-content-id={r.id}
      href={a?.href}
      target={a?.target}
      rel={a?.rel}
      className={className}
      aria-label={a?.['aria-label']}
      data-consultation={
        (a?.href === '#cta' && r.text === item('hero', 4).text) || undefined
      }
    >
      {r.displayText}
      {icon && <Arrow />}
    </a>
  );
}
