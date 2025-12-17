import InfoCommand from '#src/commands/info.js'
import test from 'ava'
import semver from 'semver'
import sinon from 'sinon'

test('info command should be instantiated with correct definition', (t) => {
  const command = new InfoCommand()

  t.is(command.name, 'info')
  t.truthy(command.description)
  t.truthy(command.summary)
  t.truthy(semver.valid(command.version), `command must have a semantic version, got: ${command.version}`)
  t.truthy(command.args)
  t.truthy(command.options)
})
