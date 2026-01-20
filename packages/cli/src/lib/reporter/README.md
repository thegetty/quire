# Reporter Module

The Reporter module provides CLI progress feedback through spinners and status indicators.

## Overview

This module wraps [ora](https://github.com/sindresorhus/ora) to provide:

- Consistent progress indicators across all CLI commands
- Automatic suppression in quiet mode, JSON mode, and non-TTY environments
- Elapsed time display for long-running operations
- Multi-phase operation support

## Usage

### Basic Usage

```javascript
import reporter from '#lib/reporter/index.js'

// Start a spinner
reporter.start('Building site...')

// Do work...
await build()

// Mark as complete
reporter.succeed('Build complete')
```

### Multi-Phase Operations

```javascript
reporter.start('Cloning starter project...')
await git.clone(starter, '.')

reporter.update('Initializing repository...')
await git.init()

reporter.update('Installing dependencies...')
await npm.install()

reporter.succeed('Project created')
```

### Error Handling

```javascript
reporter.start('Generating PDF...')
try {
  await generatePdf()
  reporter.succeed('PDF generated')
} catch (error) {
  reporter.fail('PDF generation failed')
  throw error
}
```

### Elapsed Time Display

For operations with unpredictable duration:

```javascript
reporter.start('Building site...', { showElapsed: true })
// Shows: ⠋ Building site... (12s)
await build()
reporter.succeed('Build complete')
```

### Configuration

Configure the reporter to respect command options:

```javascript
async action(options) {
  // Call at start of action() to respect --quiet, --json flags
  reporter.configure(options)

  reporter.start('Working...')
  // ...
}
```

| Option | Effect |
|--------|--------|
| `quiet: true` | Suppress all spinner output |
| `json: true` | Suppress spinner (JSON-only output) |
| `verbose: true` | (Reserved for future use) |

## API Reference

### `reporter.configure(options)`

Configure reporter for current command context.

```javascript
reporter.configure({ quiet: true, json: false })
```

### `reporter.start(text, options)`

Start a new spinner.

| Parameter | Type | Description |
|-----------|------|-------------|
| `text` | `string` | Spinner text |
| `options.showElapsed` | `boolean` | Show elapsed time (default: `false`) |

### `reporter.update(text)`

Update spinner text while running.

### `reporter.succeed(text)`

Mark operation as successful. Uses current text if `text` not provided.

### `reporter.fail(text)`

Mark operation as failed.

### `reporter.warn(text)`

Mark operation with a warning.

### `reporter.info(text)`

Display an info message.

### `reporter.stop()`

Stop spinner without status indicator.

### `reporter.isSpinning()`

Returns `true` if a spinner is currently running.

### `reporter.getElapsed()`

Returns elapsed time in milliseconds since `start()`, or `null` if not started.

### `reporter.reset()`

Reset all reporter state. Useful in tests.

## Testing

### Mocking in Tests

```javascript
import esmock from 'esmock'
import sinon from 'sinon'

const mockReporter = {
  start: sinon.stub().returnsThis(),
  update: sinon.stub().returnsThis(),
  succeed: sinon.stub().returnsThis(),
  fail: sinon.stub().returnsThis(),
  configure: sinon.stub().returnsThis(),
}

const MyCommand = await esmock('./mycommand.js', {
  '#lib/reporter/index.js': { default: mockReporter }
})
```

### Verifying Calls

```javascript
test('shows progress during build', async (t) => {
  await command.action(options)

  t.true(mockReporter.start.calledWith('Building...'))
  t.true(mockReporter.succeed.calledWith('Build complete'))
})
```

## Design Decisions

### Why ora?

| Factor | ora | Alternatives |
|--------|-----|--------------|
| Already installed | Yes | Would add dependency |
| Weekly downloads | 46.8M | cli-progress: 5.3M |
| Bundle size | 30.4 kB | cli-progress: 62.2 kB |
| Maintenance | Active | progress: 7 years dormant |
| Complexity | Simple | listr2: over-engineered |

### Singleton Pattern

Follows the established pattern from `lib/logger`, `lib/git`, and `lib/npm`:

```javascript
// Singleton export
export default new Reporter()

// Class export for testing
export { Reporter }
```

### Automatic TTY Detection

Spinners are automatically suppressed when:

1. `--quiet` flag is set
2. `--json` flag is set
3. `process.stdout.isTTY` is `false` (CI environments, piped output)

## Related

- [lib/logger](../logger/) - Logging abstraction (different concern)
