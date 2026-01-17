# Test Mocking Strategy Evaluation (REVISED)

## Critical Update

**Initial evaluation was incomplete.** After thorough investigation of E2E tests and the 11ty package, the mocking strategy requires a significantly different assessment.

---

## Complete Test Coverage Hierarchy

### 1. **Unit Tests - Command Contracts** (*.spec.js in packages/cli/src/commands/)
- **Location:** `packages/cli/src/commands/*.spec.js`
- **Count:** 51 tests across 10 commands
- **Mocking:** None (tests registered Commander.js instances)
- **Purpose:** Verify command public API and registration
- **Grade:** A- (Working well)
- **Speed:** ~100ms per test

### 2. **Integration Tests - Command Logic** (*.test.js in packages/cli/src/commands/)
- **Location:** `packages/cli/src/commands/*.test.js`
- **Count:** 68 tests across 10 commands
- **Mocking:** HEAVY (memfs, logger, all external dependencies)
- **Purpose:** Verify command behavior with isolated logic
- **Grade:** B+ (See analysis below)
- **Speed:** ~50-200ms per test

### 3. **E2E Tests - Full Build Workflow** (_tests/e2e-test.mjs) ⚠️ **MISSING FROM INITIAL EVALUATION**
- **Location:** `/_tests/e2e-test.mjs`
- **Count:** 3 serial tests
- **Mocking:** NONE - Uses real quire CLI commands
- **Purpose:** Verify full publication build workflow
- **What it actually tests:**
  ```javascript
  test.serial('Create publication and build site/pdf/epub', async (t) => {
    // Run REAL commands:
    await execa('quire', ['new', '--quire-path', eleventyPath, 'test-publication'])
    await execa('quire', ['build'])  // Real Eleventy build
    await execa('quire', ['pdf'])    // Real PDF generation
    await execa('quire', ['epub'])   // Real EPUB generation

    // Verify real files exist
    assert(fs.existsSync('_site/_assets/downloads/publication.pdf'))
    assert(fs.existsSync('epubjs.epub'))
  })
  ```
- **Grade:** A (Excellent coverage of real integration)
- **Speed:** ~2-5 minutes (360s timeout, 30m in CI)

### 4. **E2E Tests - Browser Validation** (_tests/publication.spec.js)
- **Location:** `/_tests/publication.spec.js`
- **Count:** Dynamic (one test per sitemap URL, ~20-40 tests)
- **Mocking:** Minimal (browser environment only)
- **Purpose:** Verify rendered HTML quality
- **Tests:** Page titles, image URLs (no 404s), IIIF rendering, lightbox behavior
- **Grade:** A- (Good coverage, but doesn't test build process)
- **Speed:** ~30-60 seconds for all pages

### 5. **11ty Package Tests** (packages/11ty/_tests/*.spec.js)
- **Location:** `packages/11ty/_tests/*.spec.js`
- **Count:** 3 test files (pdf-transform, epub-transform, shortcodes)
- **Mocking:** Moderate (stubs Eleventy environment)
- **Purpose:** Test transforms, shortcodes, and plugins
- **Grade:** B+ (Good unit coverage, but incomplete)
- **Speed:** ~200-500ms per test

### 6. **Lib Module Tests** ❌ **COMPLETELY MISSING**
- **Expected location:** `packages/cli/src/lib/**/*.test.js`
- **What exists:** ZERO tests for lib modules
- **What's missing:** Tests for:
  - `#lib/11ty` - Eleventy CLI/API wrappers
  - `#lib/pdf` - PDF generation (PrinceXML, Paged.js)
  - `#lib/epub` - EPUB generation
  - `#lib/git` - Git operations
  - `#lib/quire` - Starter template initialization
  - `#lib/npm` - npm operations
  - `#lib/conf` - Configuration management
  - `#lib/reporter` - Progress reporting
  - `#lib/i18n` - Internationalization
- **Grade:** F (Non-existent)

---

## Revised Assessment of Command Test Mocking

### Initial Assessment Was WRONG ❌

**I incorrectly concluded:** "Integration tests (*.test.js) are over-mocked and should use real file systems"

**Actual situation:** The mocking in *.test.js is **appropriately scoped** BECAUSE:

1. **E2E tests already cover real integration** (`/_tests/e2e-test.mjs`)
   - Real `quire new` command execution
   - Real `quire build` with Eleventy
   - Real `quire pdf` with PrinceXML/Paged.js
   - Real file system operations
   - Real external command execution

2. **Command *.test.js serve a different purpose**
   - They test command LOGIC, not integration
   - They verify correct function calls with correct parameters
   - They test error handling at the command level
   - They test option parsing and validation
   - Fast feedback (seconds vs minutes)

3. **The test pyramid is actually well-structured:**
   ```
   E2E Browser Tests (40 tests, ~60s)
   ────────────────────────────────────
   E2E Build Tests (3 tests, ~5min)
   ────────────────────────────────────
   Integration Tests (68 tests, ~30s)
   ────────────────────────────────────
   Contract Tests (51 tests, ~10s)
   ────────────────────────────────────
   ```

### What I Missed in Initial Evaluation

1. **Didn't discover `/_tests/e2e-test.mjs`**
   - Only saw `publication.spec.js` which tests browser behavior
   - Assumed E2E tests only tested pre-built output
   - Missed that E2E tests ACTUALLY BUILD publications from scratch

2. **Didn't check AVA configuration**
   - AVA config specifies `files: ["./_tests/*-test.mjs"]`
   - Would have found the build tests immediately

3. **Didn't check CI configuration thoroughly**
   - Lines 168-180 in `.circleci/build.yml` show:
     ```yaml
     - run:
         name: Run end-to-end tests
         command: npm run test:e2e
     - persist_to_workspace:
         paths:
           - test-publication/_site
           - test-publication-pathname/_site
     ```
   - This proves E2E tests BUILD the publications

4. **Didn't analyze package.json test script**
   - `"test:e2e": "ava --tap --timeout 360s"` with 360s timeout
   - Should have been obvious these are slow build tests

---

## REAL Gaps in Test Coverage

### Gap #1: No Lib Module Tests ❌❌❌ **CRITICAL**

**This is the ACTUAL missing piece.**

The lib modules do the heavy lifting, but have ZERO tests:

#### Missing: #lib/11ty tests
```javascript
// packages/cli/src/lib/11ty/index.js - NO TESTS
export const api = {
  build: async (options) => { /* Eleventy API integration */ },
  serve: async (options) => { /* Dev server */ }
}

export const cli = {
  build: async (options) => { /* Eleventy CLI wrapper */ },
  serve: async (options) => { /* Dev server */ }
}

// What should be tested:
// - API vs CLI mode selection
// - Option transformation
// - Error handling when Eleventy fails
// - Exit code handling
// - stdout/stderr capture
```

**Impact of missing tests:**
- If Eleventy API integration breaks, only E2E tests (5 min) catch it
- Can't test error scenarios (Eleventy failures, syntax errors, etc.)
- Can't verify option transformation correctness
- Hard to debug issues in Eleventy integration layer

#### Missing: #lib/pdf tests
```javascript
// packages/cli/src/lib/pdf/index.js - NO TESTS
export default function libPdf(library) {
  return async (input, covers, output) => {
    // Chooses between PrinceXML and Paged.js
    // Handles PDF generation configuration
    // Manages temp files and cleanup
  }
}

// What should be tested:
// - Library selection (prince vs pagedjs)
// - Config transformation
// - Error handling (missing PrinceXML, invalid HTML, etc.)
// - Temp file cleanup
// - Split PDF generation
```

**Impact of missing tests:**
- PDF generation errors only caught in E2E (5 min)
- Can't test library selection logic
- Can't verify config is passed correctly
- Can't test PDF failure modes

#### Missing: #lib/git tests
```javascript
// packages/cli/src/lib/git/index.js - NO TESTS
// Git operations for starter template initialization
// - Cloning
// - Branch management
// - Cleanup

// What should be tested:
// - Clone from various sources (GitHub, local, tarball)
// - Error handling (network failures, auth, etc.)
// - Branch selection
// - Git cleanup (removing .git, reinitialization)
```

**Impact of missing tests:**
- Git errors only caught in E2E or not at all
- Can't test network failure scenarios
- Can't verify cleanup behavior
- Hard to test different starter sources

#### Missing: #lib/quire tests
```javascript
// packages/cli/src/lib/quire/index.js - NO TESTS
export const quire = {
  initStarter: async (starter, projectPath, options) => {
    // Initializes starter template
    // Handles version compatibility
    // Sets up project structure
  },
  installInProject: async (projectPath, version, options) => {
    // npm install in project
    // Manages node_modules
    // Handles version constraints
  }
}

// What should be tested:
// - Starter initialization from various sources
// - Version compatibility checking
// - npm install error handling
// - File structure validation
// - .quire-version file creation
```

**Impact of missing tests:**
- Project creation errors only caught in E2E
- Can't test version compatibility logic
- Can't verify npm install failure handling
- Hard to test starter template variations

#### Missing: #lib/epub, #lib/conf, #lib/npm, #lib/reporter, #lib/i18n tests

All of these modules have zero test coverage.

---

### Gap #2: Command *.test.js Don't Test Real Lib Module Integration

**Current:** Command tests mock lib modules entirely
```javascript
// build.test.js - Mocks the entire Eleventy integration
const mockEleventyCli = {
  build: sandbox.stub().resolves({ exitCode: 0 })
}

const BuildCommand = await esmock('./build.js', {
  '#lib/11ty/index.js': {
    cli: mockEleventyCli,  // Completely stubbed
    api: mockEleventyApi,  // Completely stubbed
  }
})
```

**Problem:** This tests command logic but NOT the integration with lib modules

**What's missing:** Tests that verify commands correctly integrate with lib modules
- Do options get transformed correctly?
- Are errors from lib modules handled properly?
- Does the command correctly choose between API/CLI modes?

---

### Gap #3: Limited E2E Error Scenario Coverage

**Current E2E tests verify happy path:**
- ✅ `quire new` succeeds
- ✅ `quire build` succeeds
- ✅ `quire pdf` succeeds
- ✅ `quire epub` succeeds
- ✅ Files are created

**What's missing in E2E:**
- ❌ Build failures (syntax errors, missing files)
- ❌ PDF generation failures (missing PrinceXML, HTML errors)
- ❌ EPUB generation failures
- ❌ Network failures during `quire new`
- ❌ Permission errors
- ❌ Disk space errors
- ❌ Invalid project structures

---

## Revised Recommendations

### Priority 1: Add Lib Module Tests ⭐⭐⭐ **CRITICAL**

**Effort:** 15-20 hours
**Impact:** HIGH - Fills the biggest gap in test coverage

Create integration tests for lib modules:

```javascript
// packages/cli/src/lib/11ty/index.test.js

import test from 'ava'
import { api, cli } from './index.js'
import fs from 'fs-extra'
import os from 'node:os'
import path from 'node:path'

test('api.build should build a minimal Eleventy project', async (t) => {
  // Create real temp directory with minimal Eleventy project
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'quire-11ty-test-'))

  // Create minimal .eleventy.js and content
  await fs.writeFile(path.join(tmpDir, '.eleventy.js'), `
    module.exports = function(eleventyConfig) {
      return { dir: { input: ".", output: "_site" } }
    }
  `)
  await fs.writeFile(path.join(tmpDir, 'index.md'), '# Test')

  // Run real Eleventy build via API
  const result = await api.build({
    input: tmpDir,
    output: path.join(tmpDir, '_site')
  })

  // Verify real output
  t.true(await fs.pathExists(path.join(tmpDir, '_site/index.html')))

  // Cleanup
  await fs.rm(tmpDir, { recursive: true })
})

test('api.build should handle Eleventy errors', async (t) => {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'quire-11ty-test-'))

  // Create invalid .eleventy.js
  await fs.writeFile(path.join(tmpDir, '.eleventy.js'), 'INVALID SYNTAX{')

  // Should throw or return error
  await t.throwsAsync(
    () => api.build({ input: tmpDir }),
    { message: /syntax/ }
  )

  await fs.rm(tmpDir, { recursive: true })
})

test('cli.build should pass options to Eleventy CLI', async (t) => {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'quire-11ty-test-'))

  await setupMinimalProject(tmpDir)

  const result = await cli.build({
    input: tmpDir,
    quiet: true,
    dryrun: true
  })

  // Verify options were passed (check stdout or result)
  t.truthy(result)

  await fs.rm(tmpDir, { recursive: true })
})
```

**Files to create:**
1. `packages/cli/src/lib/11ty/index.test.js` (Eleventy integration)
2. `packages/cli/src/lib/pdf/index.test.js` (PDF generation)
3. `packages/cli/src/lib/epub/index.test.js` (EPUB generation)
4. `packages/cli/src/lib/git/index.test.js` (Git operations)
5. `packages/cli/src/lib/quire/index.test.js` (Starter initialization)
6. `packages/cli/src/lib/npm/index.test.js` (npm operations)
7. `packages/cli/src/lib/conf/config.test.js` (Configuration)

**Test approach:**
- Use real file systems with temp directories
- Use real lib module code (no mocking)
- Mock only external binaries (PrinceXML, git for some tests)
- Create test fixtures (minimal projects, invalid projects, etc.)
- Test both happy path AND error scenarios

---

### Priority 2: Keep Command *.test.js As-Is ✅

**Verdict:** Current mocking in command tests is **appropriately scoped**

**Reasoning:**
1. E2E tests already verify real integration
2. Command tests verify command logic quickly (30s total)
3. Lib module tests (Priority 1) will fill the integration gap
4. Test pyramid is balanced

**Do NOT refactor** command tests to use real file systems. The current approach is correct given:
- E2E tests test real builds (slow but comprehensive)
- Command tests test logic (fast feedback)
- Lib tests (to be added) will test integration (medium speed)

---

### Priority 3: Add Lib Module Error Scenario Tests

**Effort:** 5-8 hours
**Impact:** MEDIUM - Improves confidence in error handling

Add error scenario tests to lib modules:

```javascript
// packages/cli/src/lib/pdf/index.test.js

test('PDF generation should handle missing PrinceXML gracefully', async (t) => {
  // Mock execaCommand to simulate PrinceXML not installed
  const mockExeca = () => {
    throw new Error('prince: command not found')
  }

  const libPdf = await esmock('./index.js', {
    'execa': { execaCommand: mockExeca }
  })

  const pdfGenerator = libPdf('prince')

  await t.throwsAsync(
    () => pdfGenerator('input.html', 'covers.html', 'output.pdf'),
    { message: /PrinceXML not found/ }
  )
})

test('PDF generation should handle invalid HTML', async (t) => {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'quire-pdf-test-'))

  // Create invalid HTML
  await fs.writeFile(path.join(tmpDir, 'input.html'), '<html BROKEN')

  const pdfGenerator = libPdf('pagedjs')

  await t.throwsAsync(
    () => pdfGenerator(
      path.join(tmpDir, 'input.html'),
      null,
      path.join(tmpDir, 'output.pdf')
    ),
    { message: /invalid HTML/ }
  )

  await fs.rm(tmpDir, { recursive: true })
})
```

---

### Priority 4: Add E2E Error Scenario Tests

**Effort:** 4-6 hours
**Impact:** MEDIUM - Verifies real-world failure handling

Add error scenario E2E tests:

```javascript
// _tests/e2e-errors.test.mjs

test.serial('quire build should fail gracefully with syntax errors', async (t) => {
  await execa('quire', ['new', 'test-error-pub'])
  process.chdir('test-error-pub')

  // Create invalid Eleventy config
  await fs.writeFile('.eleventy.js', 'INVALID SYNTAX{')

  const error = await t.throwsAsync(
    () => execa('quire', ['build'])
  )

  t.true(error.stderr.includes('syntax error'))

  process.chdir('..')
  await fs.rm('test-error-pub', { recursive: true })
})

test.serial('quire pdf should fail when build is missing', async (t) => {
  await execa('quire', ['new', 'test-no-build'])
  process.chdir('test-no-build')

  const error = await t.throwsAsync(
    () => execa('quire', ['pdf'])
  )

  t.true(error.stderr.includes('quire build'))

  process.chdir('..')
  await fs.rm('test-no-build', { recursive: true })
})
```

---

## Updated Test Coverage Summary

### Current State

| Test Layer | Tests | Coverage | Speed | Grade |
|------------|-------|----------|-------|-------|
| Command Contracts | 51 | 100% | ~10s | A- |
| Command Logic | 68 | 100% | ~30s | B+ |
| E2E Builds | 3 | Happy path only | ~5min | B+ |
| E2E Browser | ~30 | Rendered output | ~60s | A- |
| 11ty Unit | ~20 | Transforms/shortcodes | ~5s | B+ |
| **Lib Modules** | **0** | **0%** | **N/A** | **F** |

**Overall Grade: C+** (due to missing lib module tests)

### After Implementing Recommendations

| Test Layer | Tests | Coverage | Speed | Grade |
|------------|-------|----------|-------|-------|
| Command Contracts | 51 | 100% | ~10s | A- |
| Command Logic | 68 | 100% | ~30s | A- |
| **Lib Modules** | **~40** | **Happy + errors** | **~2min** | **A** |
| E2E Builds | ~10 | Happy + errors | ~8min | A |
| E2E Browser | ~30 | Rendered output | ~60s | A- |
| 11ty Unit | ~20 | Transforms/shortcodes | ~5s | B+ |

**Overall Grade: A-** (comprehensive coverage at all layers)

**Total test suite time:**
- Current: ~6-7 minutes
- After: ~11-13 minutes
- Trade-off: +5 minutes for MUCH higher confidence

---

## Key Insights from Revised Analysis

### What I Got Wrong

1. ❌ **"Command tests are over-mocked"**
   - WRONG: They're appropriately scoped given E2E coverage
   - Command tests verify logic, not integration
   - Fast feedback is valuable

2. ❌ **"Need to refactor command tests to use real file systems"**
   - WRONG: This would duplicate E2E coverage
   - Would make tests slower without adding value
   - Test pyramid would be inverted

3. ❌ **"E2E tests only test browser behavior"**
   - WRONG: Missed `e2e-test.mjs` entirely
   - E2E tests DO build full publications
   - They run real quire commands

### What I Got Right

1. ✅ **Identified that integration gaps exist**
   - RIGHT: But the gap is lib modules, not commands
   - Lib modules have ZERO tests
   - This is the critical missing piece

2. ✅ **Suggested using real file systems for integration tests**
   - RIGHT: But for lib modules, not commands
   - Lib module tests should use real temp dirs
   - Should test real integration with Eleventy, PDF tools, etc.

3. ✅ **Identified need for error scenario coverage**
   - RIGHT: Error scenarios are under-tested
   - Should be added to both lib and E2E tests
   - Critical for production readiness

---

## Answers to Your Question

> "Does this evaluation take into consideration the existing end-to-end tests, which test full builds of the site and pdf, and/or the absence of tests for the cli/lib modules?"

### Answer: NO (Initial Evaluation)

**What I missed:**
1. **E2E tests in `/_tests/e2e-test.mjs`** - Only found browser tests
2. **The E2E tests BUILD publications** - Thought they only tested pre-built output
3. **The actual test pyramid structure** - Didn't understand the layers
4. **The lib module gap** - Most critical finding

**Why I missed it:**
- Only searched for `*.spec.js` and `*.test.js` files
- Didn't check AVA config which specifies `*-test.mjs` files
- Didn't thoroughly read CI config
- Made assumptions about test structure without verification

### Answer: YES (Revised Evaluation)

**What's actually missing:**
1. ✅ **E2E tests EXIST and test full builds** - They're comprehensive
2. ✅ **Lib module tests are COMPLETELY ABSENT** - This is the real gap
3. ✅ **Command test mocking is APPROPRIATE** - Given E2E coverage
4. ✅ **Error scenarios need more coverage** - Both lib and E2E

---

## Recommendation: Focus on Lib Modules

### Immediate Action (Week 1-2)

**Create lib module tests starting with most critical:**

1. **Day 1-2:** `lib/quire/index.test.js` (starter initialization)
   - Most complex logic
   - Version compatibility handling
   - Git/npm integration
   - ~6-8 hours

2. **Day 3-4:** `lib/11ty/index.test.js` (Eleventy integration)
   - API vs CLI mode
   - Option transformation
   - Error handling
   - ~5-6 hours

3. **Day 5-6:** `lib/pdf/index.test.js` (PDF generation)
   - Library selection
   - Config handling
   - Error scenarios
   - ~4-5 hours

4. **Day 7-8:** `lib/git/index.test.js`, `lib/epub/index.test.js`
   - Git operations
   - EPUB generation
   - ~3-4 hours each

**Total effort:** ~20-25 hours (2 weeks part-time)

### Long-term (Month 2)

1. Add remaining lib module tests (conf, npm, reporter, i18n)
2. Add E2E error scenario tests
3. Improve 11ty package test coverage

---

## Conclusion

**The original evaluation was fundamentally flawed** due to:
1. Incomplete discovery of existing E2E tests
2. Misunderstanding of test pyramid structure
3. Incorrect diagnosis of where gaps exist

**The ACTUAL problem:**
- ❌ NOT over-mocking in command tests
- ✅ MISSING lib module tests entirely
- ✅ Lib modules are where integration happens
- ✅ Zero test coverage for critical integration code

**Correct path forward:**
1. **Keep command *.test.js as-is** (appropriately scoped)
2. **Add lib module tests** (fill the critical gap)
3. **Add error scenarios** (improve robustness)
4. **Keep E2E tests** (already excellent coverage)

**Revised overall grade:**
- **Current:** C+ (due to missing lib tests)
- **After Priority 1:** A- (comprehensive coverage)
- **After all priorities:** A (production-ready test suite)
