# Doctor Module

Diagnostic checks for Quire environment and project health.

## Architecture

```
┌───────────────────────────────────────────────────────────────────────┐
│                         doctor/                                       │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │                        index.js                                 │  │
│  │  • checkNodeVersion()     • checkQuireProject()                 │  │
│  │  • checkNpmAvailable()    • checkDependencies()                 │  │
│  │  • checkGitAvailable()    • checkOutdatedQuire11ty()            │  │
│  │  • checkStaleBuild()      • checkDataFiles()                    │  │
│  │  • runAllChecks()         • runAllChecksWithSections()          │  │
│  └──────────────────────────────┬──────────────────────────────────┘  │
│                                 │                                     │
│  ┌──────────────────────────────┴──────────────────────────────────┐  │
│  │                        formatDuration.js                        │  │
│  │  • TIME_UNITS              • formatDuration(ms)                 │  │
│  └─────────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
          ┌─────────▼─────────┐       ┌─────────▼─────────┐
          │     project/      │       │    validators/    │
          │                   │       │                   │
          │ • DATA_DIR        │       │ validate-data-    │
          │ • PROJECT_MARKERS │       │ files.js          │
          │ • REQUIRED_FILES  │       │                   │
          │ • SOURCE_DIRS     │       │ • validateYaml-   │
          └───────────────────┘       │   File()          │
                                      │ • validateData-   │
                                      │   Files()         │
                                      └───────────────────┘
```

## Dependencies

| Module | Purpose |
|--------|---------|
| `#lib/project/` | Project constants (`DATA_DIR`, `PROJECT_MARKERS`, etc.) |
| `#lib/git/` | Git availability check |
| `#lib/npm/` | npm availability and registry queries |
| `#lib/conf/config.js` | Configuration (updateChannel for version check) |
| `#src/validators/validate-data-files.js` | YAML validation logic |
| `semver` | Semantic version comparison |
| `./formatDuration.js` | Human-readable time formatting |

## Check Result Type

All check functions return a `CheckResult` object:

```javascript
/**
 * @typedef {Object} CheckResult
 * @property {boolean} ok - Whether the check passed
 * @property {'error'|'warn'} [level] - Severity level (default: 'error')
 * @property {string|null} message - Optional message with details
 * @property {string|null} [remediation] - Steps to fix the issue
 * @property {string|null} [docsUrl] - Link to relevant documentation
 */
```

### Examples

**Passing check:**
```javascript
{
  ok: true,
  message: 'v22.0.0 (>= 22 required)'
}
```

**Failing check (error):**
```javascript
{
  ok: false,
  message: 'npm not found in PATH',
  remediation: 'npm is included with Node.js...',
  docsUrl: 'https://quire.getty.edu/docs-v1/install-uninstall/'
}
```

**Failing check (warning):**
```javascript
{
  ok: false,
  level: 'warn',
  message: 'Build output is 2 weeks older than source files',
  remediation: 'Run "quire build" to regenerate...',
  docsUrl: 'https://quire.getty.edu/docs-v1/quire-commands/'
}
```

## Available Checks

### Environment Section

| Check | Function | Description |
|-------|----------|-------------|
| Node.js version | `checkNodeVersion()` | Verifies Node.js >= 22 |
| npm available | `checkNpmAvailable()` | Verifies npm in PATH |
| Git available | `checkGitAvailable()` | Verifies git in PATH |

### Project Section

| Check | Function | Description |
|-------|----------|-------------|
| Quire project | `checkQuireProject()` | Detects project marker files |
| Dependencies | `checkDependencies()` | Verifies node_modules exists |
| quire-11ty version | `checkOutdatedQuire11ty()` | Checks for newer quire-11ty versions |
| Data files | `checkDataFiles()` | Validates YAML files in content/_data/ |
| Build status | `checkStaleBuild()` | Compares source vs build timestamps |

## Check Behaviors

### checkNodeVersion

| Scenario | Result |
|----------|--------|
| Node.js >= 22 | `ok: true` - "v22.0.0 (>= 22 required)" |
| Node.js < 22 | `ok: false` - with installation instructions |

### checkNpmAvailable

| Scenario | Result |
|----------|--------|
| npm in PATH | `ok: true` - no message |
| npm not found | `ok: false` - "npm not found in PATH" |

### checkGitAvailable

| Scenario | Result |
|----------|--------|
| git in PATH | `ok: true` - no message |
| git not found | `ok: false` - "Git not found in PATH" |

### checkQuireProject

| Scenario | Result |
|----------|--------|
| Marker file found | `ok: true` - "Detected via .quire" |
| No marker files | `ok: false` - "No Quire project marker found" |

### checkDependencies

| Scenario | Result |
|----------|--------|
| No package.json | `ok: true` - "No package.json (not in project directory)" |
| Has node_modules | `ok: true` - no message |
| Missing node_modules | `ok: false` - "node_modules not found" |

### checkOutdatedQuire11ty

| Scenario | Result |
|----------|--------|
| Not in project | `ok: true` - "quire-11ty not installed (not in project)" |
| Up to date | `ok: true` - "v1.0.0-rc.33 (up to date)" |
| Outdated | `ok: false, level: warn` - "v1.0.0-rc.30 installed, v1.0.0-rc.33 available" |
| Can't read version | `ok: false, level: warn` - "Could not read installed quire-11ty version" |
| Network error | `ok: true` - "v1.0.0-rc.30 (could not check for updates)" |

### checkDataFiles

| Scenario | Result |
|----------|--------|
| Not in project | `ok: true` - "No content/_data directory (not in project)" |
| All files valid | `ok: true` - "3 files validated" |
| Missing required file | `ok: false, level: warn` - "1 issue in data files" |
| YAML syntax error | `ok: false, level: warn` - with error details |
| Duplicate IDs | `ok: false, level: warn` - with duplicate ID list |

### checkStaleBuild

| Scenario | Result |
|----------|--------|
| No _site directory | `ok: true` - "No build output yet (run quire build)" |
| Build up to date | `ok: true` - "Build output is up to date" |
| Build is stale | `ok: false, level: warn` - "Build output is 2 weeks older than source files" |

## Exports

```javascript
// Individual check functions
export { checkNodeVersion }
export { checkNpmAvailable }
export { checkGitAvailable }
export { checkQuireProject }
export { checkDependencies }
export { checkOutdatedQuire11ty }
export { checkDataFiles }
export { checkStaleBuild }

// Check collections
export { checks }         // Flat array of all checks
export { checkSections }  // Checks organized by section

// Runners
export { runAllChecks }              // Run all, return flat results
export { runAllChecksWithSections }  // Run all, return by section
```

## Adding a New Check

### 1. Create the check function

```javascript
/**
 * Check description here
 * @returns {CheckResult}
 */
export function checkSomething() {
  // Perform check logic
  const ok = /* condition */

  if (ok) {
    return {
      ok: true,
      message: 'Success message or null',
    }
  }

  return {
    ok: false,
    level: 'warn', // Optional: 'warn' for non-blocking issues
    message: 'What went wrong',
    remediation: `How to fix:\n    • Step 1\n    • Step 2`,
    docsUrl: `${DOCS_BASE_URL}/relevant-page/`,
  }
}
```

### 2. Add to check arrays

```javascript
// In checkSections (organized by section)
export const checkSections = [
  {
    name: 'Project',
    checks: [
      // ... existing checks
      { name: 'Something', check: checkSomething },
    ],
  },
]

// In checks (flat list)
export const checks = [
  // ... existing checks
  { name: 'Something', check: checkSomething },
]
```

### 3. Add to default export

```javascript
export default {
  // ... existing exports
  checkSomething,
}
```

### 4. Write tests

```javascript
test('checkSomething returns ok when condition met', async (t) => {
  const { checkSomething } = await esmock('./index.js', {
    // Mock dependencies
  })

  const result = checkSomething()

  t.true(result.ok)
})

test('checkSomething returns not ok when condition fails', async (t) => {
  const { checkSomething } = await esmock('./index.js', {
    // Mock dependencies for failure case
  })

  const result = checkSomething()

  t.false(result.ok)
  t.truthy(result.remediation)
  t.truthy(result.docsUrl)
})
```

## Design Principles

### Separation of Concerns

- **Constants** (paths, markers, required files) live in `project/`
- **Validation logic** (YAML parsing, schema validation) lives in `validators/`
- **Diagnostic checks** (returning CheckResult) live in `doctor/`

### Check Independence

Each check should be independent and not depend on the results of other checks. The runner executes all checks regardless of previous failures.

### Graceful Degradation

Checks should handle missing directories/files gracefully:

```javascript
// Skip check if not in a project
if (!fs.existsSync(DATA_DIR)) {
  return {
    ok: true,
    message: 'No content/_data directory (not in project)',
  }
}
```

### Actionable Remediation

Every failing check should include:
1. **Clear message** - What's wrong
2. **Remediation steps** - How to fix it
3. **Documentation link** - Where to learn more

## Testing

Tests use AVA with esmock for ESM module mocking.

### Running Tests

```bash
# Doctor module tests
npx ava src/lib/doctor/index.test.js

# Duration formatting tests
npx ava src/lib/doctor/formatDuration.test.js

# Related validator tests
npx ava src/validators/validate-data-files.test.js
```

### Test Patterns

**Mocking the validator:**
```javascript
const { checkDataFiles } = await esmock('./index.js', {
  '#src/validators/validate-data-files.js': {
    validateDataFiles: sandbox.stub().returns({
      valid: true,
      errors: [],
      fileCount: 1,
      files: [],
    }),
  },
})
```

**Mocking filesystem:**
```javascript
const { checkStaleBuild } = await esmock('./index.js', {
  'node:fs': {
    default: {
      existsSync: sandbox.stub().returns(true),
      statSync: sandbox.stub().returns({ mtimeMs: Date.now() }),
      readdirSync: sandbox.stub().returns([]),
    },
  },
})
```

## Files

| File | Description |
|------|-------------|
| `index.js` | Main module with all check functions |
| `index.test.js` | Tests for check functions (31 tests) |
| `formatDuration.js` | Time duration formatting utility |
| `formatDuration.test.js` | Tests for duration formatting (10 tests) |
