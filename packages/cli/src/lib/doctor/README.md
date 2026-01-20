# Doctor Module

Diagnostic checks for Quire environment and project health.

## Command Usage

```bash
quire doctor                          # Run all diagnostic checks
quire doctor --check environment      # Check environment section only
quire doctor --check node,npm         # Check specific items
quire doctor --verbose                # Show additional details
quire doctor --errors                 # Show only failed checks
quire doctor --warnings               # Show only warnings
quire doctor --json                   # Output as JSON to stdout
quire doctor --json report.json       # Save JSON to file
```

### CI/Scripting

The `--quiet` flag suppresses all console output, useful for CI pipelines and scripts.

**Exit code only** (gate a CI step on environment health):
```bash
quire doctor --check environment --quiet || exit 1
```

**Save JSON report silently** (for CI artifacts):
```bash
quire doctor --quiet --json reports/doctor.json
```

**Exit codes:**
- `0` - All checks passed (warnings don't affect exit code)
- `1` - One or more checks failed

### Output Formats

| Format | Flag | Use Case |
|--------|------|----------|
| Human | (default) | Interactive terminal use |
| JSON | `--json` | Programmatic consumption, CI artifacts |
| Quiet | `--quiet` | Exit code only, no output |

## Architecture

```
doctor/
├── index.js                  # Barrel export, runners, checkSections
├── index.test.js             # Integration tests for runners
├── constants.js              # Re-exports constants from #lib/constants.js
├── formatDuration.js         # Human-readable time formatting
├── formatDuration.test.js    # Duration formatting tests
├── README.md                 # This file
└── checks/                   # Domain-organized check modules
    ├── environment/          # System prerequisites
    │   ├── index.js          # Barrel export
    │   ├── os-info.js        # Operating system info
    │   ├── os-info.test.js
    │   ├── cli-version.js    # CLI version check
    │   ├── cli-version.test.js
    │   ├── node-version.js   # Node.js version check (OS-specific remediation)
    │   ├── node-version.test.js
    │   ├── npm-available.js  # npm availability check (OS-specific remediation)
    │   ├── npm-available.test.js
    │   ├── git-available.js  # Git availability check (OS-specific remediation)
    │   └── git-available.test.js
    ├── project/              # Project configuration
    │   ├── index.js          # Barrel export
    │   ├── quire-project.js  # Project detection check
    │   ├── quire-project.test.js
    │   ├── dependencies.js   # node_modules check
    │   ├── dependencies.test.js
    │   ├── quire-11ty.js     # Version check
    │   ├── quire-11ty.test.js
    │   ├── data-files.js     # YAML validation check
    │   └── data-files.test.js
    └── outputs/              # Build artifacts
        ├── index.js          # Barrel export
        ├── stale-build.js    # Stale build detection
        ├── stale-build.test.js
        ├── pdf-output.js     # PDF output check
        ├── pdf-output.test.js
        ├── epub-output.js    # EPUB output check
        └── epub-output.test.js
```

## Dependency Graph

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              doctor/index.js                                 │
│  Imports checks from domain submodules, defines checkSections, runners      │
└────────────────────────────────────┬────────────────────────────────────────┘
                                     │
         ┌───────────────────────────┼───────────────────────────┐
         │                           │                           │
         ▼                           ▼                           ▼
┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐
│ checks/environment/ │  │   checks/project/   │  │   checks/outputs/   │
│                     │  │                     │  │                     │
│ • checkOsInfo       │  │ • checkQuireProject │  │ • checkStaleBuild   │
│ • checkCliVersion   │  │ • checkDependencies │  │ • checkPdfOutput    │
│ • checkNodeVersion  │  │ • checkOutdated...  │  │ • checkEpubOutput   │
│ • checkNpmAvailable │  │ • checkDataFiles    │  │                     │
│ • checkGitAvailable │  │                     │  │                     │
└──────────┬──────────┘  └──────────┬──────────┘  └──────────┬──────────┘
           │                        │                        │
           ▼                        ▼                        ▼
    ┌──────────────┐     ┌───────────────────┐    ┌──────────────────┐
    │ constants.js │     │ validators/       │    │ #lib/project/    │
    │              │     │ validate-data-    │    │ SOURCE_DIRS      │
    │ DOCS_BASE_URL│     │ files.js          │    │                  │
    │ NODE_VERSION │     └───────────────────┘    └──────────────────┘
    │ QUIRE_11TY_  │
    │ PACKAGE      │
    └──────────────┘
```

## Dependencies

| Module | Purpose |
|--------|---------|
| `#lib/platform.js` | OS detection utilities (getPlatform, Platform enum) |
| `#lib/project/` | Project constants (`DATA_DIR`, `PROJECT_MARKERS`, `SOURCE_DIRECTORIES`) |
| `#lib/git/` | Git availability check |
| `#lib/npm/` | npm availability and registry queries |
| `#lib/conf/config.js` | Configuration (updateChannel for version check) |
| `#src/packageConfig.js` | CLI package.json for version info |
| `#src/validators/validate-data-files.js` | YAML validation logic |
| `update-notifier` | Cached CLI update check info |
| `semver` | Semantic version comparison |
| `./constants.js` | Re-exports from `#lib/constants.js` (DOCS_BASE_URL, REQUIRED_NODE_VERSION, QUIRE_11TY_PACKAGE) |
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

| Check | Function | Module | Description |
|-------|----------|--------|-------------|
| Operating system | `checkOsInfo()` | `checks/environment/os-info.js` | Reports OS name, version, and architecture |
| Quire CLI version | `checkCliVersion()` | `checks/environment/cli-version.js` | Reports CLI version and available updates |
| Node.js version | `checkNodeVersion()` | `checks/environment/node-version.js` | Verifies Node.js >= 22 (OS-specific remediation) |
| npm available | `checkNpmAvailable()` | `checks/environment/npm-available.js` | Verifies npm in PATH (OS-specific remediation) |
| Git available | `checkGitAvailable()` | `checks/environment/git-available.js` | Verifies git in PATH (OS-specific remediation) |

### Project Section

| Check | Function | Module | Description |
|-------|----------|--------|-------------|
| Quire project | `checkQuireProject()` | `checks/project/quire-project.js` | Detects project marker files |
| Dependencies | `checkDependencies()` | `checks/project/dependencies.js` | Verifies node_modules exists |
| quire-11ty version | `checkOutdatedQuire11ty()` | `checks/project/quire-11ty.js` | Checks for newer quire-11ty versions |
| Data files | `checkDataFiles()` | `checks/project/data-files.js` | Validates YAML files in content/_data/ |

### Outputs Section

| Check | Function | Module | Description |
|-------|----------|--------|-------------|
| Build status | `checkStaleBuild()` | `checks/outputs/stale-build.js` | Compares source vs build timestamps |
| PDF output | `checkPdfOutput()` | `checks/outputs/pdf-output.js` | Checks PDF freshness vs _site |
| EPUB output | `checkEpubOutput()` | `checks/outputs/epub-output.js` | Checks EPUB freshness vs _site |

## Check Behaviors

### checkOsInfo

| Scenario | Result |
|----------|--------|
| macOS | `ok: true` - "macOS 14 (arm64)" |
| Windows | `ok: true` - "Windows (10.0.22621) (x64) - Git for Windows recommended" |
| Linux | `ok: true` - "Linux (5.15.0) (x64)" |

### checkCliVersion

| Scenario | Result |
|----------|--------|
| Up to date | `ok: true` - "v1.0.0-rc.33 (up to date)" |
| Update available | `ok: false, level: warn` - "v1.0.0-rc.30 installed, v1.0.0-rc.33 available" |
| No cached update info | `ok: true` - "v1.0.0-rc.33" (no "up to date" suffix) |

### checkNodeVersion

| Scenario | Result |
|----------|--------|
| Node.js >= 22 | `ok: true` - "v22.0.0 (>= 22 required)" |
| Node.js < 22 | `ok: false` - with OS-specific installation instructions |

Remediation varies by platform:
- **macOS**: nvm, Homebrew, or nodejs.org
- **Windows**: nvm-windows, winget, or nodejs.org
- **Linux**: nvm, apt, or nodejs.org

### checkNpmAvailable

| Scenario | Result |
|----------|--------|
| npm in PATH | `ok: true` - no message |
| npm not found | `ok: false` - "npm not found in PATH" with OS-specific troubleshooting |

Remediation varies by platform:
- **macOS**: nvm use, brew reinstall
- **Windows**: Check PATH includes %APPDATA%\npm
- **Linux**: nvm use, check PATH

### checkGitAvailable

| Scenario | Result |
|----------|--------|
| git in PATH | `ok: true` - no message |
| git not found | `ok: false` - "Git not found in PATH" with OS-specific installation |

Remediation and docs URL vary by platform:
- **macOS**: xcode-select --install or Homebrew
- **Windows**: git-scm.com/download/win or winget
- **Linux**: apt, dnf, or pacman

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

### checkPdfOutput

| Scenario | Result |
|----------|--------|
| No PDF files exist | `ok: true` - "No PDF output (run quire pdf to generate)" |
| PDF exists, no _site | `ok: true` - "pagedjs.pdf exists (no _site to compare)" |
| PDF up to date | `ok: true` - "pagedjs.pdf up to date" |
| PDF is stale | `ok: false, level: warn` - "pagedjs.pdf is 1 hour older than _site" |

### checkEpubOutput

| Scenario | Result |
|----------|--------|
| No _epub directory | `ok: true` - "No EPUB output (run quire epub to generate)" |
| _epub exists, no _site | `ok: true` - "_epub exists (no _site to compare)" |
| _epub up to date | `ok: true` - "_epub up to date" |
| _epub is stale | `ok: false, level: warn` - "_epub is 1 hour older than _site" |

## Exports

```javascript
// Individual check functions (re-exported from domain modules)
export { checkOsInfo }
export { checkCliVersion }
export { checkNodeVersion }
export { checkNpmAvailable }
export { checkGitAvailable }
export { checkQuireProject }
export { checkDependencies }
export { checkOutdatedQuire11ty }
export { checkDataFiles }
export { checkStaleBuild }
export { checkPdfOutput }
export { checkEpubOutput }

// Constants
export { DOCS_BASE_URL, REQUIRED_NODE_VERSION, QUIRE_11TY_PACKAGE }

// Check collections
export { checks }         // Flat array of all checks (12 checks)
export { checkSections }  // Checks organized by section (3 sections)

// Runners
export { runAllChecks }              // Run all, return flat results
export { runAllChecksWithSections }  // Run all, return by section
```

## Adding a New Check

### 1. Determine the domain

- **environment/**: System prerequisites (OS info, CLI version, Node.js, npm, Git)
- **project/**: Project configuration and dependencies
- **outputs/**: Build artifacts and generated files

### 2. Create the check file

```javascript
// checks/project/my-check.js
import { DOCS_BASE_URL } from '../../constants.js'
import createDebug from '#debug'

const debug = createDebug('lib:doctor:my-check')

/**
 * Check description here
 * @returns {import('../../index.js').CheckResult}
 */
export function checkMyThing() {
  debug('Running my check')

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

export default checkMyThing
```

### 3. Create the test file

```javascript
// checks/project/my-check.test.js
import test from 'ava'
import sinon from 'sinon'
import esmock from 'esmock'

test.beforeEach((t) => {
  t.context.sandbox = sinon.createSandbox()
})

test.afterEach.always((t) => {
  t.context.sandbox.restore()
})

test('checkMyThing returns ok when condition met', async (t) => {
  const { checkMyThing } = await esmock('./my-check.js', {
    // Mock dependencies
  })

  const result = checkMyThing()

  t.true(result.ok)
})

test('checkMyThing returns not ok when condition fails', async (t) => {
  const { checkMyThing } = await esmock('./my-check.js', {
    // Mock dependencies for failure case
  })

  const result = checkMyThing()

  t.false(result.ok)
  t.truthy(result.remediation)
  t.truthy(result.docsUrl)
})
```

### 4. Export from domain barrel

```javascript
// checks/project/index.js
export { checkQuireProject } from './quire-project.js'
export { checkDependencies } from './dependencies.js'
export { checkOutdatedQuire11ty } from './quire-11ty.js'
export { checkDataFiles } from './data-files.js'
export { checkMyThing } from './my-check.js'  // Add new export
```

### 5. Add to main index.js

```javascript
// In imports
import {
  checkQuireProject,
  checkDependencies,
  checkOutdatedQuire11ty,
  checkDataFiles,
  checkMyThing,  // Add new import
} from './checks/project/index.js'

// In re-exports
export {
  // ... existing exports
  checkMyThing,
}

// In checkSections
export const checkSections = [
  // ...
  {
    name: 'Project',
    checks: [
      // ... existing checks
      { name: 'My thing', check: checkMyThing },
    ],
  },
]

// In checks (flat list)
export const checks = [
  // ... existing checks
  { name: 'My thing', check: checkMyThing },
]

// In default export
export default {
  // ... existing exports
  checkMyThing,
}
```

### 6. Update test count in index.test.js

Update the assertions for check counts if needed.

## Design Principles

### Domain Organization

Checks are organized by domain rather than technical concern:
- **environment**: "Do I have what I need to run Quire?"
- **project**: "Is my project properly configured?"
- **outputs**: "Are my build outputs valid?"

### Check Independence

Each check should be independent and not depend on the results of other checks. The runner executes all checks regardless of previous failures.

### Co-located Tests

Each check file has its corresponding test file in the same directory:
```
my-check.js
my-check.test.js
```

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
# All doctor tests
npx ava 'src/lib/doctor/**/*.test.js'

# Main integration tests
npx ava src/lib/doctor/index.test.js

# Domain-specific tests
npx ava src/lib/doctor/checks/environment/*.test.js
npx ava src/lib/doctor/checks/project/*.test.js
npx ava src/lib/doctor/checks/outputs/*.test.js

# Duration formatting tests
npx ava src/lib/doctor/formatDuration.test.js

# Related validator tests
npx ava src/validators/validate-data-files.test.js
```

### Test Patterns

**Mocking dependencies in domain checks:**
```javascript
const { checkDataFiles } = await esmock('./data-files.js', {
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
const { checkStaleBuild } = await esmock('./stale-build.js', {
  'node:fs': {
    existsSync: sandbox.stub().returns(true),
    statSync: sandbox.stub().returns({ mtimeMs: Date.now() }),
    readdirSync: sandbox.stub().returns([]),
  },
})
```

## Files Summary

| File | Description |
|------|-------------|
| `index.js` | Barrel export, runners, checkSections |
| `index.test.js` | Integration tests for runners and sections |
| `constants.js` | Re-exports from `#lib/constants.js` |
| `formatDuration.js` | Time duration formatting utility |
| `formatDuration.test.js` | Duration formatting tests |
| `checks/environment/` | Environment prerequisite checks (5 checks: os-info, cli-version, node-version, npm-available, git-available) |
| `checks/project/` | Project configuration checks (4 checks) |
| `checks/outputs/` | Build artifact checks (3 checks: stale-build, pdf-output, epub-output) |
