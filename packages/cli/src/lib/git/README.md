# Git Façade

A façade module that abstracts git command-line operations for the Quire CLI.

## Purpose

This module provides a unified interface for git operations with:

- Encapsulation of git implementation details
- Consistent logging prefixed with `[CLI:lib/git]`
- Unified error handling
- Easy mockability for testing

## Usage

```javascript
import git from '#lib/git/index.js'

// Check git availability
if (!git.isAvailable()) {
  console.error('git is not installed')
}

// Get git version
// @see https://git-scm.com/docs/git-version
const version = await git.version()

// Clone a repository
// @see https://git-scm.com/docs/git-clone
await git.clone('https://github.com/user/repo', '/path/to/dest')

// Initialize a repository
// @see https://git-scm.com/docs/git-init
await git.init('/path/to/project')

// Stage files
// @see https://git-scm.com/docs/git-add
await git.add('.', '/path/to/project')
await git.add(['file1.js', 'file2.js'], '/path/to/project')

// Create a commit
// @see https://git-scm.com/docs/git-commit
await git.commit('Initial commit', '/path/to/project')

// Remove files from tracking
// @see https://git-scm.com/docs/git-rm
await git.rm('package.json', '/path/to/project')
await git.rm(['file1.js', 'file2.js'], '/path/to/project')
```

## API

### `isAvailable()`

Check if git is available in PATH.

### `version()`

Get the installed git version.

### `add(files, cwd)`

Stage files for commit.

**Parameters:**
- `files` (string|string[]) - Files to stage (use `'.'` for all)
- `cwd` (string, optional) - Working directory

### `clone(url, destination, cwd)`

Clone a repository.

**Parameters:**
- `url` (string) - Repository URL
- `destination` (string, default: `'.'`) - Destination directory
- `cwd` (string, optional) - Working directory for clone operation

### `commit(message, cwd)`

Create a commit with staged changes.

**Parameters:**
- `message` (string) - Commit message
- `cwd` (string, optional) - Working directory

### `init(cwd)`

Initialize a new git repository.

**Parameters:**
- `cwd` (string, optional) - Working directory

### `rm(files, cwd)`

Remove files from the working tree and index.

**Parameters:**
- `files` (string|string[]) - Files to remove
- `cwd` (string, optional) - Working directory

## Testing

The module exports a singleton instance which can be mocked in tests:

```javascript
import esmock from 'esmock'

const mockGit = {
  add: sandbox.stub().resolves(),
  clone: sandbox.stub().resolves(),
  commit: sandbox.stub().resolves(),
  init: sandbox.stub().resolves(),
  isAvailable: sandbox.stub().returns(true),
  rm: sandbox.stub().resolves(),
}

const MyCommand = await esmock('./mycommand.js', {
  '#lib/git/index.js': { default: mockGit }
})
```
