# CLI Output Modes

This document describes the three output modes available across Quire CLI commands for controlling console output verbosity.

## Overview

Quire CLI commands support three output modes that control the level of feedback shown to users:

| Mode | Flag | Description | Audience |
|------|------|-------------|----------|
| **Quiet** | `-q, --quiet` | Suppress progress output | CI/scripts |
| **Default** | (none) | Show spinner with basic status | General users |
| **Verbose** | `-v, --verbose` | Show detailed progress | Users wanting more info |

Additionally, there's a separate debugging mode:

| Mode | Flag | Description | Audience |
|------|------|-------------|----------|
| **Debug** | `--debug` | Enable debug output for troubleshooting | Developers/maintainers |

## Semantic Model

### User-Facing Output (Quiet/Default/Verbose)

These three modes form a spectrum of output verbosity for end users:

```
Quiet ←――――――――→ Default ←――――――――→ Verbose
(none)           (basic)            (detailed)
```

- **Quiet mode** (`-q, --quiet`): Suppresses all progress output. Use for CI/CD pipelines, automated scripts, or when piping output to other commands. Exit codes still indicate success/failure.

- **Default mode**: Shows a spinner with basic status messages. Suitable for interactive terminal use.

- **Verbose mode** (`-v, --verbose`): Shows detailed progress information including file paths, timing data, and step-by-step progress. Useful when you want more visibility into what the CLI is doing.

### Developer Output (Debug)

Debug mode is separate from the user-facing output modes:

- **Debug mode** (`--debug`): Enables the `DEBUG=quire:*` namespace for internal logging. This outputs technical debugging information intended for developers and maintainers troubleshooting issues.

Debug mode can be combined with any of the user-facing output modes:
- `quire build --debug` - Default output + debug logs
- `quire build --verbose --debug` - Verbose output + debug logs
- `quire build --quiet --debug` - No spinner, but debug logs still appear

## Config Defaults

You can set persistent default values for verbose and debug modes using `quire settings`:

```bash
# Always run in verbose mode
quire settings set verbose true

# Always run in debug mode
quire settings set debug true

# View current settings
quire settings list
```

CLI flags always override config settings using the `--no-` prefix:

```bash
# Disable verbose even if enabled in config
quire build --no-verbose

# Disable debug even if enabled in config
quire build --no-debug
```

> **Note:** The `--no-` prefix is a [Commander.js built-in feature](https://github.com/tj/commander.js#other-option-types-negatable-boolean-and-booleanvalue).
> For any boolean option like `--verbose`, Commander automatically supports `--no-verbose` to explicitly set it to `false`.

## Global vs Command Options

These flags are available both globally and per-command:

### Global Flags (from main.js)

```bash
quire -q [command]      # Run any command in quiet mode
quire -v [command]      # Run any command in verbose mode
quire --debug [command] # Run any command with debug output
```

### Command-Level Flags

Each command also defines these flags, allowing the same behavior:

```bash
quire build --quiet
quire pdf --verbose
quire epub --debug
```

## Implementation

### Reporter Module

The reporter module (`lib/reporter/index.js`) handles user-facing output:

```javascript
import reporter from '#lib/reporter/index.js'

// Configure reporter at the start of command action()
reporter.configure({ quiet: options.quiet, verbose: options.verbose })

// Use reporter for progress feedback
reporter.start('Building site...', { showElapsed: true })
reporter.detail('Processing 45 pages')  // Only shown in verbose mode
reporter.succeed('Build complete')
```

### Reporter Methods

| Method | Description | Verbose Only |
|--------|-------------|--------------|
| `start(text, options)` | Start a spinner | No |
| `update(text)` | Update spinner text | No |
| `succeed(text)` | Mark success | No |
| `fail(text)` | Mark failure | No |
| `warn(text)` | Mark warning | No |
| `info(text)` | Show info message | No |
| `detail(text)` | Show detailed info | Yes |
| `stop()` | Stop spinner | No |

### Debug Mode

Debug mode is enabled via the `enableDebug` function in the CLI preAction hook:

```javascript
program.hook('preAction', (thisCommand) => {
  const opts = thisCommand.opts()
  if (opts.debug) {
    enableDebug('quire:*')
  }
})
```

Commands use the debug instance from the base Command class:

```javascript
this.debug('called with options %O', options)
```

## Examples

### Build Command

```bash
# Default - spinner with basic status
quire build

# Quiet - no output (for CI)
quire build --quiet

# Verbose - detailed progress
quire build --verbose

# Debug - troubleshooting
quire build --debug

# Verbose + Debug - all output
quire build --verbose --debug
```

### PDF Command

```bash
# Default
quire pdf

# Verbose with timing
quire pdf --verbose

# CI/scripts
quire pdf --quiet
```

### Doctor Command

The doctor command has additional output options:

```bash
# Verbose shows paths and versions
quire doctor --verbose

# JSON output for scripts
quire doctor --json

# Quiet - exit code only
quire doctor --quiet

# Combine JSON output with quiet (saves file silently)
quire doctor --quiet --json report.json
```

## Commands Supporting Output Modes

| Command | -q/--quiet | -v/--verbose | --debug |
|---------|------------|--------------|---------|
| build | Yes | Yes | Yes |
| clean | Yes | Yes | Yes |
| create (new) | Yes | Yes | Yes |
| doctor | Yes | Yes | Yes |
| epub | Yes | Yes | Yes |
| info | - | - | - |
| pdf | Yes | Yes | Yes |
| preview | Yes | Yes | Yes |
| settings | - | - | Yes |
| use | - | - | - |
| validate | Yes | Yes | Yes |

## Best Practices

### For Users

1. **CI/CD pipelines**: Always use `--quiet` to avoid spinner output that can clutter logs
2. **Troubleshooting**: Start with `--verbose`, escalate to `--debug` if needed
3. **Scripts**: Use `--quiet` and rely on exit codes for success/failure
4. **Persistent defaults**: Use `quire settings set verbose true` if you always want verbose output

### For Developers

1. Always call `reporter.configure()` at the start of command `action()`
2. Use `reporter.detail()` for verbose-only information
3. Use `this.debug()` for internal state, not user-facing messages
4. Ensure commands work correctly in all three modes
