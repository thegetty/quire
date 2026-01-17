# CLI Command Test Suite: A+ Roadmap

**Current Grade: A- (8.5/10)**
**Target Grade: A+ (9.5/10)**

**Date:** 2026-01-09
**Previous Evaluation:** [test-suite-reevaluation.md](test-suite-reevaluation.md)

## Executive Summary

The CLI test suite has reached production-ready status with consistent patterns, excellent maintainability, and strong coverage. To achieve A+ grade (9/10 or better), we need to:

1. **Complete integration test coverage** (10/10 commands)
2. **Add comprehensive error handling tests** (edge cases, failure scenarios)
3. **Support programmatic usage** (TypeScript types, programmatic tests, docs)
4. **Enhance test robustness** (async edge cases, resource cleanup)
5. **Improve documentation** (API docs, usage examples)

**Current State:**
- ✅ Pattern consistency: 100% (10/10 commands)
- ✅ Technical debt: 0%
- ⚠️ Integration coverage: 90% (9/10 commands)
- ⚠️ Error scenario coverage: ~40%
- ❌ Programmatic usage support: 0%
- ⚠️ TypeScript definitions: 0%

## Detailed Grade Breakdown

### Current Grades (A- = 8.5/10)

| Category | Current | Target | Gap | Priority |
|----------|---------|--------|-----|----------|
| **Clarity** | A (9/10) | A+ (10/10) | Documentation | Medium |
| **Coverage** | B+ (8.5/10) | A+ (10/10) | Missing tests | High |
| **Quality** | A (9/10) | A+ (10/10) | Error scenarios | High |
| **Maintainability** | A (9/10) | A+ (10/10) | Tooling | Low |

### Coverage Breakdown

**Contract Tests (*.spec.js): 100%** ✅
- 51 spec tests across 10 commands
- All test Commander.js public API
- Consistent pattern everywhere

**Integration Tests (*.test.js): 90%** ⚠️
- 49 integration tests across 9 commands
- Missing: info.test.js
- Total: 100 passing tests (51 spec + 49 integration)

**Error Scenario Coverage: ~40%** ❌
- create.test.js: 1 error test (initStarter failure)
- validate.test.js: 1 error test (validation errors)
- pdf.test.js: 1 test (missing build output)
- Other commands: Missing comprehensive error scenarios

**Edge Case Coverage: ~20%** ❌
- Limited boundary condition testing
- Missing invalid input validation tests
- No timeout or race condition tests

**Programmatic Usage Coverage: 0%** ❌
- No TypeScript definitions
- No programmatic instantiation tests
- No direct action() call tests
- No API documentation

## Path to A+ Grade

### Priority 1: Complete Integration Coverage (2-3 hours)

**Missing:** info.test.js

**Goal:** 100% integration test coverage (10/10 commands)

**Tasks:**
1. Create info.test.js with 5-7 tests:
   - Should display system information
   - Should show Node.js version
   - Should show npm version
   - Should show quire-cli version
   - Should show project root path
   - Should display git status when in git repo
   - Should handle missing git gracefully

**Complexity:** Medium (requires mocking system info calls)

**Estimated effort:** 2-3 hours

**Impact on grade:** B+ → A (Coverage)

---

### Priority 2: Add Comprehensive Error Handling Tests (4-5 hours)

**Goal:** Test all failure scenarios, edge cases, and error recovery

#### 2.1 Build Command Error Tests (1 hour)

```javascript
// build.test.js - Add these tests:
test('build command should handle eleventy build failure')
test('build command should handle missing config file')
test('build command should handle invalid project structure')
test('build command should handle file permission errors')
test('build command should clean up on build failure')
```

#### 2.2 Create Command Error Tests (1 hour)

```javascript
// create.test.js - Add these tests:
test('create command should prevent overwriting existing project')
test('create command should handle network errors when cloning starter')
test('create command should handle invalid starter template URL')
test('create command should handle npm install failure')
test('create command should clean up on any failure')
```

#### 2.3 Preview Command Error Tests (1 hour)

```javascript
// preview.test.js - Add these tests:
test('preview command should handle port already in use')
test('preview command should handle eleventy serve failure')
test('preview command should handle CTRL+C gracefully')
test('preview command should handle missing build files')
```

#### 2.4 PDF/EPUB Command Error Tests (1 hour)

```javascript
// pdf.test.js - Add these tests:
test('pdf command should handle prince/pagedjs installation missing')
test('pdf command should handle invalid PDF configuration')
test('pdf command should handle file system write errors')
test('pdf command should provide helpful error when build output missing')

// epub.test.js - Add these tests:
test('epub command should handle epubjs-cli missing')
test('epub command should handle invalid EPUB configuration')
test('epub command should handle missing required metadata')
```

#### 2.5 Validation Command Error Tests (30 minutes)

```javascript
// validate.test.js - Add these tests:
test('validate command should report multiple validation errors')
test('validate command should handle malformed YAML')
test('validate command should handle missing schema files')
test('validate command should provide line numbers for errors')
```

#### 2.6 Version Command Error Tests (30 minutes)

```javascript
// version.test.js - Add these tests:
test('version command should reject invalid semver formats')
test('version command should handle file write errors')
test('version command should prevent switching to non-existent version')
test('version command should handle git conflicts')
```

**Estimated effort:** 4-5 hours total

**Impact on grade:** Quality A → A+

---

### Priority 3: Add Programmatic Usage Support (5-6 hours)

**Goal:** Enable safe, documented programmatic API usage

#### 3.1 TypeScript Type Definitions (2 hours)

Create `packages/cli/index.d.ts`:

```typescript
/**
 * Quire CLI - TypeScript Definitions
 *
 * Programmatic API for @thegetty/quire-cli
 */

export interface CommandDefinition {
  name: string
  alias?: string
  aliases?: string[]
  description: string
  summary?: string
  args?: CommandArgument[]
  options?: CommandOption[]
  version?: string
  hidden?: boolean
}

export interface CommandArgument {
  name: string
  description?: string
  required?: boolean
  defaultValue?: any
}

export interface CommandOption {
  flags: string
  description?: string
  defaultValue?: any
}

export interface CommandOptions {
  debug?: boolean
  verbose?: boolean
  quiet?: boolean
  [key: string]: any
}

/**
 * Abstract base class for all Quire CLI commands
 */
export abstract class Command {
  name: string
  aliases?: string[]
  description: string
  summary?: string
  args?: CommandArgument[]
  options?: CommandOption[]
  config: any

  constructor(definition: CommandDefinition)

  /**
   * Execute the command action
   * @param args Command arguments
   * @param options Command options
   */
  action(...args: any[]): Promise<void> | void

  /**
   * Pre-action hook executed before the main action
   * @param command Commander.js command instance
   */
  preAction?(command: any): void | Promise<void>
}

/**
 * Build Command - Generate static site
 */
export class BuildCommand extends Command {
  action(options: CommandOptions & { '11ty'?: 'cli' | 'api' }): Promise<void>
}

/**
 * Create Command - Create new Quire project
 */
export class CreateCommand extends Command {
  action(projectPath: string, starter?: string, options?: CommandOptions): Promise<void>
}

/**
 * Preview Command - Run development server
 */
export class PreviewCommand extends Command {
  action(options: CommandOptions & {
    port?: number
    '11ty'?: 'cli' | 'api'
  }): Promise<void>
}

/**
 * PDF Command - Generate PDF output
 */
export class PDFCommand extends Command {
  action(options: CommandOptions & {
    lib?: 'prince' | 'pagedjs'
    open?: boolean
  }): Promise<void>
}

/**
 * EPUB Command - Generate EPUB output
 */
export class EPUBCommand extends Command {
  action(options: CommandOptions & {
    lib?: 'epubjs' | 'pandoc'
  }): Promise<void>
}

/**
 * Validate Command - Validate project files
 */
export class ValidateCommand extends Command {
  action(options: CommandOptions): Promise<void>
}

/**
 * Clean Command - Remove build artifacts
 */
export class CleanCommand extends Command {
  action(options: CommandOptions): Promise<void>
}

/**
 * Version Command - Manage Quire version
 */
export class VersionCommand extends Command {
  action(version: string, options: CommandOptions): Promise<void>
}

/**
 * Config Command - Display configuration
 */
export class ConfigCommand extends Command {
  action(key?: string, value?: string, options?: CommandOptions): Promise<void>
}

/**
 * Info Command - Display system information
 */
export class InfoCommand extends Command {
  action(options: CommandOptions): Promise<void>
}

// Export all commands
export {
  BuildCommand as Build,
  CreateCommand as Create,
  PreviewCommand as Preview,
  PDFCommand as PDF,
  EPUBCommand as EPUB,
  ValidateCommand as Validate,
  CleanCommand as Clean,
  VersionCommand as Version,
  ConfigCommand as Config,
  InfoCommand as Info
}
```

**Files to create:**
- `packages/cli/index.d.ts` - Main type definitions
- `packages/cli/src/Command.d.ts` - Command base class types

**Estimated effort:** 2 hours

#### 3.2 Programmatic Usage Tests (2 hours)

Create `packages/cli/src/programmatic.test.js`:

```javascript
import test from 'ava'
import { BuildCommand, CreateCommand, PreviewCommand } from '../index.js'

test('BuildCommand can be instantiated programmatically', (t) => {
  const build = new BuildCommand()

  t.truthy(build)
  t.is(build.name, 'build')
  t.is(typeof build.action, 'function')
})

test('BuildCommand action can be called directly', async (t) => {
  // Mock all dependencies
  const build = new BuildCommand()

  // Test direct action() call
  await t.notThrowsAsync(async () => {
    await build.action({ '11ty': 'api', dryRun: true })
  })
})

test('Commands can be imported and used in automation scripts', async (t) => {
  // Example automation workflow
  const create = new CreateCommand()
  const build = new BuildCommand()

  t.truthy(create)
  t.truthy(build)

  // Verify they can be chained
  t.is(typeof create.action, 'function')
  t.is(typeof build.action, 'function')
})

test('Command options can be inspected programmatically', (t) => {
  const build = new BuildCommand()

  // Access options array
  t.true(Array.isArray(build.options))

  // Find specific option
  const dryRunOption = build.options.find((opt) =>
    opt.includes('--dry-run')
  )

  t.truthy(dryRunOption)
})

test('Command can be configured with custom config', (t) => {
  const build = new BuildCommand()

  // Custom config can be injected
  build.config = { get: () => 'custom-value' }

  t.truthy(build.config)
  t.is(build.config.get(), 'custom-value')
})
```

**Estimated effort:** 2 hours

#### 3.3 Programmatic Usage Documentation (1 hour)

Create `packages/cli/docs/programmatic-usage.md`:

```markdown
# Programmatic Usage

The Quire CLI can be used programmatically in Node.js scripts and applications.

## Installation

```bash
npm install @thegetty/quire-cli
```

## Importing Commands

```javascript
import {
  BuildCommand,
  CreateCommand,
  PreviewCommand
} from '@thegetty/quire-cli'
```

## Basic Usage

### Building a Project

```javascript
import { BuildCommand } from '@thegetty/quire-cli'

const build = new BuildCommand()

// Build with default options
await build.action({ '11ty': 'cli' })

// Build with custom options
await build.action({
  '11ty': 'api',
  verbose: true,
  dryRun: true
})
```

### Creating a Project

```javascript
import { CreateCommand } from '@thegetty/quire-cli'

const create = new CreateCommand()

await create.action(
  './my-new-project',
  'https://github.com/thegetty/quire-starter-default',
  { verbose: true }
)
```

## Automation Example

```javascript
#!/usr/bin/env node
import { CreateCommand, BuildCommand, PDFCommand } from '@thegetty/quire-cli'

async function automatePublication() {
  // Create project
  const create = new CreateCommand()
  await create.action('./my-publication', 'default')

  // Change to project directory
  process.chdir('./my-publication')

  // Build HTML
  const build = new BuildCommand()
  await build.action({ '11ty': 'api' })

  // Generate PDF
  const pdf = new PDFCommand()
  await pdf.action({ lib: 'prince' })

  console.log('Publication created and built successfully!')
}

automatePublication().catch(console.error)
```

## TypeScript Support

```typescript
import { BuildCommand, CommandOptions } from '@thegetty/quire-cli'

const build: BuildCommand = new BuildCommand()

const options: CommandOptions = {
  '11ty': 'api',
  verbose: true
}

await build.action(options)
```

## Error Handling

```javascript
import { BuildCommand } from '@thegetty/quire-cli'

const build = new BuildCommand()

try {
  await build.action({ '11ty': 'cli' })
  console.log('Build succeeded')
} catch (error) {
  console.error('Build failed:', error.message)
  process.exit(1)
}
```

## Advanced: Custom Configuration

```javascript
import { BuildCommand } from '@thegetty/quire-cli'
import config from '@thegetty/quire-cli/lib/conf/config.js'

// Modify configuration
config.set('starter.default', 'https://github.com/my-org/my-starter')

const build = new BuildCommand()
build.config = config

await build.action({ '11ty': 'api' })
```

## API Reference

See [index.d.ts](../index.d.ts) for complete TypeScript type definitions.
```

**Estimated effort:** 1 hour

#### 3.4 Export Commands in package.json (30 minutes)

Update `packages/cli/package.json`:

```json
{
  "exports": {
    ".": {
      "import": "./index.js",
      "types": "./index.d.ts"
    },
    "./commands/*": {
      "import": "./src/commands/*.js"
    }
  },
  "types": "./index.d.ts"
}
```

Create `packages/cli/index.js`:

```javascript
// Programmatic API exports
export { default as Command } from './src/Command.js'
export { default as BuildCommand } from './src/commands/build.js'
export { default as CleanCommand } from './src/commands/clean.js'
export { default as ConfigCommand } from './src/commands/conf.js'
export { default as CreateCommand } from './src/commands/create.js'
export { default as EPUBCommand } from './src/commands/epub.js'
export { default as InfoCommand } from './src/commands/info.js'
export { default as PDFCommand } from './src/commands/pdf.js'
export { default as PreviewCommand } from './src/commands/preview.js'
export { default as ValidateCommand } from './src/commands/validate.js'
export { default as VersionCommand } from './src/commands/version.js'
```

**Estimated effort:** 30 minutes

**Total effort for Priority 3:** 5-6 hours

**Impact on grade:** Coverage B+ → A, Documentation → A+

---

### Priority 4: Enhance Test Robustness (2-3 hours)

#### 4.1 Async Error Handling Tests (1 hour)

```javascript
// Test unhandled promise rejections
test('build command should handle unhandled promise rejection', async (t) => {
  // Force async error
  const error = await t.throwsAsync(async () => {
    await build.action({ invalid: true })
  })

  t.truthy(error)
  t.truthy(error.message)
})

// Test timeout scenarios
test('build command should timeout on hung process', async (t) => {
  t.timeout(5000)

  // Simulate hung eleventy process
  // Verify timeout handling
})
```

#### 4.2 Resource Cleanup Tests (1 hour)

```javascript
// Test cleanup on errors
test('create command should cleanup on SIGINT', async (t) => {
  const projectPath = '/test-project'

  // Simulate CTRL+C during project creation
  process.emit('SIGINT')

  // Verify project directory was removed
  t.false(fs.existsSync(projectPath))
})

// Test file descriptor cleanup
test('build command should close all file descriptors', async (t) => {
  await build.action({})

  // Verify no leaked file descriptors
  // (would require fd counting utility)
})
```

#### 4.3 Race Condition Tests (30 minutes)

```javascript
// Test concurrent command execution
test('multiple build commands can run concurrently', async (t) => {
  const build1 = new BuildCommand()
  const build2 = new BuildCommand()

  await Promise.all([
    build1.action({ '11ty': 'api' }),
    build2.action({ '11ty': 'api' })
  ])

  t.pass('Both builds completed without conflict')
})
```

#### 4.4 Boundary Condition Tests (30 minutes)

```javascript
// Test edge cases
test('preview command should handle port 0 (random port)', async (t) => {
  await preview.action({ port: 0 })
  t.pass('Random port assignment works')
})

test('version command should handle very long version strings', async (t) => {
  const longVersion = '1.0.0-' + 'a'.repeat(1000)
  const error = await t.throwsAsync(async () => {
    await version.action(longVersion, {})
  })
  t.truthy(error)
})

test('create command should handle paths with special characters', async (t) => {
  await create.action('./my project (2024)', 'default')
  t.pass('Special characters in paths handled')
})
```

**Total effort for Priority 4:** 2-3 hours

**Impact on grade:** Quality A → A+

---

### Priority 5: Documentation Improvements (2 hours)

#### 5.1 Command API Documentation (1 hour)

Enhance JSDoc in `src/Command.js`:

```javascript
/**
 * Abstract base class for all Quire CLI commands
 *
 * @abstract
 * @class Command
 *
 * @example
 * // Creating a custom command
 * class MyCommand extends Command {
 *   static definition = {
 *     name: 'my-command',
 *     description: 'My custom command',
 *     args: [],
 *     options: []
 *   }
 *
 *   async action(options) {
 *     // Implementation
 *   }
 * }
 *
 * @example
 * // Programmatic usage
 * import { BuildCommand } from '@thegetty/quire-cli'
 * const build = new BuildCommand()
 * await build.action({ '11ty': 'api' })
 */
export default class Command {
  /**
   * Command definition object
   * Must be provided by subclass
   *
   * @typedef {Object} CommandDefinition
   * @property {string} name - Command name
   * @property {string} description - Command description
   * @property {string} [summary] - Short summary for help
   * @property {Array<string>} [aliases] - Command aliases
   * @property {Array<CommandArgument>} [args] - Command arguments
   * @property {Array<CommandOption>} [options] - Command options
   * @property {string} [version] - Command version
   * @property {boolean} [hidden] - Hide from help
   *
   * @static
   * @type {CommandDefinition}
   */
  static definition = null

  /**
   * Execute the command
   * Must be implemented by subclass
   *
   * @abstract
   * @param {...*} args - Command arguments and options
   * @returns {Promise<void>|void}
   * @throws {Error} If not implemented by subclass
   */
  action() {
    throw Error(`Command '${this.name}' has not been implemented.`)
  }

  /**
   * Pre-action hook
   * Executed before the main action
   * Override in subclass to add validation, setup, etc.
   *
   * @param {Object} command - Commander.js command instance
   * @returns {Promise<void>|void}
   */
  preAction(command) {
    // Default: no-op
  }
}
```

**Estimated effort:** 1 hour

#### 5.2 Testing Guide Documentation (1 hour)

Create `packages/cli/docs/testing-guide.md`:

```markdown
# Testing Guide

## Test Types

### Contract Tests (*.spec.js)
Test the public Commander.js API

**Purpose:** Ensure CLI interface stability

### Integration Tests (*.test.js)
Test command behavior with mocked dependencies

**Purpose:** Verify command logic and interactions

## Writing Tests

### Contract Test Pattern

```javascript
import { Command, Option } from 'commander'
import program from '#src/main.js'
import test from 'ava'

test.before((t) => {
  t.context.command = program.commands.find((cmd) => cmd.name() === 'my-cmd')
})

test('command is registered', (t) => {
  const { command } = t.context
  t.truthy(command)
  t.true(command instanceof Command)
})
```

### Integration Test Pattern

```javascript
import test from 'ava'
import { Volume, createFsFromVolume } from 'memfs'
import sinon from 'sinon'
import esmock from 'esmock'

test.beforeEach((t) => {
  t.context.sandbox = sinon.createSandbox()
  t.context.vol = new Volume()
  t.context.fs = createFsFromVolume(t.context.vol)

  t.context.mockLogger = {
    info: t.context.sandbox.stub(),
    error: t.context.sandbox.stub(),
    debug: t.context.sandbox.stub()
  }
})

test.afterEach.always((t) => {
  t.context.sandbox.restore()
  t.context.vol.reset()
})

test('command should do something', async (t) => {
  const { sandbox, fs, mockLogger } = t.context

  const MyCommand = await esmock('./my-command.js', {
    '#src/lib/logger.js': { default: mockLogger },
    'fs-extra': fs
  })

  const command = new MyCommand()
  await command.action({})

  t.true(mockLogger.info.called)
})
```

## Test Coverage Goals

- Contract tests: 100% of commands
- Integration tests: 100% of commands
- Error scenarios: 80%+ coverage
- Edge cases: Critical paths covered

## Running Tests

```bash
# All tests
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage

# Specific file
npm test -- build.test.js
```

## Best Practices

1. Use descriptive test names
2. Test one thing per test
3. Mock external dependencies
4. Clean up in afterEach
5. Test error scenarios
6. Test edge cases
7. Use in-memory filesystem (memfs)
8. Don't test implementation details
```

**Estimated effort:** 1 hour

**Total effort for Priority 5:** 2 hours

**Impact on grade:** All categories improved, overall A- → A+

---

## Summary: Path to A+

### Effort Breakdown

| Priority | Task | Effort | Impact |
|----------|------|--------|--------|
| P1 | Complete integration coverage | 2-3h | Coverage B+ → A |
| P2 | Error handling tests | 4-5h | Quality A → A+ |
| P3 | Programmatic usage support | 5-6h | Coverage A, Docs A+ |
| P4 | Test robustness | 2-3h | Quality A+ |
| P5 | Documentation | 2h | Docs A+ |
| **Total** | **All priorities** | **15-19h** | **A- → A+** |

### Minimum Viable A+ (9/10)

**Required work:** Priorities 1-2 (6-8 hours)
- Complete integration coverage (info.test.js)
- Add comprehensive error handling tests

**Grade achieved:** A (9/10)

### Full A+ (9.5/10)

**Required work:** All priorities (15-19 hours)
- Everything above
- Programmatic usage support
- Test robustness enhancements
- Complete documentation

**Grade achieved:** A+ (9.5/10)

### Perfect Score A+ (10/10)

**Additional work:** (5-10 hours beyond full A+)
- Performance benchmarks
- Load testing
- Security testing
- Accessibility testing
- Internationalization tests
- CI/CD integration tests
- Docker integration tests
- Cross-platform tests (Windows, macOS, Linux)

**Grade achieved:** A+ (10/10) - Production excellence

---

## Recommended Next Steps

### Immediate (This Sprint)

1. **Create info.test.js** (2-3 hours)
   - Achieves 100% integration coverage
   - Low complexity, high value

2. **Add error handling tests** (4-5 hours)
   - Focus on critical commands: build, create, preview
   - Test file missing, network errors, invalid config

**Expected grade after immediate work:** A (9/10)

### Short-term (Next Sprint)

3. **Add TypeScript definitions** (2 hours)
   - Enable IDE autocomplete
   - Support programmatic usage

4. **Create programmatic usage documentation** (1 hour)
   - Show example automation scripts
   - Document public API

**Expected grade after short-term work:** A+ (9.5/10)

### Long-term (Future Sprints)

5. **Test robustness enhancements** (2-3 hours)
   - Async error handling
   - Resource cleanup
   - Race conditions

6. **Performance and cross-platform tests** (5-10 hours)
   - Benchmarks
   - Windows/macOS/Linux testing
   - Docker integration

**Expected grade after long-term work:** A+ (10/10)

---

## Impact Analysis

### Business Value

**High Priority (P1-P2):**
- ✅ Prevents bugs in production
- ✅ Enables confident releases
- ✅ Reduces debugging time
- ✅ Improves user experience

**Medium Priority (P3):**
- ✅ Enables automation workflows
- ✅ Supports advanced users
- ✅ Enables integration with other tools
- ✅ Improves developer experience

**Low Priority (P4-P5):**
- ✅ Future-proofs codebase
- ✅ Improves documentation
- ✅ Reduces support burden

### Technical Value

**Testing Coverage:**
- Current: 90% integration, ~40% error scenarios
- After P1-P2: 100% integration, ~80% error scenarios
- After P3-P5: 100% integration, 90%+ error scenarios

**Code Quality:**
- Current: Production-ready, minimal tech debt
- After work: Production-excellent, zero tech debt

**Developer Experience:**
- Current: CLI-only, no programmatic support
- After work: CLI + programmatic API, full TypeScript support

---

## Conclusion

The CLI test suite is currently at **A- (8.5/10)** with excellent foundations:
- ✅ Consistent patterns across all commands
- ✅ Zero technical debt
- ✅ 90% integration coverage
- ✅ Production-ready quality

To achieve **A+ (9/10)**, complete:
- 🎯 **Minimum viable:** P1-P2 (6-8 hours)
  - 100% integration coverage
  - Comprehensive error handling

To achieve **A+ (9.5/10)**, complete:
- 🎯 **Full A+:** All priorities (15-19 hours)
  - Everything above
  - Programmatic usage support
  - Complete documentation

The test suite already provides strong confidence for production use. The additional work would move from "production-ready" to "production-excellent" with full programmatic API support.

**Recommended approach:** Start with P1-P2 for immediate A grade, then incrementally add P3-P5 based on user demand for programmatic usage.
