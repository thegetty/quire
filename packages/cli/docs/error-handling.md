# CLI Error Handling Architecture

This document describes the centralized error handling system for the Quire CLI.

## Overview

The CLI uses a structured error handling approach that provides:

- **Testability**: No `process.exit()` in library modules
- **Consistency**: All errors flow through a centralized handler
- **User Experience**: Helpful error messages with suggestions and documentation links
- **Meaningful Exit Codes**: Categorized by user workflow stage

## Architecture

Commands and library modules **throw errors** rather than calling `process.exit()` directly. This keeps modules testable and routes all exits through a centralized handler:

```
Command Action ─► throws QuireError or Error
     │
     ▼
  try/catch wrapper (main.js)
     │
     ▼ (on error)
  handleError()
     │
     ├─► QuireError ──► Format with code, suggestion, docs link ──► exit(exitCode)
     │
     └─► Other Error ─► Display as unexpected, prompt to report ─► exit(1)
```

Signal-based exits (Ctrl-C, SIGTERM) are handled separately by the process manager module using POSIX conventions (SIGINT → 130, SIGTERM → 143).

Standard POSIX values (`ENOENT=2`, `EIO=5`) are designed for system-level errors. Using these codes for Quire would lose semantic precision; code 2 does not disambiguate between running `quire` commands outside a project, missing a config file, or missing build output. Instead, exit codes are aligned with user workflow stages (see [Exit Codes](#exit-codes)).

## Error Classes

### Base Class

All custom errors extend `QuireError`:

```javascript
import QuireError from '#src/errors/quire-error.js'

class MyError extends QuireError {
  constructor(details, originalError) {
    super(`Error message: ${details}`, {
      code: 'MY_ERROR_CODE',        // Searchable error code
      exitCode: 1,                   // Process exit code
      suggestion: 'How to fix it',   // Actionable advice
      docsUrl: 'https://...',        // Documentation link
      filePath: '/path/to/file',     // Related file (optional)
      showDebugHint: true            // Show --debug tip (default: true)
    })
    // Optionally preserve the original error for debugging
    this.cause = originalError
  }
}
```

### Error Hierarchy

Exported errors (available via `#src/errors/index.js`):

```
src/errors/
├── quire-error.js              # Base class
├── index.js                    # Barrel exports
├── project/                    # Exit code: 2
│   ├── index.js
│   ├── not-in-project-error.js
│   └── project-create-error.js
├── build/                      # Exit code: 3
│   ├── index.js
│   ├── build-failed-error.js
│   ├── config-file-not-found-error.js
│   └── config-field-missing-error.js
├── validation/                 # Exit code: 4
│   └── validation-error.js     # Exported directly (no index.js)
├── output/                     # Exit code: 5
│   ├── index.js
│   ├── epub-generation-error.js
│   ├── invalid-epub-library-error.js
│   ├── invalid-pdf-library-error.js
│   ├── missing-build-output-error.js
│   ├── pdf-generation-error.js
│   └── tool-not-found-error.js
└── install/                    # Exit code: 6
    ├── index.js
    ├── dependency-install-error.js
    ├── directory-not-empty-error.js
    ├── invalid-path-error.js
    ├── invalid-starter-error.js
    └── version-not-found-error.js
```

> **Note**: The validation folder also contains `yaml-parse-error.js`, `yaml-validation-error.js`, and `yaml-duplicate-error.js` for internal use by the YAML validator, but these are not exported through the barrel.

## Exit Codes

Exit codes are organized by user workflow stage:

| Code | Category | Commands | Examples |
|------|----------|----------|----------|
| 0 | Success | Any | Command completed |
| 1 | General | Any | Unexpected/unhandled error |
| 2 | Project | `new`, any | Not in project, create failed |
| 3 | Build | `build`, `preview` | Build failed, config missing |
| 4 | Validation | `validate` | YAML errors, schema violations |
| 5 | Output | `pdf`, `epub` | PDF/EPUB generation failed |
| 6 | Install | `new`, `version` | npm install failed, version not found |

## Error Handler

Located at `src/lib/error/handler.js`:

```javascript
import { handleError, handleErrors } from '#lib/error/handler.js'

// Single error
handleError(error, {
  exit: true,           // Whether to exit process (default: true)
  exitFn: process.exit, // Exit function (inject for testing)
  debug: false          // Show stack traces (default: false)
})

// Multiple errors (batch validation)
handleErrors(errors, options)
```

## Usage Patterns

### In Library Modules

Library modules throw errors instead of calling `process.exit()`:

```javascript
// Before (untestable)
if (!fs.existsSync(configPath)) {
  logger.error('Config not found')
  process.exit(1)
}

// After (testable)
import { ConfigFileNotFoundError } from '#src/errors/index.js'

if (!fs.existsSync(configPath)) {
  throw new ConfigFileNotFoundError(configPath)
}
```

### In Commands

Commands let errors propagate to the centralized handler:

```javascript
// The try/catch wrapper in main.js handles this automatically
async action(options) {
  const config = await loadProjectConfig()  // May throw ConfigFileNotFoundError
  await generatePdf(config)                  // May throw PdfGenerationError
}
```

### Testing

With `process.exit()` removed, testing is straightforward:

```javascript
import { ConfigFileNotFoundError } from '#src/errors/index.js'

test('throws when config missing', async (t) => {
  await t.throwsAsync(
    () => loadProjectConfig('/nonexistent'),
    { instanceOf: ConfigFileNotFoundError }
  )
})
```

Testing the error handler with injected exit function:

```javascript
test('handleError calls exit with correct code', (t) => {
  const mockExit = sinon.stub()
  const error = new NotInProjectError('build')

  handleError(error, { exitFn: mockExit })

  t.true(mockExit.calledWith(2))
})
```

## Error Output Format

Error codes (e.g., `BUILD_OUTPUT_MISSING`) are only displayed when the `--debug` flag is used. This keeps normal error output focused on the actionable message while providing technical details for troubleshooting.

### Standard Error

```
[quire] ERROR  Cannot generate PDF: build output not found
  File: /project/_site/pdf.html
  Suggestion: Run 'quire build' first, then try again
  Learn more: https://quire.getty.edu/docs-v1/quire-commands/
  Tip: Run with --debug for more details
```

The `--debug` tip is shown by default for errors where additional debug information would be helpful. Some errors suppress this hint when the fix is obvious (see [Debug Hint Control](#debug-hint-control)).

### Standard Error (with --debug)

```
[quire] ERROR  BUILD_OUTPUT_MISSING Cannot generate PDF: build output not found
  File: /project/_site/pdf.html
  Suggestion: Run 'quire build' first, then try again
  Learn more: https://quire.getty.edu/docs-v1/quire-commands/
[quire] DEBUG  Stack trace:
[quire] DEBUG  MissingBuildOutputError: Cannot generate PDF: build output not found
                   at generatePdf (/packages/cli/src/lib/pdf/index.js:42:15)
```

### Multiple Errors (Validation)

```
[quire] ERROR  Invalid YAML: missing required field
[quire] ERROR  Duplicate ID 'fig-1' found
[quire] ERROR  Validation failed with 2 error(s)
  Suggestion: Fix the errors listed above and run validation again
  Learn more: https://quire.getty.edu/docs-v1/troubleshooting/
```

### Unexpected Error

```
[quire] ERROR  Unexpected error: Cannot read property 'map' of undefined
[quire] INFO   Please report this issue: https://github.com/thegetty/quire/issues
```

## Debug Hint Control

By default, errors display a tip suggesting the user run with `--debug` for more details. This helps users discover that additional diagnostic information is available.

### Disabling the Hint

Set `showDebugHint: false` for errors where the fix is obvious and debug output wouldn't help:

```javascript
class NotInProjectError extends QuireError {
  constructor(commandName) {
    super(`Must run inside a Quire project`, {
      code: 'NOT_IN_PROJECT',
      exitCode: 2,
      suggestion: "Navigate to your project folder with 'cd your-project-name'",
      showDebugHint: false  // Fix is obvious, debug won't help
    })
  }
}
```

### When to Disable

Disable the hint for "simple user errors" where:

- The fix is immediately obvious from the message
- Debug output wouldn't provide additional useful information
- The user just needs to take a simple corrective action

**Errors with hint disabled:**

| Error | Reason |
|-------|--------|
| `NotInProjectError` | Just cd to project folder |
| `DirectoryNotEmptyError` | Choose empty directory |
| `InvalidPathError` | Verify path exists |
| `MissingBuildOutputError` | Run `quire build` first |
| `InvalidPdfLibraryError` | Use valid library name |
| `InvalidEpubLibraryError` | Use valid library name |

### When to Keep the Hint

Keep the hint enabled (default) for errors where:

- The issue may be complex or environmental
- Stack traces or debug logging would help diagnosis
- The user may need to report a bug

**Errors with hint enabled (default):**

| Error | Reason |
|-------|--------|
| `BuildFailedError` | Complex build issues need investigation |
| `PdfGenerationError` | Tool/process issues |
| `EpubGenerationError` | Tool/process issues |
| `ToolNotFoundError` | PATH/environment issues |
| `DependencyInstallError` | npm issues need detailed output |
| Config/YAML validation errors | Parsing details help |

## Adding New Errors

1. Create error class in appropriate domain folder:

```javascript
// src/errors/output/my-new-error.js
import QuireError from '../quire-error.js'
import { docsUrl } from '#helpers/docs-url.js'

export default class MyNewError extends QuireError {
  constructor(details) {
    super(`Description: ${details}`, {
      code: 'MY_NEW_ERROR',
      exitCode: 5,  // Use domain's exit code
      suggestion: 'How to fix this',
      docsUrl: docsUrl('relevant-page'),
      // Optional: disable --debug hint for simple user errors
      // showDebugHint: false
    })
  }
}
```

2. Export from domain index (if one exists):

```javascript
// src/errors/output/index.js
export { default as MyNewError } from './my-new-error.js'
```

> **Note**: The validation folder exports directly from the main index.js without a domain index.js file.

3. Export from main index:

```javascript
// src/errors/index.js
export {
  // ... existing exports
  MyNewError
} from './output/index.js'
```

4. Use in code:

```javascript
import { MyNewError } from '#src/errors/index.js'

if (condition) {
  throw new MyNewError('specific details')
}
```

## Constructor Signature Design

Error classes use **domain-specific constructor signatures** rather than a unified options-based pattern. This is an intentional architectural decision.

> Error classes should encapsulate their domain knowledge—the error class knows what message to show, what exit code to use, and what docs to link. The caller only needs to provide the domain-specific context.

### Design Rationale

Each error class accepts parameters that are semantically meaningful for that error type:

```javascript
// Domain-specific: parameters match the error's semantics
throw new InvalidPathError(quirePath, resolvedPath)
throw new ToolNotFoundError('prince', 'https://princexml.com')
throw new ConfigFieldMissingError('title', 'publication.yaml')

// NOT: generic options object
throw new InvalidPathError({ originalPath: quirePath, resolvedPath })
```

**Advantages of domain-specific signatures:**

1. **Self-documenting call sites**: The parameters communicate intent without needing to read the error class
2. **Type safety**: Each parameter has a defined purpose; harder to pass wrong data
3. **Encapsulated defaults**: The error class owns its message template, exit code, and docs URL
4. **Simpler call sites**: No need to construct an options object for common cases

**When to add optional overrides:**

Some errors accept an optional `options` parameter for rare cases where defaults should be overridden:

```javascript
// VersionNotFoundError allows custom suggestion
constructor(packageName, reason, options = {}) {
  const defaultSuggestion = isLocalPath
    ? 'Ensure the local package has a valid package.json'
    : `Run 'npm view ${packageName} versions'`

  super(message, {
    suggestion: options.suggestion || defaultSuggestion,
    // ...
  })
}
```

### Guidelines for New Error Classes

1. **Use semantic parameters**: Name parameters after what they represent, not how they're used
2. **Compute messages internally**: The error class should format the user-facing message
3. **Set sensible defaults**: Exit code, docs URL, and suggestion should rarely need overriding
4. **Add optional overrides sparingly**: Only when there's a real use case for customization

## Error Code Naming Convention

Error codes follow the pattern `RESOURCE_STATE` or `ACTION_FAILED`:

- `CONFIG_FILE_NOT_FOUND` - Resource not found
- `BUILD_OUTPUT_MISSING` - Required output missing
- `PDF_GENERATION_FAILED` - Action failed
- `INVALID_PDF_LIBRARY` - Invalid configuration
- `VERSION_NOT_FOUND` - Resource not found
- `VALIDATION_FAILED` - Action failed

Codes are:
- **SCREAMING_SNAKE_CASE** for consistency
- **Searchable** - users can Google "quire BUILD_OUTPUT_MISSING"
- **Unique** - no two errors share the same code

## Scope

This error handling covers CLI-level errors only. The following are **out of scope**:

- 11ty package plugin errors (handled internally)
- Eleventy build errors (propagated from Eleventy)
- Template rendering errors (handled by Nunjucks/Eleventy)
