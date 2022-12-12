## CLI Configuration Manager

This `quire-cli/lib/config` module manages reading and writing (persisting) options for the Quire CLI using the [`conf`](https://github.com/sindresorhus/conf#defaults) package.

~~The configuration file can be globally and per-project. The Quire CLI will search upward for the first configuration file _within the project directory_ when a CLI command is run.~~


### Configuration

`logLevel ['info']` The default logging level for the Quire CLI output.

`projectTemplate` A default project starter template to use when creating new projects; default `'quire-starter-default'`.

`quirePath` The relative path to `quire-11ty` installed in the project directory; default `./11ty`. When set to `null`, `quire-11ty` is installed to the CLI `lib/quire/versions/<version>/` directory.

```sh
❯ quire config quire-path '.'
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

To reset an individual key to its default value, use the `unset` argument:

```sh
❯ quire config unset [key]
```
