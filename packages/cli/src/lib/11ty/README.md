## CLI 11ty Module

The `lib/11ty` module is a façade for interacting with Eleventy, the static site generator for Quire projects. It follows the singleton pattern established by `lib/npm` and `lib/git`.

### Usage

**Recommended: Default export**

```javascript
import eleventy from '#lib/11ty/index.js'

// Run production build
await eleventy.build({ debug: true })

// Run development server
await eleventy.serve({ port: 8080 })

// Access paths through the façade
const outputDir = eleventy.paths.getOutputDir()
```

**Path-only consumers**

```javascript
import { paths } from '#lib/11ty/index.js'

const projectRoot = paths.getProjectRoot()
const outputDir = paths.getOutputDir()
```

**Legacy usage (deprecated)**

```javascript
// Deprecated - use default export instead
import { api, cli, paths } from '#lib/11ty/index.js'
await api.build(options)
```

### Test Mocking

```javascript
const mockEleventy = {
  build: sandbox.stub().resolves(),
  serve: sandbox.stub().resolves(),
  paths: {
    getProjectRoot: () => '/project',
    getOutputDir: () => '_site'
  }
}
const MyCommand = await esmock('./mycommand.js', {
  '#lib/11ty/index.js': { default: mockEleventy }
})
```

### Quire11ty Façade

The `Quire11ty` class provides abstracted Eleventy operations:

| Method | Description |
|--------|-------------|
| `build(options)` | Run Eleventy production build |
| `serve(options)` | Run Eleventy development server |
| `paths` | Access to `Paths` instance for path resolution |

**Build options:**
- `debug` - Enable debug output
- `dryRun` - Perform dry run without writing files
- `quiet` - Suppress output

**Serve options:**
- `debug` - Enable debug output
- `port` - Server port
- `quiet` - Suppress output

### Paths Module

The `paths` property provides a `Paths` instance with accessor methods for Eleventy path configuration. Values are computed on access to reflect the current working directory state.

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

### Environment Variables

The façade sets environment variables before creating the Eleventy instance:

| Variable | Source |
|----------|--------|
| `ELEVENTY_DATA` | `paths.getDataDir()` |
| `ELEVENTY_ENV` | `'production'` or `'development'` |
| `ELEVENTY_INCLUDES` | `paths.getIncludesDir()` |
| `ELEVENTY_LAYOUTS` | `paths.getLayoutsDir()` |

These environment variables **must be set before** the Eleventy instance is created and the `.eleventy.js` configuration is parsed.

### Design Notes

**Why a unified façade?**

The façade pattern provides:
1. **Single point of control** - Eleventy configuration in one place
2. **Consistent logging** - All operations use `[CLI:lib/11ty]` prefix
3. **Easy mocking** - Single object to mock in tests
4. **Implementation hiding** - Consumers don't need to know if we use API or CLI

**Why programmatic API instead of CLI subprocess?**

The façade uses Eleventy's programmatic API internally rather than spawning a subprocess:
1. **Event access** - Direct access to `eleventy.after` and other hooks
2. **Better error handling** - Native try/catch with full stack traces
3. **No spawn overhead** - Eliminates ~100-200ms process startup time
4. **Debugging** - Easier to trace issues in-process

The `cli.js` module is retained for backwards compatibility but is deprecated.

**Known limitation:** The Eleventy `TemplatePathResolver` requires layouts and includes directories to be within the input directory, which prevents fully decoupling Quire project content from `quire-11ty` code. See [eleventy#2655](https://github.com/11ty/eleventy/issues/2655) (still open).
