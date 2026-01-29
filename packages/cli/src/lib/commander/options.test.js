import test from 'ava'
import { Command } from 'commander'
import { arrayToOption } from './index.js'
import { colorOption, noColorOption, quietOption, verboseOption, debugOption } from './options.js'

// ─────────────────────────────────────────────────────────────────────────────
// Integration tests for option conflicts
//
// These tests verify that Commander.js correctly enforces the option conflicts
// at parse time.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Helper to create a test program with the shared options
 */
function createTestProgram() {
  const program = new Command()
  program
    .addOption(arrayToOption(colorOption))
    .addOption(arrayToOption(noColorOption))
    .addOption(arrayToOption(quietOption))
    .addOption(arrayToOption(verboseOption))
    .addOption(arrayToOption(debugOption))
    .action(() => {})
    .exitOverride() // Throw instead of process.exit
    .configureOutput({
      writeErr: () => {}, // Suppress error output
    })
  return program
}

test('--quiet alone is valid', (t) => {
  const program = createTestProgram()

  t.notThrows(() => {
    program.parse(['node', 'test', '--quiet'])
  })
})

test('--verbose alone is valid', (t) => {
  const program = createTestProgram()

  t.notThrows(() => {
    program.parse(['node', 'test', '--verbose'])
  })
})

test('--debug alone is valid', (t) => {
  const program = createTestProgram()

  t.notThrows(() => {
    program.parse(['node', 'test', '--debug'])
  })
})

test('--verbose --debug together is valid', (t) => {
  const program = createTestProgram()

  t.notThrows(() => {
    program.parse(['node', 'test', '--verbose', '--debug'])
  })
})

test('--quiet --verbose throws conflict error', (t) => {
  const program = createTestProgram()

  const error = t.throws(() => {
    program.parse(['node', 'test', '--quiet', '--verbose'])
  })

  t.true(error.message.includes('cannot be used with'))
})

test('--quiet --debug throws conflict error', (t) => {
  const program = createTestProgram()

  const error = t.throws(() => {
    program.parse(['node', 'test', '--quiet', '--debug'])
  })

  t.true(error.message.includes('cannot be used with'))
})

test('--quiet --verbose --debug throws conflict error', (t) => {
  const program = createTestProgram()

  const error = t.throws(() => {
    program.parse(['node', 'test', '--quiet', '--verbose', '--debug'])
  })

  t.true(error.message.includes('cannot be used with'))
})

test('-q -v (short flags) throws conflict error', (t) => {
  const program = createTestProgram()

  const error = t.throws(() => {
    program.parse(['node', 'test', '-q', '-v'])
  })

  t.true(error.message.includes('cannot be used with'))
})

test('options order does not affect conflict detection', (t) => {
  const program1 = createTestProgram()
  const program2 = createTestProgram()

  // Both orders should throw
  t.throws(() => program1.parse(['node', 'test', '--quiet', '--verbose']))
  t.throws(() => program2.parse(['node', 'test', '--verbose', '--quiet']))
})

// ─────────────────────────────────────────────────────────────────────────────
// Color option tests
// ─────────────────────────────────────────────────────────────────────────────

test('--no-color sets color to false', (t) => {
  const program = createTestProgram()
  program.parse(['node', 'test', '--no-color'])
  t.is(program.opts().color, false)
})

test('--color sets color to true', (t) => {
  const program = createTestProgram()
  program.parse(['node', 'test', '--color'])
  t.is(program.opts().color, true)
})

test('no color flag leaves color undefined', (t) => {
  const program = createTestProgram()
  program.parse(['node', 'test'])
  t.is(program.opts().color, undefined)
})

test('--no-color can be combined with --verbose', (t) => {
  const program = createTestProgram()
  t.notThrows(() => {
    program.parse(['node', 'test', '--no-color', '--verbose'])
  })
})

test('--no-color can be combined with --quiet', (t) => {
  const program = createTestProgram()
  t.notThrows(() => {
    program.parse(['node', 'test', '--no-color', '--quiet'])
  })
})

test('--no-color can be combined with --debug', (t) => {
  const program = createTestProgram()
  t.notThrows(() => {
    program.parse(['node', 'test', '--no-color', '--debug'])
  })
})
