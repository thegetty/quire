import Command from './Command.js'
import test from 'ava'

/**
 * Command Base Class Unit Tests
 *
 * Tests the abstract Command base class API contract.
 * These tests verify the class cannot be instantiated directly
 * and that the base methods behave correctly.
 */

test('Command cannot be instantiated directly', (t) => {
  const error = t.throws(() => {
    new Command({ name: 'test', description: 'test command' })
  })

  t.truthy(error)
  t.regex(error.message, /abstract/i, 'error message should mention abstract')
})

test('Command.action() throws not-implemented error', (t) => {
  // Create a minimal subclass that does not override action
  class TestCommand extends Command {
    constructor() {
      super({ name: 'test', description: 'test command' })
    }
  }

  const command = new TestCommand()
  const error = t.throws(() => command.action())

  t.truthy(error)
  t.regex(error.message, /not been implemented/i, 'error message should indicate not implemented')
  t.regex(error.message, /test/i, 'error message should include the command name')
})

test('subclass can override action without error', (t) => {
  class TestCommand extends Command {
    constructor() {
      super({ name: 'test', description: 'test command' })
    }

    action() {
      return 'action executed'
    }
  }

  const command = new TestCommand()
  const result = command.action()

  t.is(result, 'action executed')
})

test('Command constructor sets properties from definition', (t) => {
  const definition = {
    name: 'test',
    description: 'A test command',
    summary: 'test summary',
    aliases: ['t', 'tst'],
    args: [['<input>', 'input file']],
    options: [['--verbose', 'enable verbose output']],
    version: '1.0.0',
    hidden: true,
  }

  class TestCommand extends Command {
    constructor() {
      super(definition)
    }

    action() {}
  }

  const command = new TestCommand()

  t.is(command.name, 'test')
  t.is(command.description, 'A test command')
  t.is(command.summary, 'test summary')
  t.deepEqual(command.aliases, ['t', 'tst'])
  t.deepEqual(command.args, [['<input>', 'input file']])
  t.deepEqual(command.options, [['--verbose', 'enable verbose output']])
  t.is(command.version, '1.0.0')
  t.is(command.hidden, true)
})

test('Command constructor injects shared configuration', (t) => {
  class TestCommand extends Command {
    constructor() {
      super({ name: 'test', description: 'test command' })
    }

    action() {}
  }

  const command = new TestCommand()

  t.truthy(command.config, 'config should be injected')
  t.is(typeof command.config.get, 'function', 'config should have get method')
})
