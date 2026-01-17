# Quire Development Guide

> **For contributors:** How to set up your development environment and contribute to Quire

**Quick links:**
- **New to the project?** Start with [Quick Start](#quick-start)
- **Working on CI?** See [.circleci/README.md](.circleci/README.md)
- **Need task reference?** Run `mise help` or `mise h`

## Table of Contents

- [Quick Start](#quick-start)
- [Development Environment](#development-environment)
- [Using Mise](#using-mise)
- [Testing](#testing)
- [Package Development](#package-development)
- [Logging and Debugging](#logging-and-debugging)
- [CircleCI Integration](#circleci-integration)
- [Common Workflows](#common-workflows)
- [Troubleshooting](#troubleshooting)

## Quick Start

```sh
# 1. Clone repository
git clone https://github.com/thegetty/quire.git
cd quire

# 2. Install mise (if not already installed)
brew install mise

# 3. Activate mise in your shell (see shell activation below)
echo 'eval "$(mise activate bash)"' >> ~/.bashrc  # or ~/.zshrc for zsh

# 4. Enter project (mise auto-activates)
cd quire

# 5. Install dependencies
mise setup           # or: npm ci --ignore-scripts --foreground-scripts

# 6. Run tests
mise test
```

## Development Environment

### Requirements

- **Node.js:** 22.10.0 (managed by `mise`)
- **npm:** Included with Node.js
- **Git:** For version control
- **Chrome/Chromium:** For PDF generation and Playwright tests

### Optional Tools

- **Docker:** For reproducing CI environment
- **mise:** Task runner and version manager (recommended)
  - Automatically installs: Node.js version, CircleCI CLI, npm-check-updates

## Using Mise

[mise](https://mise.jdx.dev/) provides automated tool version management and tasks.

### Installation

**Install mise:**
Follow the official installation instructions for your platform:
- **Installation guide:** https://mise.jdx.dev/getting-started.html

**Quick reference for common platforms:**
- macOS: `brew install mise`
- Linux: `curl https://mise.run | sh`
- Windows: `winget install jdx.mise`

**Shell activation:**
After installing, activate mise in your shell. See the [shell activation guide](https://mise.jdx.dev/getting-started.html#_2-activate-mise) for detailed instructions.

Quick reference:
```sh
# Zsh
echo 'eval "$(mise activate zsh)"' >> ~/.zshrc

# Bash
echo 'eval "$(mise activate bash)"' >> ~/.bashrc

# Fish
echo 'mise activate fish | source' >> ~/.config/fish/config.fish
```

### Available Tasks

Run `mise help` (or `mise h`) for a quick reference of common tasks, or `mise tasks` for the complete list.

**Most frequently used:**
- `mise test` - Run all tests (CLI → 11ty → E2E → Playwright)
- `mise test:cli` - CLI tests only (~2s, fast feedback)
- `mise e2e` - E2E tests (builds publication, ~2-5 min)
- `mise cv` - Validate CircleCI config
- `mise setup` - Install dependencies like CI does
- `mise lint` - Lint all packages
- `mise lint:fix` - Auto-fix linting issues

See [mise.toml](mise.toml) for complete task definitions.

## Testing

### Test Execution Order

Tests run in this order (same as CI):
1. **CLI tests** (~2s) - Fast unit and integration tests
2. **11ty tests** (~8s) - Eleventy plugin tests
3. **E2E tests** (~2-5 min) - Builds publication with PDF/EPUB
4. **Browser tests** (~3-5 min) - Playwright visual/functional tests

**Why this order?** Fast failure detection. If unit tests fail, you know immediately without waiting for slow E2E tests.

### Running Tests

**All tests:**
```bash
mise test                 # Full suite
npm test                  # Same, without mise
```

**Individual test suites:**
```bash
mise test:cli             # CLI tests only
mise test:11ty            # 11ty tests only
mise e2e                  # E2E tests only
mise test:browsers        # Browser tests only
```

**Specific test file:**
```bash
cd packages/cli
npm test -- --match "*specific test name*"
```

**Watch mode:**
```bash
mise test:watch           # CLI tests in watch mode
```

### Browser Tests

**Debug with visible browser:**
```bash
mise pw:headed            # Headed mode
mise pw:debug             # Interactive debug mode
```

**Test specific file:**
```bash
npx playwright test _tests/publication.spec.js
```

**View test report:**
```bash
mise pw:report
```

### Cleaning Test Artifacts

```bash
mise clean
```

Removes:
- `_site-test/`
- `test-publication*/`
- `reports/`
- `test-results/`
- `publication.zip`
- `packages/11ty/{_site,_epub}`

## Package Development

This is a monorepo with multiple packages. Each can be developed independently.

### CLI Package (`packages/cli/`)

**Development:**
```bash
cd packages/cli
npm run dev              # Watch mode (if configured)
npm test                 # Run tests
npm run lint             # Check code style
npm run docs             # Generate documentation
```

**Test globally:**
```bash
mise cli:install         # Pack and install globally
quire new test-pub       # Test it
mise cli:uninstall       # Clean up
```

**Command testing:**
The CLI uses two test file types:
- `*.spec.js` - Contract/interface tests (verify Commander.js integration)
- `*.test.js` - Integration/behavior tests (verify execution)

See [packages/cli/docs/testing-commands.md](packages/cli/docs/testing-commands.md) for testing patterns.

### 11ty Package (`packages/11ty/`)

**Development:**
```bash
cd packages/11ty
npm run dev              # Start dev server
npm run build            # Production build
npm test                 # Run tests
```

### Linting

**All packages:**
```bash
mise l                   # Check
mise lf                  # Fix
```

**Specific package:**
```bash
cd packages/cli
npm run lint
npm run lint:fix
```

## Logging and Debugging

The CLI provides two complementary systems for output and debugging.

### User-Facing Output (Logger)

The logger is for messages users need to see: status updates, warnings, errors.

**Control log level:**
```bash
# Via environment variable
QUIRE_LOG_LEVEL=debug quire build

# Levels: trace, debug, info (default), warn, error, silent
```

**In code:**
```javascript
import { logger } from '#lib/logger/index.js'

logger.info('Building PDF...')     // Status messages
logger.warn('Deprecated option')   // Warnings
logger.error('Build failed')       // Errors
```

### Developer Debugging (DEBUG)

For internal debugging, use the `debug` module with namespace filtering. This aligns with Eleventy's debugging system.

**Enable debug output:**
```bash
# Single namespace
DEBUG=quire:lib:pdf quire pdf

# Wildcard matching
DEBUG=quire:lib:* quire build

# All Quire debug output
DEBUG=quire:* quire build

# Combined with Eleventy debugging
DEBUG=quire:*,Eleventy:* quire build

# Exclude specific namespaces
DEBUG=quire:*,-quire:lib:git quire create my-project
```

**In code:**
```javascript
import createDebug from '#debug'

const debug = createDebug('lib:pdf')

debug('options: %O', options)      // Pretty-print object
debug('file: %s', filename)        // String interpolation
```

**Namespace conventions:**

| Module Path | Namespace |
|-------------|-----------|
| `lib/pdf/index.js` | `lib:pdf` |
| `lib/pdf/paged.js` | `lib:pdf:paged` |
| `commands/build.js` | `commands:build` |

See [packages/cli/src/lib/logger/README.md](packages/cli/src/lib/logger/README.md) for complete documentation.

### Error Handling

The CLI uses a structured error hierarchy for consistent error handling.

**Error classes:**
- `QuireError` - Base class for all Quire errors
- `ValidationError` - Configuration/input validation errors
- `YamlValidationError` - YAML parsing errors

**In code:**
```javascript
import QuireError from '#src/errors/quire-error.js'

throw new QuireError('Operation failed', {
  code: 'ERR_OPERATION_FAILED',
  cause: originalError
})
```

See [packages/cli/src/errors/](packages/cli/src/errors/) for available error classes.

## CircleCI Integration

CircleCI uses dynamic path filtering to skip builds when only documentation or mise configuration files change.

**Quick reference:**
- `mise cv` - Validate CircleCI config before pushing
- `mise docker:shell` - Debug in CI Docker environment

See [.circleci/README.md](.circleci/README.md) for complete CI/CD documentation including:
- Workflow architecture and path filtering patterns
- Performance metrics and caching strategy
- Debugging workflows and troubleshooting

## Common Workflows

### Daily Development

```bash
# Start of day
cd quire
mise setup               # Install deps
mise test:cli            # Quick test

# Make changes
mise lint                # Check linting
mise test:cli            # Test changes

# Before commit
mise test                # Full test suite
```

### Adding a New Feature

```bash
# 1. Create feature branch
git checkout -b feature/my-feature

# 2. Make changes
# ... edit files ...

# 3. Test locally
mise test:cli            # Quick test
mise e2e                 # E2E test

# 4. Lint and fix
mise lint:fix

# 5. Full test suite
mise test

# 6. Commit and push
git add .
git commit -m "Add feature"
git push origin feature/my-feature
```

### Debugging CI Failures

```bash
# 1. Pull latest
git pull origin main

# 2. Clean environment
mise clean
rm -rf node_modules packages/*/node_modules

# 3. Reinstall (like CI)
mise setup

# 4. Reproduce failure with debug output
DEBUG=quire:* mise e2e                 # If E2E failed
DEBUG=quire:* mise test:browsers       # If browser tests failed

# 5. Debug in CI Docker environment
mise docker:shell
# Inside: npm ci --ignore-scripts --foreground-scripts && npm test
```

### Working on CLI

```bash
# 1. Navigate to CLI package
cd packages/cli

# 2. Make changes
# ... edit files ...

# 3. Test changes
npm test                 # Unit tests
npm run lint             # Linting

# 4. Test globally installed
cd ../..
mise cli:install
quire new test-publication
cd test-publication
quire build
quire pdf

# 5. Clean up
cd ..
mise cli:uninstall
rm -rf test-publication
```

### Updating Dependencies

**Check for updates:**
```bash
mise npm                 # Interactive selection
```

**Automated testing upgrade:**
```bash
mise npm:upgrade         # Tests each upgrade
```

This will:
1. Run tests to ensure they currently pass
2. Upgrade all dependencies
3. If tests fail, revert and test each upgrade individually
4. Report which upgrades break tests
5. Save working upgrades to package.json

### Before Pushing to CI

```bash
# 1. Validate CircleCI config
mise cv

# 2. Check expanded config for correctness
mise ci:process | grep -A 5 "your-change"

# 3. Run full test suite
mise test

# 4. Lint everything
mise lint

# 5. Check git status
git status

# 6. Push
git push
```

## Troubleshooting

### mise Not Activating

```bash
# Check if mise is installed
which mise

# Re-activate in shell
eval "$(mise activate bash)"  # or zsh

# Add to shell config permanently
echo 'eval "$(mise activate bash)"' >> ~/.bashrc
```

### Wrong Node Version

```bash
# Check version
node --version                # Should show 22.10.0

# Reinstall Node.js
mise install node@22.10.0
```

### Tests Failing Locally but Pass in CI

```bash
# Use exact CI environment
mise docker:shell

# Inside Docker:
npm ci --ignore-scripts --foreground-scripts
npm test
```

### Chrome/Puppeteer Issues

```bash
# Verify Chrome installed
google-chrome --version      # Linux
open -a "Google Chrome" --version  # macOS

# Test Puppeteer
node -e "require('puppeteer').launch().then(b => { console.log('✓ OK'); b.close(); })"
```

### Permission Errors

```bash
# Check npm global directory
npm config get prefix

# Should be user-writable, not /usr/local
# If wrong, run:
npm config set prefix ~/.npm-global
```

### Debug Output Not Showing

```bash
# Verify DEBUG is set correctly
echo $DEBUG

# Enable all Quire debug output
DEBUG=quire:* quire build

# Enable specific namespace
DEBUG=quire:lib:pdf quire pdf

# Enable multiple namespaces
DEBUG=quire:*,Eleventy:* quire build

# Check if namespace is enabled in code
node -e "import('#debug').then(m => { m.enableDebug('quire:*'); console.log(m.isDebugEnabled('lib:pdf')) })"
```

### Clean Slate

```bash
# Remove everything and start fresh
mise clean
rm -rf node_modules packages/*/node_modules
mise i
mise test
```

### CircleCI Config Not Validating

```bash
# Validate syntax
mise cv

# Check for YAML errors
mise cp

# Common issues:
# - Indentation (must be 2 spaces, not tabs)
# - Missing quotes around special characters
# - Incorrect anchor references
```

## Additional Resources

- **Main README:** [README.md](README.md) - Project overview
- **Contributing:** [CONTRIBUTING.md](CONTRIBUTING.md) - Contribution guidelines
- **CircleCI:** [.circleci/README.md](.circleci/README.md) - CI/CD documentation
- **Quire Docs:** https://quire.getty.edu/docs-v1/ - User documentation
- **mise Docs:** https://mise.jdx.dev/ - mise documentation

## Getting Help

- **GitHub Discussions:** https://github.com/thegetty/quire/discussions
- **Issue Tracker:** https://github.com/thegetty/quire/issues
- **Newsletter:** https://newsletters.getty.edu/h/t/DDE7B9372AAF01E4
