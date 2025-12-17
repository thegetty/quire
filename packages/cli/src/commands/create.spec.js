import CreateCommand from '#src/commands/create.js'
import test from 'ava'
import semver from 'semver'
import sinon from 'sinon'

test.beforeEach((t) => {
  // Create a mock config object
  t.context.mockConfig = {
    get: sinon.stub().returns('default-starter')
  }

  // Create command instance and mock config
  t.context.command = new CreateCommand()
  t.context.command.config = t.context.mockConfig
})

test.afterEach((t) => {
  sinon.restore()
})

test('CreateCommand should be instantiated with correct definition', (t) => {
  const command = t.context.command

  t.is(command.name, 'new')
  t.truthy(command.description)
  t.truthy(command.summary)
  t.truthy(semver.valid(command.version), `command must have a semantic version, got: ${command.version}`)
  t.truthy(command.args)
  t.truthy(command.options)
})
