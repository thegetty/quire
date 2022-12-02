## `@thegetty/quire-cli`

The `bin/cli.js` module is the exported entry point for the [published `quire-cli` package](https://www.npmjs.com/package/@thegetty/quire-cli).

### Running the CLI in development

During development the `quire-cli` can be run locally by executing the `bin/cli.js` shell script, for example:

```sh
./bin/cli.js --help
```

The `bin/cli.js` module specifies the `node` environment and is configured to suppress Node.js warnings.

```sh
#!/usr/bin/env node --no-warnings
```

Additional options can be set using the `NODE_OPTIONS` environment variable, this sets the environment for the duration of the script only, for example:

```sh
#!/usr/bin/env NODE_OPTIONS=--no-warnings node
```

For a long digression down a reading rabbit-hole about supressing NodeJS warnings, see [nodejs/node#32876](https://github.com/nodejs/node/issues/32876).


### Running the published CLI

`npx` supports executing npm package binaries even when they are not yet installed and will download the package into a cache if it does not find either a locally or globally installed version. Simply run

```sh
npx quire-cli --help
```
