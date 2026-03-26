# Command Testing Guide

This guide explains the testing strategy for Quire CLI commands and how to write effective tests.

## Test File Types

The CLI uses two types of test files for commands:

### `*.spec.js` - Contract/Interface Tests

**Purpose:** Verify that the command definition is correctly transformed into Commander.js Command object instance and that the public API is correct.

**What `spec` modules test:**
- Command is registered in the CLI program
- Command metadata (name, description, version) is correct
- The integration between Command class → Commander.js 
- Arguments are transformed into Commander.js `Argument` instances
- Options are transformed into Commander.js `Option` instances

**What `spec` modules DO NOT test:**
- Behavior or execution
- Internal implementation details
- Side effects (such as file system operations)

**Example:**
```javascript
test('registered command has correct options', (t) => {
  const { command } = t.context

  const pathOption = command.options.find((opt) => opt.long === '--quire-path')

  t.truthy(pathOption, '--quire-path option should exist')
  t.true(pathOption instanceof Option, '--quire-path should be Option instance')
  t.true(pathOption.required, '--quire-path should require a value')
})
```

### `*.test.js` - Integration/Behavior Tests

**Purpose:** Verify that the command executes correctly with real dependencies and produces expected outcomes.

**What `test` modules test:**
- Command execution with various arguments and options
- File system operations
- Integration with external dependencies
- Error handling and edge cases
- Command output and side effects

**What `test` modules DO NOT test:**
- The Commander.js integration (that is what spec tests do)
- Low-level implementation details (unless necessary)

**Example:**
```javascript
test('command creates a new project', async (t) => {
  const projectPath = '/tmp/test-project'
  const command = new CreateCommand()

  await command.action(projectPath, 'default-starter', {})

  t.true(fs.existsSync(projectPath))
  t.true(fs.existsSync(path.join(projectPath, 'package.json')))
})
```

## Testing Pattern for Command Specs

### 1. Import Required Modules

```javascript
import { Argument, Command, Option } from 'commander'
import program from '#src/main.js'
import test from 'ava'
```

### 2. Set Up Shared Context

Get the registered command once and share it across all tests:

```javascript
test.before((t) => {
  // Get the registered command (from program.commands) once and share across all tests
  t.context.command = program.commands.find((cmd) => cmd.name() === 'your-command')
})
```

### 3. Test Registration

Test that the command is registered in the CLI program:

```javascript
test('command is registered in CLI program', (t) => {
  const { command } = t.context

  t.truthy(command, 'command should be registered in program')
  t.true(command instanceof Command)
})
```

### 4. Test Command Metadata

Test the registered command's metadata:

```javascript
test('registered command has correct metadata', (t) => {
  const { command } = t.context

  t.is(command.name(), 'your-command')
  t.truthy(command.description())
  t.is(typeof command._actionHandler, 'function')
})
```

### 5. Test Arguments

Test that arguments are properly transformed into Commander.js `Argument` instances:

```javascript
test('registered command has correct arguments', (t) => {
  const { command } = t.context
  const registeredArguments = command.registeredArguments

  t.is(registeredArguments.length, 2, 'should have 2 arguments')

  const firstArg = registeredArguments[0]
  t.true(firstArg instanceof Argument)
  t.is(firstArg.name(), 'expectedName')
  t.false(firstArg.required) // or t.true for required args
  t.truthy(firstArg.description)
})
```

### 6. Test Options

Test that options are properly transformed into Commander.js `Option` instances:

```javascript
test('registered command has correct options', (t) => {
  const { command } = t.context

  const option = command.options.find((opt) => opt.long === '--your-option')

  t.truthy(option, 'option should exist')
  t.true(option instanceof Option)
  t.is(option.long, '--your-option')
  t.truthy(option.description)
  t.true(option.required) // or t.false for optional
})
```

## Key Commander.js Properties

### Command Properties
- `name()` - Returns the command name
- `description()` - Returns the command description
- `registeredArguments` - Array of `Argument` instances
- `options` - Array of `Option` instances
- `_actionHandler` - The action function

### Argument Properties
- `name()` - Returns the argument name
- `description` - Argument description string
- `required` - Boolean indicating if required
- `variadic` - Boolean indicating if variadic (accepts multiple values)

### Option Properties
- `long` - Long flag (e.g., '--option-name')
- `short` - Short flag (e.g., '-o')
- `description` - Option description string
- `required` - Boolean indicating if the option requires a value
- `optional` - Boolean indicating if the option is optional
- `defaultValue` - Default value if not provided

## Common Patterns

### Testing Optional Arguments

```javascript
t.false(argument.required, 'argument should be optional')
```

### Testing Required Options

```javascript
t.true(option.required, 'option should require a value')
```

### Testing Boolean Flags

```javascript
t.false(option.required, 'flag should not require a value')
```

### Testing Argument Variadic

```javascript
t.true(argument.variadic, 'argument should accept multiple values')
```

## Best Practices

1. **Test the public API** - Test what users and Commander.js see, not internal implementation
2. **Use descriptive assertions** - Include assertion messages explaining what's being tested
3. **One concept per test** - Keep tests focused on a single aspect
4. **Test all options** - Verify every option exists and has correct properties
5. **Test all arguments** - Verify every argument exists and has correct properties
6. **Keep it simple** - Spec tests should be straightforward verification, not complex logic
7. **Use test.before()** - Get the registered command once and share via `t.context`
8. **Wrap arrow function args** - Always use `(arg) => ...` not `arg => ...`

## Command Test Pattern

Testing the Commander.js API:
```javascript
// ✅ Set up once in test.before()
test.before((t) => {
  // Get the registered command (from program.commands) once and share across all tests
  t.context.command = program.commands.find((cmd) => cmd.name() === 'new')
})

// ✅ Use in tests - tests public API that Commander.js and users interact with
test('registered command has correct options', (t) => {
  const { command } = t.context
  const pathOption = command.options.find((opt) => opt.long === '--quire-path')

  t.truthy(pathOption)
  t.true(pathOption instanceof Option)
})
```

## Why This Matters

The spec tests verify the **contract** between our Command classes and Commander.js:

1. **Catches integration bugs** - If we change how we define commands, these tests will fail
2. **Documents the API** - Tests serve as executable documentation
3. **Prevents regressions** - Ensures the public API remains stable
4. **Tests what matters** - Focuses on the interface users interact with

## Example Complete Spec File

See [`create.spec.js`](../src/commands/create.spec.js) for a complete example following this pattern.
