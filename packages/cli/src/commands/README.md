## Quire CLI Commands

```javascript
const commands = [
  {
    command: BuildCommand, // #src/commands/build/
    commands: [
      EpubCommmand, // #src/commands/build/epub.js
      PdfCommmand,  // #src/commands/build/pdf.js
      SiteCommmand, // #src/commands/build/site.js
    ],
  },
  CleanCommmand,   // #src/commands/build/clean.js
  CreateCommmand,  // #src/commands/build/create.js
  PreviewCommmand, // #src/commands/build/preview.js
  {
    command: VersionCommand, // #src/commands/versions/index.js
    commands: [
      InfoCommand,      // #src/commands/build/info.js
      InstallCommand,   // #src/commands/build/install.js
      ListCommand,      // #src/commands/build/list.js
      PruneCommand,     // #src/commands/build/prune.js
      UninstallCommand, // #src/commands/build/unistall.js
    ],
  },
]
```

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

### `clean`

Remove build outputs.

Note that this command is distinct from the [quire/11ty package](https://github.com/thegetty/quire/packages/11ty/package.json) script `clean`, to allow different behavoirs for Quire editors and developers.

```sh
quire clean --dry-run
```

### `configure`

Edit a Quire project configuration.

```sh
quire configure
```

### `debug`

Display Quire debugging information in the console.

```sh
quire debug
```

### `dev`

Clone `quire/packages/11ty` into the local project.

```sh
quire dev
```

### `edit`

Open or create a new content file in the default editor.

```sh
quire edit
```

### `install`

Clone an existing project from a git repository.

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

### `preview`

Build and server the Quire site in development mode.

```sh
quire preview --port 8080
```

#### `epub`

Preview the Quire publication epub in the default application.

```sh
quire preview epub --open
```

To preview the epub in Apple iBooks or Kindle Previewer

```sh
quire preview epub --open iBooks
```

```sh
quire preview epub --open Kindle
```

#### `pdf`

Preview the Quire publication PDF in the default application.

```sh
quire preview pdf --open
```

Preview the Quire publication PDF in an application.

```sh
quire preview pdf --open <Application>
```

#### `site`

Build and serve the Quire site in development mode.

```sh
quire preview site
```

#### `server`

Start a local web server to serve a previously built Quire site.

```sh
quire server --port 8080
```

### `version`

Sets the Quire version to use when running commands on the project.

```sh
quire version 1.0.0
```

To set the quire version globally use the `--global` command flag.

```sh
quire version 1.0.0 --global
```

#### `info`

Display the local and global `quire-11ty` version; this is the *default* subcommand (running `quire version` invokes the `info` subcommand).

```sh
quire version info
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
