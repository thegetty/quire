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

### Development

* `preview`:
  Start a local development server with live reload. Changes to source
  files are rebuilt automatically.

  `-p`, `--port` _port_ sets the server port (default: 8080).
  `--open` opens the browser when the server starts.

* `build`:
  Run the Eleventy build to generate static HTML output. Build outputs
  are written to the project's output directory.

  `--clean` removes previous build output before building.

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

* `validate`:
  Check YAML files in the project's `content/_data/` directory for
  syntax errors.

* `settings` \[operation\] \[key\] \[value\]:
  View and modify CLI settings. Without arguments, displays all current
  settings.

  Operations: `get`, `set`, `delete`, `reset`, `path`.

  `--json` outputs raw JSON.

  Aliases: `prefs`, `preferences`, `conf`, `config`, `configure`.

## GLOBAL OPTIONS

* `-q`, `--quiet`:
  Suppress progress spinners and informational output. Useful for
  CI pipelines and scripts.

* `-v`, `--verbose`:
  Show detailed progress including paths, timing, and intermediate steps.

* `--debug`:
  Enable debug output for troubleshooting. Activates the `quire:*` debug
  namespace.

* `-V`, `--version`:
  Output the quire version number.

* `-h`, `--help`:
  Display help for quire or a subcommand.

## ENVIRONMENT

* `DEBUG`=_pattern_:
  Enable debug output for matching namespaces. Examples:

  `DEBUG=quire:*` enables all debug output.
  `DEBUG=quire:lib:pdf` enables only PDF module debug output.
  `DEBUG=quire:lib:*` enables all library module debug output.

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
