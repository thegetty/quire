# NPM Façade

A façade module that abstracts npm command-line operations for the Quire CLI.

## Purpose

This module provides a unified interface for npm operations with:

- Consistent logging prefixed with `[CLI:lib/npm]`
- Unified error handling
- Easy mockability for testing
- Encapsulation of npm implementation details

## Usage

```javascript
import npm from '#lib/npm/index.js'

// Check npm availability
if (!npm.isAvailable()) {
  console.error('npm is not installed')
}

// Get npm version
// @see https://docs.npmjs.com/cli/commands/npm-version
const version = await npm.version()

// Initialize package.json
// @see https://docs.npmjs.com/cli/commands/npm-init
await npm.init('/path/to/project', { yes: true })

// Install dependencies
// @see https://docs.npmjs.com/cli/commands/npm-install
await npm.install('/path/to/project', {
  saveDev: true,
  preferOffline: true
})

// Pack a package
// @see https://docs.npmjs.com/cli/commands/npm-pack
await npm.pack('@thegetty/quire-11ty@1.0.0', '/path/to/destination', {
  quiet: true
})

// Clean cache
// @see https://docs.npmjs.com/cli/commands/npm-cache
await npm.cacheClean()

// View package version from registry
// @see https://docs.npmjs.com/cli/commands/npm-view
const latestVersion = await npm.view('@thegetty/quire-11ty', 'version')

// Get compatible version for a range
// @see https://docs.npmjs.com/about-semantic-versioning
const compatible = await npm.getCompatibleVersion('@thegetty/quire-11ty', '^1.0.0')
```

## API

### `isAvailable()`

Check if npm is available in PATH.

### `version()`

Get the installed npm version.

### `init(cwd, options)`

Initialize a new package.json in the specified directory.

**Options:**
- `yes` (boolean, default: `true`) - Auto-accept defaults

### `install(cwd, options)`

Install dependencies in the specified directory.

**Options:**
- `preferOffline` (boolean, default: `false`) - Prefer cached packages
- `saveDev` (boolean, default: `false`) - Install as devDependencies

### `pack(packageSpec, destination, options)`

Download and pack a package to a tarball.

**Options:**
- `debug` (boolean, default: `false`) - Enable debug output
- `quiet` (boolean, default: `true`) - Suppress output

### `cacheClean(cwd)`

Force clean the npm cache.

### `view(packageName, field)`

Query package information from the npm registry using `npm view`.

### `show(packageName, field)`

Query package information from the npm registry using `npm show`.

### `fetchFromRegistry(packageName)`

Fetch package metadata directly from the npm registry API.

### `getCompatibleVersion(packageName, range)`

Find the latest version compatible with a semver range.

## Testing

The module exports a singleton instance which can be mocked in tests:

```javascript
import esmock from 'esmock'

const mockNpm = {
  isAvailable: sandbox.stub().returns(true),
  install: sandbox.stub().resolves(),
  version: sandbox.stub().resolves('10.2.4')
}

const MyCommand = await esmock('./mycommand.js', {
  '#lib/npm/index.js': { default: mockNpm }
})
```
