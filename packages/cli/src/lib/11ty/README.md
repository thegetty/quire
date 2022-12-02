## CLI 11ty Module

The `quire-cli/lib/11ty` module is a façade for interacting with Eleventy, the static site generator for Quire projects.

### 11ty/API module

The `api` module allows the Quire CLI to programmatical configure an instance of Eleventy on which it can call methods.

See [Eleventy Documentation: Programmatic API](https://www.11ty.dev/docs/programmatic/)

### 11ty/CLI module

The `cli` module is a wrapper around the Eleventy CLI to run `@11ty/eleventy` commands.

See [Eleventy Documentation: Command Line Usage](https://www.11ty.dev/docs/usage/#command-line-usage)

### Paths module

The `paths` module returns paths for a Quire project to configure the Eleventy instance:

- _absolute_ path to the [Eleventy configuration](https://www.11ty.dev/docs/config/) file
- _relative_ path *from* the `quire-11ty` source *to* the `input` and `output` directories for the project
- _relative_ path *from* the project `input` *to* the Eleventy `includes` and `layouts` directories


Set environment variables for paths relative to eleventy `input` dir,
    * allowing a project agnostic `quire-11ty` eleventy configuration file.
    * Nota bene: environment variables read into the eleventy configuration
    * file _must_ be set before the eleventy configuration file is parsed.

`Eleventy` does not expose an API to set the relative `includes` and `layouts` paths on the instance. In order to decouple the Eleventy configuration file from a specific project and its path on the system the exported `paths` are used by the `api` and `cli` modules to set environment variables that can be used in the `.eleventy.js` configuration.

These environment variables **must be set before** the `Eleventy` instance is created and the `.eleventy.js` configuration is parsed.

**Nota bene** The current implementation of the `Eleventy` `TemplatePathResolver` assumes that the `layouts` directory is a child of the `input` directory and prevents decoupling the Quire project content from the `quire-11ty` code; see [eleventy#2655](https://github.com/11ty/eleventy/issues/2655).
