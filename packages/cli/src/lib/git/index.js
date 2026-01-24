/**
 * Git façade providing abstracted git operations
 *
 * Provides a consistent interface for git commands with unified
 * logging, error handling, and testability.
 *
 * @example using default singleton for global operations
 * import git from '#lib/git/index.js'
 * const version = await git.version()
 * if (!git.isAvailable()) { ... }
 *
 * @example using Git class for repository-scoped operations
 * import { Git } from '#lib/git/index.js'
 * const repo = new Git('/path/to/project')
 * await repo.init()
 * await repo.add('.')
 * await repo.commit('Initial commit')
 *
 * @example mocking in tests
 * const mockGit = {
 *   clone: sandbox.stub().resolves(),
 *   commit: sandbox.stub().resolves(),
 * }
 * const MyCommand = await esmock('./mycommand.js', {
 *   '#lib/git/index.js': { default: mockGit }
 * })
 *
 * @see https://git-scm.com/docs - git documentation
 * @module git
 */
import { execa } from 'execa'
import fs from 'node:fs'
import path from 'node:path'
import which from '#helpers/which.js'
import createDebug from '#debug'

const debug = createDebug('lib:git')

/**
 * Check if a source string is a remote URL (vs local path)
 *
 * Git supports various remote URL formats:
 * - https://github.com/user/repo.git
 * - git@github.com:user/repo.git
 * - ssh://git@github.com/user/repo.git
 * - http://github.com/user/repo.git
 * - git://github.com/user/repo.git
 *
 * @param {string} source - Source string to check
 * @returns {boolean} True if source appears to be a remote URL
 */
export function isRemoteUrl(source) {
  return source.startsWith('https://') ||
         source.startsWith('git@') ||
         source.startsWith('ssh://') ||
         source.startsWith('http://') ||
         source.startsWith('git://')
}

/**
 * Check if a path is a git repository
 *
 * A directory is considered a git repository if it contains a .git directory.
 *
 * @param {string} dirPath - Path to check
 * @returns {boolean} True if the path is a git repository
 */
export function isGitRepository(dirPath) {
  const gitDir = path.join(dirPath, '.git')
  return fs.existsSync(gitDir)
}

/**
 * Validate a clone source before attempting to clone
 *
 * For remote URLs, validation is skipped (let git clone handle network errors).
 * For local paths, validates the path exists and is a git repository.
 *
 * @param {string} source - Clone source (URL or local path)
 * @returns {{ valid: boolean, reason?: string }} Validation result
 */
export function validateCloneSource(source) {
  // Remote URLs are assumed valid - let git clone handle errors
  if (isRemoteUrl(source)) {
    return { valid: true }
  }

  // Local path validation
  if (!fs.existsSync(source)) {
    return { valid: false, reason: 'path does not exist' }
  }

  if (!isGitRepository(source)) {
    return { valid: false, reason: 'not a git repository' }
  }

  return { valid: true }
}

/**
 * Git façade class
 */
class Git {
  /**
   * Create a Git façade instance
   * @param {string} [cwd] - Working directory for all operations
   */
  constructor(cwd) {
    this.cwd = cwd
  }

  /**
   * Get execa options with working directory
   * @private
   * @returns {Object} Options object for execa
   */
  #getOptions() {
    return this.cwd ? { cwd: this.cwd } : {}
  }

  /**
   * Get resolved working directory for logging
   * @private
   * @returns {string} Resolved absolute path
   */
  #resolvedCwd() {
    return path.resolve(this.cwd || process.cwd())
  }

  /**
   * Stage files for commit
   * @see https://git-scm.com/docs/git-add
   * @param {string|string[]} files - Files to stage (use '.' for all)
   * @returns {Promise<void>}
   */
  async add(files) {
    const fileList = Array.isArray(files) ? files : [files]
    debug('staging files in %s: %s', this.#resolvedCwd(), fileList.join(', '))
    await execa('git', ['add', ...fileList], this.#getOptions())
  }

  /**
   * Clone a repository
   * @see https://git-scm.com/docs/git-clone
   * @param {string} url - Repository URL
   * @param {string} [destination='.'] - Destination directory
   * @returns {Promise<void>}
   */
  async clone(url, destination = '.') {
    const resolvedDest = path.resolve(this.#resolvedCwd(), destination)
    debug('cloning %s to %s', url, resolvedDest)
    await execa('git', ['clone', url, destination], this.#getOptions())
  }

  /**
   * Create a commit
   * @see https://git-scm.com/docs/git-commit
   * @param {string} message - Commit message
   * @returns {Promise<void>}
   */
  async commit(message) {
    debug('committing in %s: %s...', this.#resolvedCwd(), message.substring(0, 50))
    await execa('git', ['commit', '-m', message], this.#getOptions())
  }

  /**
   * Initialize a new repository
   * @see https://git-scm.com/docs/git-init
   * @returns {Promise<void>}
   */
  async init() {
    debug('initializing repository in %s', this.#resolvedCwd())
    await execa('git', ['init'], this.#getOptions())
  }

  /**
   * Check if git is available in PATH
   * @returns {boolean} True if git is available
   */
  isAvailable() {
    return !!which('git')
  }

  /**
   * Remove files from the working tree and index
   * @see https://git-scm.com/docs/git-rm
   * @param {string|string[]} files - Files to remove
   * @returns {Promise<void>}
   */
  async rm(files) {
    const fileList = Array.isArray(files) ? files : [files]
    debug('removing files in %s: %s', this.#resolvedCwd(), fileList.join(', '))
    await execa('git', ['rm', ...fileList], this.#getOptions())
  }

  /**
   * Get git version
   * @see https://git-scm.com/docs/git-version
   * @returns {Promise<string>} git version string
   */
  async version() {
    const { stdout } = await execa('git', ['--version'])
    return stdout.replace('git version ', '')
  }
}

// Export class for repository-scoped operations
export { Git }

// Export singleton instance for global operations
export default new Git()
