# Error Handler

Centralized error handling for the Quire CLI. All command errors flow through this handler for consistent formatting and exit code management.

## Usage

```javascript
import { handleError, handleErrors, formatError } from '#lib/error/handler.js'

try {
  await someOperation()
} catch (error) {
  handleError(error, { debug: options.debug })
}
```

## API

### `formatError(error, options)`

Formats a QuireError for user display.

**Parameters:**
- `error` - The error to format (QuireError or Error)
- `options.debug` - Include error code in output (default: `false`)

**Returns:** Formatted string with error message and metadata.

**Output format:**
```
[ERROR_CODE] Message                    # Code shown only in debug mode
  File: /path/to/file                   # If error.filePath is set
  Suggestion: Actionable fix            # If error.suggestion is set
  Learn more: https://docs.url          # If error.docsUrl is set
  Tip: Run with --debug for more details  # If not in debug mode and showDebugHint !== false
```

### `handleError(error, options)`

Handles a single error: formats it, logs it, and exits.

**Parameters:**
- `error` - The error to handle
- `options.exit` - Whether to exit process (default: `true`)
- `options.exitFn` - Exit function for testing (default: `process.exit`)
- `options.debug` - Show stack traces (default: `false`)

**Returns:** Exit code (number)

**Behavior:**
- QuireError: Uses structured properties (code, exitCode, suggestion, docsUrl)
- Other errors: Shows as "Unexpected error" with issue report link

### `handleErrors(errors, options)`

Handles multiple errors (for batch validation scenarios).

**Parameters:** Same as `handleError`, but takes array of errors.

**Returns:** Highest exit code from all errors.

## Debug Mode

When `--debug` is enabled:
- Error codes are shown in the header (e.g., `[TOOL_NOT_FOUND]`)
- Stack traces are printed after the error message
- The "Tip: Run with --debug" hint is suppressed

## Debug Hint Control

By default, errors display a tip suggesting the user run with `--debug` for more details. This can be disabled for errors where the fix is obvious and debug info wouldn't help.

### Disabling the hint

Set `showDebugHint: false` in the error options:

```javascript
class NotInProjectError extends QuireError {
  constructor(commandName) {
    super(`Must run inside a Quire project`, {
      code: 'NOT_IN_PROJECT',
      suggestion: "Navigate to your project folder with 'cd your-project-name'",
      showDebugHint: false  // Fix is obvious, debug won't help
    })
  }
}
```

### When to disable

Disable the hint for "simple user errors" where:
- The fix is immediately obvious from the message
- Debug output wouldn't provide additional useful information
- The user just needs to take a simple corrective action

**Examples of errors with hint disabled:**
- `NotInProjectError` - just cd to project folder
- `DirectoryNotEmptyError` - choose empty directory
- `InvalidPathError` - verify path exists
- `MissingBuildOutputError` - run `quire build` first
- `InvalidPdfLibraryError` - use valid library name
- `InvalidEpubLibraryError` - use valid library name

### When to keep the hint

Keep the hint (default) for errors where:
- The issue may be complex or environmental
- Stack traces or debug logging would help diagnosis
- The user may need to report a bug

**Examples of errors with hint enabled (default):**
- `BuildFailedError` - complex build issues
- `PdfGenerationError` - tool/process issues
- `EpubGenerationError` - tool/process issues
- `ToolNotFoundError` - PATH/environment issues
- `DependencyInstallError` - npm issues
- Configuration and YAML validation errors

## QuireError Properties

The handler understands these QuireError properties:

| Property | Type | Description |
|----------|------|-------------|
| `message` | string | Main error message |
| `code` | string | Error code (e.g., `'TOOL_NOT_FOUND'`) |
| `exitCode` | number | Process exit code (default: 1) |
| `suggestion` | string | Actionable fix for the user |
| `docsUrl` | string | Link to relevant documentation |
| `filePath` | string | Source file that caused the error |
| `showDebugHint` | boolean | Whether to show --debug hint (default: true) |

## Exit Codes

| Code | Category | Examples |
|------|----------|----------|
| 1 | General error | Unexpected errors |
| 2 | Project error | Not in project, directory not empty |
| 3 | Build error | Config not found, build failed |
| 4 | Validation error | YAML parse error, validation failed |
| 5 | Output error | PDF/EPUB generation failed |
| 6 | Install error | Invalid path, dependency install failed |

## Testing

Use the `exit` and `exitFn` options to prevent actual process exit:

```javascript
import { handleError } from '#lib/error/handler.js'

const exitCode = handleError(error, {
  exit: false,  // Don't call process.exit
  debug: true
})

t.is(exitCode, 5)
```

Or provide a mock exit function:

```javascript
const mockExit = sinon.stub()

handleError(error, {
  exitFn: mockExit,
  debug: false
})

t.true(mockExit.calledWith(5))
```
