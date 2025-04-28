## Quire CLI
[![CircleCI](https://dl.circleci.com/status-badge/img/gh/thegetty/quire/tree/main.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/gh/thegetty/quire/tree/main)

The `quire-cli` implements the [command pattern](https://en.wikipedia.org/wiki/Command_pattern) to receive input from a user and delegate command behavoir to modules for the services, such as `git` and `11ty`, involved in working on Quire publications.

### Installing the CLI

The `quire-cli` can be installed as a global npm module as follows

```sh
npm install quire-cli --global
```

Installing the `quire-cli` as a _local package dependency_ requires additional npm command flags to support patching package dependencies as follows,

```sh
npm install quire-cli --install-strategy=nested
```

### Using the CLI

`npx` supports executing npm package binaries even when they are not yet installed and will download the package into a cache if it does not find either a locally or globally installed version. Simply run

```sh
npx quire-cli --help
```
