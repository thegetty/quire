# Quire CLI Architecture

This document describes the architecture of the Quire CLI package (`@thegetty/quire-cli`), including component structure, data flows, and module dependencies.

## Overview

The Quire CLI is a command-line interface for creating and managing Quire digital publications. It uses Commander.js for command parsing and follows a modular architecture with clear separation between commands, library modules, and helpers.

## Entry Points

| File | Purpose |
|------|---------|
| `bin/cli.js` | Main executable entry point |
| `src/main.js` | Application setup and command registration |
| `src/Command.js` | Base class for all commands |

## Commander.js Conventions

The CLI uses [Commander.js](https://github.com/tj/commander.js) for command parsing. Key conventions:

### Boolean Option Negation

Commander automatically supports negating boolean options with the `--no-` prefix:

```javascript
// Definition
.option('-v, --verbose', 'show detailed progress output')

// Usage
quire build --verbose    // options.verbose = true
quire build --no-verbose // options.verbose = false
quire build              // options.verbose = undefined
```

This enables the config fallback pattern used throughout the CLI:

```javascript
// CLI flag takes precedence, then config setting, then default
const verbose = options.verbose ?? config.get('verbose') ?? false
```

See [Commander.js: Other option types](https://github.com/tj/commander.js#other-option-types-negatable-boolean-and-booleanvalue) for details.

## Architecture Layers

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLI Entry Point                         │
│                          (bin/cli.js)                           │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                         Command Layer                           │
│  create │ build │ preview │ pdf │ epub │ clean │ doctor │ ...   │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                         Library Layer                           │
│   11ty | conf | installer │ project │ pdf │ epub │ npm │ git    │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                         Helper Layer                            │
│       clean │ is-empty | os-utils │ test-cwd | which            │
└─────────────────────────────────────────────────────────────────┘
```

## Commands

| Command | File | Purpose |
|---------|------|---------|
| `new` | `create.js` | Create new Quire project from template |
| `build` | `build.js` | Generate static site using Eleventy |
| `preview` | `preview.js` | Run dev server with file watching |
| `pdf` | `pdf.js` | Generate PDF from built publication |
| `epub` | `epub.js` | Generate EPUB from built publication |
| `clean` | `clean.js` | Remove build outputs |
| `doctor` | `doctor.js` | Diagnose environment and project health |
| `conf` | `conf.js` | Manage CLI configuration |
| `info` | `info.js` | Display version information |
| `validate` | `validate.js` | Validate YAML configuration files |
| `version` | `version.js` | Set quire-11ty version for project |

## Library Modules

### Core Modules

| Module | Purpose | Pattern |
|--------|---------|---------|
| `lib/11ty` | Eleventy API and CLI integration | Façade |
| `lib/conf` | CLI-level configuration and per-project data persistence | Singleton |
| `lib/installer` | Project creation and quire-11ty installation | Exported functions |
| `lib/project` | Project paths, detection, config, versions | Class + singleton |

### External Process Façade

| Module | Purpose | Pattern |
|--------|---------|---------|
| `lib/npm` | Abstracted npm operations | Singleton |
| `lib/git` | Abstracted git operations | Class + singleton |

### Output Generation

| Module | Purpose | Backends |
|--------|---------|----------|
| `lib/pdf` | PDF generation | pagedjs, prince |
| `lib/epub` | EPUB generation | epubjs, pandoc |

### Utilities

| Module | Purpose |
|--------|---------|
| `lib/logger` | Logging façade with loglevel + chalk (log levels, colors, prefixes) |
| `lib/i18n` | Internationalization (in development) |

## Per-Project Data Persistence

The CLI persists per-project data in the **global** CLI configuration file rather than within individual project directories. This avoids polluting project repositories with CLI state and ensures data survives `quire clean` operations.

### What is persisted

Currently, only **build status** is persisted: the outcome (`ok` or `failed`) and timestamp of the last `build`, `pdf`, and `epub` command run for each project. This allows `quire doctor` to distinguish between "command never ran" (show N/A) and "command ran and failed" (show error) when no output files exist on disk.

### Storage location

Data is stored in the global CLI config file managed by the [conf](https://github.com/sindresorhus/conf) package:

| Platform | Path |
|----------|------|
| macOS | `~/Library/Preferences/@thegetty/quire-cli/config.json` |
| Linux | `~/.config/@thegetty/quire-cli/config.json` |
| Windows | `%APPDATA%/@thegetty/quire-cli/config.json` |

### Schema

Projects are stored under the `projects` key, keyed by a SHA-256 hash (first 12 hex characters) of the project's absolute path. The hash avoids dot-notation traversal issues in the conf library's key resolution.

```json
{
  "projects": {
    "a1b2c3d4e5f6": {
      "projectPath": "/Users/example/my-publication",
      "buildStatus": {
        "build": { "status": "ok", "timestamp": 1706400000000 },
        "pdf":   { "status": "failed", "timestamp": 1706400060000 },
        "epub":  { "status": "ok", "timestamp": 1706400120000 }
      }
    }
  }
}
```

The `projectPath` field stores the original path for reverse lookup and debugging. The schema is defined in `lib/conf/schema.js` and validated by the conf library on every write.

### Data flow

```
┌──────────────────────────────────────────────────────────────────────┐
│                      Commands (write)                                │
│                                                                      │
│   build.js ─┐                                                        │
│   pdf.js   ─┼── recordStatus(projectPath, command, 'ok'|'failed')    │
│   epub.js  ─┘                                                        │
│                         │                                            │
│                         ▼                                            │
│              lib/conf/build-status.js                                │
│                projectKey() ← SHA-256 hash                           │
│                         │                                            │
│                         ▼                                            │
│              lib/conf/config.js (global config singleton)            │
│                         │                                            │
│                         ▼                                            │
│              ~/.config/.../config.json                               │
│                                                                      │
│                         ▲                                            │
│                         │                                            │
│              lib/conf/build-status.js                                │
│             getStatus() / clearStatus()                              │
│                         │                                            │
│                         ▼                                            │
│  Doctor checks (read)                Clean/Doctor (clear)            │
│    stale-build.js ─┐                   clean --status ─┐             │
│    pdf-output.js  ─┼──> getStatus()    doctor --reset ─┼──> clearStatus()
│    epub-output.js ─┘                                   ┘             │
└──────────────────────────────────────────────────────────────────────┘
```

### API

The `lib/conf/build-status` module exports:

| Function | Purpose |
|----------|---------|
| `recordStatus(projectPath, command, status)` | Record `'ok'` or `'failed'` for a tracked command |
| `getStatus(projectPath, command)` | Retrieve `{ status, timestamp }` or `undefined` |
| `clearStatus(projectPath)` | Delete all build status for a project |
| `projectKey(projectPath)` | Derive the hashed config key for a project path |
| `TRACKED_COMMANDS` | Frozen array: `['build', 'pdf', 'epub']` |

### Clearing stored status

| Method | Effect |
|--------|--------|
| `quire clean --status` | Clear build status for the current project |
| `quire doctor --reset` | Clear build status and exit without running checks |

Neither `quire clean` (without `--status`) nor deleting output files clears the stored status. This is intentional: if a build failed, that information remains useful even after cleaning up.

## Helpers

| Helper | Purpose |
|--------|---------|
| `clean.js` | Delete build artifacts using 'del' library |
| `is-empty.js` | Check if directory is empty |
| `os-utils.js` | Cross-platform dynamic imports |
| `test-cwd.js` | Verify current directory is a Quire project |
| `which.js` | Locate executable in PATH |

## Design Patterns

### Singleton Pattern
Used for global operations where a single instance is shared:
- `config` - CLI configuration
- `git` (default export) - global git operations
- `logger` - logging façade (also supports factory pattern for module-specific loggers)
- `npm` - npm CLI operations

### Class Pattern
Used for scoped operations requiring multiple instances:
- `Git` class - repository-specific operations
- `Paths` class - project path management
- `Quire11ty` class - Eleventy integration

### Façade Pattern
Provides unified interfaces over complex subsystems:
- `lib/11ty` - unified interface over Eleventy API and CLI
- `lib/pdf` - resolves and delegates to PDF backend
- `lib/epub` - resolves and delegates to EPUB backend

### Factory Pattern
Creates instances based on runtime conditions:
- `commands/index.js` - dynamically imports and instantiates commands
- `lib/11ty/cli.js` factory() - constructs Eleventy CLI arguments
- `lib/logger` createLogger() - creates module-specific loggers with custom prefixes

---

## Appendix A: Component Diagrams

### High-Level Component Architecture

```mermaid
%% Nota bene: subgraph direction is not respected when there are external links
%% see https://github.com/mermaid-js/mermaid/issues/2509
graph TB
    subgraph Entry["Entry"]
        CLI[bin/cli.js] --> Main[main.js]
        Main --> Cmd[Command.js]
    end

    subgraph Commands["Commands"]
        direction LR
        C1[create<br/>build<br/>preview]
        C2[pdf<br/>epub<br/>clean]
        C3[doctor<br/>info<br/>validate<br/>version]
    end

    subgraph Libraries["Libraries"]
        direction LR
        L1[installer<br/>project<br/>11ty]
        L2[pdf<br/>epub<br/>conf]
        L3[doctor<br/>npm<br/>git<br/>logger]
    end

    subgraph Helpers["Helpers"]
        direction LR
        H1[clean<br/>test-cwd]
        H2[os-utils<br/>is-empty<br/>which]
    end

    Entry --> Commands
    Commands --> Libraries
    Libraries --> Helpers
```

### Project Module Structure

```mermaid
graph TB
    subgraph Project["lib/project"]
        Index[index.js]
        Paths[paths.js<br/>Paths class]
        Config[config.js]
        Detect[detect.js]
        Version[version.js]
    end

    Index --> Paths
    Index --> Config
    Index --> Detect
    Index --> Version

    Paths --> |getProjectRoot| FS[File System]
    Paths --> |getInputPath| FS
    Paths --> |getOutputPath| FS

    Config --> |loadProjectConfig| YAML[YAML Parser]
    Config --> |validate| AJV[AJV Validator]

    Detect --> |isQuireProject| FS

    Version --> |getVersion| FS
    Version --> |setVersion| FS
```

## Appendix B: Data Flow Diagrams

### Project Creation Flow (`quire new`)

```mermaid
sequenceDiagram
    participant User
    participant CLI as CreateCommand
    participant Inst as installer
    participant Git as Git
    participant NPM as npm
    participant Proj as project
    participant FS as File System

    User->>CLI: quire new <path> [starter]
    CLI->>Inst: initStarter(starter, path, options)

    Inst->>FS: ensureDirSync(path)
    Inst->>FS: isEmpty(path)

    Inst->>Git: new Git(path)
    Inst->>Git: clone(starter, '.')

    Inst->>Proj: getVersionsFromStarter(path)
    Inst->>NPM: getCompatibleVersion(pkg, range)
    Inst->>Proj: setVersion(version, path)
    Inst->>Proj: writeVersionFile(path, info)

    Inst->>FS: remove(.git)
    Inst->>FS: remove(package.json)
    Inst->>NPM: init(path)

    Inst->>Git: init()
    Inst->>Git: add('.')
    Inst->>Git: commit('Initial Commit')

    Inst-->>CLI: quireVersion

    CLI->>Inst: installInProject(path, version, options)

    Inst->>Git: rm(['package.json'])
    Inst->>NPM: pack(package, tempDir)
    Inst->>FS: extract tarball
    Inst->>FS: copy to project
    Inst->>NPM: install(path, {saveDev: true})
    Inst->>FS: remove(.temp)
    Inst->>Git: add('.')
    Inst->>Git: commit('Adds quire-11ty files')

    Inst-->>CLI: complete
    CLI-->>User: Project created
```

### Build Flow (`quire build`)

```mermaid
sequenceDiagram
    participant User
    participant CLI as BuildCommand
    participant Helper as test-cwd
    participant Clean as clean helper
    participant 11ty as lib/11ty
    participant Paths as project/paths
    participant Eleventy as Eleventy
    participant Status as build-status

    User->>CLI: quire build [options]

    CLI->>CLI: preAction()
    CLI->>Helper: testcwd()
    Helper->>Helper: isQuireProject()
    Helper-->>CLI: valid

    CLI->>Clean: clean(outputDirs)
    Clean-->>CLI: cleaned

    CLI->>CLI: action(options)

    alt API mode
        CLI->>11ty: build(options)
        11ty->>11ty: configureEleventyEnv()
        11ty->>Paths: getProjectRoot()
        11ty->>Paths: getInputPath()
        11ty->>11ty: createEleventyInstance()
        11ty->>Eleventy: new Eleventy(input, output)
        11ty->>Eleventy: write()
        Eleventy-->>11ty: complete
    else CLI mode
        CLI->>11ty: cli.build(options)
        11ty->>11ty: factory() - build args
        11ty->>Eleventy: execa('node', [...args])
        Eleventy-->>11ty: complete
    end

    alt success
        11ty-->>CLI: complete
        CLI->>Status: recordStatus(projectRoot, 'build', 'ok')
        CLI-->>User: Build complete
    else failure
        11ty-->>CLI: error
        CLI->>Status: recordStatus(projectRoot, 'build', 'failed')
        CLI-->>User: Build failed
    end
```

### PDF Generation Flow (`quire pdf`)

```mermaid
sequenceDiagram
    participant User
    participant CLI as PDFCommand
    participant PDF as lib/pdf
    participant Paths as project/paths
    participant Config as project/config
    participant Backend as paged.js/prince.js
    participant Split as split.js
    participant Status as build-status

    User->>CLI: quire pdf [options]

    CLI->>PDF: generatePdf(options)

    PDF->>PDF: resolveLibrary(options.lib)
    PDF->>Paths: getProjectRoot()
    PDF->>Config: loadProjectConfig()

    PDF->>PDF: check pdf.html exists
    PDF->>PDF: getOutputPath()

    PDF->>Backend: dynamicImport(backend)
    PDF->>Backend: generate(input, covers, output, options)

    Backend->>Backend: setup printer/prince
    Backend->>Backend: inject plugin script
    Backend->>Backend: generate PDF

    alt has multiple pages
        Backend->>Split: splitPdf(pdf, pageMap)
        Split-->>Backend: individual PDFs
    end

    alt success
        Backend-->>PDF: complete
        PDF-->>CLI: complete
        CLI->>Status: recordStatus(projectRoot, 'pdf', 'ok')
        CLI-->>User: PDF generated
    else failure
        Backend-->>PDF: error
        PDF-->>CLI: error
        CLI->>Status: recordStatus(projectRoot, 'pdf', 'failed')
        CLI-->>User: PDF generation failed
    end
```

### EPUB Generation Flow (`quire epub`)

```mermaid
sequenceDiagram
    participant User
    participant CLI as EpubCommand
    participant EPUB as lib/epub
    participant Paths as project/paths
    participant Backend as epubjs/pandoc
    participant Status as build-status

    User->>CLI: quire epub [options]

    CLI->>EPUB: generateEpub(options)

    EPUB->>EPUB: resolveLibrary(options.lib)
    EPUB->>Paths: getProjectRoot()

    EPUB->>EPUB: check epub source exists
    EPUB->>EPUB: getOutputPath()

    EPUB->>Backend: dynamicImport(backend)
    EPUB->>Backend: generate(input, output, options)

    Backend->>Backend: assemble EPUB contents
    Backend->>Backend: generate .epub file

    alt success
        Backend-->>EPUB: complete
        EPUB-->>CLI: complete
        CLI->>Status: recordStatus(projectRoot, 'epub', 'ok')
        CLI-->>User: EPUB generated
    else failure
        Backend-->>EPUB: error
        EPUB-->>CLI: error
        CLI->>Status: recordStatus(projectRoot, 'epub', 'failed')
        CLI-->>User: EPUB generation failed
    end
```

### Validation Flow (`quire validate`)

```mermaid
sequenceDiagram
    participant User
    participant CLI as ValidateCommand
    participant Helper as test-cwd
    participant FS as File System
    participant Validator as validate-yaml
    participant YAML as yaml parser
    participant AJV as AJV

    User->>CLI: quire validate [options]

    CLI->>CLI: preAction()
    CLI->>Helper: testcwd()
    Helper-->>CLI: valid

    CLI->>CLI: action(options)
    CLI->>FS: readdirSync(content/_data/)
    FS-->>CLI: YAML files

    loop each YAML file
        CLI->>Validator: yamlValidation(file)

        Validator->>YAML: load(content)
        YAML-->>Validator: document

        Validator->>Validator: getSchemaForDocument()
        Validator->>AJV: compile(schema)
        Validator->>AJV: validate(document)

        alt validation errors
            AJV-->>Validator: errors
            Validator-->>CLI: ValidationError
        end

        Validator->>Validator: validateImagePaths()
        Validator->>Validator: checkForDuplicateIds()

        Validator-->>CLI: valid
    end

    CLI-->>User: Validation results
```

---

## Appendix C: Module Dependencies

### Dependency Matrix

| Module | Dependencies |
|--------|--------------|
| `create` | installer, logger, fs-extra |
| `build` | 11ty, conf/build-status, helpers/clean, helpers/test-cwd |
| `preview` | 11ty, helpers/test-cwd |
| `pdf` | lib/pdf, conf/build-status, helpers/test-cwd |
| `epub` | lib/epub, conf/build-status, helpers/test-cwd |
| `clean` | conf/build-status, helpers/clean, helpers/test-cwd, project |
| `doctor` | conf/build-status, lib/doctor |
| `info` | npm, project, helpers/test-cwd |
| `validate` | project, helpers/test-cwd, validators |
| `version` | installer, project, helpers/test-cwd |
| `conf` | lib/conf |
| `installer` | git, npm, project |
| `11ty` | project, helpers/os-utils |
| `pdf` | project, helpers/os-utils |
| `epub` | project, helpers/os-utils |
| `npm` | helpers/which, execa |
| `git` | helpers/which, execa |

### Import Alias Reference

The CLI uses subpath imports defined in `package.json`:

| Alias | Path |
|-------|------|
| `#src/*` | `./src/*` |
| `#lib/*` | `./src/lib/*` |
| `#helpers/*` | `./src/helpers/*` |

---

## Appendix D: Testing Architecture

### Test File Conventions

| Pattern | Purpose |
|---------|---------|
| `*.spec.js` | Unit tests (command registration, API surface) |
| `*.test.js` | Integration tests (full command execution with mocks) |

### Mocking Strategy

```mermaid
graph TB
    subgraph TestFile["Test File (*.test.js)"]
        Test[Test Case]
    end

    subgraph Mocking["esmock Mocking"]
        MockFS[Mock fs-extra]
        MockNPM[Mock lib/npm]
        MockGit[Mock lib/git]
        MockLogger[Mock lib/logger<br/>{ logger: mockLogger }]
    end

    subgraph RealCode["Real Code Under Test"]
        Command[Command Class]
        Lib[Library Module]
    end

    Test --> |esmock| Command
    Test --> |inject| MockFS
    Test --> |inject| MockNPM
    Test --> |inject| MockGit
    Test --> |inject| MockLogger

    Command --> Lib
```

### Test Example Pattern

```javascript
// Example: Mocking for create.test.js
const CreateCommand = await esmock('./create.js', {
  '#lib/installer/index.js': { installer: mockInstaller },
  '#lib/git/index.js': { Git: MockGit },
  '#lib/npm/index.js': { default: mockNpm },
  '#lib/logger/index.js': { logger: mockLogger },
  'fs-extra': mockFs
})
```
