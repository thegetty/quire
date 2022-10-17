## Quire CLI Commands

### `build`

Build Quire publication outputs.

```sh
quire build
```

#### `clean`

Clean build outputs.

```sh
quire clean
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
quire install
```

### `new`

Start a new Quire publication from a template project or clone of an existing project from a git repository (equivalent to `install`).

To start a new Quire project, execute:

```sh
quire new
```

### `preview`

Build and server the Quire site in development mode.

```sh
quire preview
```

#### `epub`

Preview the Quire publication epub in a web browser.

```sh
quire preview epub
```

To preview the epub in Kindle Previewer or Apple iBooks

```sh
quire preview epub --open
```

#### `pdf`

Preview the Quire publication PDF in a web browser.

```sh
quire preview pdf
```

#### `site`

Build and server the Quire site in development mode.

```sh
quire preview site
```

#### `server`

Start a web server on the default port to serve the Quire site.

```sh
quire server
```
