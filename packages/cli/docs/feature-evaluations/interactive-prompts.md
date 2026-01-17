# Feature Evaluation: Interactive Prompts

## Overview

Add interactive prompts to the Quire CLI to improve user experience for non-technical users (museum curators, editors) when required information is missing or decisions need to be made.

## Related TODOs

| Location | TODO |
|----------|------|
| [pdf.js:76](../../src/commands/pdf.js#L76) | Add interactive prompt when build output missing |
| [epub.js:80](../../src/commands/epub.js#L80) | Add interactive prompt when build output missing |
| [create.js:70](../../src/commands/create.js#L70) | Implement interactive starter template selection |
| [create.js:80](../../src/commands/create.js#L80) | Test version compatibility with interactive continue prompt |

## Current State

- **Inquirer** is already a dependency (`inquirer@^9.1.4`)
- No interactive prompts currently implemented
- Commands fail with errors when required input is missing
- Non-technical users (Quire's primary audience) must understand error messages

## Proposed Use Cases

### 1. Missing Build Output (PDF/EPUB)

**Current behavior:**
```bash
$ quire pdf
Error: Build output not found. Run "quire build" first, or use --build flag.
```

**Proposed behavior:**
```bash
$ quire pdf
⚠ No build output found.

? Would you like to build the site first? (Y/n)
```

### 2. Starter Template Selection (Create)

**Current behavior:**
```bash
$ quire new
# Uses default starter without user choice
```

**Proposed behavior:**
```bash
$ quire new my-project
? Select a starter template:
  ❯ Default - Standard publication template
    Minimal - Bare-bones starting point
    Museum Collection - Gallery-focused template
    Academic - Scholarly publication template
```

### 3. Version Compatibility Warning

**Current behavior:**
```bash
$ quire new my-project --quire-version 0.9.0
# Proceeds without warning about compatibility
```

**Proposed behavior:**
```bash
$ quire new my-project --quire-version 0.9.0
⚠ Version 0.9.0 may not be compatible with this starter template.
  Required: >=1.0.0

? Continue anyway? (y/N)
```

### 4. Destructive Operations Confirmation

**Current behavior:**
```bash
$ quire clean
✓ Removed: _site, node_modules/.cache
```

**Proposed behavior:**
```bash
$ quire clean --all
This will remove:
  - _site/ (build output)
  - node_modules/ (dependencies)
  - *.epub, *.pdf (generated files)

? Are you sure you want to delete these files? (y/N)
```

## Implementation Architecture

### Prompt Module (`src/lib/prompt/index.js`)

```javascript
import inquirer from 'inquirer'

/**
 * Check if the terminal supports interactive prompts
 * @returns {boolean}
 */
export function isInteractive() {
  // Nota bene: disable prompts in non-TTY environments (CI, pipes, scripts)
  return process.stdin.isTTY && !process.env.CI
}

/**
 * Confirm a yes/no question
 * @param {string} message - Question to ask
 * @param {boolean} [defaultValue=false] - Default answer
 * @returns {Promise<boolean>}
 */
export async function confirm(message, defaultValue = false) {
  if (!isInteractive()) {
    return defaultValue
  }

  const { confirmed } = await inquirer.prompt([{
    type: 'confirm',
    name: 'confirmed',
    message,
    default: defaultValue
  }])

  return confirmed
}

/**
 * Select from a list of options
 * @param {string} message - Question to ask
 * @param {Array<{name: string, value: string, description?: string}>} choices
 * @returns {Promise<string>}
 */
export async function select(message, choices) {
  if (!isInteractive()) {
    return choices[0].value
  }

  const { selected } = await inquirer.prompt([{
    type: 'list',
    name: 'selected',
    message,
    choices
  }])

  return selected
}

/**
 * Prompt for text input
 * @param {string} message - Question to ask
 * @param {string} [defaultValue] - Default value
 * @returns {Promise<string>}
 */
export async function input(message, defaultValue) {
  if (!isInteractive()) {
    return defaultValue
  }

  const { value } = await inquirer.prompt([{
    type: 'input',
    name: 'value',
    message,
    default: defaultValue
  }])

  return value
}
```

### Integration with Commands

**pdf.js / epub.js:**
```javascript
import { confirm, isInteractive } from '#lib/prompt/index.js'

// In action():
if (!hasSiteOutput()) {
  if (isInteractive()) {
    const shouldBuild = await confirm('No build output found. Build the site first?', true)
    if (shouldBuild) {
      reporter.start('Building site...', { showElapsed: true })
      await eleventy.build({ debug: options.debug })
    } else {
      throw new MissingBuildOutputError('PDF', paths.getSiteDir())
    }
  } else {
    // Non-interactive: throw error (CI/scripts use --build flag)
    throw new MissingBuildOutputError('PDF', paths.getSiteDir())
  }
}
```

**create.js:**
```javascript
import { select } from '#lib/prompt/index.js'

// In action():
if (!starter && isInteractive()) {
  const starters = await installer.listStarters()
  starter = await select('Select a starter template:', starters.map(s => ({
    name: `${s.name} - ${s.description}`,
    value: s.url
  })))
}
```

## Interaction with Output Modes

Interactive prompts must respect the CLI's output mode system:

| Mode | Interactive Prompts |
|------|---------------------|
| Default (TTY) | Enabled |
| `--quiet` | Disabled (use defaults) |
| Non-TTY (CI, pipes) | Disabled (use defaults) |
| `CI=true` env var | Disabled (use defaults) |

### Implementation

```javascript
export function isInteractive() {
  // Disable in quiet mode, CI environments, or non-TTY
  if (process.env.CI || process.env.QUIRE_NON_INTERACTIVE) {
    return false
  }
  return process.stdin.isTTY && process.stdout.isTTY
}
```

Commands should check `options.quiet` before prompting:

```javascript
if (!options.quiet && isInteractive()) {
  const shouldBuild = await confirm('Build the site first?', true)
  // ...
}
```

## Non-Interactive Fallback Behavior

When prompts are disabled, commands should:

| Scenario | Fallback Behavior |
|----------|-------------------|
| Missing build output | Throw error (user should use `--build` flag) |
| No starter specified | Use default starter |
| Version incompatible | Proceed with warning logged |
| Destructive operation | Require explicit flag (`--force`, `--yes`) |

### Example: Destructive Operations

```bash
# Interactive: prompts for confirmation
$ quire clean --all

# Non-interactive: requires explicit flag
$ quire clean --all --yes
$ quire clean --all -y
```

## Testing Strategy

### Unit Tests

```javascript
test('confirm returns default when non-interactive', async (t) => {
  // Mock non-TTY environment
  const originalIsTTY = process.stdin.isTTY
  process.stdin.isTTY = false

  try {
    const result = await confirm('Proceed?', true)
    t.true(result, 'should return default value')
  } finally {
    process.stdin.isTTY = originalIsTTY
  }
})

test('isInteractive returns false when CI env is set', (t) => {
  process.env.CI = 'true'
  try {
    t.false(isInteractive())
  } finally {
    delete process.env.CI
  }
})
```

### Integration Tests

```javascript
test('pdf command prompts to build when output missing (interactive)', async (t) => {
  // Mock inquirer to auto-confirm
  const PDFCommand = await esmock('./pdf.js', {
    '#lib/prompt/index.js': {
      isInteractive: () => true,
      confirm: async () => true
    },
    // ... other mocks
  })

  await command.action({ engine: 'pagedjs' }, command)

  t.true(mockBuild.called, 'should trigger build after confirmation')
})

test('pdf command throws when output missing (non-interactive)', async (t) => {
  const PDFCommand = await esmock('./pdf.js', {
    '#lib/prompt/index.js': {
      isInteractive: () => false
    },
    // ... other mocks
  })

  await t.throwsAsync(
    () => command.action({ engine: 'pagedjs' }, command),
    { code: 'BUILD_OUTPUT_MISSING' }
  )
})
```

## Migration Plan

### Phase 1: Infrastructure (Low Risk)

1. Create `lib/prompt/index.js` module
2. Add `isInteractive()` utility
3. Add unit tests for prompt module
4. No changes to existing commands

### Phase 2: Build Prompt (Medium Impact)

1. Add build confirmation prompt to `pdf.js` and `epub.js`
2. Maintain backward compatibility (non-interactive = error)
3. Update documentation

### Phase 3: Create Command (Medium Impact)

1. Add starter template selection to `create.js`
2. Add version compatibility warning
3. Update documentation

### Phase 4: Destructive Operations (Low Priority)

1. Add `--yes` flag to `clean` command
2. Add confirmation prompt for `clean --all`
3. Update documentation

## Effort & Priority

| Phase | Effort | Priority | Risk |
|-------|--------|----------|------|
| Phase 1: Infrastructure | Low (1-2 hours) | High | Low |
| Phase 2: Build Prompt | Medium (2-3 hours) | High | Low |
| Phase 3: Create Command | Medium (3-4 hours) | Medium | Low |
| Phase 4: Destructive Ops | Low (1-2 hours) | Low | Low |

**Total estimated effort:** 7-11 hours

## Benefits

1. **User-friendly**: Non-technical users get guidance instead of errors
2. **Discoverable**: Prompts teach users about CLI capabilities
3. **Safe defaults**: Non-interactive mode maintains backward compatibility
4. **CI-friendly**: Prompts automatically disable in CI environments

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Breaking CI pipelines | Check `CI` env var, `--quiet` flag, TTY detection |
| Slowing down workflows | Prompts only when information is missing |
| User annoyance | Keep prompts minimal, provide `--yes`/`--no-interaction` flags |
| Test complexity | Mock `inquirer` at module boundary |

## Alternative: Wizard Mode

Instead of inline prompts, implement a separate wizard command:

```bash
$ quire wizard
Welcome to Quire!

? What would you like to do?
  ❯ Create a new project
    Build an existing project
    Generate PDF
    Generate EPUB
    Get help
```

**Assessment:** Wizard mode is complementary, not a replacement. Inline prompts improve the existing command UX; a wizard would be an additional feature for complete beginners.

## References

- [Inquirer.js Documentation](https://github.com/SBoudrias/Inquirer.js)
- [CLI Output Modes](../cli-output-modes.md)
- [CLI UX Evaluation](../evaluation-reports/cli-ux.md)
