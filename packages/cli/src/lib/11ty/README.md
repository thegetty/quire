## CLI 11ty Module

The `quire-cli/lib/11ty` module is a façade for interacting with Eleventy, the static site generator for Quire projects.

### 11ty/API module

The `api` module allows the Quire CLI to programmatically configure an instance of Eleventy on which it can call methods.

See [Eleventy Documentation: Programmatic API](https://www.11ty.dev/docs/programmatic/)

### 11ty/CLI module

The `cli` module is a wrapper around the Eleventy CLI to run `@11ty/eleventy` commands.

See [Eleventy Documentation: Command Line Usage](https://www.11ty.dev/docs/usage/#command-line-usage)

### Paths module

The `paths` module provides a `Paths` class with accessor methods for Eleventy path configuration. Values are computed on access to reflect the current working directory state.

#### Naming Convention

Method names encode the return type:

| Suffix | Returns |
|--------|---------|
| `Path` or `Root` | Absolute filesystem path |
| `Dir` | Relative directory name |

#### API Reference

**Absolute paths:**

| Method | Description |
|--------|-------------|
| `getConfigPath()` | Absolute path to `.eleventy.js` config |
| `getEleventyRoot()` | Absolute path to Eleventy root directory |
| `getInputPath()` | Absolute path to content input directory |
| `getLibQuirePath()` | Absolute path to quire-11ty installation |
| `getProjectRoot()` | Absolute path to project root (`process.cwd()`) |

**Relative directories:**

| Method | Description |
|--------|-------------|
| `getDataDir()` | Data directory relative to input (`_computed`) |
| `getEpubDir()` | EPUB output directory relative to Eleventy root |
| `getIncludesDir()` | Includes directory relative to input |
| `getInputDir()` | Input directory relative to Eleventy root |
| `getLayoutsDir()` | Layouts directory relative to input |
| `getOutputDir()` | Output directory relative to Eleventy root (`_site`) |
| `getPublicDir()` | Public assets directory (`./public`) |

**Utility:**

| Method | Description |
|--------|-------------|
| `toObject()` | Returns all paths as an object (for logging/debugging) |

#### Usage

```javascript
import { paths } from '#lib/11ty/index.js'

// Get absolute paths
const projectRoot = paths.getProjectRoot()
const configPath = paths.getConfigPath()

// Get relative directories
const outputDir = paths.getOutputDir()  // '_site'
const inputDir = paths.getInputDir()    // 'content'

// Debug all paths
console.log(paths.toObject())
```

#### Environment Variables

The `api` and `cli` modules set environment variables before creating the Eleventy instance:

| Variable | Source |
|----------|--------|
| `ELEVENTY_DATA` | `paths.getDataDir()` |
| `ELEVENTY_INCLUDES` | `paths.getIncludesDir()` |
| `ELEVENTY_LAYOUTS` | `paths.getLayoutsDir()` |

These environment variables **must be set before** the Eleventy instance is created and the `.eleventy.js` configuration is parsed.

#### Design Notes

**Why environment variables instead of Eleventy API methods?**

Eleventy 3.x provides `setIncludesDirectory()` and `setLayoutsDirectory()` API methods, but environment variables are preferred because:

1. **cli.js compatibility** - The `cli` module runs Eleventy as a subprocess via `execa`. API methods cannot be called on a subprocess; only arguments and environment variables can be passed.

2. **Same path restriction** - The API methods have the same limitation: paths must be relative to the input directory. Using `../_includes` works identically with either approach.

3. **Consistent implementation** - Environment variables work for both `api.js` and `cli.js`, avoiding code divergence between the two modules.

**Known limitation:** The Eleventy `TemplatePathResolver` requires layouts and includes directories to be within the input directory, which prevents fully decoupling Quire project content from `quire-11ty` code. See [eleventy#2655](https://github.com/11ty/eleventy/issues/2655) (still open).
