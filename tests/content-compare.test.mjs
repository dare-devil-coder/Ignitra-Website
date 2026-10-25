import test from 'node:test';
import assert from 'node:assert/strict';
import { compare } from '../scripts/content-compare.mjs';
const baseline = {
  sections: [
    {
      id: 'first',
      text: 'Exact words.',
      links: [{ href: '#contact', target: null }],
      images: ['Original alt'],
    },
    { id: 'second', text: 'Next.' },
  ],
};
test('accepts identical independently decoded snapshots', () =>
  assert.deepEqual(
    compare(baseline, JSON.parse(JSON.stringify(baseline))),
    [],
  ));
for (const kind of ['copy', 'href', 'alt', 'order', 'extra'])
  test('rejects ' + kind + ' mutation', () => {
    const changed = structuredClone(baseline);
    if (kind === 'copy') changed.sections[0].text = 'Different words.';
    if (kind === 'href') changed.sections[0].links[0].href = '#wrong';
    if (kind === 'alt') changed.sections[0].images[0] = 'Changed alt';
    if (kind === 'order') changed.sections.reverse();
    if (kind === 'extra')
      changed.sections.push({ id: 'invented', text: 'Extra' });
    assert.ok(compare(baseline, changed).length);
  });
