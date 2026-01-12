# Quire CLI Commands

This directory contains the Quire CLI command implementations and their corresponding tests.

## Command Class Pattern

All Quire CLI commands extend the base `Command` class and follow a consistent pattern:

### Command Structure

```javascript
import Command from '#src/Command.js'

export default class MyCommand extends Command {
  static definition = {
    name: 'my-command',
    description: 'Description of what the command does',
    summary: 'short summary for help text',
    version: '1.0.0',
    args: [
      ['<required-arg>', 'description of required argument'],
      ['[optional-arg]', 'description of optional argument', 'default-value']
    ],
    options: [
      ['-f', '--flag', 'description of flag'],
      ['-o', '--option <value>', 'description of option with value', 'default']
    ]
  }

  constructor() {
    super(MyCommand.definition)
  }

  async action(args, options, command) {
    // Command implementation
  }

  preAction(command) {
    // Optional: runs before action()
  }

  postAction(command) {
    // Optional: runs after action()
  }
}
```

### File Organization

For each command, you'll find up to three types of files:

```
src/commands/
├── my-command.js        # Command implementation
├── my-command.spec.js   # Unit tests (structure, options, definitions)
└── my-command.test.js   # Integration tests (functionality with mocked deps)
```

## Testing Strategy

The Quire CLI uses a comprehensive three-tier testing strategy to ensure reliable command functionality:

| Test Type | Pattern | Purpose | Location | Speed |
|-----------|---------|---------|----------|-------|
| **Unit** | `*.spec.js` | Command structure, options, definitions | `src/commands/` | Very Fast (seconds) |
| **Integration** | `*.test.js` | Command functionality with mocked dependencies | `src/commands/` | Fast (seconds) |
| **E2E** | `*.e2e.js` | Complete workflows with real dependencies | `test/e2e/` | Slow (minutes) |

### Unit Tests (`*.spec.js`)

Unit tests verify the command structure and configuration without executing any logic.

**What they test:**
- Command is properly defined: name, description, and version
- Command is properly instantiated
- Arguments and options are properly defined
- Method existence (action, preAction)
- No actual functionality testing

**Example:**
```javascript
test('build command should have a dry-run option', (t) => {
  const { command } = t.context
  const dryRunOption = command.options.find((opt) => opt.flags.includes('--dry-run'))
  t.truthy(dryRunOption)
})
```

### Integration Tests (`*.test.js`)

Integration tests verify command functionality with all external dependencies mocked.

**What they test:**
- Command execution flow
- Interaction with mocked dependencies
- Option handling
- Error scenarios

Test command functionality with mocked dependencies:
- Uses `esmock` for ES module mocking
- Uses `memfs` for in-memory file system
- Uses `sinon` for function stubs

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

### E2E Tests (`*.e2e.js`)

E2E tests verify complete workflows using real dependencies.

**What they test:**
- Complete command workflows
- Cross-platform compatibility
- Real file system operations
- Real external processes
- Actual PDF/EPUB generation

**Example:**
```javascript
test('build command should create _site directory', async (t) => {
  await exec('quire build')
  t.true(fs.existsSync('./_site'))
})
```

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
⚠️ **Optionally write `*.e2e.js`** - E2E tests for critical workflows

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

- **ava** - Test runner with ES module support
- **esmock** - ES module mocking for imports
- **memfs** - In-memory file system for fast, isolated tests
- **sinon** - Stubbing and mocking for function calls

## Test Quality Standards

- Each command must have integration test scenarios
- Critical workflows must have end-to-end tests
- All error paths must be tested
- Test execution time should be < 5 minutes total (with mocking: < 30 seconds)
- Code coverage target: 80% for integration paths

## Creating a New Command

1. **Create the command file** (`src/commands/my-command.js`)
   - Extend the `Command` class
   - Define static `definition` object
   - Implement `action()` method

2. **Create integration tests** (`src/commands/my-command.test.js`)
   - Test main functionality with mocked dependencies
   - Test error handling
   - Test option passing

3. **Create unit tests** (optional, `src/commands/my-command.spec.js`)
   - Validate command structure and configuration

4. **Create e2e tests** (optional, `test/e2e/my-command.e2e.js`)
   - Test critical workflows with real dependencies
