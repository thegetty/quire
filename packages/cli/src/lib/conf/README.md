## CLI Configuration Manager

This `quire-cli/lib/config` module manages reading and writing (persisting) options for the Quire CLI using the [`conf`](https://github.com/sindresorhus/conf) package.

`conf` stores the config in the system default [user config directory](https://github.com/sindresorhus/env-paths#pathsconfig). For example, on macOS, the config file will be stored in the `~/Library/Preferences/@thegetty/quire-cli` directory.

> Changes are written to disk atomically, so if the process crashes during a write, it will not corrupt the existing config.

### Configuration

`epubEngine` The default EPUB engine for `quire epub` command; default `'epubjs'`. Options: `'epubjs'`, `'pandoc'`.

```sh
❯ quire config set epubEngine pandoc
```

`logLevel` The default logging level for the Quire CLI output; default `'info'`.

`pdfEngine` The default PDF engine for `quire pdf` command; default `'pagedjs'`. Options: `'pagedjs'`, `'prince'`.

```sh
❯ quire config set pdfEngine prince
```

`projectTemplate` A default project starter template to use when creating new projects; default `'quire-starter-default'`.

`quirePath` The relative path to `quire-11ty` installed in the project directory; default `./11ty`. When set to `null`, `quire-11ty` is installed to the CLI `lib/quire/versions/<version>/` directory.

```sh
❯ quire config quire-path '.'
```

`staleThreshold` How stale an output must be before `quire doctor` warns; default `'HOURLY'`. Options: `'ZERO'` (0 min), `'SHORT'` (5 min), `'HOURLY'` (60 min), `'DAILY'` (12 hours), `'NEVER'` (disabled).

```sh
❯ quire config set staleThreshold DAILY
```

`quireVersion` The default version of `quire-11ty` to install when creating new Quire projects; default `'latest'`.

```sh
❯ quire config quire-version '1.0.0'
```

`telemetry` Send anonymous data about Quire usage; default `false`.

```sh
❯ quire config telemetry --enabled
```

```sh
❯ quire config telemetry --disabled
```

`updateChannels` A list of distribution tags to use when checking for version updates; default `['latest']`. To show notifications for pre-releases version updates include `'pre-release'` in the array of channels. This can be set using the configuration `--pre-release` command flag.

```sh
❯ quire config update-channels
Quire configured to check for updates tagged 'latest'
```

```sh
❯ quire config update-channels --add 'pre-release'
Quire configured to check for updates tagged 'latest', 'pre-release'
```

```sh
❯ quire config update-channels --rm 'pre-release'
Quire configured to check for updates tagged 'latest'
```

`updateInterval` Interval at which to check for updates to the Quire CLI and project's `quire-11ty` version; default `'DAILY'`.

```sh
❯ quire config update-interval
Quire configured to check for updates DAILY
```

```sh
❯ quire config update-interval WEEKLY
```

`versionFile ['.quire-version']` The default file name for the `quire-11ty` version file.

```sh
❯ quire config version-file '.blargh'
```

### Quire CLI `config` Command

Running the `config` command without any arguments will start an interactive prompt to configure Quire.

To view an individual configuration value and its default value use:

```sh
❯ quire config [key]
```

To view the current `logLevel` setting for example:

```sh
❯ quire config logLevel
loglevel: 'debug' (default 'info')
```

To set an individual configuration value, use the `set` argument:

```sh
❯ quire config set <key> <value>
```

To reset *all* keys to their default values, use the `reset` argument:

```sh
❯ quire config reset
```

To reset an individual key to its default value:

```sh
❯ quire config reset [key]
```
