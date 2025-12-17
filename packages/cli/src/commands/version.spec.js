import VersionCommand from '#src/commands/version.js'
import test from 'ava'
import semver from 'semver'
import sinon from 'sinon'

test('version command should be instantiated with correct definition', (t) => {
  const command = new VersionCommand()

  t.is(command.name, 'version')
  t.truthy(command.description)
  t.truthy(command.summary)
  t.truthy(semver.valid(command.version), `command must have a semantic version, got: ${command.version}`)
  t.truthy(command.args)
  t.truthy(command.options)
})
