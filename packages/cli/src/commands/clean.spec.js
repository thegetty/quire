import CleanCommand from '#src/commands/clean.js'
import test from 'ava'
import semver from 'semver'
import sinon from 'sinon'

test('clean command should be instantiated with correct definition', (t) => {
  const command = new CleanCommand()

  t.is(command.name, 'clean')
  t.truthy(command.description)
  t.truthy(command.summary)
  t.truthy(semver.valid(command.version), `command must have a semantic version, got: ${command.version}`)
  // Note bene: args may be omitted from some command definitions
  t.true(Array.isArray(command.args) || command.args === undefined)
  t.truthy(command.options)
})
