# quire(1) -- Quire command-line interface

## SYNOPSIS

`quire` \[options\] <command> \[command-options\]

## DESCRIPTION

Quire is a command-line tool for creating and publishing digital books.
It generates static websites, PDFs, and EPUBs from a Quire project
containing Markdown content and YAML data files.

A typical workflow starts with `quire new` to scaffold a project, `quire
preview` to develop locally, and `quire build`, `quire pdf`, or `quire
epub` to produce publication outputs.

## COMMANDS

### Project Creation

* `new` \[projectPath\] \[starter\]:
  Create a new Quire project from a template. If _projectPath_ is
  omitted, the current directory is used. An optional _starter_ argument
  specifies a repository URL or local path for a starter project.

  `--quire-version` _version_ pins the quire-11ty version to install.
  `--quire-path` _path_ uses a local quire-11ty package instead of a
  published version.

### Development

* `preview`:
  Start a local development server with live reload. Changes to source
  files are rebuilt automatically.

  `-p`, `--port` _port_ sets the server port (default: 8080).
  `--open` opens the browser when the server starts.

* `build`:
  Run the Eleventy build to generate static HTML output. Build outputs
  are written to the project's output directory.

  `-d`, `--dry-run` runs the build without writing files.

* `clean`:
  Remove build outputs (HTML, PDF, and EPUB files).

  `-d`, `--dry-run` shows paths that would be deleted without removing them.
  `--status` also clears stored build status for the project.

### Output Generation

* `pdf`:
  Generate a print-ready PDF from build output.

  `--engine` _name_ selects the PDF engine (`pagedjs` or `prince`; default:
  from config or `pagedjs`).
  `--build` runs the site build first if output is missing.
  `--open` opens the PDF in the default application after generation.
  `-o`, `--output` _path_ sets a custom output file path.

* `epub`:
  Generate an EPUB e-book from build output.

  `--engine` _name_ selects the EPUB engine (`epubjs` or `pandoc`; default:
  from config or `epubjs`).
  `--build` runs the site build first if output is missing.
  `--open` opens the EPUB in the default application after generation.
  `-o`, `--output` _path_ sets a custom output file path.

### Information and Diagnostics

* `doctor` \[checks...\]:
  Run diagnostic checks on the Quire environment and project. Checks are
  organized into four sections: Environment (os, cli, node, runtime, npm,
  git), Tools (prince, pandoc), Project (project, deps, 11ty, data), and
  Outputs (build, pdf, epub).

  Without arguments, all checks are run. Pass section names or individual
  check IDs to run a subset (e.g., `quire doctor environment` or
  `quire doctor node git`).

  `-e`, `--errors` shows only failed checks.
  `-w`, `--warnings` shows only warnings.
  `--json` \[_file_\] outputs results as JSON to stdout or a file.
  `--reset` clears stored build status for the current project.

  Aliases: `checkup`, `check`, `diagnostic`, `health`.

* `info`:
  Display version information for the current project, including
  quire-cli, quire-11ty, and starter template versions.

  `--debug` includes installation paths.
  `--json` outputs version information as JSON.

* `validate`:
  Check YAML files in the project's `content/_data/` directory for
  syntax errors.

  `--json` outputs validation results as JSON.

* `settings` \[operation\] \[key\] \[value\]:
  View and modify CLI settings. Without arguments, displays all current
  settings.

  Operations: `get`, `set`, `delete`, `reset`, `path`.

  `--json` outputs raw JSON.
  `--debug` enables debug output for troubleshooting.

  Aliases: `prefs`, `preferences`, `conf`, `config`, `configure`.

* `help` \[topic\]:
  Display help for a topic or list available topics. Topics include
  individual commands, workflows, and configuration guides.

  `--list` lists all available topics.

  Alias: `h`.

## GLOBAL OPTIONS

* `-q`, `--quiet`:
  Suppress progress output. Hides spinner messages, quire-11ty log
  output, Vite log output, and the Eleventy directory listing. Exit
  codes still indicate success or failure. Useful for CI pipelines
  and scripts.

* `-v`, `--verbose`:
  Show detailed progress. Enables quire-11ty informational log output,
  the Eleventy directory listing (file-by-file build table), and Vite
  info-level output in addition to spinner messages.

* `--debug`:
  Enable debug output for troubleshooting. Activates the `quire:*` debug
  namespace, Eleventy's `DEBUG=Eleventy*` tracing, and quire-11ty debug-
  level log output. Can be combined with `--verbose`.

* `--reduced-motion`:
  Disable spinner animation and line overwriting. Each build phase prints
  on a new line with a static status symbol. Compatible with screen
  readers and terminals that do not support ANSI escape sequences. Can
  also be enabled via the `REDUCED_MOTION` environment variable or the
  `reducedMotion` config setting.

* `--color`:
  Force colored output, overriding the `NO_COLOR` environment variable.

* `--no-color`:
  Disable colored output.

* `--no-pager`:
  Disable paging for long output (e.g., help topics).

* `-V`, `--version`:
  Output the quire version number.

* `-h`, `--help`:
  Display help for quire or a subcommand.

## ENVIRONMENT

* `QUIRE_LOG_LEVEL`=_level_:
  Override the log verbosity for quire-11ty output. Valid values are
  `trace`, `debug`, `info`, `warn`, `error`, and `silent`. This is
  normally set automatically by the CLI based on `--quiet`, `--verbose`,
  and `--debug` flags. Setting it manually is useful when running
  quire-11ty outside the CLI.

* `REDUCED_MOTION`=_1_:
  Disable spinner animation, equivalent to `--reduced-motion`.

* `NO_COLOR`=_1_:
  Disable colored output (respected by chalk). Overridden by `--color`.

* `NO_PAGER`=_1_:
  Disable paging for long output, equivalent to `--no-pager`.

* `PAGER`=_program_:
  Set the pager program for long output (default: `less`).

* `DEBUG`=_pattern_:
  Enable debug output for matching namespaces. Examples:

  `DEBUG=quire:*` enables all Quire CLI debug output.
  `DEBUG=quire:lib:pdf` enables only PDF module debug output.
  `DEBUG=quire:lib:*` enables all library module debug output.
  `DEBUG=Eleventy*` enables Eleventy internal debug output.

## COMMON WORKFLOWS

Start a new project and preview it locally:

    quire new my-book && cd my-book && quire preview

Build the site for web deployment:

    quire clean && quire build

Generate all publication formats:

    quire clean && quire build && quire pdf && quire epub

Build and open a PDF in one step:

    quire pdf --build --open

## CONFIGURATION

Persistent settings are managed with the `quire settings` command. Common
settings include:

    quire settings set verbose true
    quire settings set pdfEngine prince
    quire settings set updateChannel rc

Run `quire settings` to see all available settings and their current values.
Run `quire settings path` to show the configuration file location.

## EXIT STATUS

* `0`: Success
* `1`: Command failed (build error, validation error, missing output, etc.)

## SEE ALSO

Full documentation: <https://quire.getty.edu/docs-v1>

Report bugs: <https://github.com/thegetty/quire/issues>

Source code: <https://github.com/thegetty/quire>
