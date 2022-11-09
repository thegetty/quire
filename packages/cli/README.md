## Quire CLI

The `quire-cli` implements the [command pattern](https://en.wikipedia.org/wiki/Command_pattern) to receive input from a user and delegate command behavoir to modules for the services, such as `git` and `11ty`, involved in working on Quire publications.

### Using the CLI

`npx` supports executing npm package binaries even when they are not yet installed and will download the package into a cache if it does not find either a locally or globally installed version. Simply run

```sh
npx quire-cli --help
```
