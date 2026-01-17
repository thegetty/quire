# Quire CLI Architecture Evaluation

**Date:** 2026-01-15
**Evaluated Version:** 1.0.0-rc.33
**Last Updated:** 2026-01-15
**Total Source Files:** 51 files
**Total Lines of Code:** ~5,000 LOC (excluding tests)

---

## Executive Summary

**Overall Architecture Grade: B+ (8.5/10)**

The Quire CLI demonstrates a well-structured, maintainable architecture with clear separation of concerns and modern JavaScript patterns. The command pattern implementation is clean, extensible, and follows industry best practices. However, there are opportunities for improvement in error handling, type safety, and module cohesion.

### Strengths ✅
- **Clear layered architecture** with strong separation between commands, lib modules, and helpers
- **Extensible command pattern** enabling easy addition of new commands
- **Modern ES modules** with path aliases for clean imports
- **Consistent code organization** across all commands
- **Good dependency injection** via Commander.js hooks and config
- **Simple logger abstraction** making code testable

### Weaknesses ⚠️
- **No TypeScript definitions** limiting IDE support and type safety
- **Inconsistent error handling** across commands and lib modules
- **Missing lib module tests** creating integration blind spots
- **Some tight coupling** between commands and lib implementations
- **Limited documentation** for lib module APIs
- **Process.exit() calls** make some code paths untestable

---

## Architecture Overview

### Directory Structure

```
packages/cli/src/
├── Command.js              # Abstract base class
├── main.js                 # Program receiver/router
├── packageConfig.js        # Package metadata
├── commands/               # Command modules (10 commands)
│   ├── index.js           # Auto-discovery
│   ├── build.js
│   ├── clean.js
│   ├── conf.js
│   ├── create.js
│   ├── epub.js
│   ├── info.js
│   ├── pdf.js
│   ├── preview.js
│   ├── validate.js
│   └── version.js
├── lib/                    # Business logic modules
│   ├── 11ty/              # Eleventy integration (CLI + API)
│   ├── archiver/          # Archive utilities
│   ├── conf/              # Configuration management
│   ├── epub/              # EPUB generation
│   ├── git/               # Git operations (class + singleton)
│   ├── i18n/              # Internationalization
│   ├── installer/         # Project creation and quire-11ty installation
│   ├── npm/               # npm operations (singleton façade)
│   ├── pdf/               # PDF generation
│   ├── project/           # Project paths, detection, config, versions
│   ├── reporter/          # Progress reporting
│   └── logger/            # Logger abstraction (loglevel + chalk)
├── helpers/                # Utility functions
│   ├── clean.js
│   ├── is-empty.js
│   ├── os-utils.js
│   ├── test-cwd.js
│   └── which.js
├── errors/                 # Error classes
│   └── validation/
└── validators/             # Validation utilities
```

### Layer Responsibilities

#### Layer 1: Entry Point (`bin/cli.js`)
**Responsibility:** Bootstrap and orchestrate
- Check for CLI updates
- Initialize configuration
- Parse command-line arguments
- Delegate to main program

**Grade: A** - Clean, focused bootstrap with good separation

#### Layer 2: Program Router (`src/main.js`)
**Responsibility:** Command registration and routing
- Create Commander.js program
- Auto-discover and register commands
- Configure help formatting
- Wire up command hooks (preAction, postAction)
- Inject configuration into commands

**Grade: A** - Excellent implementation of command pattern

**Strengths:**
- Auto-discovery prevents manual registration
- Consistent hook registration
- Clean separation from business logic
- Good use of Commander.js features

**Code example:**
```javascript
// Automatic command discovery and registration
commands.forEach((command) => {
  const subCommand = program
    .command(command.name)
    .description(command.description)

  // Hook registration
  if (command.preAction) {
    subCommand.hook('preAction', (thisCommand, actionCommand) => {
      command.preAction.call(command, thisCommand, actionCommand)
    })
  }

  subCommand.action(command.action)
  subCommand.config = config
})
```

#### Layer 3: Command Layer (`src/commands/*.js`)
**Responsibility:** Command interface and orchestration
- Define command metadata (name, args, options)
- Validate command-level concerns
- Orchestrate lib modules
- Handle command-specific logging
- Implement preAction/postAction hooks

**Grade: A-** - Consistent, well-structured, with minor issues

**Strengths:**
- **Consistent pattern** across all 10 commands
- **Clear metadata declarations** using static definition
- **Good separation** between command logic and business logic
- **Commander.js integration** is clean and idiomatic
- **Hooks used appropriately** (preAction for validation/cleanup)

**Example: build.js**
```javascript
export default class BuildCommand extends Command {
  static definition = {
    name: 'build',
    description: 'Generate publication outputs',
    args: [],
    options: [
      [ '-d', '--dry-run', 'run build without writing files' ],
      [ '-q', '--quiet', 'run build with no console messages' ],
      [ '-v', '--verbose', 'run build with verbose console messages' ],
      [ '--11ty <module>', 'use the specified 11ty module', 'cli' ],
      [ '--debug', 'run build with debug output to console' ],
    ],
  }

  action(options, command) {
    if (options['11ty'] === 'cli') {
      cli.build(options)  // Delegate to lib module
    } else {
      api.build(options)  // Alternative implementation
    }
  }

  preAction(command) {
    testcwd(command)  // Validate project directory
    clean(projectRoot, paths, command.opts())  // Cleanup
  }
}
```

**Weaknesses:**
- **Direct process.exit() calls** in some commands (testcwd helper)
- **Inconsistent error handling** - some throw, some return, some exit
- **Tight coupling** to lib module implementations
- **Limited abstraction** for common patterns (validation, error handling)

**Improvement opportunity:**
```javascript
// Current: Tight coupling
import { api, cli } from '#lib/11ty/index.js'

// Better: Dependency injection
class BuildCommand extends Command {
  constructor(eleventyService = defaultEleventyService) {
    super(BuildCommand.definition)
    this.eleventy = eleventyService
  }

  action(options) {
    this.eleventy.build(options)
  }
}
```

#### Layer 4: Lib Modules (`src/lib/*/`)
**Responsibility:** Core business logic
- Integrate with external tools (Eleventy, PrinceXML, Git, npm)
- Handle file system operations
- Manage complex workflows
- Provide reusable services

**Grade: C+** - Functional but needs improvement

**Strengths:**
- **Clear module boundaries** (#lib/11ty, #lib/pdf, etc.)
- **Good abstraction** over external tools
- **Reusable services** decoupled from commands
- **Clean exports** with barrel files (index.js)

**Weaknesses:**
- ❌ **ZERO tests** for lib modules (critical gap)
- ⚠️ **Inconsistent error handling** across modules
- ⚠️ **Console.* calls** instead of logger in some places
- ⚠️ **Process.exit()** in some lib modules
- ⚠️ **Limited documentation** of module APIs
- ⚠️ **Some god objects** (quire/index.js has multiple responsibilities)

**Example: lib/11ty/index.js**
```javascript
// Good: Clear API/CLI abstraction
export { api, cli, paths, projectRoot }

// lib/11ty/api.js - Eleventy API wrapper
export default {
  build: async (options) => { /* Use Eleventy API */ },
  serve: async (options) => { /* Dev server via API */ }
}

// lib/11ty/cli.js - Eleventy CLI wrapper
export default {
  build: async (options) => { /* Use Eleventy CLI */ },
  serve: async (options) => { /* Dev server via CLI */ }
}
```

**Refactored module structure (completed):**
```javascript
// The former lib/quire module has been split into focused modules:

lib/installer/           # Project creation and installation
├── index.js            # Public API (initStarter, installInProject, latest, versions)

lib/project/            # Project-level concerns
├── index.js            # Barrel exports
├── paths.js            # Paths class for project path management
├── config.js           # Project config.yaml loading and validation
├── detect.js           # Quire project detection
└── version.js          # Version file management

lib/git/                # Git operations
├── index.js            # Git class + singleton instance

lib/npm/                # npm operations
├── index.js            # Npm singleton façade
```

**Benefits achieved:**
- ✅ Single responsibility per module
- ✅ Clear separation of concerns
- ✅ Improved testability with focused mocks
- ✅ Better code organization

#### Layer 5: Helpers (`src/helpers/*.js`)
**Responsibility:** Utility functions
- OS detection and utilities
- File system checks
- Validation helpers
- Project detection

**Grade: A-** - Well-structured utilities

**Strengths:**
- **Pure functions** where possible
- **Single responsibility** per helper
- **Good naming** (is-quire, is-empty, test-cwd)
- **Some have tests** (is-quire.test.js, test-cwd.test.js)

**Weaknesses:**
- **process.exit() in test-cwd** makes it untestable as-is
- **Console.error instead of logger** in some helpers
- **Inconsistent test coverage** (only 2 helpers have tests)

**Example: test-cwd.js**
```javascript
// Problem: process.exit() makes this untestable
export default (command) => {
  const message = `[CLI] command must be run while in a Quire project directory`

  if (!isQuire(process.cwd())) {
    console.error(message)  // Should use logger
    process.exit(1)         // Can't be tested
  }
}

// Better approach:
export default (command) => {
  if (!isQuire(process.cwd())) {
    throw new QuireProjectError('Not in a Quire project directory')
  }
}
```

---

## Design Patterns

### 1. Command Pattern ✅ **Excellent Implementation**

**Pattern:** Each command is an instance of the Command abstract class

**Implementation:**
- Abstract `Command` base class enforces structure
- Static `definition` property for metadata
- `action(options, command)` method for execution
- Optional `preAction` and `postAction` hooks
- Auto-discovery via `commands/index.js`

**Benefits:**
- ✅ Easy to add new commands (just add a file)
- ✅ Consistent structure across all commands
- ✅ Testable in isolation
- ✅ Clear separation from CLI framework

**Grade: A**

### 2. Dependency Injection ✅ **Good via Configuration**

**Current approach:**
```javascript
// main.js injects config into all commands
subCommand.config = config

// Commands access via this.config
class InfoCommand extends Command {
  action() {
    const versionFile = this.config.get('versionFile')
  }
}
```

**Strengths:**
- Config is injected, not globally imported
- Enables testing with mock config

**Weaknesses:**
- Lib modules are imported directly, not injected
- Hard to substitute lib implementations for testing

**Improvement:**
```javascript
// Constructor injection for lib modules
class BuildCommand extends Command {
  constructor(eleventy = defaultEleventy, cleaner = defaultCleaner) {
    super(BuildCommand.definition)
    this.eleventy = eleventy
    this.cleaner = cleaner
  }
}
```

**Grade: B+**

### 3. Service Layer ✅ **Well Implemented**

**Good:**
- Lib modules act as services
- Commands delegate to services
- Clean barrel exports
- Git and Npm façades provide consistent interfaces

**Patterns in use:**
- **Singleton pattern** for global operations (npm, logger, config)
- **Class pattern** for scoped operations (Git class for repo-specific operations)

**Example of good service design:**
```javascript
// lib/git/index.js - Class + singleton exports
export { Git }           // Class for repo-scoped operations
export default new Git() // Singleton for global operations

// Usage in lib/installer:
import { Git } from '#lib/git/index.js'
const repo = new Git(projectPath)
await repo.clone(starter, '.')
await repo.init()
await repo.add('.')
await repo.commit('Initial Commit')
```

**Grade: B+**

### 4. Factory Pattern ⚠️ **Used Inconsistently**

**Where used well:**
```javascript
// lib/pdf/index.js
export default function libPdf(library) {
  return async (input, covers, output) => {
    switch (library) {
      case 'prince': return prince(input, covers, output)
      case 'pagedjs': return paged(input, covers, output)
    }
  }
}
```

**Where missing:**
- Command instantiation could use factories
- Error object creation is ad-hoc

**Grade: B-**

### 5. Strategy Pattern ✅ **Used Effectively**

**Example: Eleventy CLI vs API**
```javascript
// Build command chooses strategy at runtime
if (options['11ty'] === 'cli') {
  cli.build(options)   // Strategy 1
} else {
  api.build(options)   // Strategy 2
}
```

**Example: PDF library selection**
```javascript
const generator = libPdf('prince')  // Strategy selection
await generator(input, covers, output)
```

**Grade: A**

---

## Cross-Cutting Concerns

### 1. Error Handling ❌ **MAJOR WEAKNESS**

**Current state:** Inconsistent and problematic

**Issues identified:**

1. **Mix of error handling approaches:**
   - Some functions throw errors
   - Some call process.exit()
   - Some return early
   - Some log and continue

2. **process.exit() prevents testing:**
```javascript
// test-cwd.js
if (!isQuire(process.cwd())) {
  console.error(message)
  process.exit(1)  // Can't test this path
}
```

3. **No custom error classes:**
```javascript
// Current: Generic errors
throw new Error('File not found')

// Better: Typed errors
throw new QuireFileNotFoundError(filePath, { cause: error })
```

4. **Inconsistent error messages:**
- Some use `[CLI]` prefix
- Some use `[CLI:module]` prefix
- Some have no prefix
- Inconsistent formatting

5. **No error recovery:**
- Most errors are fatal
- No retry logic
- No fallback strategies

**Recommendations:**

Create error hierarchy:
```javascript
// src/errors/QuireError.js
export class QuireError extends Error {
  constructor(message, { cause, code } = {}) {
    super(message, { cause })
    this.name = this.constructor.name
    this.code = code
    this.isQuireError = true
  }
}

export class QuireProjectError extends QuireError {
  constructor(message, options) {
    super(message, { code: 'NOT_QUIRE_PROJECT', ...options })
  }
}

export class QuireBuildError extends QuireError {
  constructor(message, options) {
    super(message, { code: 'BUILD_FAILED', ...options })
  }
}

// Usage
if (!isQuire(process.cwd())) {
  throw new QuireProjectError(
    'Not in a Quire project directory',
    { path: process.cwd() }
  )
}
```

Centralized error handler:
```javascript
// src/lib/error-handler.js
export function handleError(error, logger) {
  if (error.isQuireError) {
    logger.error(`[${error.code}] ${error.message}`)
    if (error.cause) {
      logger.debug('Caused by:', error.cause)
    }
  } else {
    logger.error('Unexpected error:', error)
  }

  process.exit(error.exitCode || 1)
}

// bin/cli.js
try {
  await cli.parse()
} catch (error) {
  handleError(error, logger)
}
```

**Grade: D** - Needs significant improvement

**Future consideration: Machine-readable error codes**

When implementing the error handling PR, consider adding stable machine-readable error codes
to support programmatic consumers (CI/CD, scripts). The `doctor` command now outputs JSON
with check IDs (e.g., `"id": "node"`, `"id": "deps"`) which provides a model for this:

```javascript
// Example error codes for future error handling system
const ERROR_CODES = {
  NOT_QUIRE_PROJECT: 'E001',
  NODE_VERSION_LOW: 'E002',
  DEPS_NOT_INSTALLED: 'E003',
  BUILD_FAILED: 'E004',
  // etc.
}

// Error output could include stable codes
{
  "code": "E002",
  "id": "NODE_VERSION_LOW",
  "message": "Node.js version 18.0.0 found, but >= 22 required",
  "remediation": "..."
}
```

This enables scripts to handle specific errors without parsing message text, which is
fragile and breaks when messages change.

### 2. Logging ✅ **Excellent Implementation** (Updated 2026-01-15)

**Current implementation:**
```javascript
// lib/logger/index.js - Factory pattern with loglevel + chalk
import chalk from 'chalk'
import log from 'loglevel'

export const LOG_LEVELS = { trace: 0, debug: 1, info: 2, warn: 3, error: 4, silent: 5 }
export const LOG_LEVEL_ENV_VAR = 'QUIRE_LOG_LEVEL'

export default function createLogger(prefix = 'quire', level) {
  const loggerInstance = log.getLogger(prefix)
  loggerInstance.setLevel(resolveLevel(level), false)

  const createLogFn = (type) => {
    const logMethod = loggerInstance[type]
    const style = styles[type]
    return (...args) => {
      const levelLabel = type.toUpperCase().padEnd(5, ' ')
      const styledLabel = style(chalk.bold(`[quire] ${levelLabel}`))
      logMethod(styledLabel, paddedPrefix, ...args)
    }
  }

  return {
    trace: createLogFn('trace'),
    debug: createLogFn('debug'),
    info: createLogFn('info'),
    warn: createLogFn('warn'),
    error: createLogFn('error'),
    setLevel(newLevel) { /* ... */ },
    getLevel() { return loggerInstance.getLevel() }
  }
}

export const logger = createLogger('quire')  // Singleton
```

**Strengths:**
- ✅ Log level filtering via loglevel library
- ✅ Colored output via chalk (aligned with 11ty package)
- ✅ Module-specific prefixes for traceable logs
- ✅ Configuration integration via `QUIRE_LOG_LEVEL` env var
- ✅ Factory pattern enables module-specific loggers
- ✅ Singleton available for simple usage
- ✅ Mockable in tests via esmock
- ✅ Consistent output format: `[quire] LEVEL prefix message`

**Configuration flow:**
```
config.get('logLevel') → process.env.QUIRE_LOG_LEVEL → createLogger()
         ↑                           ↑                        ↓
    defaults.js                 bin/cli.js              resolveLevel()
```

**Usage examples:**
```javascript
// Simple singleton usage
import { logger } from '#lib/logger/index.js'
logger.info('Starting build...')

// Module-specific logger
import createLogger from '#lib/logger/index.js'
const logger = createLogger('lib:pdf')
logger.debug('Resolving library...')
// Output: [quire] DEBUG lib:pdf                   Resolving library...
```

**Remaining improvements (low priority):**
- ⚠️ No structured logging (JSON) - not needed for CLI
- ⚠️ No log file output option - could add if needed

**Grade: A** - Excellent implementation with config integration

### 3. Configuration Management ✅ **Excellent**

**Implementation:**
```javascript
// Uses 'conf' package for configuration
const config = new Conf({
  projectName: 'quire-cli',
  defaults,
  schema,          // JSON Schema validation
  migrations,      // Version migrations
  watch: true,     // Auto-reload on changes
})
```

**Strengths:**
- ✅ JSON Schema validation
- ✅ Migration support for version updates
- ✅ Type-safe with schema
- ✅ Centralized defaults
- ✅ Auto-discovery of config file
- ✅ Watch mode for live reloading

**File structure:**
```
lib/conf/
├── index.js       # Export configured instance
├── config.js      # Conf initialization
├── defaults.js    # Default values
├── schema.js      # JSON Schema validation
└── migrations.js  # Version migrations
```

**Example schema:**
```javascript
// lib/conf/schema.js
export default {
  projectTemplate: {
    type: 'string',
    format: 'uri',
    default: 'https://github.com/thegetty/quire-starter-default'
  },
  updateChannel: {
    type: 'string',
    enum: ['latest', 'next', 'canary'],
    default: 'latest'
  }
}
```

**Grade: A** - Best-in-class configuration management

### 4. Type Safety ❌ **Major Gap**

**Current state:** JavaScript with JSDoc comments

**Problems:**
- No TypeScript
- Incomplete JSDoc coverage
- No type checking in CI
- IDE autocomplete limited
- Runtime type errors possible

**JSDoc coverage:**
```javascript
// Some files have good JSDoc:
/**
 * @typedef CommandDefinition
 * @property {String} name
 * @property {Array<CommandArgument>} args
 */

// But inconsistent across codebase
// Many functions have no type annotations
```

**Recommendations:**

**Option A: Add TypeScript**
```typescript
// src/Command.ts
export interface CommandDefinition {
  name: string
  description: string
  args?: CommandArgument[]
  options?: CommandOption[]
}

export abstract class Command {
  abstract action(options: Record<string, any>, command: any): Promise<void>
}
```

**Option B: Improve JSDoc + Type Checking**
```javascript
// Use JSDoc with TypeScript checking
// package.json
{
  "scripts": {
    "typecheck": "tsc --noEmit --allowJs --checkJs"
  }
}

// Add tsconfig.json for type checking
{
  "compilerOptions": {
    "allowJs": true,
    "checkJs": true,
    "noEmit": true
  }
}
```

**Grade: D** - Needs significant improvement

### 5. Internationalization ⚠️ **Partially Implemented**

**Structure exists but underutilized:**
```
lib/i18n/
├── index.js
├── config.js
└── localeService.js
```

**Current usage:** Minimal
- Not used in command messages
- Not used in error messages
- Infrastructure exists but not integrated

**Recommendation:**
- Either fully implement i18n
- Or remove the lib/i18n module to reduce maintenance burden
- Don't leave partially implemented features

**Grade: C-** - Incomplete implementation

---

## Module Cohesion Analysis

### High Cohesion ✅

**Commands:**
- Each command has single, clear responsibility
- Well-defined inputs/outputs
- Minimal coupling between commands

**Helpers:**
- Pure utility functions
- Single responsibility
- Reusable across commands

**lib/conf:**
- Focused on configuration only
- Clear module boundary
- Well-structured

### Improved Cohesion ✅ (Refactored)

**lib/installer/ (formerly lib/quire):**
- ✅ Split into focused modules
- ✅ installer handles only project creation/installation
- ✅ project/ handles paths, config, detection, versions
- ✅ git/ and npm/ are separate façades

**lib/11ty:**
- ✅ Now uses lib/project for path resolution
- ✅ Clear separation between API and CLI modes

### Module Coupling

**Acceptable coupling:**
- Commands → Lib modules (expected)
- Commands → Helpers (expected)
- Helpers → Node stdlib (expected)

**Problematic coupling:**
- Some lib modules → console.* (should use logger)
- testcwd helper → process.exit() (should throw)
- Commands → specific lib implementations (could be abstracted)

---

## Code Quality Metrics

### Maintainability

| Metric | Score | Assessment |
|--------|-------|------------|
| **Consistency** | A | All commands follow same pattern |
| **Readability** | A- | Clear structure, some complex functions |
| **Documentation** | B- | Some JSDoc, missing in places |
| **Modularity** | B+ | Good separation, some god objects |
| **DRY** | B | Some duplication in command boilerplate |

### Testability

| Metric | Score | Assessment |
|--------|-------|------------|
| **Unit Tests** | A- | Commands have good test coverage |
| **Integration Tests** | F | Lib modules have ZERO tests |
| **Test Isolation** | A | Commands testable in isolation |
| **Mock Points** | B+ | Logger mockable, lib modules mostly mockable |
| **Side Effects** | C | process.exit() and console.* calls |

### Extensibility

| Metric | Score | Assessment |
|--------|-------|------------|
| **Add Command** | A | Just add file to commands/ |
| **Add Lib Module** | A | Clear pattern to follow |
| **Add Hook** | A | Commander.js hooks available |
| **Override Behavior** | B- | Some hardcoded behaviors |
| **Plugin System** | N/A | Not implemented |

---

## Architectural Principles Assessment

### SOLID Principles

#### Single Responsibility ✅ **Mostly Good**
- ✅ Each command has one job
- ✅ Most helpers are single-purpose
- ❌ lib/quire/index.js violates SRP

**Grade: B+**

#### Open/Closed ✅ **Good**
- ✅ Can add commands without modifying main.js
- ✅ Can extend Command class
- ✅ Auto-discovery enables extension

**Grade: A**

#### Liskov Substitution ✅ **Good**
- ✅ All commands extend Command correctly
- ✅ Can substitute command implementations

**Grade: A**

#### Interface Segregation ⚠️ **Could Improve**
- ⚠️ Command class forces all commands to implement hooks even if unused
- ⚠️ Some interfaces (lib modules) are informal, not explicit

**Grade: B-**

#### Dependency Inversion ⚠️ **Partially Applied**
- ✅ Commands depend on abstractions (Commander.js Command)
- ❌ Commands depend on concrete lib module implementations
- ❌ No dependency injection container

**Grade: C+**

### DRY (Don't Repeat Yourself) ⚠️

**Violations:**
- Command boilerplate (constructor, definition pattern)
- Error message formatting repeated
- Option definitions duplicated (--debug in multiple commands)

**Recommendation:**
```javascript
// Shared options
export const commonOptions = {
  debug: [ '--debug', 'run with debug output' ],
  quiet: [ '-q', '--quiet', 'suppress output' ],
  verbose: [ '-v', '--verbose', 'verbose output' ],
}

// Use in commands
static definition = {
  name: 'build',
  options: [
    commonOptions.debug,
    commonOptions.verbose,
    // command-specific options...
  ]
}
```

**Grade: B**

### Separation of Concerns ✅ **Excellent**

Clear layers:
- Entry point (bin/)
- Router (main.js)
- Commands (commands/)
- Business logic (lib/)
- Utilities (helpers/)

**Grade: A**

---

## Security Considerations

### Input Validation ⚠️

**Current state:**
- Commander.js validates argument count
- No validation of argument values
- No sanitization of file paths
- Trust user input

**Risks:**
- Path traversal (user-provided paths)
- Command injection (in git/npm operations)
- Malicious starter templates

**Recommendations:**
```javascript
// Validate and sanitize paths
import path from 'node:path'

function validateProjectPath(projectPath) {
  const resolved = path.resolve(projectPath)
  const cwd = process.cwd()

  // Prevent path traversal outside CWD
  if (!resolved.startsWith(cwd)) {
    throw new Error('Project path must be within current directory')
  }

  return resolved
}

// Sanitize URLs
import { URL } from 'node:url'

function validateStarterUrl(url) {
  try {
    const parsed = new URL(url)
    // Only allow specific protocols
    if (!['https:', 'git:', 'ssh:'].includes(parsed.protocol)) {
      throw new Error('Invalid starter URL protocol')
    }
    return url
  } catch {
    throw new Error('Invalid starter URL')
  }
}
```

**Grade: C-**

### Command Injection ⚠️

**Current:** Some use of execa without input sanitization

```javascript
// Potential risk if version is user-controlled
await execaCommand(`npm install @thegetty/quire-11ty@${version}`)
```

**Recommendation:** Always use execa's array syntax
```javascript
// Safe: Arguments are escaped
await execa('npm', ['install', `@thegetty/quire-11ty@${version}`])
```

**Grade: B-**

### Secrets Management ✅

**Current:** No secrets in code
- Uses environment variables appropriately
- No hardcoded credentials
- Config file permissions respected

**Grade: A**

---

## Performance Considerations

### Startup Time ✅ **Fast**

**Measured:** ~100-200ms to show help
- ES module lazy loading
- Minimal dependencies loaded at startup
- Dynamic import of commands

**Grade: A**

### Build Performance ⚠️ **Delegated**

Performance depends on:
- Eleventy (lib/11ty)
- PrinceXML or Paged.js (lib/pdf)
- epubjs-cli (lib/epub)

CLI itself is not the bottleneck.

**Grade: N/A** (delegated to external tools)

### Memory Usage ✅ **Efficient**

- No memory leaks identified
- Streams used where appropriate
- Cleanup in error paths (mostly)

**Grade: A-**

---

## Recommendations by Priority

### Priority 1: Critical (Fix Immediately) ⚠️

1. **Add lib module tests**
   - **Impact:** High - Currently zero integration test coverage
   - **Effort:** 20-25 hours
   - **Risk:** High - Untested integration code
   - See: test-mocking-evaluation-revised.md

2. **Fix error handling**
   - **Impact:** High - Makes code untestable and fragile
   - **Effort:** 8-12 hours
   - **Tasks:**
     - Create error hierarchy (QuireError, QuireProjectError, etc.)
     - Remove process.exit() from helpers/lib modules
     - Centralize error handling in bin/cli.js
     - Standardize error messages

3. ~~**Replace console.* with logger**~~ ✅ **COMPLETED**
   - **Status:** Logger upgraded to use loglevel + chalk with config integration
   - **Result:** All commands use logger, config.logLevel now functional
   - **See:** [lib/logger/README.md](../src/lib/logger/README.md)

### Priority 2: High (Plan for Next Quarter) 📋

4. **Add TypeScript or improve JSDoc**
   - **Impact:** High - Developer experience and safety
   - **Effort:** 15-20 hours (TypeScript) or 8-10 hours (JSDoc)
   - **Options:**
     - Full TypeScript migration
     - JSDoc + type checking with tsc --checkJs
   - **Benefit:** IDE support, catch bugs at compile time

5. ~~**Split lib/quire/index.js**~~ ✅ **COMPLETED**
   - **Status:** Refactored into lib/installer/, lib/project/, lib/git/, lib/npm/
   - **Result:** Clear separation of concerns achieved

6. **Add input validation**
   - **Impact:** High - Security
   - **Effort:** 4-6 hours
   - **Tasks:**
     - Validate file paths (prevent traversal)
     - Validate URLs (protocol whitelist)
     - Sanitize all user inputs
     - Add validation module

### Priority 3: Medium (Nice to Have) 💡

7. ~~**Enhance logger**~~ ✅ **COMPLETED**
   - **Status:** Implemented with loglevel + chalk
   - **Features delivered:**
     - ✅ Log levels (trace, debug, info, warn, error, silent)
     - ✅ Environment-based level control (`QUIRE_LOG_LEVEL`)
     - ✅ Configuration integration (`config.logLevel`)
     - ✅ Colored output aligned with 11ty
     - ✅ Module-specific prefixes

8. **Reduce coupling with DI**
   - **Impact:** Medium - Better testability
   - **Effort:** 10-12 hours
   - **Approach:**
     - Add constructor injection to commands
     - Create service factory
     - Update tests to use DI

9. **Shared command options**
   - **Impact:** Low - Reduce duplication
   - **Effort:** 2-3 hours
   - **Create:** commonOptions module
   - **Share:** --debug, --quiet, --verbose

10. **Complete or remove i18n**
    - **Impact:** Low - Clean up dead code
    - **Effort:** 1 hour (remove) or 20+ hours (complete)
    - **Decision:** Determine if i18n is needed
    - **Action:** Either fully implement or remove lib/i18n/

### Priority 4: Low (Future Improvements) 🔮

11. **Plugin system**
    - **Impact:** Low - Extensibility
    - **Effort:** 15-20 hours
    - **Enable:** Third-party commands
    - **Pattern:** Similar to Gatsby/Next.js plugins

12. **Telemetry/analytics**
    - **Impact:** Low - Usage insights
    - **Effort:** 8-10 hours
    - **Privacy:** Opt-in, anonymized
    - **Purpose:** Understand command usage

---

## Comparison to Industry Standards

### vs. Commander.js Examples ✅
- **Follows best practices**
- Good use of hooks
- Clean command structure
- **Grade: A**

### vs. Angular CLI ⚠️
- Missing: Schematics/generators
- Missing: Workspace concept
- Missing: Plugin system
- **Grade: B-**

### vs. Create React App ✅
- Similar: Simple, focused CLI
- Better: More commands, more flexible
- Missing: Interactive prompts (minimal usage)
- **Grade: B+**

### vs. Gatsby CLI ⚠️
- Missing: Plugin ecosystem
- Missing: Recipes/templates
- Similar: Build/serve commands
- **Grade: B**

### vs. Vue CLI ⚠️
- Missing: Interactive project creation
- Missing: Plugin system
- Missing: GUI mode
- Simpler: Good for this use case
- **Grade: B**

---

## Architecture Decision Records (Implied)

Based on code analysis, these architectural decisions were made:

### ADR 1: Command Pattern with Auto-Discovery ✅
**Decision:** Use abstract Command class with auto-discovery
**Rationale:** Easy extension, consistent structure
**Status:** Excellent implementation

### ADR 2: ES Modules with Path Aliases ✅
**Decision:** Use ES modules with # path aliases
**Rationale:** Modern JavaScript, clean imports
**Status:** Working well

### ADR 3: Delegate to External Tools ✅
**Decision:** Wrap Eleventy, PrinceXML, etc. rather than reimplemented
**Rationale:** Leverage existing tools, avoid reinventing
**Status:** Appropriate choice

### ADR 4: Logger with loglevel + chalk ✅ (Updated 2026-01-15)
**Decision:** Factory-based logger using loglevel for level filtering and chalk for colored output
**Rationale:** Testability, log level filtering, 11ty format alignment, config integration
**Status:** Excellent - fully implemented with environment variable configuration

### ADR 5: Configuration via 'conf' Package ✅
**Decision:** Use conf package for config management
**Rationale:** Schema validation, migrations, cross-platform
**Status:** Excellent choice

### ADR 6: No TypeScript (Yet) ⚠️
**Decision:** Use JavaScript with JSDoc
**Rationale:** Lower barrier, simpler tooling
**Status:** Should reconsider - TS would help significantly

### ADR 7: Module-Level Mocking vs Constructor DI ✅
**Decision:** Use direct imports with esmock for testing rather than constructor-based dependency injection

**Context:**
Commands import lib modules directly at the module level:
```javascript
// create.js - direct imports
import { installer } from '#lib/installer/index.js'
import logger from '#src/lib/logger.js'

export default class CreateCommand extends Command {
  async action(projectPath, starter, options) {
    await installer.initStarter(starter, projectPath, options)
  }
}
```

**Alternatives Considered:**

| Approach | Pros | Cons |
|----------|------|------|
| **Direct imports + esmock** | Simple command code, no boilerplate, established pattern | Tests need module-level mocking |
| **Constructor DI** | Cleaner tests, explicit dependencies | More boilerplate, changes all commands |
| **Service locator** | Flexible, lazy loading | Hidden dependencies, harder to trace |
| **main.js injection** | Centralized, consistent | Requires refactoring command base class |

**Decision Rationale:**
1. **Simplicity wins:** Command code stays clean without DI boilerplate
2. **Testing works:** esmock effectively intercepts module imports for testing
3. **Established pattern:** Team has working patterns for this approach
4. **Trade-off accepted:** The "tight coupling" is acceptable because:
   - Commands rarely need alternative implementations at runtime
   - Testing infrastructure (esmock) handles the complexity
   - Refactoring to DI would add complexity without proportional benefit

**Example test pattern:**
```javascript
// Tests use esmock to replace imports
const CreateCommand = await esmock('./create.js', {
  '#lib/installer/index.js': { installer: mockInstaller },
  '#lib/git/index.js': { Git: MockGit },
  '#src/lib/logger.js': { default: mockLogger },
})
```

**Status:** Pragmatic choice - works well for current needs

**Consequences:**
- ✅ Command code remains simple and readable
- ✅ Tests are effective with esmock
- ⚠️ Noted as "architectural debt" but low priority to change
- ⚠️ Would need refactoring if runtime substitution becomes necessary

---

## Final Grades by Category

| Category | Grade | Score | Assessment |
|----------|-------|-------|------------|
| **Architecture** | A- | 9.0/10 | Layered, clear separation of concerns |
| **Code Quality** | B+ | 8.5/10 | Consistent, readable, some improvements needed |
| **Testability** | B- | 7.5/10 | Commands tested, lib modules untested |
| **Maintainability** | B+ | 8.5/10 | Easy to extend, some god objects |
| **Security** | C+ | 7.0/10 | Basic security, needs input validation |
| **Documentation** | B- | 7.5/10 | Some JSDoc, inconsistent coverage |
| **Error Handling** | D | 6.0/10 | Inconsistent, needs improvement |
| **Type Safety** | D | 6.0/10 | No TypeScript, incomplete JSDoc |
| **Extensibility** | A | 9.5/10 | Excellent command pattern |
| **Performance** | A | 9.0/10 | Fast startup, efficient execution |

**Overall Architecture Grade: B+ (8.5/10)**

---

## Conclusion

The Quire CLI architecture demonstrates solid software engineering practices with clear layering, good separation of concerns, and an extensible command pattern. The codebase is maintainable and follows modern JavaScript patterns.

### Key Strengths
1. **Excellent command pattern implementation** enabling easy extension
2. **Clear architectural layers** with appropriate responsibilities
3. **Good configuration management** with schema validation
4. **Consistent code organization** across all commands
5. **Fast performance** with minimal startup overhead

### Critical Improvements Needed
1. **Add lib module tests** (currently zero coverage)
2. **Fix error handling** (remove process.exit, add error hierarchy)
3. **Standardize logging** (remove console.*, use logger everywhere)
4. **Add type safety** (TypeScript or improved JSDoc)
5. **Input validation** (security concern)

### Architectural Debt
- ~~**lib/quire god object** needs splitting~~ ✅ **RESOLVED** - Split into lib/installer/, lib/project/, lib/git/, lib/npm/
- **Tight coupling** between commands and lib implementations
- **Missing dependency injection** for better testability
- **Incomplete i18n** should be finished or removed

### Recommended Next Steps

**Week 1-2:** Add lib module tests (Priority 1)
**Week 3:** Fix error handling (Priority 1)
**Week 4:** Standardize logging (Priority 1)
**Month 2:** Add TypeScript or JSDoc type checking (Priority 2)
**Month 3:** Refactor lib/quire and add input validation (Priority 2)

With these improvements, the architecture would reach **A- (9.0/10)** grade.

---

## Appendix: Architecture Diagrams

### Component Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         bin/cli.js                          │
│                    (Entry Point/Bootstrap)                  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                       src/main.js                           │
│                  (Program Router/Receiver)                  │
└────────────────────────┬────────────────────────────────────┘
                         │
            ┌────────────┴────────────┐
            ▼                         ▼
┌───────────────────────┐   ┌───────────────────────┐
│   src/Command.js      │   │  src/commands/*.js    │
│   (Abstract Base)     │◄──│  (10 Commands)        │
└───────────────────────┘   └───────┬───────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
        ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
        │  src/lib/*   │  │src/helpers/* │  │  src/conf    │
        │  (Services)  │  │ (Utilities)  │  │   (Config)   │
        └──────────────┘  └──────────────┘  └──────────────┘
```

### Data Flow Diagram

```
User Input (CLI args)
         │
         ▼
    bin/cli.js ──► Check for updates
         │         Initialize config
         ▼
    main.js ──────► Parse arguments
         │          Route to command
         ▼
    Command ───────► Validate (preAction)
         │          Execute (action)
         │          Cleanup (postAction)
         ▼
    Lib Module ────► Execute business logic
         │          Call external tools
         ▼
    External Tool ─► Eleventy/Prince/Git/npm
         │
         ▼
    File System ───► Write outputs
         │
         ▼
    Console ───────► User feedback
```

### Module Dependency Graph

```
bin/cli.js
    ├── src/lib/conf/config.js     # Read config first
    ├── process.env.QUIRE_LOG_LEVEL  # Set before imports
    │
    └── src/main.js (dynamic import)
        ├── src/Command.js
        ├── src/commands/index.js
        │   └── src/commands/*.js
        │       ├── src/lib/11ty/
        │       ├── src/lib/pdf/
        │       ├── src/lib/epub/
        │       ├── src/lib/installer/
        │       │   ├── src/lib/git/
        │       │   ├── src/lib/npm/
        │       │   └── src/lib/project/
        │       ├── src/lib/logger/   # Reads QUIRE_LOG_LEVEL
        │       └── src/helpers/*
        └── src/lib/conf/
```

---

**Document Version:** 1.3
**Last Updated:** 2026-01-15
**Next Review:** After Priority 1 tasks completed

### Changelog
- **1.3 (2026-01-15):** Updated logging section to reflect new logger implementation (loglevel + chalk with config integration)
- **1.2 (2026-01-15):** Added ADR 7 documenting module-level mocking vs constructor DI decision
- **1.1 (2026-01-15):** Updated to reflect lib/quire refactoring into lib/installer/, lib/project/, lib/git/, lib/npm/
- **1.0 (2026-01-09):** Initial evaluation
