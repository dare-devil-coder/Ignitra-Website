import assert from 'node:assert/strict';
const norm = (s) => s.replace(/\s+/g, ' ').trim();
async function observed(locator) {
  // Compare settled CSS interaction states, including delayed menu entries.
  await locator.evaluate(async (root) => {
    await Promise.all(
      root
        .getAnimations({ subtree: true })
        .filter(
          (animation) => animation.effect?.getTiming().iterations !== Infinity,
        )
        .map((animation) => animation.finished.catch(() => {})),
    );
  });
  return locator.evaluate((root) => {
    const norm = (s) => s.replace(/\s+/g, ' ').trim();
    const visible = (e) => {
      for (let a = e; a; a = a.parentElement) {
        const s = getComputedStyle(a);
        if (
          s.display === 'none' ||
          s.visibility === 'hidden' ||
          Number(s.opacity) === 0 ||
          a.hidden
        )
          return false;
      }
      return true;
    };
    const text = (e) => {
      const result = [],
        w = document.createTreeWalker(e, NodeFilter.SHOW_TEXT);
      let n;
      while ((n = w.nextNode()))
        if (
          !n.parentElement.closest('script,style,noscript') &&
          visible(n.parentElement) &&
          norm(n.textContent)
        )
          result.push(norm(n.textContent));
      return result.join(' ');
    };
    return {
      text: text(root),
      links: [...root.querySelectorAll('a')].filter(visible).map((a) => ({
        text: norm(a.textContent),
        href: a.getAttribute('href'),
        target: a.getAttribute('target'),
      })),
      images: [...root.querySelectorAll('img')]
        .filter(visible)
        .map((i) => i.getAttribute('alt')),
    };
  });
}
function expected(items, all = false) {
  const shown = items.filter((i) => all || i.visible);
  return {
    text: shown
      .map((i) => i.displayText)
      .filter(Boolean)
      .join(' '),
    links: shown
      .filter((i) => i.kind === 'a')
      .map((i) => ({
        text: i.displayText,
        href: i.attributes.href,
        target: i.attributes.target || null,
      })),
    images: shown
      .filter((i) => i.kind === 'img')
      .map((i) => i.attributes.alt ?? null),
  };
}
export async function verifyInteractions(page, snapshot, profile, allow) {
  const passed = [];
  const loop = page.locator('#difference');
  for (let index = 0; index < 7; index++) {
    await loop.locator('.loop-controls button').nth(index).click();
    const state = snapshot.states.find((s) => s.name === 'loop-' + (index + 1));
    // Capture contains the final authored records even where the old fade was mid-transition.
    assert.deepEqual(
      await observed(loop),
      expected(state.items, true),
      'Settled loop state ' + (index + 1),
    );
    assert.equal(await loop.locator('[aria-pressed=true]').count(), 1);
    passed.push('loop-' + (index + 1));
  }
  await page.evaluate(() => scrollTo(0, 0));
  await page.waitForFunction(
    () => document.querySelector('.nav-wrap').getBoundingClientRect().top >= 0,
  );
  await page
    .getByRole('link', { name: 'Book a Consultation', exact: true })
    .first()
    .click();
  const dialog = page.locator('.consultation-dialog');
  assert.equal(await dialog.evaluate((e) => e.open), true);
  assert.deepEqual(
    await observed(dialog),
    expected(snapshot.states.find((s) => s.name === 'consultation-open').items),
    'Consultation open content',
  );
  for (const record of snapshot.accessibility.filter(
    (r) =>
      r.section === 'consultation' && ['input', 'textarea'].includes(r.tag),
  )) {
    const a = record.attributes;
    if (a.name.startsWith('$ACTION')) continue;
    const field = dialog.locator('[name="' + a.name + '"]');
    assert.equal(await field.count(), 1, 'Missing field ' + a.name);
    for (const [key, sourceValue] of Object.entries(a)) {
      const correction = allow.approvedAttributeCorrections.find(
        (c) =>
          c.selector === 'input[name="' + a.name + '"]' && c.attribute === key,
      );
      if (correction) assert.equal(correction.legacy, sourceValue);
      const value = correction?.value ?? sourceValue;
      assert.equal(
        await field.getAttribute(key),
        value,
        'Field attribute ' + a.name + '.' + key,
      );
    }
  }
  const combo = dialog.getByRole('combobox');
  await combo.click();
  assert.deepEqual(
    await observed(dialog),
    expected(
      snapshot.states.find((s) => s.name === 'consultation-options').items,
    ),
    'Consultation options content',
  );
  for (let index = 0; index < 4; index++) {
    if (index) await combo.click();
    await dialog.getByRole('option').nth(index).click();
    const items = snapshot.states.find(
      (s) => s.name === 'consultation-options',
    ).items;
    const labels = items.filter(
      (i) =>
        i.kind === 'text' &&
        [
          'Consulting',
          'Marketing & Business Growth Strategy',
          'IT Solutions',
          'Not sure yet',
        ].includes(i.text),
    );
    assert.equal(norm(await combo.textContent()), labels[index].displayText);
  }
  await combo.focus();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('End');
  await page.keyboard.press('Enter');
  assert.equal(await combo.getAttribute('aria-expanded'), 'false');
  await dialog.getByLabel('Close', { exact: true }).click();
  assert.equal(await dialog.evaluate((e) => e.open), false);
  assert.equal(
    await page.evaluate(() =>
      document.activeElement?.hasAttribute('data-consultation'),
    ),
    true,
    'Dialog restores focus',
  );
  passed.push(
    'consultation-open',
    'consultation-options',
    'form-attributes',
    'service-selection',
    'dialog-focus',
  );
  if (profile.width < 768) {
    await page.getByRole('button', { name: 'Open menu', exact: true }).click();
    const menu = page.locator('#mobile-menu');
    assert.deepEqual(
      await observed(menu),
      expected(snapshot.states.find((s) => s.name === 'mobile-menu').items),
      'Mobile menu content',
    );
    await page.keyboard.press('Escape');
    assert.equal(await menu.evaluate((e) => e.open), false);
    assert.equal(
      await page
        .getByRole('button', { name: 'Open menu', exact: true })
        .evaluate((e) => e === document.activeElement),
      true,
    );
    passed.push('mobile-menu');
  }
  const toggle = page.locator('.nav-pill .theme-toggle');
  await toggle.click();
  const next = profile.theme === 'dark' ? 'light' : 'dark';
  await page.waitForFunction(
    (next) => document.documentElement.dataset.theme === next,
    next,
  );
  assert.equal(await page.locator('html').getAttribute('data-theme'), next);
  assert.equal(
    await toggle.getAttribute('aria-pressed'),
    String(next === 'light'),
  );
  await page.reload();
  assert.equal(await page.locator('html').getAttribute('data-theme'), next);
  passed.push('theme-toggle-and-persistence');
  return passed;
}
