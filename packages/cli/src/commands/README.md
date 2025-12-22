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

## Three-Tier Testing Strategy

The Quire CLI uses a comprehensive testing strategy with three test types:

| Test Type | Pattern | Purpose | Speed |
|-----------|---------|---------|-------|
| **Unit** | `*.spec.js` | Command structure validation | Very Fast |
| **Integration** | `*.test.js` | Functionality with mocked dependencies | Fast |
| **E2E** | `*.e2e.js` | Complete workflows with real dependencies | Slow |

### Unit Tests (`*.spec.js`)

Validate command structure and configuration:
- Command name, description, version
- Arguments and options are properly defined
- No actual functionality testing

**Example:**
```javascript
test('preview command should have correct name', (t) => {
  const command = new PreviewCommand()
  t.is(command.name(), 'preview')
})
```

### Integration Tests (`*.test.js`)

Test command functionality with mocked dependencies:
- Uses `memfs` for in-memory file system
- Uses `esmock` for ES module mocking
- Uses `sinon` for function stubs
- Fast execution (seconds)

**Example:**
```javascript
test('preview command should call eleventy serve', async (t) => {
  const mockEleventy = {
    serve: sandbox.stub().resolves({ exitCode: 0 })
  }

  const PreviewCommand = await esmock('./preview.js', {
    '#lib/11ty/index.js': { cli: mockEleventy }
  })

  await command.action({ port: 8080 }, command)
  t.true(mockEleventy.serve.called)
})
```

### E2E Tests (`*.e2e.js`)

Test complete workflows with real dependencies:
- Real file system operations
- Real external processes
- Actual PDF/EPUB generation
- Slow execution (minutes)

**Example:**
```javascript
test('build command should create _site directory', async (t) => {
  await exec('quire build')
  t.true(fs.existsSync('./_site'))
})
```

## Testing Dependencies

- **ava** - Test runner with ES module support
- **esmock** - ES module mocking for imports
- **memfs** - In-memory file system for fast, isolated tests
- **sinon** - Stubbing and mocking for function calls

## Running Tests

```sh
# Run all tests
npm test

# Run only unit tests (fast)
npm run test:unit

# Run only integration tests (fast, mocked)
npm run test:integration

# Run only helper tests
npm run test:helpers

# Run only e2e tests (slow, real deps)
npm run test:e2e

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

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

---

## Command Reference

### `build`

Build Quire publication outputs.

```sh
quire build
```

#### `epub`

Build Quire publication EPUB format.

```sh
quire build epub
```

#### `info`

List `quire-11ty`, `quire-cli`, and starter package versions; use the `--debug` option to include node, npm, and os versions.

```sh
quire build info
```

#### `pdf`

Build Quire publication PDF format.

```sh
quire build pdf
```

#### `site`

Build Quire publication HTML format.

```sh
quire build site
```

### `clean`

Remove build outputs.

Note that this command is distinct from the [quire/11ty package](https://github.com/thegetty/quire/packages/11ty/package.json) script `clean`, to allow different behavoirs for Quire editors and developers.

```sh
quire clean --dry-run
```

### `configure` **not yet implemented**

Edit the Quire CLI configuration.

```sh
quire configure
```

### `install` **not yet implemented**

Clone an existing Quire project from a git repository.

```sh
quire install <repository>
```

### `new`

Start a new Quire publication from a template project or clone an existing project from a git repository (equivalent to `install`).

Running the `new` without any arguments will start an interactive prompt.

```sh
quire new
```

To start a new Quire project using the default starter run the following command:

```sh
quire new <path>
```

To create a new project from a starter template

```sh
quire new <path> <starter>
```

#### Specifying the `quire-11ty` version

When the `--quire` flag is used the new project will be started using the specified version of `quire-11ty`

```sh
quire new <path> <starter> --quire <version>
```

##### Version identifiers

The `--quire` flag must be either a semantic version identifier or a npm distribution tag. For example:

```sh
quire new ./blargh --quire 1.0.0-rc.5
```

```sh
quire new ./blargh --quire latest
```

### `preview`

Build and server the Quire site in development mode.

```sh
quire preview --port 8080
```

#### `epub` **not yet implemented**

Preview the Quire publication epub in the default application.

```sh
quire preview epub --open
```

#### `pdf` **not yet implemented**

Preview the Quire publication PDF in the default application.

```sh
quire preview pdf --open
```

#### `site` **default subcommand**

Build and serve the Quire site in development mode.

```sh
quire preview site
```

### `server` **not yet implemented**

Start a local web server to serve a previously built Quire site.

```sh
quire server --port 8080
```

### `version` **partial implementation**

Sets the Quire version to use when running commands on the project.

```sh
quire version 1.0.0
```

To set the quire version globally use the `--global` command flag.

```sh
quire version 1.0.0 --global
```

#### `install`

```sh
quire version install <version>
```

To reinstall a `quire-11ty` version run

```sh
quire version install <version> --force
```

#### `list`

List installed versions of `quire-11ty`

```sh
quire version list
```

#### `prune`

Remove outdated versions of `quire-11ty`

```sh
quire version prune
```

#### `remove` (alias `uninstall`)

```sh
quire version remove <version>
```

```sh
quire version uninstall <version>
```
