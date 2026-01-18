import test from 'ava'
import { Argument, Option } from 'commander'
import { arrayToArgument, arrayToOption } from './index.js'

// ─────────────────────────────────────────────────────────────────────────────
// arrayToArgument tests
// ─────────────────────────────────────────────────────────────────────────────

test('arrayToArgument creates Argument from basic array', (t) => {
  const arg = arrayToArgument(['<version>', 'the version to use'])

  t.true(arg instanceof Argument)
  t.is(arg.name(), 'version')
  t.is(arg.description, 'the version to use')
  t.true(arg.required)
})

test('arrayToArgument creates optional Argument', (t) => {
  const arg = arrayToArgument(['[starter]', 'starter template'])

  t.true(arg instanceof Argument)
  t.is(arg.name(), 'starter')
  t.false(arg.required)
})

test('arrayToArgument applies choices from config', (t) => {
  const arg = arrayToArgument(['<format>', 'output format', { choices: ['pdf', 'epub'] }])

  t.true(arg instanceof Argument)
  t.deepEqual(arg.argChoices, ['pdf', 'epub'])
})

test('arrayToArgument applies default from config', (t) => {
  const arg = arrayToArgument(['[starter]', 'starter template', { default: 'default' }])

  t.true(arg instanceof Argument)
  t.is(arg.defaultValue, 'default')
})

// ─────────────────────────────────────────────────────────────────────────────
// arrayToOption tests
// ─────────────────────────────────────────────────────────────────────────────

test('arrayToOption creates Option from combined flags', (t) => {
  const opt = arrayToOption(['--debug', 'enable debug output'])

  t.true(opt instanceof Option)
  t.is(opt.long, '--debug')
  t.is(opt.description, 'enable debug output')
})

test('arrayToOption creates Option from separate short/long flags', (t) => {
  const opt = arrayToOption(['-v', '--verbose', 'enable verbose output'])

  t.true(opt instanceof Option)
  t.is(opt.short, '-v')
  t.is(opt.long, '--verbose')
  t.is(opt.description, 'enable verbose output')
})

test('arrayToOption applies choices from config object', (t) => {
  const opt = arrayToOption([
    '--lib <module>',
    'library to use',
    { choices: ['pagedjs', 'prince'], default: 'pagedjs' }
  ])

  t.true(opt instanceof Option)
  t.deepEqual(opt.argChoices, ['pagedjs', 'prince'])
  t.is(opt.defaultValue, 'pagedjs')
})

test('arrayToOption applies default from positional argument', (t) => {
  const opt = arrayToOption(['--port <number>', 'port to use', 8080])

  t.true(opt instanceof Option)
  t.is(opt.defaultValue, 8080)
})

test('arrayToOption handles option with value placeholder', (t) => {
  const opt = arrayToOption(['--output <path>', 'output directory'])

  t.true(opt instanceof Option)
  t.is(opt.long, '--output')
  t.true(opt.required) // option requires a value
})
