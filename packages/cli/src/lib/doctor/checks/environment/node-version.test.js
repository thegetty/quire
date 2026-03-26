import test from 'ava'

test('checkNodeVersion returns ok when version meets requirement', async (t) => {
  const { checkNodeVersion } = await import('./node-version.js')

  const result = checkNodeVersion()

  // Current Node.js version should be >= 22 in dev environment
  t.is(typeof result.ok, 'boolean')
  t.is(typeof result.message, 'string')
  t.regex(result.message, /v\d+/)

  // When check passes, details should be the Node.js executable path
  if (result.ok) {
    t.is(result.details, process.execPath)
  }
})
