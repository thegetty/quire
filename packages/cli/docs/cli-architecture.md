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
│   create │ build │ preview │ pdf │ epub │ clean │ info │ ...    │
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
| `conf` | `conf.js` | Manage CLI configuration |
| `info` | `info.js` | Display version information |
| `validate` | `validate.js` | Validate YAML configuration files |
| `version` | `version.js` | Set quire-11ty version for project |

## Library Modules

### Core Modules

| Module | Purpose | Pattern |
|--------|---------|---------|
| `lib/11ty` | Eleventy API and CLI integration | Facade |
| `lib/conf` | CLI-level configuration management | Singleton |
| `lib/installer` | Project creation and quire-11ty installation | Exported functions |
| `lib/project` | Project paths, detection, config, versions | Class + singleton |

### External Process Facades

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
| `lib/logger` | Console abstraction for testability |
| `lib/i18n` | Internationalization (in development) |

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
- `logger` - console logging
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

---

## Appendix A: Component Diagrams

### A.1 High-Level Component Architecture

```mermaid
graph TB
    subgraph Entry["Entry Layer"]
        CLI[bin/cli.js]
        Main[src/main.js]
        Cmd[src/Command.js]
    end

    subgraph Commands["Command Layer"]
        Create[create]
        Build[build]
        Preview[preview]
        PDF[pdf]
        EPUB[epub]
        Clean[clean]
        Info[info]
        Validate[validate]
        Version[version]
        Conf[conf]
    end

    subgraph Libraries["Library Layer"]
        Installer[lib/installer]
        Project[lib/project]
        Eleventy[lib/11ty]
        PDFLib[lib/pdf]
        EPUBLib[lib/epub]
        NPM[lib/npm]
        Git[lib/git]
        Config[lib/conf]
        Logger[lib/logger]
    end

    subgraph Helpers["Helper Layer"]
        CleanHelper[helpers/clean]
        TestCwd[helpers/test-cwd]
        OSUtils[helpers/os-utils]
        IsEmpty[helpers/is-empty]
        Which[helpers/which]
    end

    CLI --> Main
    Main --> Cmd
    Main --> Commands

    Create --> Installer
    Build --> Eleventy
    Preview --> Eleventy
    PDF --> PDFLib
    EPUB --> EPUBLib
    Clean --> CleanHelper
    Info --> NPM
    Validate --> Project
    Version --> Installer

    Installer --> Git
    Installer --> NPM
    Installer --> Project
    Eleventy --> Project
    PDFLib --> Project
    EPUBLib --> Project
```

### A.2 Project Module Structure

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

### A.3 External Process Façades

```mermaid
graph LR
    subgraph Facades["Process Facades"]
        NPM[lib/npm<br/>Npm class]
        Git[lib/git<br/>Git class]
    end

    subgraph External["External Processes"]
        NPMProc[npm CLI]
        GitProc[git CLI]
    end

    NPM --> |execa| NPMProc
    Git --> |execa| GitProc

    NPM --> |init| NPMProc
    NPM --> |install| NPMProc
    NPM --> |pack| NPMProc
    NPM --> |view| NPMProc

    Git --> |clone| GitProc
    Git --> |init| GitProc
    Git --> |add| GitProc
    Git --> |commit| GitProc
    Git --> |rm| GitProc
```

### A.4 Output Generation Backends

```mermaid
graph TB
    subgraph PDF["lib/pdf"]
        PDFIndex[index.js<br/>Facade]
        Paged[paged.js<br/>Paged.js backend]
        Prince[prince.js<br/>PrinceXML backend]
        Split[split.js]
    end

    subgraph EPUB["lib/epub"]
        EPUBIndex[index.js<br/>Facade]
        EPUBjs[epub.js<br/>EPUB.js backend]
        Pandoc[pandoc.js<br/>Pandoc backend]
    end

    PDFIndex --> |lib=paged| Paged
    PDFIndex --> |lib=prince| Prince
    Paged --> Split
    Prince --> Split

    EPUBIndex --> |lib=epubjs| EPUBjs
    EPUBIndex --> |lib=pandoc| Pandoc
```

---

## Appendix B: Data Flow Diagrams

### B.1 Project Creation Flow (`quire new`)

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

### B.2 Build Flow (`quire build`)

```mermaid
sequenceDiagram
    participant User
    participant CLI as BuildCommand
    participant Helper as test-cwd
    participant Clean as clean helper
    participant 11ty as lib/11ty
    participant Paths as project/paths
    participant Eleventy as Eleventy

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

    11ty-->>CLI: complete
    CLI-->>User: Build complete
```

### B.3 PDF Generation Flow (`quire pdf`)

```mermaid
sequenceDiagram
    participant User
    participant CLI as PDFCommand
    participant PDF as lib/pdf
    participant Paths as project/paths
    participant Config as project/config
    participant Backend as paged.js/prince.js
    participant Split as split.js

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

    Backend-->>PDF: complete
    PDF-->>CLI: complete
    CLI-->>User: PDF generated
```

### B.4 Validation Flow (`quire validate`)

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

## Appendix C: Module Dependency Graph

### C.1 Complete Dependency Graph

```mermaid
graph TB
    subgraph Commands
        create[create.js]
        build[build.js]
        preview[preview.js]
        pdf[pdf.js]
        epub[epub.js]
        clean[clean.js]
        info[info.js]
        validate[validate.js]
        version[version.js]
        conf[conf.js]
    end

    subgraph CoreLibs["Core Libraries"]
        installer[lib/installer]
        project[lib/project]
        eleventy[lib/11ty]
        pdfLib[lib/pdf]
        epubLib[lib/epub]
        cliConf[lib/conf]
    end

    subgraph Facades["Process Facades"]
        npm[lib/npm]
        git[lib/git]
    end

    subgraph Utils["Utilities"]
        logger[lib/logger]
        i18n[lib/i18n]
    end

    subgraph Helpers
        cleanHelper[helpers/clean]
        testCwd[helpers/test-cwd]
        osUtils[helpers/os-utils]
        isEmpty[helpers/is-empty]
        which[helpers/which]
    end

    subgraph ProjectSub["lib/project submodules"]
        paths[paths.js]
        config[config.js]
        detect[detect.js]
        versionMod[version.js]
    end

    %% Command dependencies
    create --> installer
    create --> logger

    build --> eleventy
    build --> cleanHelper
    build --> testCwd

    preview --> eleventy
    preview --> testCwd

    pdf --> pdfLib
    pdf --> testCwd

    epub --> epubLib
    epub --> testCwd

    clean --> cleanHelper
    clean --> testCwd
    clean --> project

    info --> npm
    info --> project
    info --> testCwd

    validate --> project
    validate --> testCwd

    version --> installer
    version --> project
    version --> testCwd

    conf --> cliConf

    %% Library dependencies
    installer --> git
    installer --> npm
    installer --> project

    eleventy --> project
    eleventy --> osUtils

    pdfLib --> project
    pdfLib --> osUtils

    epubLib --> project
    epubLib --> osUtils

    %% Project submodule structure
    project --> paths
    project --> config
    project --> detect
    project --> versionMod

    %% Helper dependencies
    testCwd --> detect
    cleanHelper --> project

    %% Facade dependencies
    npm --> which
    git --> which

    %% Cross-cutting
    installer -.-> logger
    eleventy -.-> logger
```

### C.2 Dependency Matrix

| Module | Dependencies |
|--------|--------------|
| `create` | installer, logger, fs-extra |
| `build` | 11ty, helpers/clean, helpers/test-cwd |
| `preview` | 11ty, helpers/test-cwd |
| `pdf` | lib/pdf, helpers/test-cwd |
| `epub` | lib/epub, helpers/test-cwd |
| `clean` | helpers/clean, helpers/test-cwd, project |
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

### C.3 Import Alias Reference

The CLI uses subpath imports defined in `package.json`:

| Alias | Path |
|-------|------|
| `#src/*` | `./src/*` |
| `#lib/*` | `./src/lib/*` |
| `#helpers/*` | `./src/helpers/*` |

---

## Appendix D: Testing Architecture

### D.1 Test File Conventions

| Pattern | Purpose |
|---------|---------|
| `*.spec.js` | Unit tests (command registration, API surface) |
| `*.test.js` | Integration tests (full command execution with mocks) |

### D.2 Mocking Strategy

```mermaid
graph TB
    subgraph TestFile["Test File (*.test.js)"]
        Test[Test Case]
    end

    subgraph Mocking["esmock Mocking"]
        MockFS[Mock fs-extra]
        MockNPM[Mock lib/npm]
        MockGit[Mock lib/git]
        MockLogger[Mock lib/logger]
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

### D.3 Test Example Pattern

```javascript
// Example: Mocking for create.test.js
const CreateCommand = await esmock('./create.js', {
  '#lib/installer/index.js': { installer: mockInstaller },
  '#lib/git/index.js': { Git: MockGit },
  '#lib/npm/index.js': { default: mockNpm },
  '#src/lib/logger.js': { default: mockLogger },
  'fs-extra': mockFs
})
```
