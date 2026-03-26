import test from 'ava'
import { formatDuration } from './formatDuration.js'

test('formatDuration returns seconds for durations under 1 minute', (t) => {
  t.is(formatDuration(0), '0 seconds')
  t.is(formatDuration(1000), '1 second')
  t.is(formatDuration(45000), '45 seconds')
  t.is(formatDuration(59000), '59 seconds')
})

test('formatDuration returns minutes for durations under 1 hour', (t) => {
  t.is(formatDuration(60000), '1 minute')
  t.is(formatDuration(120000), '2 minutes')
  t.is(formatDuration(30 * 60 * 1000), '30 minutes')
  t.is(formatDuration(59 * 60 * 1000), '59 minutes')
})

test('formatDuration returns hours for durations under 1 day', (t) => {
  t.is(formatDuration(60 * 60 * 1000), '1 hour')
  t.is(formatDuration(2 * 60 * 60 * 1000), '2 hours')
  t.is(formatDuration(12 * 60 * 60 * 1000), '12 hours')
  t.is(formatDuration(23 * 60 * 60 * 1000), '23 hours')
})

test('formatDuration returns days for durations under 1 week', (t) => {
  t.is(formatDuration(24 * 60 * 60 * 1000), '1 day')
  t.is(formatDuration(2 * 24 * 60 * 60 * 1000), '2 days')
  t.is(formatDuration(6 * 24 * 60 * 60 * 1000), '6 days')
})

test('formatDuration returns weeks for durations under 1 month', (t) => {
  t.is(formatDuration(7 * 24 * 60 * 60 * 1000), '1 week')
  t.is(formatDuration(14 * 24 * 60 * 60 * 1000), '2 weeks')
  t.is(formatDuration(21 * 24 * 60 * 60 * 1000), '3 weeks')
  t.is(formatDuration(28 * 24 * 60 * 60 * 1000), '4 weeks')
})

test('formatDuration returns months for durations under 1 year', (t) => {
  t.is(formatDuration(30 * 24 * 60 * 60 * 1000), '1 month')
  t.is(formatDuration(60 * 24 * 60 * 60 * 1000), '2 months')
  t.is(formatDuration(90 * 24 * 60 * 60 * 1000), '3 months')
  t.is(formatDuration(180 * 24 * 60 * 60 * 1000), '6 months')
  t.is(formatDuration(364 * 24 * 60 * 60 * 1000), '12 months')
})

test('formatDuration returns years for durations of 1 year or more', (t) => {
  t.is(formatDuration(365 * 24 * 60 * 60 * 1000), '1 year')
  t.is(formatDuration(2 * 365 * 24 * 60 * 60 * 1000), '2 years')
  t.is(formatDuration(5 * 365 * 24 * 60 * 60 * 1000), '5 years')
  t.is(formatDuration(10 * 365 * 24 * 60 * 60 * 1000), '10 years')
})

test('formatDuration handles singular forms correctly', (t) => {
  t.is(formatDuration(1000), '1 second')
  t.is(formatDuration(60 * 1000), '1 minute')
  t.is(formatDuration(60 * 60 * 1000), '1 hour')
  t.is(formatDuration(24 * 60 * 60 * 1000), '1 day')
  t.is(formatDuration(7 * 24 * 60 * 60 * 1000), '1 week')
  t.is(formatDuration(30 * 24 * 60 * 60 * 1000), '1 month')
  t.is(formatDuration(365 * 24 * 60 * 60 * 1000), '1 year')
})

test('formatDuration handles plural forms correctly', (t) => {
  t.is(formatDuration(2000), '2 seconds')
  t.is(formatDuration(2 * 60 * 1000), '2 minutes')
  t.is(formatDuration(2 * 60 * 60 * 1000), '2 hours')
  t.is(formatDuration(2 * 24 * 60 * 60 * 1000), '2 days')
  t.is(formatDuration(2 * 7 * 24 * 60 * 60 * 1000), '2 weeks')
  t.is(formatDuration(2 * 30 * 24 * 60 * 60 * 1000), '2 months')
  t.is(formatDuration(2 * 365 * 24 * 60 * 60 * 1000), '2 years')
})

test('default export is the same as named export', async (t) => {
  const module = await import('./formatDuration.js')
  t.is(module.default, module.formatDuration)
})
