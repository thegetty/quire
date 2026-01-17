# Test Mocking Strategy Evaluation

## Executive Summary

**Current State:** Integration tests (*.test.js) rely heavily on mocking, using in-memory file systems (memfs) and stubbed dependencies for all external operations. This creates a **test strategy problem** rather than an architectural flaw.

**Key Finding:** Integration tests are currently functioning as "unit tests with mocked integration points" rather than true integration tests. They verify command logic but don't test actual integration with file systems, external commands, or libraries.

**Grade: C+ (Significant room for improvement)**

**Recommendation:** Introduce a **hybrid testing strategy** with:
1. Keep current *.spec.js as contract tests (A- grade, working well)
2. Refactor *.test.js to use real file systems with temporary directories
3. Add selective mocking only for expensive/external operations
4. Distinguish between "integration tests" and "isolated unit tests"

---

## Testing Hierarchy Analysis

### Current Test Structure

```
Unit Tests (*.spec.js)
├─ Test: Public API contract with Commander.js
├─ Mocking: None (tests registered command instances)
├─ Grade: A- (Working well)
└─ Coverage: 10/10 commands (100%)

Integration Tests (*.test.js)
├─ Test: Command behavior with dependencies
├─ Mocking: HEAVY (memfs, logger, all external calls)
├─ Grade: C+ (Too much mocking)
└─ Coverage: 10/10 commands (100%)

E2E Tests (/_tests/publication.spec.js)
├─ Test: Full publication build with browser validation
├─ Mocking: Minimal (only browser environment)
├─ Grade: B+ (Good coverage, but only one E2E test file)
└─ Coverage: Full publication workflow
```

### The Gap

**What's missing:** True integration tests that:
- Use real file systems (with temporary directories)
- Execute actual commands (where feasible)
- Test real file I/O operations
- Verify actual error conditions
- Test cross-platform file path handling

---

## Mock Analysis by Test File

### 1. info.test.js (Created recently)

**Mocks used:**
- `mockLogger` - All logging methods stubbed
- `mockConfig` - Configuration system stubbed
- `mockTestcwd` - Project validation stubbed
- `mockExecaCommand` - External commands (`quire --version`, `npm --version`) stubbed
- `mockOs` - Operating system calls stubbed
- `mockFs` - File system (readFileSync, writeFileSync, existsSync) stubbed

**What's being tested:**
- Command calls the right functions in the right order
- Debug flag controls output
- Error handling for missing/malformed files
- Version information display logic

**What's NOT being tested:**
- Actual file reading from real `.quire-version` file
- Actual npm/quire command execution
- Actual file writing on disk
- Real file system errors (permissions, disk space, etc.)
- Cross-platform path handling

**Assessment:** ⚠️ **Over-mocked**
- These are "logic tests" not "integration tests"
- Should use real file system with temp directories
- Should test actual config file parsing
- Logger mocking prevents verifying actual output

**Recommendation:**
```javascript
// Instead of mocking fs entirely, use real temp directory:
test.beforeEach(async (t) => {
  t.context.tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'quire-test-'))
  t.context.versionFile = path.join(t.context.tmpDir, '.quire-version')

  // Write real test files
  await fs.writeFile(t.context.versionFile, JSON.stringify({
    cli: '1.0.0-rc.33',
    starter: 'https://github.com/thegetty/quire-starter-default'
  }))
})

test.afterEach.always(async (t) => {
  // Cleanup real files
  await fs.rm(t.context.tmpDir, { recursive: true, force: true })
})
```

---

### 2. conf.test.js

**Mocks used:**
- `mockLogger` - All logging stubbed
- `mockConfig` - Entire config store stubbed with fake data

**What's being tested:**
- Config display logic
- Internal config value filtering (debug flag)
- Logger call patterns

**What's NOT being tested:**
- Actual config file reading from disk
- Real Configstore behavior
- Config persistence
- Config file corruption handling

**Assessment:** ⚠️ **Over-mocked**
- Config behavior should use real Configstore with temp file
- Logger output should be verifiable

**Recommendation:**
```javascript
// Use real Configstore with temp directory
import Configstore from 'configstore'

test.beforeEach((t) => {
  t.context.tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'quire-test-'))
  t.context.config = new Configstore('quire-test', {}, {
    configPath: path.join(t.context.tmpDir, 'config.json')
  })
})
```

---

### 3. build.test.js

**Mocks used:**
- `memfs` - Entire file system in-memory
- `mockEleventyCli` - Eleventy CLI execution stubbed
- `mockEleventyApi` - Eleventy API stubbed
- `mockClean` - Clean helper stubbed
- `mockTestcwd` - Project validation stubbed
- `mockLogger` - All logging stubbed

**What's being tested:**
- Command chooses correct Eleventy interface (CLI vs API)
- Options passed correctly to Eleventy
- preAction calls clean with correct params

**What's NOT being tested:**
- Actual Eleventy builds
- Real file system operations during build
- Build output file creation
- File permission handling
- Build failure scenarios with real errors

**Assessment:** ⚠️ **Over-mocked**
- Using memfs prevents testing real file system behavior
- Can't verify actual build artifacts
- Misses real-world build issues

**Trade-off consideration:**
- Eleventy builds are SLOW (10-30 seconds)
- Running real Eleventy in every test would make suite too slow
- **Solution:** Hybrid approach needed

**Recommendation:**
```javascript
// For fast tests: Mock Eleventy but use real file system
test('build command should create output directory', async (t) => {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'quire-build-'))

  // Mock Eleventy to just create output
  const mockEleventy = {
    build: async () => {
      await fs.mkdir(path.join(tmpDir, '_site'), { recursive: true })
      await fs.writeFile(path.join(tmpDir, '_site/index.html'), '<html>...</html>')
    }
  }

  // Use real file system
  const outputExists = await fs.pathExists(path.join(tmpDir, '_site'))
  t.true(outputExists)

  await fs.rm(tmpDir, { recursive: true })
})

// For slow tests: Mark as @slow and run real Eleventy
test.serial('@slow: build command should generate valid HTML', async (t) => {
  // Actually run Eleventy with a minimal test project
  // This can be in a separate test suite that runs less frequently
})
```

---

### 4. create.test.js

**Mocks used:**
- `memfs` - Entire file system in-memory
- `mockQuire.initStarter` - Starter template initialization stubbed
- `mockQuire.installInProject` - npm install stubbed
- `mockConfig` - Config system stubbed
- `mockLogger` - All logging stubbed

**Additional complexity:**
- Test at line 297 mocks Git operations with complex chainable stubs
- Simulates npm pack creating tarball in `.temp`

**What's being tested:**
- Correct method calls with correct arguments
- Default starter from config when not provided
- Options passed through correctly
- Error cleanup (removes project dir on failure)

**What's NOT being tested:**
- Actual Git clone operations
- Real npm install
- Actual file copying from starter template
- Real file system error conditions
- Cross-platform path handling

**Assessment:** ⚠️ **HEAVILY over-mocked**
- This is the most complex mocking scenario
- Tests are testing mock behavior more than real behavior
- The test at lines 303-336 is testing implementation details of mocking

**Critical issue at lines 297-336:**
```javascript
test('create command should remove temp dir and package artifacts', async (t) => {
  // NB: Passing `vol` here as fs because memfs only provides the cpSync there
  const { quire } = await esmock('../lib/quire/index.js', {
    'fs-extra': vol,  // Using memfs volume directly due to cpSync limitation
    '#lib/git/index.js': {
      add: () => ({ commit: sandbox.stub() }),  // Mock chains
      cwd: () => ({ rm: () => ({ catch: sandbox.stub() }) })
    },
    'execa': {
      execaCommand: sandbox.stub().withArgs(/npm pack/).callsFake(() => {
        fs.writeFileSync(path.join(projectRoot, '.temp', 'tarball.tgz'), '')
      })
    }
  })
})
```

**This test is problematic because:**
1. It's testing that cleanup happens by manually triggering cleanup behavior through mocks
2. The mock of `npm pack` simulates side effects
3. Git operations are mocked with nested chainable stubs
4. This doesn't test actual cleanup - it tests mock cleanup

**Recommendation:**
```javascript
// Use real file system with real temp directories
test('create command should create project from starter', async (t) => {
  const tmpParent = await fs.mkdtemp(path.join(os.tmpdir(), 'quire-test-'))
  const projectPath = path.join(tmpParent, 'my-project')

  // Mock only the expensive external operations (Git, npm)
  const mockQuire = {
    initStarter: async (starter, path) => {
      // Simulate starter by copying a fixture
      await fs.copy('./test/fixtures/minimal-starter', path)
      return '1.0.0'
    },
    installInProject: async (path, version) => {
      // Simulate npm install by just creating node_modules
      await fs.mkdir(path.join(path, 'node_modules'))
    }
  }

  // Run real command with real file system
  await command.action(projectPath, 'default', {})

  // Verify real files exist
  t.true(await fs.pathExists(projectPath))
  t.true(await fs.pathExists(path.join(projectPath, 'package.json')))
  t.true(await fs.pathExists(path.join(projectPath, 'content')))

  // Cleanup
  await fs.rm(tmpParent, { recursive: true })
})
```

---

### 5. preview.test.js

**Mocks used:**
- `memfs` - Entire file system in-memory
- `mockEleventyCli.serve` - Development server stubbed
- `mockEleventyApi.serve` - API server stubbed
- `mockTestcwd` - Project validation stubbed
- `mockLogger` - All logging stubbed

**What's being tested:**
- Command chooses correct server (CLI vs API)
- Port option passed correctly
- Quiet/verbose options passed correctly

**What's NOT being tested:**
- Actual server startup
- Port binding conflicts
- Server error conditions
- File watching behavior

**Assessment:** ⚠️ **Over-mocked**
- Could use real file system
- Server startup could be tested (then immediately shut down)

**Recommendation:**
```javascript
// Test with real file system and actual server startup
test.serial('preview command should start server on specified port', async (t) => {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'quire-preview-'))

  // Create minimal Quire project
  await setupMinimalProject(tmpDir)

  // Start server (with short timeout)
  const serverPromise = command.action({ port: 9999 }, command)

  // Wait for server to be ready
  await waitForPort(9999, { timeout: 5000 })

  // Verify server responds
  const response = await fetch('http://localhost:9999')
  t.is(response.status, 200)

  // Shutdown server
  await serverPromise.cancel() // or send SIGTERM

  // Cleanup
  await fs.rm(tmpDir, { recursive: true })
})
```

---

### 6. pdf.test.js

**Mocks used:**
- `memfs` - Entire file system in-memory
- `mockPdfGenerator` - PDF generation stubbed (simulates by creating file)
- `mockLibPdf` - PDF library factory stubbed
- `mockOpen` - File opening stubbed
- Mock YAML parser

**What's being tested:**
- Correct library selection (pagedjs vs prince)
- Config passed to PDF generator
- File opening with --open flag
- Missing build output handling (incomplete test at line 258)

**What's NOT being tested:**
- Actual PDF generation
- Real PDF file validity
- PrinceXML/Paged.js error conditions
- PDF file size/contents

**Assessment:** ⚠️ **Appropriately mocked** (with caveats)
- PDF generation is EXPENSIVE (5-30 seconds)
- Real PDF generation should be in E2E tests, not integration tests
- BUT: File system should be real

**Recommendation:**
```javascript
// Use real file system, mock only PDF generation
test('pdf command should create PDF file', async (t) => {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'quire-pdf-'))

  // Create real input files
  await fs.mkdir(path.join(tmpDir, '_site'))
  await fs.writeFile(
    path.join(tmpDir, '_site/pdf.html'),
    '<html><body>Test</body></html>'
  )

  // Mock only the expensive PDF generation
  const mockGenerator = async (input, covers, output) => {
    // Read real input file
    const html = await fs.readFile(input, 'utf-8')
    t.true(html.includes('Test'))

    // Write fake PDF (for speed)
    await fs.writeFile(output, '%PDF-1.4\nfake pdf')
  }

  // Run command
  await command.action({ lib: 'pagedjs' }, command)

  // Verify real output file exists
  const pdfExists = await fs.pathExists(path.join(tmpDir, '_pdf/test.pdf'))
  t.true(pdfExists)

  // Cleanup
  await fs.rm(tmpDir, { recursive: true })
})
```

---

### 7. version.test.js

**Mocks used:**
- `memfs` - In-memory file system
- `mockLogger` - All logging stubbed
- `mockTestcwd` - Project validation stubbed

**What's being tested:**
- preAction validates project
- Command accepts version argument
- Debug logging behavior
- Semver version handling
- Command definition correctness

**What's NOT being tested:**
- Actual version file updates
- Real file system interaction
- Actual logger output

**Assessment:** ⚠️ **Over-mocked for test scope**
- This command is primarily validation logic
- Could benefit from real file system
- But test scope is appropriate (verifying command structure)

**Recommendation:**
```javascript
// Use real file system for version tests
test('version command should update version file', async (t) => {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'quire-version-'))

  // Create real .quire-version file
  const versionFile = path.join(tmpDir, '.quire-version')
  await fs.writeFile(versionFile, JSON.stringify({ cli: '1.0.0-rc.30' }))

  // Mock only logger (to suppress output)
  const mockLogger = createMockLogger()

  // Run command
  await command.action('1.0.0-rc.33', {})

  // Verify real file was updated
  const updated = JSON.parse(await fs.readFile(versionFile, 'utf-8'))
  t.is(updated.cli, '1.0.0-rc.33')

  // Cleanup
  await fs.rm(tmpDir, { recursive: true })
})
```

---

## Problems Created by Over-Reliance on Mocks

### 1. **False Confidence**
- Tests pass but real operations might fail
- Example: memfs doesn't test cross-platform path separators
- Example: Mocked file system doesn't test permissions

### 2. **Testing Mock Behavior Instead of Real Behavior**
- create.test.js lines 297-336: Testing that mocks cleanup correctly
- Tests become coupled to mock implementation

### 3. **Missing Real Error Scenarios**
- Can't test "disk full" errors
- Can't test "permission denied" errors
- Can't test "file in use" errors on Windows
- Can't test race conditions with real file I/O

### 4. **Poor Test Maintainability**
- Complex mock setups with nested stubs
- Mock chains for Git operations: `add: () => ({ commit: stub() })`
- Brittle tests that break when implementation changes

### 5. **Can't Verify Actual Output**
- Logger is mocked, so can't see actual output
- Can't verify log formatting, colors, etc.
- Can't test that errors are helpful to users

### 6. **Missing Cross-Platform Issues**
- memfs uses forward slashes, missing Windows backslash issues
- Can't test Windows file locking behavior
- Can't test case-sensitivity differences (macOS vs Linux)

### 7. **Integration Gaps**
- Tests verify function calls but not actual integration
- Gap between integration tests and E2E tests is too large
- Example: create.test.js tests that `initStarter` is called, but not that it actually creates a working project

---

## Is This a Test Strategy Flaw or Architecture Flaw?

### Verdict: **TEST STRATEGY FLAW**

**Evidence that architecture is sound:**

1. **Commands are well-structured**
   - Clean separation of concerns
   - preAction for validation
   - action for execution
   - Clear Command base class pattern

2. **Dependencies are properly abstracted**
   - File system via fs-extra (mockable)
   - External commands via execa (mockable)
   - Logging via logger abstraction (mockable)
   - Config via Configstore (mockable)

3. **Commands are independently testable**
   - Each command has clear inputs and outputs
   - Side effects are isolated
   - Error handling is structured

4. **Integration points are clear**
   - Eleventy integration via #lib/11ty
   - PDF generation via #lib/pdf
   - Git operations via #lib/git
   - Starter templates via #lib/quire

**The architecture ENABLES good testing** - the problem is the test strategy doesn't take advantage of it.

### What Would Indicate an Architecture Problem?

If we saw:
- ❌ Tight coupling between commands (not present)
- ❌ Global state dependencies (not present)
- ❌ Inability to inject dependencies (not present - we're using esmock successfully)
- ❌ Commands that can't run in isolation (not present)
- ❌ Hard-coded file paths or dependencies (not present)
- ❌ Mixed concerns (UI, business logic, file I/O all in one place) (not present)

**None of these are present.** The architecture is actually quite testable.

---

## Recommendations for Improvement

### 1. **Create Test Fixtures Directory**

```bash
packages/cli/test/fixtures/
├── minimal-project/         # Minimal valid Quire project
│   ├── content/
│   │   └── _data/
│   │       └── config.yaml
│   ├── package.json
│   └── .quire-version
├── invalid-project/         # Project with validation errors
├── starter-template/        # Minimal starter template
└── config-samples/          # Sample config files
    ├── valid-config.json
    ├── malformed-config.json
    └── empty-config.json
```

### 2. **Introduce Test Utilities**

```javascript
// packages/cli/test/utils/test-project.js

import fs from 'fs-extra'
import os from 'node:os'
import path from 'node:path'

/**
 * Create a temporary test project from a fixture
 */
export async function createTestProject(fixtureName = 'minimal-project') {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'quire-test-'))
  const fixturePath = path.join(__dirname, '../fixtures', fixtureName)

  await fs.copy(fixturePath, tmpDir)

  return {
    path: tmpDir,
    cleanup: async () => {
      await fs.rm(tmpDir, { recursive: true, force: true })
    }
  }
}

/**
 * Create temporary directory with cleanup
 */
export async function createTempDir(prefix = 'quire-test-') {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), prefix))

  return {
    path: tmpDir,
    cleanup: async () => {
      await fs.rm(tmpDir, { recursive: true, force: true })
    }
  }
}

/**
 * Mock logger that captures output for assertions
 */
export function createTestLogger() {
  const output = {
    info: [],
    error: [],
    warn: [],
    debug: [],
    log: []
  }

  return {
    info: (...args) => output.info.push(args),
    error: (...args) => output.error.push(args),
    warn: (...args) => output.warn.push(args),
    debug: (...args) => output.debug.push(args),
    log: (...args) => output.log.push(args),
    output
  }
}
```

### 3. **Refactor Integration Tests to Use Real File System**

**Example: info.test.js refactored**

```javascript
import test from 'ava'
import esmock from 'esmock'
import { createTestProject, createTestLogger } from '../test/utils/test-project.js'

test('info command should display project version information', async (t) => {
  // Create real test project
  const project = await createTestProject('minimal-project')

  // Use test logger (captures but doesn't suppress output)
  const logger = createTestLogger()

  // Mock only expensive external commands
  const mockExecaCommand = (cmd) => {
    if (cmd === 'quire --version') return { stdout: '1.0.0-rc.33' }
    if (cmd === 'npm --version') return { stdout: '10.2.4' }
    throw new Error(`Unexpected command: ${cmd}`)
  }

  // Import command with minimal mocking
  const InfoCommand = await esmock('./info.js', {
    '#src/lib/logger.js': { default: logger },
    'execa': { execaCommand: mockExecaCommand }
  })

  const command = new InfoCommand()
  command.config = {
    get: () => path.join(project.path, '.quire-version')
  }

  // Run command in real project directory
  process.chdir(project.path)
  await command.action({}, {})

  // Verify real output
  t.true(logger.output.info.some(args =>
    args[0].includes('quire-cli') && args[0].includes('1.0.0-rc.33')
  ))

  // Cleanup
  await project.cleanup()
})
```

### 4. **Distinguish Integration Test Types**

Create two types of integration tests:

**Type A: Fast Integration Tests** (current *.test.js)
- Use real file system with temp directories
- Mock expensive operations (Eleventy builds, PDF generation, npm install)
- Run on every commit
- ~1-5 seconds per test

**Type B: Slow Integration Tests** (new *.integration.js)
- Use real file system
- Run SOME real operations (small Eleventy builds, real npm operations)
- Run on PR or manually
- ~10-60 seconds per test

```javascript
// build.test.js - Fast integration test
test('build command should create output directory', async (t) => {
  // Uses real FS, mocks Eleventy
})

// build.integration.js - Slow integration test
test.serial('@slow: build command should generate valid site', async (t) => {
  // Uses real FS, runs real (small) Eleventy build
})
```

### 5. **Add Test Markers**

```javascript
// package.json
{
  "scripts": {
    "test": "ava",
    "test:unit": "ava '**/*.spec.js'",
    "test:integration": "ava '**/*.test.js'",
    "test:integration:slow": "ava '**/*.integration.js'",
    "test:all": "npm run test:unit && npm run test:integration && npm run test:integration:slow"
  }
}
```

### 6. **Update Testing Documentation**

Add to `docs/testing-commands.md`:

```markdown
## Test File Types

### Contract Tests (*.spec.js)
- Test public API and Commander.js integration
- No mocking
- Fast (~100ms per test)
- Run: `npm run test:unit`

### Integration Tests (*.test.js)
- Test command behavior with real file system
- Mock expensive operations (builds, external commands)
- Medium speed (~1-5s per test)
- Run: `npm run test:integration`

### Slow Integration Tests (*.integration.js)
- Test with more real operations
- Run small real builds
- Slow (~10-60s per test)
- Run: `npm run test:integration:slow`

### E2E Tests (/_tests/*.spec.js)
- Test full publication workflow
- Use real operations and browser testing
- Very slow (~2-5 minutes)
- Run: `npm run test:e2e`
```

### 7. **Example Refactoring: create.test.js**

**Before (over-mocked):**
```javascript
test('create command should initialize starter and install quire', async (t) => {
  const mockQuire = {
    initStarter: sandbox.stub().callsFake(async (starter, projectPath) => {
      fs.mkdirSync(projectPath, { recursive: true })
      fs.writeFileSync(`${projectPath}/package.json`, '{}')
      return '1.0.0'
    }),
    installInProject: sandbox.stub().resolves()
  }
  // ... more mocking
})
```

**After (real FS, selective mocking):**
```javascript
test('create command should initialize starter and install quire', async (t) => {
  const tmpParent = await createTempDir('quire-create-')
  const projectPath = path.join(tmpParent.path, 'my-project')

  // Mock only expensive operations
  const mockQuire = {
    initStarter: async (starter, path) => {
      // Copy real fixture instead of stubbing
      await fs.copy('./test/fixtures/starter-template', path)
      return '1.0.0'
    },
    installInProject: async (path) => {
      // Simulate npm install without actually running it
      await fs.mkdir(path.join(path, 'node_modules'))
      await fs.writeJson(path.join(path, 'package-lock.json'), {})
    }
  }

  await command.action(projectPath, 'default-starter', {})

  // Verify real files exist on real file system
  t.true(await fs.pathExists(projectPath), 'project directory should exist')
  t.true(await fs.pathExists(path.join(projectPath, 'content')), 'content dir should exist')
  t.true(await fs.pathExists(path.join(projectPath, 'package.json')), 'package.json should exist')

  const packageJson = await fs.readJson(path.join(projectPath, 'package.json'))
  t.truthy(packageJson.name, 'package.json should have name')

  await tmpParent.cleanup()
})
```

---

## Implementation Roadmap

### Phase 1: Infrastructure (2-3 hours)
- [ ] Create `packages/cli/test/fixtures/` directory
- [ ] Create minimal-project fixture
- [ ] Create starter-template fixture
- [ ] Create `packages/cli/test/utils/test-project.js` utilities
- [ ] Add test utilities to package.json imports

### Phase 2: Refactor Simple Commands (3-4 hours)
- [ ] Refactor conf.test.js (simplest - no external commands)
- [ ] Refactor version.test.js (simple file operations)
- [ ] Refactor info.test.js (file read + external commands)
- [ ] Update docs/testing-commands.md with new patterns

### Phase 3: Refactor Complex Commands (5-6 hours)
- [ ] Refactor build.test.js (mock Eleventy, real FS)
- [ ] Refactor preview.test.js (mock server, real FS)
- [ ] Refactor pdf.test.js (mock PDF gen, real FS)
- [ ] Refactor epub.test.js (mock EPUB gen, real FS)

### Phase 4: Refactor Most Complex (4-5 hours)
- [ ] Refactor create.test.js (most complex mocking)
- [ ] Refactor clean.test.js
- [ ] Refactor validate.test.js

### Phase 5: Add Slow Integration Tests (3-4 hours)
- [ ] Create build.integration.js with real small Eleventy build
- [ ] Create create.integration.js with real git/npm operations
- [ ] Add CI job for slow integration tests (run on PR only)

### Phase 6: Documentation (1-2 hours)
- [ ] Update docs/testing-commands.md with new strategy
- [ ] Add test/README.md explaining test types
- [ ] Document when to mock vs use real operations
- [ ] Add examples of good test patterns

**Total effort:** 18-24 hours

**Outcome:**
- Integration tests that actually test integration
- Better confidence in real-world behavior
- Faster debugging (failures show real errors)
- Improved test maintainability

---

## Comparison: Current vs Proposed

| Aspect | Current (Mocked) | Proposed (Real FS) |
|--------|------------------|-------------------|
| **File System** | memfs (in-memory) | Real temp directories |
| **Speed** | Very fast (~50-200ms) | Fast (~500ms-2s) |
| **Confidence** | Low (tests mocks) | High (tests reality) |
| **Error Testing** | Limited to mocked errors | Real FS errors |
| **Cross-platform** | Misses path issues | Catches real issues |
| **Maintainability** | Complex mock setups | Simpler, clearer tests |
| **Debugging** | Hard (mock behavior) | Easy (real failures) |
| **CI Time** | ~5-10 seconds total | ~30-60 seconds total |

**Trade-off:** ~40-50 seconds slower CI, but much higher quality tests.

---

## Conclusion

### Key Findings

1. **Architecture is sound** - Commands are well-structured and testable
2. **Test strategy needs improvement** - Too much mocking reduces confidence
3. **Clear path forward** - Use real file systems with selective mocking
4. **Manageable effort** - ~18-24 hours to refactor all integration tests
5. **High impact** - Catches real bugs, easier debugging, better maintainability

### Recommended Action

**Start with Phase 1-2** (5-7 hours):
1. Create test utilities and fixtures
2. Refactor 3 simple command tests (conf, version, info)
3. Document new patterns
4. Evaluate impact before proceeding to Phase 3-6

This gives you:
- Proof of concept
- Reusable utilities for remaining tests
- Clear pattern for team to follow
- Data on actual speed/quality trade-offs

### Final Grade After Refactoring

**Current:** C+ (Heavy mocking, tests logic not integration)
**After Phase 1-4:** A- (Real FS, selective mocking, true integration testing)
**After Phase 5-6:** A (Adding slow integration tests fills remaining gaps)

---

## Questions for Discussion

1. **CI time budget:** Is 30-60 seconds for integration tests acceptable?
2. **Slow tests:** Should slow integration tests (Phase 5) run on every PR or only manually/nightly?
3. **Test fixtures:** Should we commit fixture projects or generate them on the fly?
4. **Priority:** Which commands should be refactored first based on bug history?
5. **Backwards compatibility:** Should we keep old mocked tests temporarily during transition?
