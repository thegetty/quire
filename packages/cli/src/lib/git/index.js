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
import which from '#helpers/which.js'

const LOG_PREFIX = '[CLI:lib/git]'

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
   * Stage files for commit
   * @see https://git-scm.com/docs/git-add
   * @param {string|string[]} files - Files to stage (use '.' for all)
   * @returns {Promise<void>}
   */
  async add(files) {
    const fileList = Array.isArray(files) ? files : [files]
    console.debug(`${LOG_PREFIX} staging files: ${fileList.join(', ')}`)
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
    console.debug(`${LOG_PREFIX} cloning ${url} to ${destination}`)
    await execa('git', ['clone', url, destination], this.#getOptions())
  }

  /**
   * Create a commit
   * @see https://git-scm.com/docs/git-commit
   * @param {string} message - Commit message
   * @returns {Promise<void>}
   */
  async commit(message) {
    console.debug(`${LOG_PREFIX} committing: ${message.substring(0, 50)}...`)
    await execa('git', ['commit', '-m', message], this.#getOptions())
  }

  /**
   * Initialize a new repository
   * @see https://git-scm.com/docs/git-init
   * @returns {Promise<void>}
   */
  async init() {
    console.debug(`${LOG_PREFIX} initializing repository`)
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
    console.debug(`${LOG_PREFIX} removing files: ${fileList.join(', ')}`)
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
