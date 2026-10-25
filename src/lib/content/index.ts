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
