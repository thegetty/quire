## CLI Configuration Module

The `conf/` module manages reading and writing (persisting) settings for the Quire CLI using the [`conf`](https://github.com/sindresorhus/conf) package.

`conf` stores the config in the system default [user config directory](https://github.com/sindresorhus/env-paths#pathsconfig). For example, on macOS, the config file will be stored in the `~/Library/Preferences/@thegetty/quire-cli` directory.

> Changes are written to disk atomically, so if the process crashes during a write, it will not corrupt the existing config.

### Module Structure

```
conf/
├── index.js         Barrel export (config singleton + named helpers)
├── config.js        Conf singleton instance
├── helpers.js       Pure schema-aware helper functions
├── defaults.js      Default configuration values
├── schema.js        JSON Schema definitions
├── migrations.js    Version migration functions
├── config.test.js   Integration tests for Conf instance
└── helpers.test.js  Unit tests for helper functions
```

### Architecture: Barrel Export vs Singleton Wrapper

The module uses a **barrel export** pattern (`index.js`) rather than wrapping the `Conf` singleton in a class. This is a deliberate design choice:

- **`config.js`** exports the `Conf` singleton that owns mutable state (the on-disk JSON store, file watching, schema validation, migrations). This is a thin wrapper around the `conf` package.
- **`helpers.js`** exports pure functions (`isValidKey`, `coerceValue`, `formatSettings`, etc.) that operate on the schema and defaults — static data that does not require the `Conf` instance.
- **`index.js`** re-exports both, providing a single import path for consumers.

A wrapper class was considered but rejected for three reasons:

1. **No shared state.** The helpers operate on schema/defaults (static data), not the config store (runtime state). Binding them to the singleton would create a false coupling.
2. **Circular dependency avoidance.** The logger imports `config.js`. If helpers were methods on the config singleton, importing them would trigger the full `Conf` instantiation chain. By depending only on `schema.js` and `defaults.js` (pure data modules), `helpers.js` stays free of transitive dependencies.
3. **Testability.** Pure functions are directly testable with simple import + assert — no esmock, no sinon, no constructor stubbing. Compare `helpers.test.js` (27 pure function tests) with `config.test.js` (integration tests requiring esmock to mock the `Conf` constructor).

### Exports

```javascript
// Barrel import — config singleton + named helpers
import config, { isValidKey, coerceValue } from '#lib/conf/index.js'

// Direct import — config singleton only (used by logger, etc.)
import config from '#lib/conf/config.js'
```

| Export | Source | Description |
|--------|--------|-------------|
| `default` | `config.js` | `Conf` singleton instance |
| `isValidKey(key)` | `helpers.js` | Check if key exists in schema |
| `getValidKeys()` | `helpers.js` | Sorted array of all schema keys |
| `coerceValue(key, value)` | `helpers.js` | Coerce CLI string to schema type |
| `formatValidationError(key, value)` | `helpers.js` | Format error with enum/description hints |
| `getDefault(key)` | `helpers.js` | Get default value for a key |
| `getKeyDescription(key)` | `helpers.js` | Get schema description for a key |
| `formatSettings(store, options)` | `helpers.js` | Format all settings for display |

### Settings Reference

Use `quire settings` to view all settings with descriptions, or manage individual values:

```sh
quire settings                     # Show all settings
quire settings get <key>           # Get a single value
quire settings set <key> <value>   # Set a value
quire settings delete <key>        # Delete (reset to default)
quire settings reset [key]         # Reset all or single key
quire settings path                # Show settings file path
```

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `debug` | boolean | `false` | Enable debug output by default |
| `epubEngine` | string | `'epubjs'` | EPUB engine (`epubjs`, `pandoc`) |
| `logLevel` | string | `'info'` | Log level (`trace`, `debug`, `info`, `warn`, `error`, `silent`) |
| `logPrefix` | string | `'quire'` | Prefix text for log messages |
| `logPrefixStyle` | string | `'bracket'` | Prefix style (`bracket`, `emoji`, `plain`, `none`) |
| `logShowLevel` | boolean | `false` | Show level label in output |
| `logUseColor` | boolean | `true` | Use colored output |
| `logColorMessages` | boolean | `true` | Color message text by level |
| `pdfEngine` | string | `'pagedjs'` | PDF engine (`pagedjs`, `prince`) |
| `projectTemplate` | string | (GitHub URL) | Default starter template |
| `quire11tyPath` | string | `'.'` | Path to quire-11ty package |
| `quireVersion` | string | `'latest'` | Version of quire-11ty to install |
| `updateChannel` | string | `'rc'` | Release channel (`stable`, `rc`, `beta`, `alpha`) |
| `updateInterval` | string | `'DAILY'` | Update check frequency (`DAILY`, `WEEKLY`, `MONTHLY`, `NEVER`) |
| `verbose` | boolean | `false` | Enable verbose output by default |
| `versionFile` | string | `'.quire'` | Filename to identify Quire projects |
