# CLI Accessibility

This document describes the accessibility features and design principles of the Quire CLI, including color output control, screen reader compatibility, and structured output for automation.

## Overview

The Quire CLI is designed to be usable by people with a range of abilities and in a variety of environments. Key principles:

- **Color is never the sole information channel.** All status indicators use distinct Unicode symbols alongside color.
- **Output respects user preferences.** Color, verbosity, and spinners can all be controlled.
- **Errors are actionable.** Every error includes a suggestion and documentation link, not just a code or stack trace.
- **Structured output is available.** Machine-readable JSON output is supported for automation and assistive tooling.

## Color Output

### Disabling Color

Color output can be disabled in three ways, listed by precedence (highest first):

| Method | Scope | Example |
|--------|-------|---------|
| `--no-color` flag | Single command | `quire build --no-color` |
| `NO_COLOR` env var | Shell session | `NO_COLOR=1 quire build` |
| Config setting | Persistent | `quire settings set logUseColor false` |

The `--no-color` flag and `NO_COLOR` environment variable follow the [no-color.org](https://no-color.org/) standard. Setting either disables ANSI escape sequences in all CLI output, including the logger and progress spinners (ora).

### Forcing Color

Color can be forced on, overriding `NO_COLOR`:

| Method | Scope | Example |
|--------|-------|---------|
| `--color` flag | Single command | `quire build --color` |
| `FORCE_COLOR` env var | Shell session | `FORCE_COLOR=1 quire build` |

This is useful when piping output to a tool that supports ANSI codes but does not provide a TTY (e.g., `less -R`).

### How Color Propagates

The CLI uses `process.env.NO_COLOR` as the universal signal for disabling color. Chalk 5.x, ora, and the Quire logger all read this environment variable.

The `--no-color` flag sets `process.env.NO_COLOR = '1'` in the Commander.js `preAction` hook, before any command runs. The config-based `logUseColor: false` setting is applied earlier, in `bin/cli.js`, before modules are loaded — this ensures chalk picks up the value at import time.

### Color Palette

The CLI uses the following colors for status indicators:

| Element | Color | Symbol | Notes |
|---------|-------|--------|-------|
| Passed/Success | Green | `✔` | Good contrast on both light and dark terminals |
| Failed/Error | Red | `✖` | Good contrast |
| Warning | Yellow | `⚠` | May be low-contrast on light terminals |
| Timeout | Magenta | `⏱` | Acceptable contrast |
| N/A | Gray | `○` | Used for skipped or not-applicable items |

Every status uses a distinct symbol in addition to color, so information is never lost when color is disabled.

## Paging

Long help topic content is displayed through the system pager (`less` on Unix, `more` on Windows) when running in an interactive terminal. Paging can be disabled for screen reader compatibility and automation.

### Disabling the Pager

| Method | Scope | Example |
|--------|-------|---------|
| `--no-pager` flag | Single command | `quire --no-pager help workflows` |
| `NO_PAGER` env var | Shell session | `NO_PAGER=1 quire help workflows` |
| `PAGER=cat` | Traditional Unix | `PAGER=cat quire help workflows` |
| Pipe to `cat` | Single command | `quire help workflows \| cat` |

The `--no-pager` flag sets `process.env.NO_PAGER = '1'` in the `preAction` hook. The `NO_PAGER` environment variable is checked directly by the pager utility. Setting `PAGER=cat` works because `cat` passes content through without interactive paging.

Paging is automatically skipped when output is not a TTY (e.g., piped to a file or another command) or when the content fits within the terminal height.

### Selecting a Pager

The `PAGER` environment variable selects the pager program. The default is `less -R` on Unix (`-R` preserves ANSI colors) and `more` on Windows.

## Non-TTY and CI Environments

The CLI automatically adapts its output for non-interactive environments:

| Behavior | TTY (interactive) | Non-TTY (piped/CI) |
|----------|-------------------|---------------------|
| Progress spinners | Animated | Suppressed |
| Color output | Enabled (unless `NO_COLOR`) | Disabled by chalk |
| `--quiet` mode | Suppresses spinners | Suppresses spinners |

For CI/CD pipelines, use `--quiet` to suppress all progress output and rely on exit codes:

```bash
quire build --quiet
echo $?  # 0 = success, non-zero = failure
```

## Structured Output

### JSON Output

Commands that support `--json` output machine-readable data to stdout:

| Command | `--json` | Notes |
|---------|----------|-------|
| `doctor` | Yes | Diagnostic results with status fields |
| `settings` | Yes | Current configuration key-value pairs |
| `info` | Yes | Project and system version information |
| `validate` | Yes | Per-file validation results with summary |

```bash
# Print JSON to stdout
quire doctor --json

# Save JSON to file
quire doctor --json report.json

# Quiet mode with JSON file (no console output)
quire doctor --quiet --json report.json

# Validate YAML and capture results
quire validate --json

# Get version info for automation
quire info --json
```

JSON output always includes all available fields regardless of flags like `--debug`, providing a stable schema for automation. The JSON schema uses explicit `status` fields (`"passed"`, `"failed"`, `"warning"`, `"timeout"`, `"na"`) so that automated tools do not need to parse human-readable text or interpret color codes.

### Exit Codes

All commands return meaningful exit codes for scripting:

| Code | Category |
|------|----------|
| 0 | Success |
| 1 | General/unexpected error |
| 2 | Project error (not in project, create failed) |
| 3 | Build error (build failed, config missing) |
| 4 | Validation error (YAML syntax, schema) |
| 5 | Output error (PDF/EPUB generation failed) |
| 6 | Install error (npm install, version not found) |
| 130 | SIGINT (Ctrl+C) |

See [error-handling.md](error-handling.md) for the full error architecture.

### Stream Routing

Output is routed to the correct stream for filtering and redirection:

- `stdout`: Informational output (`logger.info()`)
- `stderr`: Errors and warnings (`logger.error()`, `logger.warn()`)

This allows `2>/dev/null` to suppress errors or `1>/dev/null` to suppress normal output while preserving errors.

## Error Message Design

Error messages follow blame-free, actionable language:

```
[quire] ERROR  Configuration file 'publication.yaml' not found
  File: content/_data/publication.yaml
  Suggestion: Create publication.yaml in your content/_data/ folder
  Learn more: https://quire.getty.edu/docs-v1/publication-configuration
  Tip: Run with --debug for more details
```

Design principles:

- **Blame-free tone**: "The 'build' command must be run inside a Quire project" rather than "You're not in a project directory."
- **Actionable suggestions**: Every error includes a `Suggestion` with a concrete next step.
- **Documentation links**: Errors link to relevant documentation where available.
- **Progressive detail**: Stack traces are hidden by default and shown with `--debug`.

## Output Modes

Three output modes control verbosity. These are orthogonal to color settings and can be combined freely:

| Mode | Flag | Purpose |
|------|------|---------|
| Quiet | `-q, --quiet` | Suppress progress output (CI/scripts) |
| Default | (none) | Spinner with basic status |
| Verbose | `-v, --verbose` | Detailed progress (paths, timing) |
| Debug | `--debug` | Developer-level diagnostic output |

See [cli-output-modes.md](cli-output-modes.md) for the full output mode architecture.

## Known Limitations

1. **`quire --no-color --help`** may still render Commander.js help styling with color, because Commander processes `--help` before the `preAction` hook runs. Use `NO_COLOR=1 quire --help` instead.

2. **No reduced-motion detection.** Spinners always animate in TTY environments. There is no `prefers-reduced-motion` equivalent or `--no-spinner` flag. Use `--quiet` to suppress spinners entirely.

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `NO_COLOR` | Disable color output ([no-color.org](https://no-color.org/)) |
| `FORCE_COLOR` | Force color output (overrides `NO_COLOR`) |
| `NO_PAGER` | Disable paging for long output |
| `PAGER` | Set pager program (default: `less`). Use `PAGER=cat` to disable |
| `DEBUG=quire:*` | Enable debug output for all modules |
| `DEBUG=quire:lib:pdf` | Enable debug output for a specific module |

## Configuration

Persistent accessibility-related settings available via `quire settings`:

```bash
# Disable color permanently
quire settings set logUseColor false

# Disable colored error/warning labels
quire settings set logColorMessages false

# Enable verbose output by default
quire settings set verbose true
```

CLI flags always override config settings for the current command.
