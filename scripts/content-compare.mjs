import { isDeepStrictEqual } from 'node:util';
export function compare(expected, actual) {
  const diffs = [];
  if (!isDeepStrictEqual(expected, actual)) {
    for (const key of new Set([
      ...Object.keys(expected),
      ...Object.keys(actual),
    ]))
      if (!isDeepStrictEqual(expected[key], actual[key]))
        diffs.push({ key, expected: expected[key], actual: actual[key] });
  }
  return diffs;
}
