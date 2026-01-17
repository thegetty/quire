# Quire - Claude Code Guide

## Project Overview

Quire is a digital publishing tool developed by Getty that creates dynamic publications in multiple formats (web, print, e-book). It's optimized for scholarly publishing with rich visual imagery, accessibility, and long-term stability.

**Version:** 1.0.0-rc.33 (pre-release)
**License:** BSD 3-clause
**Repository:** https://github.com/thegetty/quire
**Documentation:** https://quire.getty.edu

## Project Conventions

### Quire Emoji

The project uses 📖 as the official Quire emoji in documentation and tooling.

**Usage:**
- **mise.toml:** Available as `$QUIRE_EMOJI` environment variable
- **Documentation:** Use 📖 directly in markdown files
- **Git commits:** Optional, use at your discretion
- **Tool output:** Use in CLI messages, hooks, and developer-facing output

**To change:** Update the `QUIRE_EMOJI` value in `mise.toml` line 8

## Repository Structure

This is a monorepo using npm workspaces with the following packages:

```
quire/
├── packages/
│   ├── 11ty/         # Eleventy static site generator (@thegetty/quire-11ty)
│   ├── cli/          # Command-line interface (@thegetty/quire-cli)
│   └── eslint/       # ESLint configuration
├── _tests/           # End-to-end tests
└── playwright/       # Browser tests
```

### Package Details

#### CLI Package (`packages/cli/`)
- **Purpose:** Command-line interface for Quire
- **Entry point:** `bin/cli.js`
- **Key dependencies:** Commander, Inquirer, Loglevel, Execa
- **Testing:** AVA (unit, integration, e2e tests)
- **Module type:** ES modules
- **Current feature branch:** `feature/logger-abstraction`

#### 11ty Package (`packages/11ty/`)
- **Purpose:** Eleventy-based static site generator
- **Entry point:** `.eleventy.js`
- **Key dependencies:** Eleventy 3.x, Vite, Lit, Markdown-it plugins
- **Testing:** AVA + Node native test runner
- **Build system:** Vite for bundling

## Commands

### Quick Start with mise

This project uses [mise](https://mise.jdx.dev/) for task automation and version management. See [DEVELOPMENT.md](DEVELOPMENT.md) for full guide.

```bash
mise help        # Show common tasks (alias: mise h)
mise tasks       # List all available tasks
mise install     # Install dependencies (like CI)
mise test        # Run all tests
mise test:cli    # Run CLI tests only (~2s)
mise e2e         # Run E2E tests (~2-5 min)
mise cv          # Validate CircleCI config
mise docker:shell # Docker shell (CI environment)
```

### Quire CLI Commands
```bash
quire new <projectName>   # Create new Quire project
quire preview             # Run preview server
quire build               # Generate HTML site files
quire pdf                 # Generate PDF (requires build first)
quire epub                # Generate EPUB (requires build first)
quire clean               # Remove old build outputs
```

### Development Commands
```bash
npm test                  # Run all tests (AVA + Playwright)
npm run test:browsers     # Browser tests only
npm run test:clean        # Clean test artifacts
npm run test:serve        # Serve test site
```

### CLI Package Commands
```bash
cd packages/cli
npm run lint              # Lint source code
npm run lint:fix          # Auto-fix linting issues
npm test                  # Run all CLI tests
npm run test:unit         # Unit tests only
npm run test:integration  # Integration tests only
npm run docs              # Generate CLI documentation
```

### 11ty Package Commands
```bash
cd packages/11ty
npm run dev               # Development server
npm run build             # Production build
npm run clean             # Clean build artifacts
npm run lint              # Lint source code
npm test                  # Run all tests
```

## Technology Stack

- **Runtime:** Node.js >= 22 (LTS required)
- **Static Site Generator:** Eleventy 3.x
- **Build Tool:** Vite 6.x
- **Testing:** AVA 6.x, Playwright 1.x
- **Component Framework:** Lit 3.x
- **CSS Framework:** Bulma 0.9
- **Markdown Engine:** Markdown-it with plugins (footnotes, deflist, attrs, etc.)
- **PDF Generation:** PrinceXML or Paged.js
- **EPUB Generation:** epubjs-cli
- **Package Manager:** npm with workspaces

## Testing

### Test Structure
- **End-to-end tests:** `/_tests/` directory (AVA)
- **Browser tests:** `/playwright/` (Playwright)
- **CLI unit tests:** `packages/cli/src/commands/**/*.spec.js`
- **CLI integration tests:** `packages/cli/src/commands/**/*.test.js`
- **11ty plugin tests:** `packages/11ty/_plugins/**/test/*.spec.js`

### Running Tests
```bash
# All tests (includes 360s timeout for E2E)
npm test

# Browser tests with custom pathname
QUIRE_TEST_PUB_PATHNAME=1 npx playwright test

# Watch mode for CLI
cd packages/cli && npm run test:watch

# Coverage report
cd packages/cli && npm run test:coverage
```

### Cross-Platform Path Handling in Tests

Tests run on Linux, macOS, and Windows (CI uses all three). When writing tests that involve file paths:

**DO use `path.join()` for path construction:**
```javascript
import path from 'node:path'

// Good - works on all platforms
const filePath = path.join('content', 'file.md')
statSync.withArgs(filePath).returns({ mtimeMs: sourceTime })

// Bad - fails on Windows (expects backslashes)
statSync.withArgs('content/file.md').returns({ mtimeMs: sourceTime })
```

**Key rules:**
- Always use `path.join()` when constructing paths for stubs/mocks
- Never hardcode forward slashes in path strings used for assertions or stubs
- Use `path.sep` if you need to check the separator character
- For regex patterns matching paths, account for both `/` and `\\`

## Current Work

**Branch:** `feature/logger-abstraction`

Recent commits show work on:
- CLI integration tests
- CLI command unit tests
- Documentation updates for CLI modules
- Merging from main branch

Files changed:
- Deleted: `packages/11ty/package-lock.json`, `packages/cli/package-lock.json`
- Untracked: `.claude/`, `mise.toml`, `packages/cli/docs/`

## Development Guidelines

### Code Style
- ES modules (type: "module")
- Use import aliases defined in `imports` field
- CLI uses `#src/`, `#helpers/`, `#lib/` aliases
- 11ty uses `#root/`, `#includes/`, `#layouts/`, `#lib/`, `#plugins/` aliases
- ESLint with Standard config
- No emojis in code unless explicitly requested

### Comment Conventions
- Use "Nota bene:" for important context notes (preferred over "NB:" or "Note:")
- Example: `// Nota bene: reporter lifecycle is owned by façade, not command`

### Key Dependencies
- **Logger:** loglevel (abstraction layer in progress)
- **Git operations:** simple-git
- **Validation:** AJV (JSON schema)
- **CLI framework:** Commander
- **Prompts:** Inquirer
- **Process execution:** Execa
- **IIIF support:** Canvas Panel, IIIF helpers/parser/vault
- **Citations:** Citation.js
- **Image processing:** Sharp, Eleventy Image

### Module Aliases
When working with code:
- CLI: Use `#src/`, `#helpers/`, `#lib/` for imports
- 11ty: Use `#plugins/`, `#lib/`, `#includes/`, `#layouts/` for imports

## Common Tasks

### Adding a New CLI Command
1. Create command file in `packages/cli/src/commands/`
2. Create unit test: `*.spec.js`
3. Create integration test: `*.test.js`
4. Register command in `bin/cli.js`
5. Update documentation: `npm run docs`

### Working with 11ty Plugins
1. Plugins are in `packages/11ty/_plugins/`
2. Each plugin should have tests in `test/*.spec.js`
3. Register in `.eleventy.js`
4. Follow existing patterns for configuration

### Running Local Development
```bash
# 1. Install dependencies
npm install

# 2. For CLI development
cd packages/cli
npm run lint
npm test

# 3. For 11ty development
cd packages/11ty
npm run dev  # Starts dev server
```

## Important Notes

- This is a **pre-release** (rc.33) - expect changes
- Requires Node.js >= 22
- Uses npm workspaces - install from root
- Test timeout is 360s for publication builds
- Browser tests run with and without pathname configuration
- Git for Windows required on Windows
- PrinceXML or Paged.js needed for PDF generation

## Resources

### Development
- **Development Guide:** [DEVELOPMENT.md](DEVELOPMENT.md) - Local development, mise usage, testing, CI integration
- **CircleCI Guide:** [.circleci/README.md](.circleci/README.md) - CI/CD pipeline documentation and debugging

### External
- **Documentation:** https://quire.getty.edu/docs-v1/
- **Community Forum:** https://github.com/thegetty/quire/discussions
- **Issue Tracker:** https://github.com/thegetty/quire/issues
- **Newsletter:** https://newsletters.getty.edu/h/t/DDE7B9372AAF01E4
- **Contributing:** https://github.com/thegetty/quire/blob/main/CONTRIBUTING.md

## Output Formats

Quire publications support:
- **Web:** Responsive HTML with full-text search
- **PDF:** Print-ready via PrinceXML or Paged.js
- **EPUB:** E-book format via epubjs-cli

Features include:
- Page-level citation
- Footnotes and bibliographies
- Figure images and groups
- IIIF image support
- Video/audio embeds
- Zooming images and maps
- Web accessibility (WCAG compliant)
- SEO optimized
