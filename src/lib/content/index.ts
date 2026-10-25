import raw from '../../../content/site-content.json';
import assets from '../../../content/asset-manifest.json';
export interface ContentImage {
  alt: string;
  source: string;
  visible: boolean;
}
export interface ContentItem {
  id: string;
  kind: string;
  text: string;
  displayText: string;
  attributes?: Record<string, string>;
  source?: string;
  width?: number;
  height?: number;
  images?: ContentImage[];
  profiles: Record<string, boolean>;
  visible: boolean;
}
export interface ContentSection {
  id: string;
  items: ContentItem[];
}
export const siteContent = raw;
export const homeContent = raw.pages[0];
export const sections = homeContent.sections as ContentSection[];
export function section(id: string): ContentSection {
  const found = sections.find((s) => s.id === id);
  if (!found) throw new Error('Unknown content section: ' + id);
  return found;
}
export function asset(source: string): string {
  const match = assets.find((a) => new URL(a.source).pathname === source);
  if (!match) throw new Error('Unmapped legacy asset: ' + source);
  return match.url;
}

export function item(sectionId: string, number: number): ContentItem {
  const record = section(sectionId).items[number - 1];
  if (!record) throw new Error('Unknown content item');
  return record;
}
export function state(name: string) {
  const found = siteContent.states.find((s) => s.name === name);
  if (!found) throw new Error('Unknown content state');
  return found as {
    name: string;
    items: Omit<ContentItem, 'id' | 'profiles'>[];
  };
}
export function accessible(sectionId: string, attribute: string, index = 0) {
  const records = siteContent.accessibility.filter(
    (a) => a.section === sectionId && attribute in a.attributes,
  );
  return (
    records[index]?.attributes as Record<string, string | undefined> | undefined
  )?.[attribute];
}
export const themeLabels = siteContent.ui.themeToggle;
