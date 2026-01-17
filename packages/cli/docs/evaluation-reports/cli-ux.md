# Quire CLI User Experience Evaluation

**Date:** 2026-01-17
**Evaluated Version:** 1.0.0-rc.33
**Last Updated:** 2026-01-17

---

## Executive Summary

This document evaluates the Quire CLI from three user perspectives and provides a staged implementation plan for improvements. The CLI is functional but has opportunities to improve clarity for non-technical users, power features for developers, and maintainability for contributors.

**Overall UX Grade: B (7.5/10)**

---

## Current CLI Output

```
$ quire --help
Usage: quire [options] [command]

Quire command-line interface

Options:
  -v, --version   output quire version number
      --verbose   enable verbose output for debugging
  -h, --help      display help for command

Commands:
  build           run build
  clean           remove build outputs
  conf|config     read/write quire-cli configuration options
  new             create a new project
  epub            run build epub
  info            list info
  pdf             run build pdf
  preview         run the development server
  validate        run validation
  version         set the @thegetty/quire-11ty version
  help            display help for command
```

---

## Evaluation by User Persona

### 1. Non-Technical User (Content Creator/Editor)

**Profile:** Museum curator, editor, or author using Quire to create digital publications. Limited command-line experience.

#### Strengths

| Feature | Assessment |
|---------|------------|
| Simple core workflow | `new`, `preview`, `build` cover 90% of use cases |
| `--open` flag | User-friendly for pdf/epub commands |
| Examples in help | Helpful for understanding usage |
| Docs links | Points to relevant documentation |

#### Pain Points

| Issue | Impact | Example |
|-------|--------|---------|
| **Cryptic summaries** | Users don't understand commands from `quire --help` | "run build", "list info", "run validation" |
| **`version` command confusion** | Clashes with `-v, --version` flag semantics | User expects `quire version` to show version, not set it |
| **No guided workflow** | Users must know to run `build` before `pdf`/`epub` | Error messages after running `pdf` without `build` |
| **`conf` is jargon** | Non-technical users don't understand "configuration" | Would understand "settings" better |
| **No progress indicators** | Long operations provide no feedback | `build` and `pdf` can take 30+ seconds |
| **Validation scope unclear** | "Validate configuration files" is vague | What files? What errors can it catch? |

#### Missing Features

- `quire publish` or `quire deploy` command
- `quire check` (pre-flight validation before building)
- Interactive mode for `quire new` (starter template selection)
- `quire update` (update quire-11ty version easily)

#### Recommended Summary Improvements

| Command | Current | Proposed |
|---------|---------|----------|
| build | "run build" | "generate HTML site files" |
| clean | "remove build outputs" | "delete generated files" |
| epub | "run build epub" | "generate EPUB e-book" |
| info | "list info" | "show version information" |
| pdf | "run build pdf" | "generate print-ready PDF" |
| preview | "run the development server" | "start local preview server" |
| validate | "run validation" | "check YAML files for errors" |
| version | "set the @thegetty/quire-11ty version" | Rename to `use` or `switch` |

---

### 2. Developer (Complex Quire Project)

**Profile:** Developer working on a customized Quire publication, possibly with custom templates, shortcodes, or integrations.

#### Strengths

| Feature | Assessment |
|---------|------------|
| `--debug` and `--verbose` flags | Available on most commands |
| `DEBUG=` environment variable | Granular control for specific modules |
| Library selection | pdf (`pagedjs`/`prince`), epub (`epubjs`/`pandoc`) |
| `--dry-run` | Safe testing for build/clean |
| `--11ty` flag | Choose API vs CLI mode |

#### Pain Points

| Issue | Impact | Example |
|-------|--------|---------|
| **Inconsistent option naming** | `--lib` for pdf/epub, `--11ty` for build/preview | Should be unified |
| **Three debugging mechanisms** | `--debug`, `--verbose`, `DEBUG=` unclear hierarchy | When to use which? |
| **No `--output` option** | Can't specify custom output paths | CI/CD workflows need this |
| **No `--config` option** | Can't use alternate config files | Testing/staging scenarios |
| **`--11ty` flag is obscure** | Implementation detail exposed to users | Most users don't need this |
| **`choices` not shown in help** | `--lib` doesn't display available options | Must guess or check docs |
| **No watch mode for pdf/epub** | Must manually re-run after changes | Development workflow friction |

#### Missing Features

- `quire serve` alias for `preview`
- `quire dev` (preview + watch + auto-rebuild)
- Build profiles (`quire build --profile production`)
- `quire doctor` (diagnose environment issues)
- `--output` / `-o` option for custom output paths
- `--config` / `-c` option for alternate config files

#### Recommended Option Standardization

| Current | Proposed | Rationale |
|---------|----------|-----------|
| `--lib <module>` (pdf/epub) | `--engine <name>` | Consistent terminology |
| `--11ty <module>` (build/preview) | Remove or hide | Implementation detail |
| Add new | `--output <path>` | CI/CD workflows |
| Add new | `--config <path>` | Testing scenarios |

---

### 3. CLI Maintainer/Extender

**Profile:** Developer maintaining the Quire CLI or extending it with new commands.

#### Strengths

| Feature | Assessment |
|---------|------------|
| Command base class pattern | Clean, consistent structure |
| Declarative definitions | `static definition` is clear |
| Separation of `docsLink`/`helpText` | Flexible help customization |
| Import aliases | `#src/`, `#lib/`, `#helpers/` |
| Test structure | `.spec.js` unit, `.test.js` integration |

#### Pain Points

| Issue | Location | Fix |
|-------|----------|-----|
| **Inconsistent hook signatures** | `preAction(command)` vs `preAction(options, command)` | Standardize to Commander pattern |
| **`alias instanceof String` bug** | main.js:94 | Use `typeof alias === 'string'` |
| **Unused `command` parameters** | Multiple action methods | Remove or use consistently |
| **Magic strings for operations** | conf.js `OPERATIONS` array | Export as constant |
| **Unused command `version` property** | All commands | Either use for deprecation or remove |
| **Broken `definition()` method** | Command.js:74 | `this.prototype` is wrong |
| **Option parsing formats** | Three different formats | Document preferred format |
| **`testcwd` duplication** | Copy-pasted across commands | Extract to base class |

#### Code Quality Issues

```javascript
// Bug: alias instanceof String is never true for string literals
if (alias instanceof String) {  // Line 94 in main.js
  subCommand.alias(alias)
}

// Should be:
if (typeof alias === 'string') {
  subCommand.alias(alias)
}
```

```javascript
// Broken: this.prototype doesn't exist on instances
definition() {
  return this.prototype.definition  // Line 74-76 in Command.js
}

// Should be:
definition() {
  return this.constructor.definition
}
```

#### Architectural Suggestions

**Current lib/ structure:**
```
lib/
├── 11ty/       # Eleventy integration
├── conf/       # Configuration
├── epub/       # EPUB generation
├── git/        # Git operations
├── installer/  # Project creation
├── logger/     # Logging
├── npm/        # npm operations
├── pdf/        # PDF generation
├── project/    # Project paths/detection
└── reporter/   # Progress reporting
```

**Suggested grouping:**
```
lib/
├── output/         # Group output formats
│   ├── html/       # (was 11ty)
│   ├── pdf/
│   └── epub/
├── project/        # Project-level concerns
│   ├── installer/
│   ├── paths/
│   └── config/
├── external/       # External tool wrappers
│   ├── git/
│   └── npm/
└── core/           # Cross-cutting
    ├── conf/
    ├── logger/
    └── reporter/
```

---

## Implementation Plan

### Stage 1: Quick Wins (1-2 days)

**Target:** All three user personas benefit
**Risk:** Low
**Breaking Changes:** None

| Task | Persona | File(s) | Effort |
|------|---------|---------|--------|
| Fix `alias instanceof String` bug | Maintainer | main.js | 5 min |
| Fix broken `definition()` method | Maintainer | Command.js | 5 min |
| Update command summaries to be descriptive | Non-technical | All command files | 1 hour |
| Standardize preAction signatures | Maintainer | validate.js, others | 30 min |
| Add `serve` alias for `preview` | Developer | preview.js | 5 min |

### Stage 2: Help Text & Documentation (1 week)

**Target:** Non-technical users, Developers
**Risk:** Low
**Breaking Changes:** None

| Task | Persona | File(s) | Effort |
|------|---------|---------|--------|
| Show `choices` in option help text | Developer | main.js option parsing | 2 hours |
| Add usage examples to all commands | Non-technical | All command helpText | 2 hours |
| Document debugging hierarchy | Developer | main.js mainHelpText | 1 hour |
| Add "common workflows" section to help | Non-technical | main.js mainHelpText | 1 hour |

### Stage 3: Option Standardization (1 week)

**Target:** Developers, Maintainers
**Risk:** Medium (deprecation needed)
**Breaking Changes:** Deprecate `--lib`, `--11ty`

| Task | Persona | File(s) | Effort |
|------|---------|---------|--------|
| Rename `--lib` to `--engine` (keep alias) | Developer | pdf.js, epub.js | 2 hours |
| Hide `--11ty` option (keep functional) | Developer | build.js, preview.js | 1 hour |
| Add `--output` option to build/pdf/epub | Developer | build.js, pdf.js, epub.js | 4 hours |
| Add `--config` option | Developer | All commands | 4 hours |
| Create shared options module | Maintainer | lib/options.js | 2 hours |

### Stage 4: Command Naming (2 weeks)

**Target:** Non-technical users
**Risk:** High (breaking change)
**Breaking Changes:** Rename `version` command

| Task | Persona | Impact | Effort |
|------|---------|--------|--------|
| Rename `version` to `use` | Non-technical | Breaking | 2 hours |
| Add `settings` alias for `conf` | Non-technical | Non-breaking | 5 min |
| Add deprecation warning for old names | All | Non-breaking | 2 hours |
| Update all documentation | All | Required | 4 hours |

### Stage 5: Developer Experience (2-3 weeks)

**Target:** Developers
**Risk:** Medium
**Breaking Changes:** None

| Task | Persona | File(s) | Effort |
|------|---------|---------|--------|
| Add `quire doctor` command | Developer | commands/doctor.js | 8 hours |
| Add `--watch` to pdf/epub | Developer | pdf.js, epub.js | 8 hours |
| Add progress indicators | All | lib/reporter integration | 8 hours |
| Improve error messages | All | All commands | 8 hours |

### Stage 6: Non-Technical User Experience (3-4 weeks)

**Target:** Non-technical users
**Risk:** Medium
**Breaking Changes:** None

| Task | Persona | File(s) | Effort |
|------|---------|---------|--------|
| Interactive `quire new` | Non-technical | create.js | 16 hours |
| Auto-run build before pdf/epub | Non-technical | pdf.js, epub.js | 4 hours |
| Add `quire update` command | Non-technical | commands/update.js | 8 hours |
| Add `quire check` pre-flight | Non-technical | commands/check.js | 8 hours |

---

## Priority Matrix

```
                    HIGH IMPACT
                        │
     Stage 4            │           Stage 1
  (Command Naming)      │        (Quick Wins)
                        │
                        │
HIGH ───────────────────┼─────────────────── LOW
EFFORT                  │                   EFFORT
                        │
     Stage 5-6          │           Stage 2-3
  (New Features)        │      (Help & Options)
                        │
                    LOW IMPACT
```

**Recommended Order:**
1. Stage 1 (Quick Wins) - Immediate
2. Stage 2 (Help Text) - This sprint
3. Stage 3 (Options) - Next sprint
4. Stage 4 (Naming) - Plan for major version
5. Stage 5-6 (Features) - Roadmap items

---

## Success Metrics

### Non-Technical User
- [ ] Can understand all commands from `quire --help` alone
- [ ] Zero confusion between `version` command and `-v` flag
- [ ] Clear error messages guide users to solutions
- [ ] Progress indicators for operations > 2 seconds

### Developer
- [ ] Consistent option naming across all commands
- [ ] Clear documentation of debugging options
- [ ] `--output` and `--config` available for CI/CD
- [ ] `choices` visible in help text

### Maintainer
- [ ] Zero bugs in base Command class
- [ ] Consistent hook signatures
- [ ] Documented preferred patterns
- [ ] Shared options reduce duplication

---

## Appendix: Current vs Proposed Help Output

### Current
```
$ quire --help
Commands:
  build      run build
  clean      remove build outputs
  epub       run build epub
  info       list info
  pdf        run build pdf
  preview    run the development server
  validate   run validation
  version    set the @thegetty/quire-11ty version
```

### Proposed
```
$ quire --help
Commands:
  build      Generate HTML site files
  clean      Delete generated files
  epub       Generate EPUB e-book
  info       Show version information
  pdf        Generate print-ready PDF
  preview    Start local preview server
  validate   Check YAML files for errors
  use        Set Quire version for this project

Aliases:
  serve      Alias for preview
  settings   Alias for conf
```

---

**Document Version:** 1.0
**Author:** Claude Code
**Next Review:** After Stage 1 implementation
