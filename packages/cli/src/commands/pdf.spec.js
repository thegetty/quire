import PDFCommand from '#src/commands/pdf.js'
import test from 'ava'
import semver from 'semver'
import sinon from 'sinon'

test('pdf command should be instantiated with correct definition', (t) => {
  const command = new PDFCommand()

  t.is(command.name, 'pdf')
  t.truthy(command.description)
  t.truthy(command.summary)
  t.truthy(semver.valid(command.version), `command must have a semantic version, got: ${command.version}`)
  // Note bene: args may be omitted from some command definitions
  t.true(command.args === undefined)
  t.truthy(command.options)
})
