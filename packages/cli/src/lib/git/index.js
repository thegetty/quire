/**
 * Git façade providing abstracted git operations
 *
 * Provides a consistent interface for git commands with unified
 * logging, error handling, and testability. Follows the singleton
 * pattern like lib/npm/index.js for easy mocking in tests.
 *
 * @example in production code
 * import git from '#lib/git/index.js'
 * await git.clone('https://github.com/user/repo', '/path/to/dest')
 *
 * @example in test code
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
   * Stage files for commit
   * @see https://git-scm.com/docs/git-add
   * @param {string|string[]} files - Files to stage (use '.' for all)
   * @param {string} [cwd] - Working directory
   * @returns {Promise<void>}
   */
  async add(files, cwd) {
    const fileList = Array.isArray(files) ? files : [files]
    console.debug(`${LOG_PREFIX} staging files: ${fileList.join(', ')}`)
    const options = cwd ? { cwd } : {}
    await execa('git', ['add', ...fileList], options)
  }

  /**
   * Clone a repository
   * @see https://git-scm.com/docs/git-clone
   * @param {string} url - Repository URL
   * @param {string} [destination='.'] - Destination directory
   * @param {string} [cwd] - Working directory for clone operation
   * @returns {Promise<void>}
   */
  async clone(url, destination = '.', cwd) {
    console.debug(`${LOG_PREFIX} cloning ${url} to ${destination}`)
    const options = cwd ? { cwd } : {}
    await execa('git', ['clone', url, destination], options)
  }

  /**
   * Create a commit
   * @see https://git-scm.com/docs/git-commit
   * @param {string} message - Commit message
   * @param {string} [cwd] - Working directory
   * @returns {Promise<void>}
   */
  async commit(message, cwd) {
    console.debug(`${LOG_PREFIX} committing: ${message.substring(0, 50)}...`)
    const options = cwd ? { cwd } : {}
    await execa('git', ['commit', '-m', message], options)
  }

  /**
   * Initialize a new repository
   * @see https://git-scm.com/docs/git-init
   * @param {string} [cwd] - Working directory
   * @returns {Promise<void>}
   */
  async init(cwd) {
    console.debug(`${LOG_PREFIX} initializing repository`)
    const options = cwd ? { cwd } : {}
    await execa('git', ['init'], options)
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
   * @param {string} [cwd] - Working directory
   * @returns {Promise<void>}
   */
  async rm(files, cwd) {
    const fileList = Array.isArray(files) ? files : [files]
    console.debug(`${LOG_PREFIX} removing files: ${fileList.join(', ')}`)
    const options = cwd ? { cwd } : {}
    await execa('git', ['rm', ...fileList], options)
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

// Export singleton instance
export default new Git()
