# Logger Module

A logging facade for the Quire CLI that provides colored output, log level filtering, and module-specific prefixes. Aligned with the 11ty package logging format for a consistent user experience.

## Features

- **Log level filtering** via [loglevel](https://github.com/pimterry/loglevel)
- **Colored output** via [chalk](https://github.com/chalk/chalk)
- **Module-specific prefixes** for traceable log messages
- **Configuration integration** reads level from `QUIRE_LOG_LEVEL` environment variable
- **11ty format alignment** consistent `[quire] LEVEL prefix message` output

## Usage

### Simple Usage (Singleton)

```javascript
import { logger } from '#lib/logger/index.js'

logger.info('Starting build...')
logger.debug('Processing file:', filename)
logger.warn('Deprecated option used')
logger.error('Build failed:', error.message)
```

### Module-Specific Logger

```javascript
import createLogger from '#lib/logger/index.js'

const logger = createLogger('lib:pdf')

logger.info('Generating PDF...')
// Output: [quire] INFO  lib:pdf                   Generating PDF...
```

### With Explicit Level

```javascript
import createLogger from '#lib/logger/index.js'

// Create a debug-level logger regardless of config
const logger = createLogger('debug:module', 'debug')
```

## Log Levels

| Level | Value | Description |
|-------|-------|-------------|
| `trace` | 0 | Most verbose, for detailed debugging |
| `debug` | 1 | Debug information |
| `info` | 2 | General information (default) |
| `warn` | 3 | Warnings |
| `error` | 4 | Errors only |
| `silent` | 5 | No output |

## Configuration

The logger reads its default level from the `QUIRE_LOG_LEVEL` environment variable, which is set by the CLI entry point from the user's configuration.

### Priority Order

1. **Explicit level parameter** - `createLogger('prefix', 'debug')`
2. **Environment variable** - `QUIRE_LOG_LEVEL=debug`
3. **Default** - `info`

### Setting Log Level

```javascript
// At runtime
logger.setLevel('debug')

// Check current level
const level = logger.getLevel() // Returns numeric level (0-5)
```

### Via Configuration

The CLI reads `logLevel` from the user's config file (`~/.config/quire-cli/config.json`):

```json
{
  "logLevel": "debug"
}
```

This is set as `QUIRE_LOG_LEVEL` environment variable before logger modules are loaded.

## Output Format

```
[quire] LEVEL prefix                    message
```

Example output:

```
[quire] INFO  quire                     Starting build...
[quire] DEBUG lib:pdf                   Resolving library: prince
[quire] WARN  lib:epub                  Missing cover image
[quire] ERROR lib:git                   Failed to clone repository
```

The format matches the 11ty package's logging for visual consistency.

## Testing

### Mocking in Tests

```javascript
import test from 'ava'
import esmock from 'esmock'

test('example test', async (t) => {
  const mockLogger = {
    info: t.context.sandbox.stub(),
    error: t.context.sandbox.stub(),
    debug: t.context.sandbox.stub(),
    warn: t.context.sandbox.stub(),
    trace: t.context.sandbox.stub(),
    setLevel: t.context.sandbox.stub(),
    getLevel: t.context.sandbox.stub().returns(2)
  }

  const MyModule = await esmock('./my-module.js', {
    '#lib/logger/index.js': { logger: mockLogger }
  })

  // Test code...

  t.true(mockLogger.info.calledWith('expected message'))
})
```

### Testing with Environment Variable

```javascript
test.serial('logger respects QUIRE_LOG_LEVEL', async (t) => {
  const original = process.env.QUIRE_LOG_LEVEL

  try {
    process.env.QUIRE_LOG_LEVEL = 'debug'

    // Import fresh module
    const { default: createLogger } = await import('./index.js?test-env')
    const log = createLogger('test:prefix')

    t.is(log.getLevel(), 1) // debug = 1
  } finally {
    process.env.QUIRE_LOG_LEVEL = original
  }
})
```

## API Reference

### `createLogger(prefix?, level?)`

Creates a new logger instance.

**Parameters:**
- `prefix` (string, default: `'quire'`) - Module prefix for log messages
- `level` (string|number, optional) - Log level override

**Returns:** Logger instance with methods:
- `trace(...args)` - Log at trace level
- `debug(...args)` - Log at debug level
- `info(...args)` - Log at info level
- `warn(...args)` - Log at warn level
- `error(...args)` - Log at error level
- `setLevel(level)` - Change log level at runtime
- `getLevel()` - Get current numeric log level

### `logger`

Default singleton logger instance with prefix `'quire'`.

### `LOG_LEVELS`

Exported constants for log level values:

```javascript
import { LOG_LEVELS } from '#lib/logger/index.js'

LOG_LEVELS.trace  // 0
LOG_LEVELS.debug  // 1
LOG_LEVELS.info   // 2
LOG_LEVELS.warn   // 3
LOG_LEVELS.error  // 4
LOG_LEVELS.silent // 5
```

### `LOG_LEVEL_ENV_VAR`

The environment variable name used for configuration: `'QUIRE_LOG_LEVEL'`

## Architecture

```
bin/cli.js
    │
    ├── Reads config.get('logLevel')
    ├── Sets process.env.QUIRE_LOG_LEVEL
    │
    └── Dynamic import main.js
            │
            └── Imports commands
                    │
                    └── Import logger
                            │
                            └── resolveLevel() reads QUIRE_LOG_LEVEL
```

This architecture ensures:
1. Config is read before any logger modules are loaded
2. All loggers (including module-level ones) use the configured level
3. Tests can set the env var before importing to control levels

## Related

- [11ty chalk factory](../../../11ty/_lib/chalk/index.js) - 11ty's equivalent logger
- [conf module](../conf/) - Configuration management
- [cli-architecture.md](../../docs/cli-architecture.md) - Architecture documentation
