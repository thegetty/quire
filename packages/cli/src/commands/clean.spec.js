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
  t.truthy(command.args)
  t.truthy(command.options)
})
