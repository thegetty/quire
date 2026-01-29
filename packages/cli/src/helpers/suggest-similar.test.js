import test from 'ava'
import { suggestSimilar, formatSuggestion } from './suggest-similar.js'

// ─────────────────────────────────────────────────────────────────────────────
// suggestSimilar
// ─────────────────────────────────────────────────────────────────────────────

test('suggestSimilar returns match for single-character deletion', (t) => {
  const result = suggestSimilar('gt', ['get', 'set', 'delete', 'reset', 'path'])
  t.deepEqual(result, ['get'])
})

test('suggestSimilar returns match for single-character insertion', (t) => {
  const result = suggestSimilar('geet', ['get', 'set', 'delete'])
  t.deepEqual(result, ['get'])
})

test('suggestSimilar returns match for single-character substitution', (t) => {
  const result = suggestSimilar('gat', ['get', 'set', 'delete'])
  t.deepEqual(result, ['get'])
})

test('suggestSimilar returns match for transposition', (t) => {
  const result = suggestSimilar('gte', ['get', 'set', 'delete'])
  t.deepEqual(result, ['get'])
})

test('suggestSimilar returns match for camelCase near-miss', (t) => {
  const result = suggestSimilar('logLeve', ['logLevel', 'logPrefix', 'verbose'])
  t.deepEqual(result, ['logLevel'])
})

test('suggestSimilar returns match for case difference', (t) => {
  // 'loglevel' vs 'logLevel' differs by one character (L vs l)
  const result = suggestSimilar('loglevel', ['logLevel', 'logPrefix', 'verbose'])
  t.deepEqual(result, ['logLevel'])
})

test('suggestSimilar returns empty array when no candidates are similar', (t) => {
  const result = suggestSimilar('xyzabc', ['get', 'set', 'delete', 'reset', 'path'])
  t.deepEqual(result, [])
})

test('suggestSimilar returns empty array for empty input', (t) => {
  t.deepEqual(suggestSimilar('', ['get', 'set']), [])
})

test('suggestSimilar returns empty array for null input', (t) => {
  t.deepEqual(suggestSimilar(null, ['get', 'set']), [])
})

test('suggestSimilar returns empty array for empty candidates', (t) => {
  t.deepEqual(suggestSimilar('get', []), [])
})

test('suggestSimilar returns empty array for null candidates', (t) => {
  t.deepEqual(suggestSimilar('get', null), [])
})

test('suggestSimilar excludes single-character candidates', (t) => {
  // 'g' is distance 0 from 'g', but should be excluded
  const result = suggestSimilar('g', ['g', 'get', 'set'])
  t.deepEqual(result, [])
})

test('suggestSimilar deduplicates candidates', (t) => {
  const result = suggestSimilar('gt', ['get', 'get', 'get'])
  t.deepEqual(result, ['get'])
})

test('suggestSimilar returns multiple matches sorted alphabetically', (t) => {
  // 'bild' is distance 1 from 'bind' and 'build' — both should match
  // but 'build' is distance 1 (deletion), 'bind' is distance 2 (substitution + deletion)
  // Let's use a case where two candidates have equal distance
  const result = suggestSimilar('delet', ['delete', 'reset'])
  // 'delet' → 'delete' distance 1, 'delet' → 'reset' distance 2
  t.deepEqual(result, ['delete'])
})

test('suggestSimilar returns multiple equally-close matches', (t) => {
  // Both 'bar' and 'baz' are distance 1 from 'bax'
  const result = suggestSimilar('bax', ['bar', 'baz', 'foo'])
  t.deepEqual(result, ['bar', 'baz'])
})

// ─────────────────────────────────────────────────────────────────────────────
// formatSuggestion
// ─────────────────────────────────────────────────────────────────────────────

test('formatSuggestion returns undefined for empty array', (t) => {
  t.is(formatSuggestion([]), undefined)
})

test('formatSuggestion returns undefined for null', (t) => {
  t.is(formatSuggestion(null), undefined)
})

test('formatSuggestion returns undefined for undefined', (t) => {
  t.is(formatSuggestion(undefined), undefined)
})

test('formatSuggestion formats single match', (t) => {
  t.is(formatSuggestion(['logLevel']), 'Did you mean: logLevel?')
})

test('formatSuggestion formats multiple matches', (t) => {
  t.is(formatSuggestion(['bar', 'baz']), 'Did you mean one of: bar, baz?')
})
