/**
 * Reporter module for CLI progress feedback
 *
 * Provides a consistent interface for progress indicators (spinners) with
 * unified handling of quiet/verbose modes and testability. Follows the
 * singleton pattern like lib/logger.js for easy mocking in tests.
 *
 * ## Output Modes
 *
 * The reporter supports three output modes controlled by command options:
 *
 * | Mode | Flag | Behavior |
 * |------|------|----------|
 * | Default | (none) | Show spinner with basic status |
 * | Quiet | `-q, --quiet` | Suppress all output (for CI/scripts) |
 * | Verbose | `-v, --verbose` | Show detailed progress with paths, timing |
 *
 * Note: `--debug` is handled separately and enables DEBUG namespace logging,
 * not reporter output. Use verbose mode for detailed user-facing output.
 *
 * ## Config Defaults
 *
 * Users can set default values via `quire settings`:
 * - `quire settings set verbose true` - Always run in verbose mode
 *
 * CLI flags override config settings. Use `--no-verbose` to disable verbose
 * mode even when enabled in config.
 *
 * @example Production usage
 * import reporter from '#lib/reporter/index.js'
 * reporter.start('Building site...')
 * await build()
 * reporter.succeed('Build complete')
 *
 * @example Multi-phase operation
 * reporter.start('Cloning starter...')
 * await git.clone()
 * reporter.update('Installing dependencies...')
 * await npm.install()
 * reporter.succeed('Project created')
 *
 * @example Error handling
 * reporter.start('Generating PDF...')
 * try {
 *   await generatePdf()
 *   reporter.succeed()
 * } catch (error) {
 *   reporter.fail('PDF generation failed')
 *   throw error
 * }
 *
 * @example Verbose mode with details
 * reporter.configure({ verbose: true })
 * reporter.start('Building site...')
 * reporter.detail('Output: _site/')
 * reporter.detail('Pages: 45')
 * reporter.succeed('Build complete')
 * // Shows:
 * // ⠋ Building site...
 * //   Output: _site/
 * //   Pages: 45
 * // ✔ Build complete
 *
 * @example Test mocking
 * const mockReporter = {
 *   start: sandbox.stub(),
 *   succeed: sandbox.stub(),
 *   fail: sandbox.stub(),
 *   configure: sandbox.stub(),
 * }
 * const MyCommand = await esmock('./mycommand.js', {
 *   '#lib/reporter/index.js': { default: mockReporter }
 * })
 *
 * @see https://github.com/sindresorhus/ora
 * @module lib/reporter
 */
import ora from 'ora'
import createDebug from '#debug'
import config from '#lib/conf/config.js'

const debug = createDebug('lib:reporter')

/**
 * Reporter class for CLI progress feedback
 *
 * Wraps ora spinner with additional features:
 * - Respects --quiet and --json flags
 * - Supports elapsed time display
 * - Provides consistent API across commands
 */
class Reporter {
  /** @type {import('ora').Ora|null} */
  #spinner = null

  /** @type {boolean} */
  #quiet = false

  /** @type {boolean} */
  #json = false

  /** @type {boolean} */
  #verbose = false

  /** @type {number|null} */
  #startTime = null

  /** @type {NodeJS.Timeout|null} */
  #elapsedInterval = null

  /** @type {string} */
  #baseText = ''

  /**
   * Configure reporter for current command context
   *
   * Call this at the start of command action() to respect command options.
   * CLI flags take precedence over config settings.
   *
   * @param {Object} options - Command options
   * @param {boolean} [options.quiet] - Suppress all output (no config default)
   * @param {boolean} [options.json] - JSON output mode (suppress spinner)
   * @param {boolean} [options.verbose] - Verbose output mode (falls back to config.verbose)
   * @returns {Reporter} this instance for chaining
   *
   * @example
   * async action(options) {
   *   reporter.configure(options)
   *   reporter.start('Working...')
   * }
   */
  configure(options = {}) {
    this.#quiet = options.quiet || false
    this.#json = options.json || false
    // CLI flag takes precedence, then config setting, then default false
    this.#verbose = options.verbose ?? config.get('verbose') ?? false
    debug('configured: quiet=%s, json=%s, verbose=%s', this.#quiet, this.#json, this.#verbose)
    return this
  }

  /**
   * Check if output should be suppressed
   * @private
   * @returns {boolean}
   */
  #shouldSuppress() {
    // Suppress if quiet mode, JSON mode, or not a TTY
    return this.#quiet || this.#json || !process.stdout.isTTY
  }

  /**
   * Start a new spinner
   *
   * @param {string} text - Initial spinner text
   * @param {Object} [options] - Spinner options
   * @param {boolean} [options.showElapsed=false] - Show elapsed time (e.g., "Building... (12s)")
   * @returns {Reporter} this instance for chaining
   *
   * @example
   * reporter.start('Building site...')
   *
   * @example With elapsed time
   * reporter.start('Building site...', { showElapsed: true })
   * // Shows: ⠋ Building site... (12s)
   */
  start(text, options = {}) {
    // Stop any existing spinner
    this.stop()

    this.#baseText = text
    this.#startTime = Date.now()

    if (this.#shouldSuppress()) {
      debug('spinner suppressed: %s', text)
      return this
    }

    debug('spinner start: %s', text)
    this.#spinner = ora({
      text,
      // Use 'dots' spinner for consistency across platforms
      spinner: 'dots',
    }).start()

    // Start elapsed time updates if requested
    if (options.showElapsed) {
      this.#startElapsedTimer()
    }

    return this
  }

  /**
   * Start interval timer to update elapsed time display
   * @private
   */
  #startElapsedTimer() {
    this.#elapsedInterval = setInterval(() => {
      if (this.#spinner && this.#startTime) {
        const elapsed = Math.floor((Date.now() - this.#startTime) / 1000)
        this.#spinner.text = `${this.#baseText} (${elapsed}s)`
      }
    }, 1000)
  }

  /**
   * Stop elapsed time timer
   * @private
   */
  #stopElapsedTimer() {
    if (this.#elapsedInterval) {
      clearInterval(this.#elapsedInterval)
      this.#elapsedInterval = null
    }
  }

  /**
   * Update spinner text while running
   *
   * @param {string} text - New spinner text
   * @returns {Reporter} this instance for chaining
   *
   * @example
   * reporter.start('Step 1...')
   * await step1()
   * reporter.update('Step 2...')
   * await step2()
   * reporter.succeed('All steps complete')
   */
  update(text) {
    this.#baseText = text

    if (this.#shouldSuppress()) {
      debug('spinner update (suppressed): %s', text)
      return this
    }

    if (this.#spinner) {
      debug('spinner update: %s', text)
      this.#spinner.text = text
    } else {
      // If no spinner running, start one
      this.start(text)
    }

    return this
  }

  /**
   * Mark operation as successful
   *
   * @param {string} [text] - Optional success message (defaults to current text)
   * @returns {Reporter} this instance for chaining
   *
   * @example
   * reporter.start('Building...')
   * await build()
   * reporter.succeed('Build complete')
   *
   * @example Using current text
   * reporter.start('Building site...')
   * await build()
   * reporter.succeed() // Shows: ✔ Building site...
   */
  succeed(text) {
    this.#stopElapsedTimer()

    const message = text || this.#baseText

    if (this.#shouldSuppress()) {
      debug('spinner succeed (suppressed): %s', message)
      this.#spinner = null
      return this
    }

    if (this.#spinner) {
      debug('spinner succeed: %s', message)
      this.#spinner.succeed(message)
      this.#spinner = null
    }

    return this
  }

  /**
   * Mark operation as failed
   *
   * @param {string} [text] - Optional failure message (defaults to current text)
   * @returns {Reporter} this instance for chaining
   *
   * @example
   * reporter.start('Generating PDF...')
   * try {
   *   await generatePdf()
   *   reporter.succeed()
   * } catch (error) {
   *   reporter.fail('PDF generation failed')
   *   throw error
   * }
   */
  fail(text) {
    this.#stopElapsedTimer()

    const message = text || this.#baseText

    if (this.#shouldSuppress()) {
      debug('spinner fail (suppressed): %s', message)
      this.#spinner = null
      return this
    }

    if (this.#spinner) {
      debug('spinner fail: %s', message)
      this.#spinner.fail(message)
      this.#spinner = null
    }

    return this
  }

  /**
   * Mark operation with a warning
   *
   * @param {string} [text] - Optional warning message (defaults to current text)
   * @returns {Reporter} this instance for chaining
   *
   * @example
   * reporter.start('Checking dependencies...')
   * if (outdatedDeps.length > 0) {
   *   reporter.warn('Some dependencies are outdated')
   * } else {
   *   reporter.succeed('All dependencies up to date')
   * }
   */
  warn(text) {
    this.#stopElapsedTimer()

    const message = text || this.#baseText

    if (this.#shouldSuppress()) {
      debug('spinner warn (suppressed): %s', message)
      this.#spinner = null
      return this
    }

    if (this.#spinner) {
      debug('spinner warn: %s', message)
      this.#spinner.warn(message)
      this.#spinner = null
    }

    return this
  }

  /**
   * Display an info message (non-spinner)
   *
   * @param {string} text - Info message
   * @returns {Reporter} this instance for chaining
   *
   * @example
   * reporter.info('Using cached dependencies')
   */
  info(text) {
    this.#stopElapsedTimer()

    if (this.#shouldSuppress()) {
      debug('spinner info (suppressed): %s', text)
      this.#spinner = null
      return this
    }

    if (this.#spinner) {
      debug('spinner info: %s', text)
      this.#spinner.info(text)
      this.#spinner = null
    } else {
      // Create temporary spinner just to show info
      ora().info(text)
    }

    return this
  }

  /**
   * Display a detail line (only shown in verbose mode)
   *
   * Use this to provide additional context that's useful for users
   * who want more information but isn't essential for normal operation.
   *
   * @param {string} text - Detail text to display
   * @returns {Reporter} this instance for chaining
   *
   * @example
   * reporter.configure({ verbose: true })
   * reporter.start('Building site...')
   * reporter.detail('Output: _site/')
   * reporter.detail('Processing 45 pages')
   * reporter.succeed('Build complete')
   */
  detail(text) {
    // Only show details in verbose mode
    if (!this.#verbose || this.#shouldSuppress()) {
      debug('detail (suppressed): %s', text)
      return this
    }

    // Print detail with indentation below spinner
    if (this.#spinner) {
      // Temporarily stop spinner to print detail
      const wasSpinning = this.#spinner.isSpinning
      if (wasSpinning) {
        this.#spinner.stop()
      }
      console.log(`  ${text}`)
      if (wasSpinning) {
        this.#spinner.start()
      }
    } else {
      console.log(`  ${text}`)
    }

    debug('detail: %s', text)
    return this
  }

  /**
   * Check if verbose mode is enabled
   *
   * @returns {boolean} True if verbose mode is enabled
   */
  isVerbose() {
    return this.#verbose
  }

  /**
   * Stop spinner without status indicator
   *
   * Use this when an operation is interrupted or when you need
   * to clear the spinner before other output.
   *
   * @returns {Reporter} this instance for chaining
   *
   * @example
   * reporter.start('Processing...')
   * if (shouldAbort) {
   *   reporter.stop()
   *   return
   * }
   */
  stop() {
    this.#stopElapsedTimer()

    if (this.#spinner) {
      debug('spinner stop')
      this.#spinner.stop()
      this.#spinner = null
    }

    return this
  }

  /**
   * Check if spinner is currently active
   *
   * @returns {boolean} True if a spinner is running
   *
   * @example
   * if (reporter.isSpinning()) {
   *   reporter.stop()
   * }
   */
  isSpinning() {
    return this.#spinner !== null && this.#spinner.isSpinning
  }

  /**
   * Get elapsed time since spinner started
   *
   * @returns {number|null} Elapsed time in milliseconds, or null if not started
   */
  getElapsed() {
    if (this.#startTime === null) {
      return null
    }
    return Date.now() - this.#startTime
  }

  /**
   * Reset reporter state
   *
   * Useful for testing or when reusing reporter across multiple operations.
   *
   * @returns {Reporter} this instance for chaining
   */
  reset() {
    this.stop()
    this.#quiet = false
    this.#json = false
    this.#verbose = false
    this.#startTime = null
    this.#baseText = ''
    debug('reporter reset')
    return this
  }
}

// Export singleton instance
export default new Reporter()

// Export class for testing
export { Reporter }
