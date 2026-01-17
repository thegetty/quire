# ADR: Reporter Module for CLI Progress Feedback

**Status:** Proposed
**Date:** 2026-01-19
**Decision Makers:** CLI Team

## Context

The Quire CLI has several long-running operations that provide minimal or no feedback to users:

| Command | Duration | Current Feedback |
|---------|----------|------------------|
| `quire new` | 30-120s | None (silent during git clone, npm install) |
| `quire build` | 10-60s | Single "Building site..." message |
| `quire pdf` | 10-30s | None |
| `quire epub` | 5-20s | None |

**Problem:** Users experience long periods of silence with no indication of progress, leading to:
- Uncertainty whether the command is working or frozen
- Premature Ctrl-C interrupts during legitimate operations
- Poor user experience, especially for non-technical users (Quire's primary audience: museum curators, editors, authors)

**Previous Attempt:** A `lib/reporter` module was started (commit `05128b0a`) but removed as "unimplemented" (commit `03f9d9a9`).

**Existing Infrastructure:**
- `ora` (^6.1.2) already installed in package.json
- `--progress` option pattern exists in `clean` command
- Logger abstraction in `lib/logger` provides consistent output handling

## Decision

Implement a **Reporter** singleton module (`lib/reporter/index.js`) using **ora** as the underlying spinner library, following the existing façade patterns (`lib/git`, `lib/npm`, `lib/logger`).

### Library Selection

#### Options Evaluated

| Library | Weekly Downloads | Bundle Size | Last Update | Maintenance |
|---------|-----------------|-------------|-------------|-------------|
| **ora** | 46.8M | 30.4 kB | 3 months ago | Active |
| cli-spinners | 37.7M | 33.2 kB | 2 months ago | Active |
| progress | 28.2M | — | 7 years ago | Dormant |
| cli-progress | 5.3M | 62.2 kB | 3 years ago | Minimal |
| listr2 | 19.5M | — | Active | Active |

#### Recommendation: **ora**

**Why ora over alternatives:**

1. **Already installed** - No new dependency, familiar to team
2. **Highest downloads** (46.8M/week) - Battle-tested, widely adopted
3. **Active maintenance** - Updated within 3 months
4. **Simple API** - Matches Quire's philosophy of minimal complexity
5. **Small bundle** (30.4 kB) - Lightweight
6. **Promise-friendly** - Works well with async operations

**Why not cli-spinners:**
- Only provides spinner frames, not a complete solution
- Actually a dependency of ora (ora uses it internally)

**Why not progress/cli-progress:**
- progress is unmaintained (7 years)
- cli-progress is over-engineered for our use case (multi-bar support unnecessary)
- cli-progress's last update was 3 years ago

**Why not listr2:**
- Over-engineered for simple spinner needs
- Designed for complex task lists with subtasks, retries, rollbacks
- 6 dependencies vs ora's minimal footprint
- Would require significant refactoring of existing command structure
- Better suited if we needed concurrent task visualization

### Architecture

```
bin/cli.js
    └── Commands use reporter directly

lib/reporter/index.js (singleton)
    ├── Exports: default Reporter instance
    ├── Wraps: ora spinner
    └── Respects: --quiet, --json, --verbose flags

lib/installer/index.js ──┐
lib/11ty/api.js ─────────┼── import reporter directly
lib/pdf/index.js ────────┘
```

### API Design

```javascript
import reporter from '#lib/reporter/index.js'

// Simple spinner
reporter.start('Building site...')
// ... operation ...
reporter.succeed('Build complete')

// Multi-phase operation
reporter.start('Cloning starter project...')
await git.clone(starter, '.')
reporter.update('Initializing repository...')
await git.init()
reporter.update('Installing dependencies...')
await npm.install(cwd)
reporter.succeed('Project created')

// Error handling
reporter.start('Generating PDF...')
try {
  await generatePdf()
  reporter.succeed('PDF generated')
} catch (error) {
  reporter.fail('PDF generation failed')
  throw error
}

// Elapsed time display
reporter.start('Building site...', { showElapsed: true })
// Shows: ⠋ Building site... (12s)
```

### Reporter Class Interface

```javascript
class Reporter {
  /**
   * Start a new spinner
   * @param {string} text - Initial spinner text
   * @param {Object} options - Spinner options
   * @param {boolean} [options.showElapsed=false] - Show elapsed time
   */
  start(text, options = {})

  /**
   * Update spinner text (while running)
   * @param {string} text - New spinner text
   */
  update(text)

  /**
   * Mark operation as successful
   * @param {string} [text] - Optional success message (defaults to current text)
   */
  succeed(text)

  /**
   * Mark operation as failed
   * @param {string} [text] - Optional failure message (defaults to current text)
   */
  fail(text)

  /**
   * Mark operation as warning
   * @param {string} [text] - Optional warning message
   */
  warn(text)

  /**
   * Stop spinner without status indicator
   */
  stop()

  /**
   * Check if spinner is currently active
   * @returns {boolean}
   */
  isSpinning()

  /**
   * Configure reporter for current command context
   * @param {Object} options - Command options
   * @param {boolean} [options.quiet] - Suppress all output
   * @param {boolean} [options.json] - JSON output mode (suppress spinner)
   * @param {boolean} [options.verbose] - Verbose output
   */
  configure(options)
}
```

### Integration with Command Options

| Option | Reporter Behavior |
|--------|------------------|
| (default) | Show spinner with default text |
| `--quiet` | Suppress spinner entirely |
| `--json` | Suppress spinner (JSON output only) |
| `--verbose` | Show spinner + additional details |
| `--debug` | Show spinner + debug output |

### Implementation in Commands

```javascript
// create.js (quire new)
async action(projectPath, starter, options = {}) {
  reporter.configure(options)

  reporter.start('Cloning starter project...')
  const quireVersion = await installer.initStarter(starter, projectPath, options)

  reporter.update('Installing quire-11ty...')
  await installer.installInProject(projectPath, quireVersion, options)

  reporter.succeed(`Project created at ${projectPath}`)
}
```

```javascript
// build.js (quire build)
async action(options, command) {
  reporter.configure(options)

  reporter.start('Building site...', { showElapsed: true })
  await eleventy.build(options)
  reporter.succeed('Build complete')
}
```

## Alternatives Considered

### 1. No Abstraction (Direct ora Usage)

```javascript
import ora from 'ora'
const spinner = ora('Building...').start()
```

**Rejected because:**
- Repeated boilerplate across commands
- No central handling of `--quiet`/`--json` flags
- Harder to test (can't mock easily with esmock)
- Inconsistent with existing façade patterns

### 2. Logger Extension

```javascript
logger.spinner('Building...')
logger.spinnerSucceed('Build complete')
```

**Rejected because:**
- Mixes logging concerns with progress UI
- Logger is for messages; Reporter is for operation state
- Would complicate the already-clean logger abstraction

### 3. listr2 Task Lists

```javascript
const tasks = new Listr([
  { title: 'Clone starter', task: () => git.clone() },
  { title: 'Install deps', task: () => npm.install() },
])
await tasks.run()
```

**Rejected because:**
- Over-engineered for most Quire commands (single operations)
- Would require significant command refactoring
- Better suited for complex CLI tools with nested subtasks
- Only `quire new` has enough phases to justify task lists

### 4. Event-Based Progress

```javascript
installer.on('progress', (phase) => spinner.text = phase)
await installer.initStarter()
```

**Rejected because:**
- Requires refactoring all library modules
- More complex than direct calls
- Implicit flow harder to trace

## Consequences

### Positive

- **Better UX** - Users see operation progress, reducing perceived wait time
- **Consistent pattern** - Follows established façade patterns
- **Testable** - Can be mocked with esmock like other lib/ modules
- **Minimal overhead** - Uses already-installed `ora`
- **Non-breaking** - Opt-in addition, no changes to existing behavior

### Negative

- **Another abstraction** - One more module to maintain
- **Spinner overhead** - Small CPU cost for animation (negligible)
- **CI considerations** - Must suppress in non-TTY environments

### Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| Spinner conflicts with other output | Reporter checks `process.stdout.isTTY` |
| Tests fail due to spinner | Configure with `{ quiet: true }` in tests |
| ora deprecation | ora is widely used; migration would be straightforward |

## Implementation Plan

### Phase 1: Core Module (2 hours)

1. Create `lib/reporter/index.js` - Reporter class wrapping ora
2. Create `lib/reporter/index.test.js` - Unit tests
3. Add import alias to package.json imports

### Phase 2: Command Integration (4 hours)

1. `quire new` - Multi-phase progress (highest impact)
2. `quire build` - Single spinner with elapsed time
3. `quire pdf` - Single spinner
4. `quire epub` - Single spinner

### Phase 3: Polish (2 hours)

1. Ensure CI compatibility (non-TTY detection)
2. Integration tests for spinner behavior
3. Documentation in lib/reporter/README.md

**Total Estimated Effort:** 8 hours

## Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `lib/reporter/index.js` | Create | Reporter singleton |
| `lib/reporter/index.test.js` | Create | Unit tests |
| `lib/reporter/README.md` | Create | Module documentation |
| `src/commands/create.js` | Modify | Add progress phases |
| `src/commands/build.js` | Modify | Add spinner |
| `src/commands/pdf.js` | Modify | Add spinner |
| `src/commands/epub.js` | Modify | Add spinner |
| `package.json` | Modify | Add import alias |

## References

- [ora npm package](https://www.npmjs.com/package/ora)
- [listr2 documentation](https://listr2.kilic.dev/)
- [npm-compare: CLI progress libraries](https://npm-compare.com/cli-progress,cli-spinners,ora,progress/)
- [CLI UX Evaluation](./cli-ux-evaluation.md) - Stage 5 progress indicators recommendation
- [ADR: Process Management](./adr-process-management.md) - Related singleton pattern
