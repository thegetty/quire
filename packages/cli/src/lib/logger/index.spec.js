import test from 'ava'
import createLogger, { logger, LOG_LEVELS } from './index.js'

/**
 * Logger Module Unit Tests
 *
 * Tests the logger factory exports and API surface.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Export tests
// ─────────────────────────────────────────────────────────────────────────────

test('createLogger is exported as default', (t) => {
  t.is(typeof createLogger, 'function')
})

test('logger singleton is exported', (t) => {
  t.truthy(logger)
  t.is(typeof logger.info, 'function')
})

test('LOG_LEVELS constants are exported', (t) => {
  t.deepEqual(LOG_LEVELS, {
    trace: 0,
    debug: 1,
    info: 2,
    warn: 3,
    error: 4,
    silent: 5
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Factory function tests
// ─────────────────────────────────────────────────────────────────────────────

test('createLogger returns logger with all methods', (t) => {
  const log = createLogger('test')

  t.is(typeof log.trace, 'function')
  t.is(typeof log.debug, 'function')
  t.is(typeof log.info, 'function')
  t.is(typeof log.warn, 'function')
  t.is(typeof log.error, 'function')
  t.is(typeof log.setLevel, 'function')
  t.is(typeof log.getLevel, 'function')
})

test('createLogger uses default prefix when none provided', (t) => {
  const log = createLogger()
  t.truthy(log)
  t.is(typeof log.info, 'function')
})

test('createLogger accepts custom prefix', (t) => {
  const log = createLogger('custom:prefix')
  t.truthy(log)
})

test('createLogger accepts level as string', (t) => {
  const log = createLogger('test', 'debug')
  t.is(log.getLevel(), LOG_LEVELS.debug)
})

test('createLogger accepts level as number', (t) => {
  const log = createLogger('test', 3)
  t.is(log.getLevel(), 3)
})

test('createLogger defaults to info level', (t) => {
  const log = createLogger('test')
  t.is(log.getLevel(), LOG_LEVELS.info)
})

// ─────────────────────────────────────────────────────────────────────────────
// setLevel tests
// ─────────────────────────────────────────────────────────────────────────────

test('setLevel changes log level with string', (t) => {
  const log = createLogger('test', 'info')
  t.is(log.getLevel(), LOG_LEVELS.info)

  log.setLevel('debug')
  t.is(log.getLevel(), LOG_LEVELS.debug)
})

test('setLevel changes log level with number', (t) => {
  const log = createLogger('test', 'info')

  log.setLevel(0)
  t.is(log.getLevel(), 0)
})

test('setLevel defaults to info for invalid level', (t) => {
  const log = createLogger('test', 'debug')

  log.setLevel('invalid')
  t.is(log.getLevel(), LOG_LEVELS.info)
})

// ─────────────────────────────────────────────────────────────────────────────
// Singleton tests
// ─────────────────────────────────────────────────────────────────────────────

test('logger singleton has all required methods', (t) => {
  t.is(typeof logger.trace, 'function')
  t.is(typeof logger.debug, 'function')
  t.is(typeof logger.info, 'function')
  t.is(typeof logger.warn, 'function')
  t.is(typeof logger.error, 'function')
  t.is(typeof logger.setLevel, 'function')
  t.is(typeof logger.getLevel, 'function')
})

// ─────────────────────────────────────────────────────────────────────────────
// Multiple logger instances tests
// ─────────────────────────────────────────────────────────────────────────────

test('createLogger creates independent instances', (t) => {
  const log1 = createLogger('module:one', 'debug')
  const log2 = createLogger('module:two', 'error')

  t.is(log1.getLevel(), LOG_LEVELS.debug)
  t.is(log2.getLevel(), LOG_LEVELS.error)

  // Changing one shouldn't affect the other
  log1.setLevel('warn')
  t.is(log1.getLevel(), LOG_LEVELS.warn)
  t.is(log2.getLevel(), LOG_LEVELS.error)
})
