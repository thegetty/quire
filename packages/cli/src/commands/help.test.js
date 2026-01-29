import esmock from 'esmock'
import sinon from 'sinon'
import test from 'ava'

/**
 * Help Command Integration Tests
 *
 * Tests the help command behavior with mocked dependencies.
 */

test.serial('help command outputs topic list when called without arguments', async (t) => {
  const sandbox = sinon.createSandbox()
  const stdoutWrite = sandbox.stub(process.stdout, 'write')

  try {
    const mockList = 'Available help topics:\n  debugging  Troubleshooting help'

    const HelpCommand = await esmock('./help.js', {
      '#lib/help/index.js': {
        getTopicList: sandbox.stub().resolves(mockList),
        getTopicContent: sandbox.stub()
      },
      '#helpers/pager.js': {
        outputWithPaging: sandbox.stub()
      }
    })

    const command = new HelpCommand.default()
    await command.action(undefined, {}, {})

    t.true(stdoutWrite.calledOnce)
    t.true(stdoutWrite.calledWith(mockList + '\n'))
  } finally {
    sandbox.restore()
  }
})

test.serial('help command outputs topic list when --list flag is provided', async (t) => {
  const sandbox = sinon.createSandbox()
  const stdoutWrite = sandbox.stub(process.stdout, 'write')

  try {
    const mockList = 'Available help topics:\n  pdf  PDF generation'

    const HelpCommand = await esmock('./help.js', {
      '#lib/help/index.js': {
        getTopicList: sandbox.stub().resolves(mockList),
        getTopicContent: sandbox.stub()
      },
      '#helpers/pager.js': {
        outputWithPaging: sandbox.stub()
      }
    })

    const command = new HelpCommand.default()
    await command.action('ignored', { list: true }, {})

    t.true(stdoutWrite.calledOnce)
    t.true(stdoutWrite.calledWith(mockList + '\n'))
  } finally {
    sandbox.restore()
  }
})

test('help command outputs topic content with paging when topic is specified', async (t) => {
  const sandbox = sinon.createSandbox()

  try {
    const mockRendered = 'Rendered workflows content'
    const mockOutputWithPaging = sandbox.stub().resolves()

    const HelpCommand = await esmock('./help.js', {
      '#lib/help/index.js': {
        getTopicList: sandbox.stub(),
        getTopicContent: sandbox.stub().resolves(mockRendered)
      },
      '#helpers/pager.js': {
        outputWithPaging: mockOutputWithPaging
      }
    })

    const command = new HelpCommand.default()
    await command.action('workflows', {}, {})

    t.true(mockOutputWithPaging.calledOnce)
    t.true(mockOutputWithPaging.calledWith(mockRendered))
  } finally {
    sandbox.restore()
  }
})

test('help command propagates HelpTopicNotFoundError from getTopicContent', async (t) => {
  const sandbox = sinon.createSandbox()

  try {
    const { default: HelpTopicNotFoundError } = await import('#src/errors/help/help-topic-not-found-error.js')

    const HelpCommand = await esmock('./help.js', {
      '#lib/help/index.js': {
        getTopicList: sandbox.stub(),
        getTopicContent: sandbox.stub().rejects(new HelpTopicNotFoundError('nonexistent'))
      },
      '#helpers/pager.js': {
        outputWithPaging: sandbox.stub()
      }
    })

    const command = new HelpCommand.default()

    const error = await t.throwsAsync(
      () => command.action('nonexistent', {}, {}),
      { name: 'HelpTopicNotFoundError' }
    )

    t.is(error.code, 'HELP_TOPIC_NOT_FOUND')
    t.is(error.exitCode, 2)
    t.is(error.topic, 'nonexistent')
  } finally {
    sandbox.restore()
  }
})

test('help command has correct definition', async (t) => {
  const HelpCommand = await import('./help.js')
  const command = new HelpCommand.default()

  t.is(command.name, 'help')
  t.deepEqual(command.aliases, ['h'])
  t.truthy(command.description)
  t.truthy(command.args)
  t.truthy(command.options)
})
