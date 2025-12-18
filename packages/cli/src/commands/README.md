# Quire CLI Commands Testing

This directory contains the Quire CLI command implementations and their corresponding tests.

## Three-Tier Testing Strategy

The Quire CLI uses a comprehensive three-tier testing strategy to ensure robust, reliable command functionality:

| Test Type | Pattern | Purpose | Location | Speed |
|-----------|---------|---------|----------|-------|
| **Unit** | `*.spec.js` | Command structure, options, definitions | `src/commands/` | Very Fast (seconds) |
| **Integration** | `*.test.js` | Command functionality with mocked dependencies | `src/commands/` | Fast (seconds) |
| **E2E** | `*.e2e.js` | Complete workflows with real dependencies | `test/e2e/` | Slow (minutes) |

### File Organization

For each command, you'll find three types of files:

```
src/commands/
├── build.js              # Implementation
├── build.spec.js         # Unit tests (structure, options)
├── build.test.js         # Integration tests (mocked functionality)
├── clean.js
├── clean.spec.js
├── clean.test.js
└── ...
```

## Test Types Explained

### 1. Unit Tests (`*.spec.js`)

Unit tests verify the command structure and configuration without executing any logic.

**What they test:**
- Command instantiation
- Command name, description, and version
- Options and arguments definitions
- Method existence (action, preAction)

**Example:**
```javascript
test('build command should have a dry-run option', (t) => {
  const { command } = t.context
  const dryRunOption = command.options.find(opt => opt.flags.includes('--dry-run'))
  t.truthy(dryRunOption)
})
```

**When to run:** On every commit (~5 seconds)

### 2. Integration Tests (`*.test.js`)

Integration tests verify command functionality with all external dependencies mocked.

**What they test:**
- Command execution flow
- Interaction with mocked dependencies
- Option handling
- Error scenarios

**Key mocking tools:**
- `memfs` - In-memory file system
- `esmock` - ES module mocking
- `sinon` - Function stubbing and mocking

**Example:**
```javascript
test('build command should call eleventy CLI with default options', async (t) => {
  const { sandbox, fs } = t.context

  const mockEleventyCli = {
    build: sandbox.stub().resolves({ exitCode: 0 })
  }

  const BuildCommand = await esmock('./build.js', {
    '#lib/11ty/index.js': {
      cli: mockEleventyCli,
      paths: { output: '_site' },
      projectRoot: '/project'
    },
    'fs-extra': fs
  })

  const command = new BuildCommand()
  await command.action({ '11ty': 'cli' }, command)

  t.true(mockEleventyCli.build.called)
})
```

**When to run:** On every commit, PR validation (~30 seconds)

### 3. End-to-End Tests (`*.e2e.js`)

E2E tests verify complete workflows using real dependencies.

**What they test:**
- Actual file system operations
- Real PDF/EPUB generation
- Complete command workflows
- Cross-platform compatibility

**When to run:** Nightly builds, pre-release validation (minutes)

## Running Tests

```sh
# Run all tests (unit + integration + e2e)
npm test

# Run only unit tests (fast)
npm run test:unit

# Run only integration tests (fast, mocked)
npm run test:integration

# Run only E2E tests (slow, real dependencies)
npm run test:e2e

# Watch mode for development
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Writing Tests

### When to Write Each Type

✅ **Always write `*.spec.js`** - Unit tests for every command
✅ **Always write `*.test.js`** - Integration tests for command logic
⚠️ **Optionally write `*.e2e.js`** - E2E tests for critical workflows only

### Integration Test Pattern

```javascript
import test from 'ava'
import { Volume, createFsFromVolume } from 'memfs'
import sinon from 'sinon'
import esmock from 'esmock'

test.beforeEach((t) => {
  // Create sinon sandbox for mocking
  t.context.sandbox = sinon.createSandbox()

  // Create in-memory file system
  t.context.vol = new Volume()
  t.context.fs = createFsFromVolume(t.context.vol)

  // Setup mock directory structure
  t.context.vol.fromJSON({
    '/project/content/_data/config.yaml': 'title: Test Project',
    '/project/package.json': JSON.stringify({ name: 'test-project' })
  })

  t.context.projectRoot = '/project'
})

test.afterEach.always((t) => {
  // Restore all mocks
  t.context.sandbox.restore()

  // Clear in-memory file system
  t.context.vol.reset()
})

test('command should perform expected operation', async (t) => {
  const { sandbox, fs } = t.context

  // Mock dependencies
  const mockDependency = sandbox.stub().resolves()

  // Use esmock to load command with mocked dependencies
  const MyCommand = await esmock('./mycommand.js', {
    '#lib/dependency/index.js': mockDependency,
    'fs-extra': fs
  })

  const command = new MyCommand()
  await command.action({}, command)

  t.true(mockDependency.called)
})
```

## Testing Dependencies

All testing dependencies are managed in [package.json](../../package.json):

```json
{
  "devDependencies": {
    "ava": "^6.2.0",           // Test runner
    "esmock": "^2.7.3",        // ES module mocking
    "memfs": "^4.51.1",        // In-memory file system
    "sinon": "^17.0.1",        // Stubbing and mocking
  }
}
```

## Test Quality Standards

- Each command must have integration test scenarios
- Critical workflows must have end-to-end tests
- All error paths must be tested
- Test execution time should be < 5 minutes total (with mocking: < 30 seconds)
- Code coverage target: 80% for integration paths

## Benefits of This Strategy

### Speed
- **Unit tests**: ~5 seconds (instant feedback)
- **Integration tests**: ~30 seconds (mocked dependencies)
- **E2E tests**: minutes (real dependencies, run less frequently)

### Reliability
- Mocked dependencies eliminate flaky tests
- Consistent behavior across platforms
- No external dependencies required for most tests

### Maintainability
- Co-located tests are easy to find
- Clear separation between test types
- Tests focus on command logic, not infrastructure

## Further Reading

For complete implementation details, see the [Integration Testing Plan](../../docs/integration-testing-plan.md).
