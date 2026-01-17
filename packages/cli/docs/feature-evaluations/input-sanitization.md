# Feature Evaluation: Input Sanitization for Security

## Overview

Evaluate and implement input sanitization to protect the Quire CLI from security vulnerabilities including command injection, path traversal, and malicious input attacks.

## Current State

### Risk Assessment

The CLI handles user input in several security-sensitive contexts:

| Input Source | Usage | Current Validation | Risk Level |
|--------------|-------|-------------------|------------|
| `projectPath` argument | File operations, shell commands | Empty directory check only | **High** |
| `starter` argument | Git clone URL/path | None | **High** |
| `--quire-path` option | File copy operations | `fs.existsSync()` only | **Medium** |
| `--quire-version` option | npm package specifier | None (validated by npm) | **Low** |
| Working directory (`cwd`) | Passed to execa | None | **Medium** |

### Vulnerability Analysis

#### 1. Command Injection via `execaCommand()`

**Location:** [installer/index.js:178](../../src/lib/installer/index.js#L178)

```javascript
// VULNERABLE: Template string interpolation with user-derived paths
await execaCommand(`tar -xzf ${tarballPath} -C ${tempDir} --strip-components=1 package/`)
```

If `projectPath` contains shell metacharacters (`;`, `|`, `$()`, etc.), they could be interpreted by the shell.

**Additional occurrences:**
- [npm/index.js:45](../../src/lib/npm/index.js#L45) - `execaCommand('npm cache clean --force', { cwd })`
- [npm/index.js:93](../../src/lib/npm/index.js#L93) - `execaCommand(\`npm init ${flags}\`.trim(), { cwd })`
- [npm/index.js:113](../../src/lib/npm/index.js#L113) - `execaCommand(\`npm install ${flags}\`.trim(), { cwd })`
- [npm/index.js:140](../../src/lib/npm/index.js#L140) - `execaCommand(\`npm pack ... ${packageSpec}\`)`

#### 2. Path Traversal

**Location:** [installer/index.js:72-75](../../src/lib/installer/index.js#L72-L75)

```javascript
projectPath = projectPath || process.cwd()
fs.ensureDirSync(projectPath)  // No validation of '../../../' sequences
```

A malicious `projectPath` like `../../../etc/quire` could write files outside the intended directory.

#### 3. Arbitrary Git Clone

**Location:** [installer/index.js:90-91](../../src/lib/installer/index.js#L90-L91)

```javascript
const repo = new Git(projectPath)
await repo.clone(starter, '.')  // No URL/path validation
```

The `starter` argument accepts:
- Remote URLs (could clone malicious repos with post-checkout hooks)
- Local paths (could access sensitive directories)

### Safe Patterns Already in Use

The codebase uses some safe patterns that should be expanded:

**Array-based execa (safe):**
```javascript
// git/index.js - Arguments passed as array, preventing shell interpretation
await execa('git', ['clone', url, destination], this.#getOptions())
await execa('git', ['commit', '-m', message], this.#getOptions())
```

**Commander.js choices validation:**
```javascript
// Restricts input to predefined values
['--engine <name>', 'PDF engine', 'pagedjs', { choices: ['pagedjs', 'prince'] }]
```

## Library Evaluation

### Candidate Libraries

| Library | Weekly Downloads | Focus Area | Dependencies | TypeScript |
|---------|-----------------|------------|--------------|------------|
| [validator.js](https://github.com/validatorjs/validator.js) | ~9M | String validation/sanitization | 0 | Definitions available |
| [Zod](https://github.com/colinhacks/zod) | ~15M | Schema validation | 0 | First-class |
| [Joi](https://github.com/hapijs/joi) | ~5M | Schema validation | Multiple | Definitions available |
| [shescape](https://github.com/ericcornelissen/shescape) | ~50K | Shell escape | 0 | First-class |

### Analysis

#### validator.js

**Strengths:**
- Zero dependencies
- Extensive string validators: `isURL()`, `isAlphanumeric()`, `isEmail()`, etc.
- Sanitizers: `escape()`, `trim()`, `normalizeEmail()`
- Battle-tested (~9M weekly downloads)

**Weaknesses:**
- String-only (no path validation)
- [XSS sanitization removed](https://github.com/validatorjs/validator.js) (recommend DOMPurify)
- No shell/command injection protection
- No path traversal detection

**Assessment:** Useful for URL and string validation, but doesn't address core CLI security needs (path traversal, shell escape).

#### Zod

**Strengths:**
- TypeScript-first with inference
- Zero dependencies
- Schema composition and refinements
- Active development, modern API

**Weaknesses:**
- General-purpose schema validation
- No built-in path traversal detection
- No shell escape utilities
- Requires custom validators for security needs

**Assessment:** Excellent for type-safe validation schemas, but security-specific checks (path traversal, shell metacharacters) require custom refinements. [Recommended for TypeScript projects](https://dev.to/gimnathperera/yup-vs-zod-vs-joi-a-comprehensive-comparison-of-javascript-validation-libraries-4mhi).

#### Joi

**Strengths:**
- Battle-tested in Node.js ecosystem (Hapi.js heritage)
- Extensive validation rules
- Good for complex nested objects

**Weaknesses:**
- Heavy dependency tree
- [Historical security issues](https://medium.com/@jaimansoni/choosing-the-best-javascript-validation-library-yup-zod-or-joi-999280fc622c) due to deep dependencies
- No shell escape utilities
- Bulkier than alternatives

**Assessment:** Overkill for CLI needs; dependency weight not justified for simple path/URL validation.

#### shescape

**Strengths:**
- Purpose-built for shell escape
- Cross-platform (Bash, Zsh, PowerShell, cmd.exe)
- Active maintenance
- `escape()`, `quote()`, `escapeAll()`, `quoteAll()`
- Control character protection
- [Flag protection enabled by default](https://github.com/ericcornelissen/shescape/blob/main/docs/tips.md)

**Weaknesses:**
- Only addresses shell escape (not path validation)
- [Historical CVEs](https://security.snyk.io/vuln/SNYK-JS-SHESCAPE-2952704) (fixed in v1.5.8+)
- Smaller community (~50K downloads)

**Assessment:** Best-in-class for shell escape, but doesn't cover path validation needs.

### Recommendation

**Hybrid approach: Custom path validation + refactor to array-based execa**

| Concern | Solution |
|---------|----------|
| Command injection | Refactor `execaCommand()` to array-based `execa()` (no library needed) |
| Path traversal | Custom `sanitizePath()` (simple, well-tested patterns) |
| URL validation | Use existing `new URL()` + custom host whitelist |
| Package spec | Custom regex (npm naming rules are well-defined) |

**Rationale:**

1. **Array-based execa eliminates shell injection** - By passing arguments as arrays, shell metacharacters are never interpreted. This is the [recommended approach](https://auth0.com/blog/preventing-command-injection-attacks-in-node-js-apps/) and eliminates the need for shell escape libraries entirely.

2. **Path validation is simple** - Detecting `../` sequences and enforcing basePath constraints doesn't need a library. A few well-tested functions suffice.

3. **Minimize dependencies** - Quire CLI should remain lightweight. Adding Zod or Joi for ~50 lines of path validation is over-engineering.

4. **Existing AJV covers schemas** - The CLI already uses AJV for JSON schema validation; no need for another schema library.

### Alternative: Using shescape

If shell interpolation cannot be avoided (e.g., complex shell pipelines), [shescape](https://www.npmjs.com/package/shescape) is the recommended library:

```javascript
import { Shescape } from 'shescape'

const shescape = new Shescape({ shell: true })
const safePath = shescape.quote(userPath)
await execaCommand(`tar -xzf ${safePath} -C ${safeDir}`)
```

However, this adds complexity. The preferred approach is to refactor to array-based `execa()`.

### Decision Matrix

| Approach | Pros | Cons | Recommendation |
|----------|------|------|----------------|
| **Refactor to execa arrays + custom validation** | Zero new dependencies, eliminates shell injection | Requires refactoring | **Recommended** |
| **shescape + custom validation** | Best shell escape if shell needed | Adds 1 dependency | Alternative if shell required |
| **Zod + custom** | Type-safe schemas | Overkill, 1 dependency | Not recommended |
| **validator.js only** | Good string validation | Doesn't address core security needs | Not recommended alone |

## Proposed Architecture

### Sanitization Module (`src/lib/sanitize/index.js`)

```javascript
import path from 'node:path'

/**
 * Characters that could be interpreted by shells
 * @see https://www.gnu.org/software/bash/manual/html_node/Special-Characters.html
 */
const SHELL_METACHARACTERS = /[;&|`$(){}[\]<>!#*?\n\r\\]/

/**
 * Path traversal patterns
 */
const PATH_TRAVERSAL_PATTERN = /(?:^|[\\/])\.\.(?:[\\/]|$)/

/**
 * Validate and sanitize a file system path
 * @param {string} inputPath - User-provided path
 * @param {Object} options - Validation options
 * @param {string} [options.basePath] - Require path to be within this directory
 * @param {boolean} [options.allowAbsolute=true] - Allow absolute paths
 * @param {boolean} [options.allowTraversal=false] - Allow ../ sequences
 * @returns {string} Sanitized path
 * @throws {Error} If path is invalid
 */
export function sanitizePath(inputPath, options = {}) {
  const { basePath, allowAbsolute = true, allowTraversal = false } = options

  if (typeof inputPath !== 'string' || inputPath.trim() === '') {
    throw new Error('Path must be a non-empty string')
  }

  // Check for path traversal
  if (!allowTraversal && PATH_TRAVERSAL_PATTERN.test(inputPath)) {
    throw new Error(`Path traversal not allowed: ${inputPath}`)
  }

  // Check for absolute paths
  if (!allowAbsolute && path.isAbsolute(inputPath)) {
    throw new Error(`Absolute paths not allowed: ${inputPath}`)
  }

  // Resolve to absolute path
  const resolved = path.resolve(inputPath)

  // If basePath specified, ensure resolved path is within it
  if (basePath) {
    const resolvedBase = path.resolve(basePath)
    if (!resolved.startsWith(resolvedBase + path.sep) && resolved !== resolvedBase) {
      throw new Error(`Path must be within ${basePath}: ${inputPath}`)
    }
  }

  return resolved
}

/**
 * Validate a project name/path component
 * @param {string} name - Project name or path component
 * @returns {string} Validated name
 * @throws {Error} If name is invalid
 */
export function validateProjectName(name) {
  if (typeof name !== 'string' || name.trim() === '') {
    throw new Error('Project name must be a non-empty string')
  }

  // Reject shell metacharacters
  if (SHELL_METACHARACTERS.test(name)) {
    throw new Error(`Project name contains invalid characters: ${name}`)
  }

  // Reject hidden files/directories (starting with .)
  if (name.startsWith('.') && name !== '.') {
    throw new Error(`Project name cannot start with a dot: ${name}`)
  }

  // Reject reserved names on Windows
  const WINDOWS_RESERVED = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i
  if (WINDOWS_RESERVED.test(name)) {
    throw new Error(`Project name is reserved on Windows: ${name}`)
  }

  return name.trim()
}

/**
 * Validate a git repository URL
 * @param {string} url - Repository URL or local path
 * @param {Object} options - Validation options
 * @param {boolean} [options.allowLocal=true] - Allow local file paths
 * @param {string[]} [options.allowedHosts] - Whitelist of allowed hosts
 * @returns {string} Validated URL
 * @throws {Error} If URL is invalid
 */
export function validateGitUrl(url, options = {}) {
  const { allowLocal = true, allowedHosts } = options

  if (typeof url !== 'string' || url.trim() === '') {
    throw new Error('Repository URL must be a non-empty string')
  }

  // Check if it's a local path
  const isLocalPath = !url.includes('://') && !url.startsWith('git@')

  if (isLocalPath) {
    if (!allowLocal) {
      throw new Error('Local paths not allowed for repository')
    }
    // Validate as a path
    return sanitizePath(url, { allowTraversal: false })
  }

  // Parse as URL
  try {
    const parsed = new URL(url.replace(/^git@([^:]+):/, 'ssh://$1/'))

    // Check protocol
    const allowedProtocols = ['https:', 'ssh:', 'git:']
    if (!allowedProtocols.includes(parsed.protocol)) {
      throw new Error(`Unsupported protocol: ${parsed.protocol}`)
    }

    // Check host whitelist if provided
    if (allowedHosts && !allowedHosts.includes(parsed.hostname)) {
      throw new Error(`Host not in allowed list: ${parsed.hostname}`)
    }

    return url.trim()
  } catch (error) {
    if (error.code === 'ERR_INVALID_URL') {
      throw new Error(`Invalid repository URL: ${url}`)
    }
    throw error
  }
}

/**
 * Validate an npm package specifier
 * @param {string} spec - Package specifier (e.g., "@scope/name@version")
 * @returns {string} Validated specifier
 * @throws {Error} If specifier is invalid
 */
export function validatePackageSpec(spec) {
  if (typeof spec !== 'string' || spec.trim() === '') {
    throw new Error('Package specifier must be a non-empty string')
  }

  // Reject shell metacharacters
  if (SHELL_METACHARACTERS.test(spec)) {
    throw new Error(`Package specifier contains invalid characters: ${spec}`)
  }

  // Basic npm package name validation
  // @see https://docs.npmjs.com/cli/v10/configuring-npm/package-json#name
  const NPM_PACKAGE_PATTERN = /^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*(@.+)?$/i

  if (!NPM_PACKAGE_PATTERN.test(spec)) {
    throw new Error(`Invalid package specifier: ${spec}`)
  }

  return spec.trim()
}

/**
 * Check if a string contains shell metacharacters
 * @param {string} input - String to check
 * @returns {boolean} True if contains metacharacters
 */
export function hasShellMetacharacters(input) {
  return SHELL_METACHARACTERS.test(input)
}
```

## Implementation Plan

### Phase 1: Create Sanitization Module (Low Risk)

1. Create `src/lib/sanitize/index.js` with validation functions
2. Add unit tests for all validation functions
3. No changes to existing commands

### Phase 2: Fix Command Injection (High Priority)

**Replace `execaCommand()` with array-based `execa()`:**

```javascript
// BEFORE (vulnerable)
await execaCommand(`tar -xzf ${tarballPath} -C ${tempDir} --strip-components=1 package/`)

// AFTER (safe)
await execa('tar', ['-xzf', tarballPath, '-C', tempDir, '--strip-components=1', 'package/'])
```

**Files to update:**
- `lib/installer/index.js` (line 178)
- `lib/npm/index.js` (lines 45, 93, 113, 140)

### Phase 3: Add Path Validation (Medium Priority)

**Update `create.js` action:**

```javascript
import { sanitizePath, validateProjectName, validateGitUrl } from '#lib/sanitize/index.js'

async action(projectPath, starter, options = {}) {
  // Validate projectPath
  if (projectPath && projectPath !== '.') {
    validateProjectName(path.basename(projectPath))
    projectPath = sanitizePath(projectPath, { allowTraversal: false })
  }

  // Validate starter URL/path
  if (starter) {
    starter = validateGitUrl(starter, { allowLocal: true })
  }

  // ... rest of action
}
```

### Phase 4: Add Custom Error Types (Enhancement)

```javascript
// src/errors/validation/input-validation-error.js
export class InputValidationError extends QuireError {
  constructor(field, value, reason) {
    super(`Invalid ${field}: ${reason}`)
    this.code = 'INPUT_VALIDATION_ERROR'
    this.field = field
    this.value = value
  }
}

export class PathTraversalError extends InputValidationError {
  constructor(path) {
    super('path', path, 'path traversal not allowed')
    this.code = 'PATH_TRAVERSAL_ERROR'
  }
}

export class CommandInjectionError extends InputValidationError {
  constructor(field, value) {
    super(field, value, 'contains shell metacharacters')
    this.code = 'COMMAND_INJECTION_ERROR'
  }
}
```

## Testing Strategy

### Unit Tests

```javascript
import test from 'ava'
import {
  sanitizePath,
  validateProjectName,
  validateGitUrl,
  validatePackageSpec,
  hasShellMetacharacters
} from './index.js'

// Path sanitization
test('sanitizePath rejects path traversal', (t) => {
  t.throws(() => sanitizePath('../../../etc'), { message: /traversal/i })
  t.throws(() => sanitizePath('foo/../../../bar'), { message: /traversal/i })
})

test('sanitizePath enforces basePath constraint', (t) => {
  t.throws(
    () => sanitizePath('/etc/passwd', { basePath: '/home/user' }),
    { message: /must be within/i }
  )
})

// Project name validation
test('validateProjectName rejects shell metacharacters', (t) => {
  t.throws(() => validateProjectName('project;rm -rf /'), { message: /invalid/i })
  t.throws(() => validateProjectName('project$(whoami)'), { message: /invalid/i })
  t.throws(() => validateProjectName('project|cat /etc/passwd'), { message: /invalid/i })
})

test('validateProjectName allows valid names', (t) => {
  t.is(validateProjectName('my-project'), 'my-project')
  t.is(validateProjectName('My_Project_123'), 'My_Project_123')
})

// Git URL validation
test('validateGitUrl accepts valid URLs', (t) => {
  t.is(
    validateGitUrl('https://github.com/thegetty/quire-starter'),
    'https://github.com/thegetty/quire-starter'
  )
  t.is(
    validateGitUrl('git@github.com:thegetty/quire-starter.git'),
    'git@github.com:thegetty/quire-starter.git'
  )
})

test('validateGitUrl rejects invalid protocols', (t) => {
  t.throws(() => validateGitUrl('file:///etc/passwd'), { message: /protocol/i })
  t.throws(() => validateGitUrl('ftp://example.com/repo'), { message: /protocol/i })
})

// Package specifier validation
test('validatePackageSpec rejects shell metacharacters', (t) => {
  t.throws(() => validatePackageSpec('package;rm -rf /'), { message: /invalid/i })
  t.throws(() => validatePackageSpec('@scope/name$(whoami)'), { message: /invalid/i })
})
```

### Integration Tests

```javascript
test('create command rejects malicious project path', async (t) => {
  const CreateCommand = await import('./create.js')
  const command = new CreateCommand.default()

  await t.throwsAsync(
    () => command.action('../../../tmp/pwned', 'https://github.com/thegetty/quire-starter'),
    { message: /traversal/i }
  )
})

test('create command rejects shell injection in path', async (t) => {
  const CreateCommand = await import('./create.js')
  const command = new CreateCommand.default()

  await t.throwsAsync(
    () => command.action('project;rm -rf /', 'https://github.com/thegetty/quire-starter'),
    { message: /invalid/i }
  )
})
```

## Risk Assessment

### Attack Vectors Addressed

| Attack | Risk Before | Risk After | Mitigation |
|--------|-------------|------------|------------|
| Command injection via projectPath | High | Low | Array-based execa, input validation |
| Path traversal | High | Low | Path validation, basePath enforcement |
| Malicious git clone | Medium | Low | URL validation, optional host whitelist |
| npm package name injection | Low | Very Low | Package spec validation |

### Residual Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Git hooks in cloned repos | Low | High | Document in security notes; users must trust starter sources |
| Symlink attacks | Low | Medium | Not addressed; would require additional validation |
| Race conditions (TOCTOU) | Very Low | Medium | Use atomic operations where possible |

## Compatibility Considerations

### Breaking Changes

None. Validation adds constraints that reject previously-accepted (but dangerous) inputs.

### Edge Cases

| Input | Current Behavior | New Behavior |
|-------|-----------------|--------------|
| `quire new ../sibling-dir` | Creates outside cwd | **Error: path traversal not allowed** |
| `quire new "my project"` | Works (spaces OK) | Works (spaces allowed) |
| `quire new project;whoami` | Potential injection | **Error: invalid characters** |

## Effort & Priority

| Phase | Effort | Priority | Risk |
|-------|--------|----------|------|
| Phase 1: Sanitization module | Low (2-3 hours) | High | Low |
| Phase 2: Fix command injection | Medium (2-3 hours) | **Critical** | Low |
| Phase 3: Path validation | Medium (2-3 hours) | High | Low |
| Phase 4: Error types | Low (1 hour) | Low | Low |

**Total estimated effort:** 7-10 hours

## Recommendations

### Immediate Actions

1. **Replace `execaCommand()` with array-based `execa()`** - This is the highest-priority fix as it directly prevents command injection.

2. **Add path validation to `create.js`** - Prevents path traversal attacks.

### Future Considerations

1. **Host whitelist for starters** - Consider restricting `starter` URLs to trusted hosts (github.com, gitlab.com, etc.) with an override flag.

2. **Content Security Policy for cloned repos** - Warn users about git hooks in cloned repositories.

3. **Audit other user inputs** - Review all commands for additional input vectors (e.g., `--output` paths in pdf/epub commands).

## References

- [OWASP Command Injection](https://owasp.org/www-community/attacks/Command_Injection)
- [OWASP Path Traversal](https://owasp.org/www-community/attacks/Path_Traversal)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [execa Security](https://github.com/sindresorhus/execa#shell) - Why array-based commands are safer
- [npm Package Name Rules](https://docs.npmjs.com/cli/v10/configuring-npm/package-json#name)
