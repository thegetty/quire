# CLI Output Modes

This document describes the output modes available across Quire CLI commands for controlling console output verbosity and accessibility.

## Overview

Quire CLI commands support three output modes that control the level of feedback shown to users:

| Mode | Flag | Description | Audience |
|------|------|-------------|----------|
| **Quiet** | `-q, --quiet` | Suppress progress output | CI/scripts |
| **Default** | (none) | Show spinner with basic status | General users |
| **Verbose** | `-v, --verbose` | Show detailed progress | Users wanting more info |

Additionally, there are modes for debugging and accessibility:

| Mode | Flag | Description | Audience |
|------|------|-------------|----------|
| **Debug** | `--debug` | Enable debug output for troubleshooting | Developers/maintainers |
| **Reduced Motion** | `--reduced-motion` | Disable spinner animation and line overwriting | Screen reader users, reduced-motion preferences |

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

Debug mode can be combined with verbose mode:
- `quire build --debug` - Default output + debug logs
- `quire build --verbose --debug` - Verbose output + debug logs

### Accessibility (Reduced Motion)

Reduced motion mode is orthogonal to the verbosity spectrum. When enabled, the reporter outputs static text on new lines instead of animated spinners:

- **No animation**: Spinners are replaced with static status symbols (`–`, `✔`, `✖`, `⚠`, `ℹ`)
- **No line overwriting**: Each stage prints on a new line instead of overwriting the current line
- **Compatible with screen readers**: Static text output is reliably read by assistive technology

Reduced motion can be enabled three ways:

```bash
# CLI flag (single command)
quire build --reduced-motion

# Environment variable (shell session)
REDUCED_MOTION=1 quire build

# Config setting (persistent)
quire settings set reducedMotion true
```

Reduced motion can be combined with any verbosity mode:
- `quire build --reduced-motion` - Static text, default verbosity
- `quire build --reduced-motion --verbose` - Static text with details

### Option Conflicts

Quiet mode conflicts with verbose and debug modes since they have opposing purposes:

```bash
quire build --quiet --verbose  # Error: cannot use together
quire build --quiet --debug    # Error: cannot use together
```

This is enforced at the CLI level - Commander.js will show an error if conflicting options are used together.

## Config Defaults

You can set persistent default values for verbose and debug modes using `quire settings`:

```bash
# Always run in verbose mode
quire settings set verbose true

# Always run in debug mode
quire settings set debug true

# Always use reduced motion
quire settings set reducedMotion true

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
quire -q [command]              # Run any command in quiet mode
quire -v [command]              # Run any command in verbose mode
quire --debug [command]         # Run any command with debug output
quire --reduced-motion [command] # Run any command with static text output
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

### Reporter Lifecycle

The reporter's elapsed time display uses `setInterval`, which keeps the Node.js event loop alive. To ensure clean process exit, `main.js` manages the reporter lifecycle automatically:

- **Success path**: A global `postAction` hook calls `reporter.stop()` after every command
- **Error path**: The action wrapper's `catch` block calls `reporter.stop()` before `handleError()`

Commands do not need to call `reporter.stop()` themselves — this is handled centrally. Commands should use `reporter.succeed()`, `reporter.fail()`, or `reporter.warn()` to signal completion, which also clears the timer. The centralized cleanup is a safety net for cases where a command throws before reaching those calls.

See [Error Handling Architecture](error-handling.md#reporter-cleanup) for details.

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

### Eleventy Output

The `build` and `preview` commands run Eleventy, which has multiple independent output systems. The CLI bridges its verbosity flags to each system via the `QUIRE_LOG_LEVEL` environment variable, set by `configureEleventyEnv()` (API mode) and `factory()` (CLI subprocess mode).

#### Output systems and how they are controlled

| Output source | Prefix | Controlled by | Suppression mechanism |
|---------------|--------|---------------|----------------------|
| **Eleventy ConsoleLogger** | `[11ty]` | `quietMode` option | `quietMode: options.quiet \|\| !options.verbose` |
| **Eleventy build summary** | `[11ty]` | Nothing (forced) | Uses `force: true`, bypasses quietMode |
| **quire-11ty chalk logger** | `[quire]` | `QUIRE_LOG_LEVEL` env var | Level ceiling via `Math.max()` in `_lib/chalk/index.js` |
| **Vite bundler** | `[vite]` | `logLevel` config option | Mapped from `QUIRE_LOG_LEVEL` in `_plugins/vite/index.js` |
| **Directory output plugin** | (table) | Conditional registration | Only added when `QUIRE_LOG_LEVEL` is info/debug/trace |

#### QUIRE_LOG_LEVEL mapping

| CLI flags | `QUIRE_LOG_LEVEL` | Chalk logger | Vite | Directory output | Eleventy [11ty] |
|-----------|-------------------|--------------|------|------------------|-----------------|
| (default) | `warn` | warn + error | warn | hidden | suppressed (quietMode) |
| `--verbose` | `info` | info + warn + error | info | shown | shown |
| `--debug` | `debug` | debug + info + warn + error | info | shown | shown + Eleventy* DEBUG |
| `--quiet` | `silent` | all suppressed | silent | hidden | suppressed (quietMode) |

#### Chalk logger level ceiling

The quire-11ty chalk factory (`packages/11ty/_lib/chalk/index.js`) accepts an optional `loglevel` parameter. Some modules (e.g. Figures) pass an explicit level like `'DEBUG'` to enable detailed output during development.

When `QUIRE_LOG_LEVEL` is set, the effective level is `Math.max(paramLevel, envLevel)` — the env var acts as a ceiling so that CLI flags always win:

```
Figures module passes 'DEBUG' (1)
--quiet sets QUIRE_LOG_LEVEL = 'silent' (5)
Effective level: Math.max(1, 5) = 5 (silent) → all output suppressed
```

Without the env var (standalone quire-11ty), the explicit parameter or default ('info') is used unchanged.

#### Forced Eleventy output

Eleventy's build summary line (`"[11ty] Copied N Wrote N files in X seconds"`) is logged with `force: true`, which bypasses `quietMode` and `isVerbose` checks in ConsoleLogger. This line cannot be suppressed without patching Eleventy itself.

#### Environment variable bridge

The following env vars are set by the CLI and read by the 11ty package:

| Variable | Set by | Read by | Purpose |
|----------|--------|---------|---------|
| `QUIRE_LOG_LEVEL` | `configureEleventyEnv()` / `factory()` | chalk factory, Vite plugin, .eleventy.js | Log verbosity |
| `QUIRE_LOG_PREFIX` | `main.js` preAction hook | chalk factory | Formatted prefix tag (e.g. `[quire]`) |
| `QUIRE_LOG_SHOW_LEVEL` | `main.js` preAction hook | chalk factory | Whether to show level label (INFO, WARN, etc.) |
| `ELEVENTY_ENV` | `configureEleventyEnv()` / `factory()` | .eleventy.js | Build mode (production/development) |
| `DEBUG` | `configureEleventyEnv()` / `factory()` | Eleventy (via debug module) | Eleventy debug namespace |

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

# Reduced motion - static text, no animation
quire build --reduced-motion

# Reduced motion + verbose
quire build --reduced-motion --verbose
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
4. **Screen readers**: Use `--reduced-motion` or `quire settings set reducedMotion true` to disable animated spinners
5. **Persistent defaults**: Use `quire settings set verbose true` if you always want verbose output

### For Developers

1. Always call `reporter.configure()` at the start of command `action()`
2. Use `reporter.detail()` for verbose-only information
3. Use `this.debug()` for internal state, not user-facing messages
4. Ensure commands work correctly in all three modes
5. Do **not** call `reporter.stop()` for cleanup — `main.js` handles this automatically in both success and error paths (see [Reporter Lifecycle](#reporter-lifecycle))
