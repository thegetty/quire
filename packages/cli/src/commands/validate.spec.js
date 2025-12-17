import ValidateCommand from '#src/commands/validate.js'
import test from 'ava'
import semver from 'semver'
import sinon from 'sinon'

test('validate command should be instantiated with correct definition', (t) => {
  const command = new ValidateCommand()

  t.is(command.name, 'validate')
  t.truthy(command.description)
  t.truthy(command.summary)
  t.truthy(semver.valid(command.version), `command must have a semantic version, got: ${command.version}`)
  t.truthy(command.args)
  t.truthy(command.options)
})
