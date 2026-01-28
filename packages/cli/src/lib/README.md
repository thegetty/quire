# CLI Library Modules

This directory contains domain-specific modules that encapsulate the core functionality of the Quire CLI. Each module is designed around a single responsibility and provides a façade for its domain.

## Architecture Overview

```
                            Commands Layer
                ┌─────────────────────────────────────────┐
                │  build  preview  new  pdf  epub  info   │
                └──────────────────┬──────────────────────┘
                                   │
                ┌──────────────────┴──────────────────────┐
                │              lib/ modules               │
                └─────────────────────────────────────────┘

     ┌─────────────────────────────────────────────────────────────────┐
     │                        Domain Modules                           │
     │  ┌────────────┐  ┌──────────┐  ┌────────────┐  ┌─────────────┐  │
     │  │ project/   │  │  11ty/   │  │   pdf/     │  │   epub/     │  │
     │  │            │  │          │  │            │  │             │  │
     │  │ - paths    │  │ - api    │  │ - pagedjs  │  │ - epubjs    │  │
     │  │ - config   │  │ - cli    │  │ - prince   │  │ - pandoc    │  │
     │  │ - detect   │  │          │  │            │  │             │  │
     │  │ - version  │  │          │  │            │  │             │  │
     │  └────┬───────┘  └────┬─────┘  └────┬───────┘  └──────┬──────┘  │
     └───────┼───────────────┼─────────────┼─────────────────┼─────────┘
             │               │             │                 │
             │      ┌────────┴─────────────┴─────────────────┘
             │      │
     ┌───────┴──────┴──────────────────────────────────────────────────┐
     │                     Installation Module                         │
     │  ┌──────────────────────────────────────────────────────────┐   │
     │  │                      installer/                          │   │
     │  │  - initStarter (clone starter, setup project)            │   │
     │  │  - installInProject (install @thegetty/quire-11ty)       │   │
     │  │  - latest (resolve version from npm)                     │   │
     │  │  - versions (list published versions)                    │   │
     │  └──────────────────────────────────────────────────────────┘   │
     └───────────────────────────────┬─────────────────────────────────┘
                                     │
     ┌───────────────────────────────┴─────────────────────────────────┐
     │                    Infrastructure Modules                       │
     │  ┌────────┐  ┌────────┐  ┌────────┐  ┌─────────┐  ┌──────────┐  │
     │  │  npm/  │  │  git/  │  │ conf/  │  │ error/  │  │ logger/  │  │
     │  │        │  │        │  │        │  │         │  │          │  │
     │  └────────┘  └────────┘  └────────┘  └─────────┘  └──────────┘  │
     │  ┌───────────┐  ┌───────────┐                                   │
     │  │ reporter/ │  │  ui/      │                                   │
     │  │           │  │ (prompt)  │                                   │
     │  └───────────┘  └───────────┘                                   │
     └─────────────────────────────────────────────────────────────────┘
```

## Module Reference

### Domain Modules

These modules encapsulate specific business domains of Quire.

#### `project/`
**Purpose:** Project-level concerns including paths, detection, configuration, and version management.

| Export | Description |
|--------|-------------|
| `paths` (default) | Singleton for path resolution |
| `Paths` | Class for custom path instances |
| `detect(dirpath)` | Check if directory is a Quire project |
| `loadProjectConfig(projectRoot?)` | Load and validate project config |
| `getVersion(projectPath?)` | Read `quire-11ty` version from project |
| `setVersion(version, projectPath?)` | Write `quire-11ty` version to project |
| `getVersionsFromStarter(projectPath)` | Read versions from starter package.json |
| `readVersionFile(projectPath)` | Read raw version file contents |
| `writeVersionFile(projectPath, info)` | Write version file contents |

**Dependencies:** `conf/`, `fs-extra`

#### `11ty/`
**Purpose:** Eleventy build system integration via API or CLI.

| Export | Description |
|--------|-------------|
| `api` | Programmatic Eleventy control |
| `cli` | CLI-based Eleventy execution |
| `paths` | Re-exported from `project/` |
| `Paths` | Re-exported from `project/` |

**Dependencies:** `project/`

#### `pdf/`
**Purpose:** PDF generation using Prince or Paged.js.

| Export | Description |
|--------|-------------|
| `default` | Factory returning configured PDF generator |

**Implementations:** `prince.js`, `paged.js`

**Dependencies:** `project/`

#### `epub/`
**Purpose:** EPUB generation using Pandoc.

| Export | Description |
|--------|-------------|
| `default` | EPUB generator façade |

**Dependencies:** `project/`

#### `installer/`
**Purpose:** Installation of `@thegetty/quire-11ty` into Quire projects.

| Export | Description |
|--------|-------------|
| `installer` | Object with all installer methods |
| `initStarter(starter, projectPath, options)` | Clone and setup starter project |
| `installInProject(projectPath, version, options)` | Install `@thegetty/quire-11ty` package |
| `latest(version?)` | Resolve version from npm registry |
| `versions()` | List all published `@thegetty/quire-11ty` versions |

**Dependencies:** `project/`, `npm/`, `git/`

### Infrastructure Modules

These modules provide cross-cutting concerns and external tool integrations.

#### `npm/`
**Purpose:** NPM operations façade.

| Export | Description |
|--------|-------------|
| `default` | Singleton npm façade |
| `init(cwd, options?)` | Run `npm init` |
| `install(cwd, options?)` | Run `npm install` |
| `pack(spec, dest, options?)` | Run `npm pack` |
| `cacheClean(cwd?)` | Run `npm cache clean` |
| `view(pkg, field?)` | Query package info |
| `show(pkg, field?)` | Query package versions |
| `version()` | Get npm version |
| `isAvailable()` | Check npm in PATH |
| `fetchFromRegistry(pkg)` | Direct registry API call |
| `getCompatibleVersion(pkg, range)` | Resolve semver range |

**Dependencies:** `execa`, `node-fetch`

#### `git/`
**Purpose:** Git operations via simple-git.

| Export | Description |
|--------|-------------|
| `default` | Configured simple-git instance |

**Dependencies:** `simple-git`

#### `conf/`
**Purpose:** CLI configuration persistence and schema-aware helpers.

| Export | Source | Description |
|--------|--------|-------------|
| `default` | `config.js` | `Conf` singleton instance |
| `isValidKey(key)` | `helpers.js` | Check if key exists in schema |
| `getValidKeys()` | `helpers.js` | Sorted array of all schema keys |
| `coerceValue(key, value)` | `helpers.js` | Coerce CLI string to schema type |
| `formatValidationError(key, value)` | `helpers.js` | Format error with enum/description hints |
| `getDefault(key)` | `helpers.js` | Get default value for a key |
| `getKeyDescription(key)` | `helpers.js` | Get schema description for a key |
| `formatSettings(store, options)` | `helpers.js` | Format all settings for display |

Uses a barrel export (`index.js`) rather than a wrapper class to keep pure helper functions separate from the stateful `Conf` singleton. This avoids circular dependencies with the logger module and keeps helpers directly testable without mocking.

**Dependencies:** `conf`

#### `logger.js`
**Purpose:** Logging abstraction.

| Export | Description |
|--------|-------------|
| `default` | Logger instance (loglevel) |

**Dependencies:** `loglevel`

#### `reporter/`
**Purpose:** Progress reporting for long-running operations.

| Export | Description |
|--------|-------------|
| `default` | Reporter façade |

#### `error/`
**Purpose:** Centralized error handling and formatting.

| Export | Description |
|--------|-------------|
| `formatError(error, options)` | Format error for display |
| `handleError(error, options)` | Handle single error (format, log, exit) |
| `handleErrors(errors, options)` | Handle multiple errors (batch validation) |

**Features:**
- Consistent error formatting with suggestion, docs URL, file path
- Debug mode shows error codes and stack traces
- Conditional `--debug` hint (controlled by `showDebugHint` property)
- Exit code management per error category

**Dependencies:** `logger/`

#### `ui/`
**Purpose:** Display and interactive prompt

_Future feature: Not yet impemented._

## Design Patterns

### Singleton façade
Most modules export a singleton instance as the default export:
```javascript
import npm from '#lib/npm/index.js'
await npm.install('/path/to/project')
```

### Optional Parameters with Defaults
Functions that operate on projects default to `cwd` when path not provided:
```javascript
// Uses current working directory
setVersion('1.0.0')

// Uses explicit path
setVersion('1.0.0', '/path/to/project')
```

### Re-exports for Convenience
Modules re-export commonly used dependencies:
```javascript
// 11ty/ re-exports paths from project/
import { paths } from '#lib/11ty/index.js'
```

## Import Aliases

Use these aliases for imports:

| Alias | Path |
|-------|------|
| `#lib/` | `src/lib/` |
| `#src/` | `src/` |
| `#helpers/` | `src/helpers/` |

Example:
```javascript
import npm from '#lib/npm/index.js'
import { installer } from '#lib/installer/index.js'
import paths, { loadProjectConfig } from '#lib/project/index.js'
```

## Testing

Each module has associated test files:

| Pattern | Purpose |
|---------|---------|
| `*.spec.js` | Unit tests (interface contracts) |
| `*.test.js` | Integration tests (with mocked dependencies) |

Tests use:
- **AVA** for test runner
- **esmock** for ESM module mocking
- **sinon** for stubs and spies
- **memfs** for in-memory filesystem

## Adding a New Module

1. Create directory: `lib/<module-name>/`
2. Create entry point: `index.js` with façade pattern
3. Export singleton or factory as default
4. Add tests: `index.spec.js` and/or `index.test.js`
5. Update this README with module documentation
