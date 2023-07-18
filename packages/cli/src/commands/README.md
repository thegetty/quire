## Quire CLI Commands

### `build`

Build Quire publication outputs.

```sh
quire build
```

#### `epub`

Build Quire publication EPUB format.

```sh
quire build epub
```

#### `info`

List `quire-11ty`, `quire-cli`, and starter package versions; use the `--debug` option to include node, npm, and os versions.

```sh
quire build info
```

#### `pdf`

Build Quire publication PDF format.

```sh
quire build pdf
```

#### `site`

Build Quire publication HTML format.

```sh
quire build site
```

### `check`

The `quire-cli` `check` command can be used to check that publication outputs conform to various requirments and specifications.

```sh
❯ quire check [...formats] [options]
```

#### EPUB

W3C [EPUBCheck](https://www.w3.org/publishing/epubcheck/) "evaluates if your EPUB publications conform to the requirements defined in the EPUB specifications." Please note, EPUBCheck "will not detect typos, mispellings, off-topic images, etc."

Using [`epub-check`](https://github.com/bhdirect-ebooks/epub-check) [default] to asynchronously validate an expanded EPUB:

```sh
❯ quire check epub
```

Using a local version of `epub-check`:

```sh
❯ quire check epub --path <local-epub-check>
```

Using a remote service API:

```sh
❯ quire check epub --upload [url]
```

The default upload `url` is `https://draft2digital.com/book/epubcheck/upload` and can be set in your local Quire CLI configuration.

A `<url>` is a required when using the `--url` option,

```sh
❯ quire check epub --url <url>
```

##### EPUB Accessibility

`--a11y [path-to-lib]` evaluate conformance to the EPUB Accessibility specification using the [Ace](https://github.com/daisy/ace) library.

```sh
❯ quire check epub --a11y
```

#### PDF

```sh
❯ quire check pdf
```

*TODO*

#### Site HTML

Uses the [W3C HTML Checker](https://validator.w3.org/nu/) API, see the [W3C Markup Validator Web Service API](https://validator.w3.org/docs/api.html) documentation.

`--a11y` evaluate conformance to accessibility specification

```sh
❯ quire check --a11y
```

*TODO* `LHCI`, WCAG, ...?

`--open` [W3C Markup Validation Service](https://validator.w3.org/#validate_by_uri+with_options)

```sh
❯ quire check --open
```

### `clean`

Remove build outputs.

Note that this command is distinct from the [quire/11ty package](https://github.com/thegetty/quire/packages/11ty/package.json) script `clean`, to allow different behavoirs for Quire editors and developers.

```sh
quire clean --dry-run
```

### `configure` **not yet implemented**

Edit the Quire CLI configuration.

```sh
quire configure
```

### `install` **not yet implemented**

Clone an existing Quire project from a git repository.

```sh
quire install <repository>
```

### `new`

Start a new Quire publication from a template project or clone an existing project from a git repository (equivalent to `install`).

Running the `new` without any arguments will start an interactive prompt.

```sh
quire new
```

To start a new Quire project using the default starter run the following command:

```sh
quire new <path>
```

To create a new project from a starter template

```sh
quire new <path> <starter>
```

#### Specifying the `quire-11ty` version

When the `--quire` flag is used the new project will be started using the specified version of `quire-11ty`

```sh
quire new <path> <starter> --quire <version>
```

##### Version identifiers

The `--quire` flag must be either a semantic version identifier or a npm distribution tag. For example:

```sh
quire new ./blargh --quire 1.0.0-rc.5
```

```sh
quire new ./blargh --quire latest
```

### `preview`

Build and server the Quire site in development mode.

```sh
quire preview --port 8080
```

#### `epub` **not yet implemented**

Preview the Quire publication epub in the default application.

```sh
quire preview epub --open
```

#### `pdf` **not yet implemented**

Preview the Quire publication PDF in the default application.

```sh
quire preview pdf --open
```

#### `site` **default subcommand**

Build and serve the Quire site in development mode.

```sh
quire preview site
```

### `server` **not yet implemented**

Start a local web server to serve a previously built Quire site.

```sh
quire server --port 8080
```

### `version` **partial implementation**

Sets the Quire version to use when running commands on the project.

```sh
quire version 1.0.0
```

To set the quire version globally use the `--global` command flag.

```sh
quire version 1.0.0 --global
```

#### `install`

```sh
quire version install <version>
```

To reinstall a `quire-11ty` version run

```sh
quire version install <version> --force
```

#### `list`

List installed versions of `quire-11ty`

```sh
quire version list
```

#### `prune`

Remove outdated versions of `quire-11ty`

```sh
quire version prune
```

#### `remove` (alias `uninstall`)

```sh
quire version remove <version>
```

```sh
quire version uninstall <version>
```
