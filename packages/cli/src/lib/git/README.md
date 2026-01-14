# Git Façade

A façade module that abstracts git command-line operations for the Quire CLI.

## Purpose

This module provides a unified interface for git operations with:

- Encapsulation of git implementation details
- Consistent logging prefixed with `[CLI:lib/git]`
- Unified error handling
- Easy mockability for testing

## Usage

### Singleton (for global operations)

```javascript
import git from '#lib/git/index.js'

// Check git availability
if (!git.isAvailable()) {
  console.error('git is not installed')
}

// Get git version
// @see https://git-scm.com/docs/git-version
const version = await git.version()
```

### Git Class (for repository-scoped operations)

```javascript
import { Git } from '#lib/git/index.js'

// Create instance with working directory
const repo = new Git('/path/to/project')

// Clone a repository
// @see https://git-scm.com/docs/git-clone
await repo.clone('https://github.com/user/repo', '.')

// Initialize a repository
// @see https://git-scm.com/docs/git-init
await repo.init()

// Stage files
// @see https://git-scm.com/docs/git-add
await repo.add('.')
await repo.add(['file1.js', 'file2.js'])

// Create a commit
// @see https://git-scm.com/docs/git-commit
await repo.commit('Initial commit')

// Remove files from tracking
// @see https://git-scm.com/docs/git-rm
await repo.rm('package.json')
await repo.rm(['file1.js', 'file2.js'])
```

## API

### Constructor

#### `new Git(cwd)`

Create a Git façade instance scoped to a working directory.

**Parameters:**
- `cwd` (string, optional) - Working directory for all operations

### Methods

#### `isAvailable()`

Check if git is available in PATH.

#### `version()`

Get the installed git version.

#### `add(files)`

Stage files for commit.

**Parameters:**
- `files` (string|string[]) - Files to stage (use `'.'` for all)

#### `clone(url, destination)`

Clone a repository.

**Parameters:**
- `url` (string) - Repository URL
- `destination` (string, default: `'.'`) - Destination directory

#### `commit(message)`

Create a commit with staged changes.

**Parameters:**
- `message` (string) - Commit message

#### `init()`

Initialize a new git repository.

#### `rm(files)`

Remove files from the working tree and index.

**Parameters:**
- `files` (string|string[]) - Files to remove

## Testing

### Mocking the singleton

```javascript
import esmock from 'esmock'

const mockGit = {
  isAvailable: sandbox.stub().returns(true),
  version: sandbox.stub().resolves('2.39.0'),
}

const MyCommand = await esmock('./mycommand.js', {
  '#lib/git/index.js': { default: mockGit }
})
```

### Mocking the Git class

```javascript
import esmock from 'esmock'

const MockGit = class {
  constructor(cwd) {
    this.cwd = cwd
    this.add = sandbox.stub().resolves()
    this.clone = sandbox.stub().resolves()
    this.commit = sandbox.stub().resolves()
    this.init = sandbox.stub().resolves()
    this.rm = sandbox.stub().resolves()
  }
}

const MyCommand = await esmock('./mycommand.js', {
  '#lib/git/index.js': { Git: MockGit }
})
```
