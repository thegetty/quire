# CLI Command Test Suite Evaluation

**Date:** 2026-01-09
**Evaluator:** Software Architect
**Focus:** Clarity, Coverage, Quality, Maintainability for Programmatic Usage

## Executive Summary

The Quire CLI test suite is in transition between two testing philosophies. While the integration tests (*.test.js) are well-designed with modern mocking patterns, the contract tests (*.spec.js) are inconsistent - only 1 out of 10 follows the new pattern of testing the registered Commander.js API.

**Overall Grade: B-**
- **Clarity:** C (Mixed patterns, inconsistent approach)
- **Coverage:** B (70% have integration tests, all have contract tests)
- **Quality:** B+ (Modern tooling, good mocking, but fragile assertions)
- **Maintainability:** C+ (Technical debt in 9/10 spec files)

## Current State Analysis

### Test Coverage Statistics

```
Total Commands: 10
├── Contract Tests (*.spec.js): 10/10 (100%)
├── Integration Tests (*.test.js): 7/10 (70%)
└── Missing Integration Tests: conf, info, version
```

### Test Code Metrics

- **Total Test Lines:** ~2,790 lines
- **Test Files:** 17 (10 spec + 7 test)
- **Test Frameworks:** AVA (test runner), Sinon (mocking), esmock (ES module mocking), memfs (filesystem mocking)

### Commands by Test Coverage

| Command | Contract Test | Integration Test | Notes |
|---------|--------------|------------------|-------|
| build | ✅ (old pattern) | ✅ (4 tests) | Full coverage |
| clean | ✅ (old pattern) | ✅ (4 tests) | Full coverage |
| conf | ✅ (old pattern) | ❌ Missing | Behavior tests in spec file |
| create | ✅ **NEW PATTERN** | ✅ (7 tests) | **Reference implementation** |
| epub | ✅ (old pattern) | ✅ (5 tests) | Full coverage |
| info | ✅ (old pattern) | ❌ Missing | Behavior tests in spec file |
| pdf | ✅ (old pattern) | ✅ (5 tests) | Full coverage |
| preview | ✅ (old pattern) | ✅ (4 tests) | Full coverage |
| validate | ✅ (old pattern) | ✅ (5 tests) | Full coverage |
| version | ✅ (old pattern) | ❌ Missing | Simple command, may not need |

## 1. Clarity Assessment: C

### Strengths ✅

1. **Clear test file naming convention**
   - `*.spec.js` = Contract/Interface tests
   - `*.test.js` = Integration/Behavior tests
   - Documented in [testing-commands.md](testing-commands.md)

2. **Excellent documentation for new pattern**
   - Comprehensive guide created
   - Clear purpose statement in file headers
   - Examples of what to test and what not to test

3. **Integration tests have consistent structure**
   - Standard beforeEach/afterEach pattern
   - Clear mocking setup
   - Descriptive test names

### Weaknesses ❌

1. **Inconsistent contract test patterns**
   ```javascript
   // OLD PATTERN (9/10 commands) - Tests internal implementation
   test('command should have a debug option', (t) => {
     const { command } = t.context
     const debugOption = command.options.find((opt) => opt[0] === '--debug')
     t.truthy(debugOption)
   })

   // NEW PATTERN (1/10 commands) - Tests registered Commander.js API
   test('registered command has correct options', (t) => {
     const { command } = t.context
     const debug = command.options.find((opt) => opt.long === '--debug')
     t.true(debug instanceof Option)
   })
   ```

2. **Mixing concerns in spec files**
   - `conf.spec.js` includes 5 behavior tests (serial tests that call action())
   - `info.spec.js` includes 2 behavior tests
   - Should be moved to integration tests

3. **Unclear test setup in old pattern**
   - Uses sinon to stub command.name method
   - Tests both stubbed and fresh instances
   - Inconsistent about what's being tested

### Impact on Programmatic Usage

**For developers importing commands:**
- ❌ Cannot rely on spec tests to understand the public API
- ❌ Unclear which properties/methods are stable vs internal
- ⚠️ Documentation says one thing, 90% of tests do another

## 2. Coverage Assessment: B

### Strengths ✅

1. **All commands have contract tests**
   - 100% command definition coverage
   - All options and arguments verified

2. **Critical commands have integration tests**
   - build, clean, create, epub, pdf, preview, validate (7/10)
   - These represent the core workflow commands

3. **Good error path coverage in integration tests**
   - create.test.js: Tests initStarter error handling
   - epub.test.js: Tests missing build output
   - pdf.test.js: Tests missing build output

### Gaps ❌

1. **Missing integration tests for 3 commands**
   - `conf` - Configuration management (low-risk, but should test filtering of internal keys)
   - `info` - System information display (low-risk, mostly read-only)
   - `version` - Version management (medium-risk, modifies project state)

2. **No programmatic API tests**
   - No tests for importing and using commands programmatically
   - No tests for command composition
   - No tests for automation scenarios

3. **No tests for command registration**
   - OLD pattern tests Command class instances directly
   - NEW pattern tests registered commands but only 1/10 implemented
   - No tests verifying dynamic command loading from [index.js](../src/commands/index.js:1)

### Recommendations

**Priority 1: Add integration tests**
```javascript
// conf.test.js - Move behavior tests from conf.spec.js
test('conf command should filter internal config keys by default', async (t) => {
  // Test that __internal__ keys are hidden
})

// version.test.js - Critical for programmatic usage
test('version command should update .quire-version file', async (t) => {
  // Test version switching behavior
})

// info.test.js - Verify system info gathering
test('info command should read version from .quire-version file', async (t) => {
  // Test reading project metadata
})
```

**Priority 2: Add programmatic usage tests**
```javascript
// programmatic-usage.test.js
test('commands can be instantiated and called programmatically', async (t) => {
  const BuildCommand = (await import('./build.js')).default
  const command = new BuildCommand()

  // Mock dependencies...
  await command.action({ verbose: true }, command)

  t.true(mockEleventy.called)
})
```

## 3. Quality Assessment: B+

### Strengths ✅

1. **Modern testing tools and patterns**
   - AVA for ES module support
   - esmock for clean ES module mocking
   - memfs for fast, isolated filesystem tests
   - sinon for function stubbing

2. **Good test isolation**
   - beforeEach/afterEach cleanup
   - In-memory filesystems prevent side effects
   - Sandbox pattern for stub management

3. **Comprehensive integration test scenarios**
   - create.test.js: 7 tests covering error handling, option passing, cleanup
   - build.test.js: 4 tests covering CLI vs API modes, option passing
   - Tests verify the right things (behavior, not implementation)

4. **No global state pollution**
   - Tests create mocked logger instead of stubbing console globally
   - Each test gets fresh filesystem via memfs

### Weaknesses ❌

1. **Fragile assertions in old pattern spec tests**
   ```javascript
   // ❌ FRAGILE: Tests array indices
   const debugOption = command.options.find((opt) => opt[0] === '--debug')

   // ❌ FRAGILE: Tests intermediate format
   const eleventyOption = command.options.find((opt) => opt[0] && opt[0].includes('--11ty'))
   t.is(eleventyOption[0], '--11ty <module>')
   t.is(eleventyOption[2], 'cli') // magic index
   ```

2. **Redundant test setup**
   - Old pattern creates fresh command in some tests, uses stubbed one in others
   - Unclear when to use which
   - Example from build.spec.js:
     ```javascript
     test.beforeEach((t) => {
       t.context.command = new BuildCommand()
       t.context.command.name = t.context.sandbox.stub().returns('build')
     })

     test('command should be instantiated with correct definition', (t) => {
       const command = new BuildCommand() // Different instance!
       t.is(command.name, 'build')
     })
     ```

3. **Inconsistent arrow function style**
   - NEW pattern: Always uses parentheses `(cmd) =>`
   - OLD pattern: Mixed `cmd =>` and `(cmd) =>`
   - Documented standard not enforced

4. **No TypeScript types**
   - No type definitions for Command class
   - No type definitions for programmatic API
   - Makes programmatic usage harder to discover

### Impact on Programmatic Usage

**For developers importing commands:**
- ❌ No type hints for method signatures
- ❌ No documented programmatic API examples
- ✅ Integration tests show how to mock dependencies (useful!)

## 4. Maintainability Assessment: C+

### Strengths ✅

1. **Excellent documentation for new pattern**
   - [testing-commands.md](testing-commands.md) is comprehensive
   - Clear migration guide from old to new pattern
   - Good examples of what to test

2. **Consistent integration test pattern**
   - All *.test.js files follow the same structure
   - Easy to copy and adapt for new commands
   - Clear separation of setup, execution, assertion

3. **Good test organization**
   - Tests colocated with commands
   - Clear naming convention
   - Easy to find related tests

### Weaknesses ❌

1. **90% of spec tests use deprecated pattern**
   - 9 out of 10 commands need refactoring
   - Creates inconsistency and confusion
   - Technical debt acknowledged but not addressed

2. **Behavior tests mixed into spec files**
   - conf.spec.js has 5 integration tests
   - info.spec.js has 2 integration tests
   - Violates documented separation of concerns

3. **No enforcement of standards**
   - Arrow function style not enforced
   - New pattern exists but not required
   - Documentation says one thing, codebase does another

4. **Duplication across old pattern tests**
   - Every spec file has same beforeEach boilerplate
   - Same sinon stubbing pattern repeated
   - Same "fresh command vs stubbed command" confusion

### Refactoring Effort Required

**To align all tests with new pattern:**

```
Estimated refactoring: 9 spec files × 30 minutes = 4.5 hours
  - build.spec.js: 8 tests → ~30 min
  - clean.spec.js: 6 tests → ~25 min
  - conf.spec.js: 8 tests (move 5 to .test.js) → ~40 min
  - epub.spec.js: 4 tests → ~20 min
  - info.spec.js: 6 tests (move 2 to .test.js) → ~35 min
  - pdf.spec.js: 4 tests → ~20 min
  - preview.spec.js: 6 tests → ~25 min
  - validate.spec.js: 4 tests → ~20 min
  - version.spec.js: 4 tests → ~20 min

Additional work:
  - Create 3 missing .test.js files: 1.5 hours
  - Add programmatic usage tests: 1 hour
  - Update documentation with examples: 0.5 hours

Total: ~7.5 hours
```

## Programmatic Usage Considerations

### Current State

The CLI is designed for **command-line usage**, not programmatic usage. There are no:
- Public API documentation
- Type definitions
- Programmatic usage examples
- Tests for importing and using commands

### What Programmatic Users Need

1. **Stable Public API**
   - Clear distinction between public and private methods
   - Documented method signatures
   - Promise-based async API

2. **Importable Commands**
   ```javascript
   import { BuildCommand } from '@thegetty/quire-cli'

   const build = new BuildCommand()
   await build.action({ verbose: true })
   ```

3. **Composable Workflows**
   ```javascript
   import { CreateCommand, BuildCommand, PdfCommand } from '@thegetty/quire-cli'

   const create = new CreateCommand()
   await create.action('./my-project', 'default-starter', {})

   process.chdir('./my-project')

   const build = new BuildCommand()
   await build.action({})

   const pdf = new PdfCommand()
   await pdf.action({ lib: 'prince' })
   ```

4. **Type Definitions**
   ```typescript
   interface CommandOptions {
     verbose?: boolean
     debug?: boolean
     quiet?: boolean
   }

   interface BuildOptions extends CommandOptions {
     '11ty'?: 'cli' | 'api'
     'dry-run'?: boolean
   }

   class BuildCommand {
     action(options: BuildOptions, command?: Command): Promise<void>
     preAction(command: Command): void
   }
   ```

### Current Gaps for Programmatic Usage

❌ **No stable API contract**
- Spec tests verify internal implementation, not public API
- No guarantee that `command.options` format won't change
- Method signatures not documented

❌ **No programmatic examples**
- All docs show CLI usage: `quire build --verbose`
- No examples of `import { BuildCommand }`
- No examples of composing commands

❌ **Commands depend on global state**
- Commands use `process.cwd()` implicitly
- Config is global singleton
- Logger is global singleton

❌ **No error handling conventions**
- Some commands throw errors
- Some commands log and exit
- Some commands return error codes
- Inconsistent for programmatic usage

### Recommendations for Programmatic Usage

**Priority 1: Stabilize Public API**
1. Finish migrating all spec tests to test registered Commander.js API
2. Document which methods/properties are public vs internal
3. Add JSDoc comments with examples

**Priority 2: Decouple from Global State**
```javascript
class BuildCommand {
  constructor(options = {}) {
    this.logger = options.logger || defaultLogger
    this.config = options.config || defaultConfig
    this.cwd = options.cwd || process.cwd()
  }
}
```

**Priority 3: Consistent Error Handling**
```javascript
class CommandError extends Error {
  constructor(message, code, details) {
    super(message)
    this.code = code
    this.details = details
  }
}

// In commands:
throw new CommandError('Build failed', 'BUILD_FAILED', { exitCode: 1 })
```

**Priority 4: Type Definitions**
- Add TypeScript types (d.ts files)
- Document all public methods
- Define option interfaces

## Recommendations by Priority

### High Priority (Block programmatic usage)

1. **Complete spec test migration** (4.5 hours)
   - Refactor 9 remaining spec files to test Commander.js API
   - Remove behavior tests from spec files
   - Enforce new pattern via linting or pre-commit hook

2. **Add missing integration tests** (1.5 hours)
   - conf.test.js
   - version.test.js
   - info.test.js

3. **Document public API** (2 hours)
   - Add JSDoc to Command base class
   - Document each command's public interface
   - Add programmatic usage examples

### Medium Priority (Improve quality)

4. **Add programmatic usage tests** (1 hour)
   - Test importing commands
   - Test composing commands
   - Test error handling

5. **Add type definitions** (2 hours)
   - Create index.d.ts
   - Type each command's options
   - Type Command base class

6. **Decouple from global state** (3 hours)
   - Inject logger, config, cwd
   - Make commands testable without mocking globals
   - Enable parallel command execution

### Low Priority (Nice to have)

7. **Add linting rules**
   - Enforce arrow function parentheses
   - Enforce test naming conventions
   - Enforce JSDoc on public methods

8. **Add integration test template**
   - Copier/template for new commands
   - Auto-generate boilerplate

9. **Add coverage reporting**
   - Track integration test coverage
   - Set minimum thresholds

## Specific Issues by File

### build.spec.js
- ❌ Tests internal option array format
- ❌ Inconsistent test setup (stubbed vs fresh instances)
- 🔧 **Fix:** Refactor to test registered Command from program.commands

### clean.spec.js
- ❌ Tests internal option array format
- 🔧 **Fix:** Refactor to test registered Command

### conf.spec.js
- ❌ Tests internal option array format
- ❌ **Mixes concerns:** Has 5 behavior tests (test.serial)
- 🔧 **Fix:** Refactor contract tests, move behavior tests to conf.test.js

### epub.spec.js
- ❌ Tests internal option array format
- 🔧 **Fix:** Refactor to test registered Command

### info.spec.js
- ❌ Tests internal option array format
- ❌ **Mixes concerns:** Has 2 behavior tests
- 🔧 **Fix:** Refactor contract tests, move behavior tests to info.test.js

### pdf.spec.js
- ❌ Tests internal option array format
- 🔧 **Fix:** Refactor to test registered Command

### preview.spec.js
- ❌ Tests internal option array format
- 🔧 **Fix:** Refactor to test registered Command

### validate.spec.js
- ❌ Tests internal option array format
- 🔧 **Fix:** Refactor to test registered Command

### version.spec.js
- ❌ Tests internal option array format
- ❌ **Missing integration test**
- 🔧 **Fix:** Refactor contract test, add version.test.js

## Conclusion

The Quire CLI test suite demonstrates **good fundamentals with significant technical debt**:

**Strengths:**
- Modern testing tools (AVA, esmock, memfs, sinon)
- Excellent integration test patterns
- Clear separation of concerns (in documentation)
- Good test isolation and cleanup

**Weaknesses:**
- 90% of contract tests use deprecated pattern
- Behavior tests mixed into contract tests
- No programmatic API documentation or tests
- No type definitions
- Commands coupled to global state

**For Programmatic Usage:**
The CLI is not currently designed for programmatic use. To enable this:
1. Complete spec test migration (proves API stability)
2. Add programmatic usage tests
3. Document public API with JSDoc
4. Add TypeScript type definitions
5. Decouple from global state

**Estimated effort to production-ready programmatic API:** ~15-20 hours

The foundation is solid, but the vision (testing public API) has only been implemented for 10% of commands. Completing the migration would significantly improve clarity, maintainability, and enable confident programmatic usage.
