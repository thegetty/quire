# CLI Error Handling Architecture

This document describes the centralized error handling system for the Quire CLI.

## Overview

The CLI uses a structured error handling approach that provides:

- **Testability**: No `process.exit()` in library modules
- **Consistency**: All errors flow through a centralized handler
- **User Experience**: Helpful error messages with suggestions and documentation links
- **Meaningful Exit Codes**: Categorized by user workflow stage

## Architecture

```
Command Action
     │
     ▼
  try/catch wrapper (main.js)
     │
     ▼ (on error)
  handleError()
     │
     ├─► QuireError: Format and display with code, suggestion, docs link
     │
     └─► Other Error: Display as unexpected, prompt to report issue
     │
     ▼
  process.exit(exitCode)
```

## Error Classes

### Base Class

All custom errors extend `QuireError`:

```javascript
import QuireError from '#src/errors/quire-error.js'

class MyError extends QuireError {
  constructor(details) {
    super(`Error message: ${details}`, {
      code: 'MY_ERROR_CODE',        // Searchable error code
      exitCode: 1,                   // Process exit code
      suggestion: 'How to fix it',   // Actionable advice
      docsUrl: 'https://...',        // Documentation link
      filePath: '/path/to/file'      // Related file (optional)
    })
  }
}
```

### Error Hierarchy

```
src/errors/
├── quire-error.js              # Base class
├── index.js                    # Barrel exports
├── project/                    # Exit code: 2
│   ├── not-in-project-error.js
│   └── project-create-error.js
├── build/                      # Exit code: 3
│   ├── build-failed-error.js
│   ├── config-file-not-found-error.js
│   └── config-field-missing-error.js
├── validation/                 # Exit code: 4
│   ├── validation-error.js
│   ├── yaml-validation-error.js
│   ├── yaml-parse-error.js
│   └── yaml-duplicate-id-error.js
├── output/                     # Exit code: 5
│   ├── epub-generation-error.js
│   ├── invalid-epub-library-error.js
│   ├── invalid-pdf-library-error.js
│   ├── missing-build-output-error.js
│   ├── pdf-generation-error.js
│   └── tool-not-found-error.js
└── install/                    # Exit code: 6
    ├── dependency-install-error.js
    └── version-not-found-error.js
```

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

### Standard Error

```
[quire] ERROR  BUILD_OUTPUT_MISSING Cannot generate PDF: build output not found
  File: /project/_site/pdf.html
  Suggestion: Run 'quire build' first, then try again
  Learn more: https://quire.getty.edu/docs-v1/quire-commands/
```

### Multiple Errors (Validation)

```
[quire] ERROR  Invalid YAML: missing required field
[quire] ERROR  Duplicate ID 'fig-1' found
[quire] ERROR  VALIDATION_FAILED Validation failed with 2 error(s)
  Suggestion: Fix the errors listed above and run validation again
  Learn more: https://quire.getty.edu/docs-v1/troubleshooting/
```

### Unexpected Error (with --debug)

```
[quire] ERROR  Unexpected error: Cannot read property 'map' of undefined
[quire] INFO   Please report this issue: https://github.com/thegetty/quire/issues
[quire] DEBUG  Stack trace:
[quire] DEBUG  TypeError: Cannot read property 'map' of undefined
                   at processData (/packages/cli/src/lib/pdf/index.js:42:15)
```

## Adding New Errors

1. Create error class in appropriate domain folder:

```javascript
// src/errors/output/my-new-error.js
import QuireError from '../quire-error.js'

export default class MyNewError extends QuireError {
  constructor(details) {
    super(`Description: ${details}`, {
      code: 'MY_NEW_ERROR',
      exitCode: 5,  // Use domain's exit code
      suggestion: 'How to fix this',
      docsUrl: `${QuireError.DOCS_BASE}/relevant-page/`
    })
  }
}
```

2. Export from domain index:

```javascript
// src/errors/output/index.js
export { default as MyNewError } from './my-new-error.js'
```

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
