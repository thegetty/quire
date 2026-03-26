# Logger Abstraction for Console Output

## Overview

The logger module provides a simple abstraction over `console` methods that makes commands easier to test without stubbing global objects.

## Problem with Global Console Stubbing

Previously, tests that stubbed the _global_ `console` object could not be run in parallel without concurrent execution conflicts.

## Solution: Logger Abstraction

Commands now use a logger module instead of console directly:

```javascript
// ✅ NEW PATTERN - Logger abstraction
import logger from '#src/lib/logger.js'

class MyCommand extends Command {
  async action(options) {
    if (options.debug) {
      logger.info('Command called with options %o', options)
    }

    try {
      // ... command logic
    } catch (error) {
      logger.error('Command failed:', error)
    }
  }
}
```

## Testing with Logger Mocks

Integration tests should mock the `logger` at the module level using `esmock`:

```javascript
test.beforeEach((t) => {
  t.context.sandbox = sinon.createSandbox()

  // Create mock logger (no global stubbing!)
  t.context.mockLogger = {
    debug: t.context.sandbox.stub(),
    error: t.context.sandbox.stub(),
    info: t.context.sandbox.stub(),
    log: t.context.sandbox.stub(),
    warn: t.context.sandbox.stub()
  }
})

test('command should log debug info', async (t) => {
  const { sandbox, mockLogger } = t.context

  // Inject mock logger via esmock
  const MyCommand = await esmock('./mycommand.js', {
    '#src/lib/logger.js': { default: mockLogger }
  })

  const command = new MyCommand()
  await command.action({ debug: true })

  // Assert on mock logger (not global console)
  t.true(mockLogger.info.called)
  t.true(mockLogger.info.calledWith('Command called with options %o'))
})
```

## Benefits

### 1. Parallel Test Execution
Tests can run concurrently without conflicts:

```javascript
test('test 1', async (t) => { /* runs in parallel */ })
test('test 2', async (t) => { /* runs in parallel */ })
test('test 3', async (t) => { /* runs in parallel */ })
```

**Performance improvement:**
|--------|-------------------------|
| serial | 47 tests in ~30 seconds |
| parallel | 47 tests in ~10 seconds |

### 2. No Global State Pollution
Each test gets its own isolated logger mock to avoid conflicts:

```javascript
// Test 1 gets mockLogger instance A
// Test 2 gets mockLogger instance B
```

### 3. Separation of Concerns
Logger can be enhanced with additional features:
- Log levels (debug, info, warn, error)
- File output
- Structured logging
- Log filtering

## See Also

- [Integration Testing Pattern](../commands/README.md#integration-test-pattern)
- [esmock documentation](https://github.com/iambumblehead/esmock)
- [Sinon sandbox documentation](https://sinonjs.org/releases/latest/sandbox/)
