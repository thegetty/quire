/**
 * Default values for Quire configuration properties
 *
 * Nota bene: these values will overwrite schema default values
 * @see https://github.com/sindresorhus/conf#defaults
 */
export default {
  /**
   * Enable debug output by default (DEBUG=quire:* namespace logging).
   * Can be overridden per-command with --debug or --no-debug.
   */
  debug: false,
  /**
   * Default EPUB engine for quire epub command.
   */
  epubEngine: 'epubjs',
  /**
   * Logging level for the Quire CLI output.
   */
  logLevel: 'info',
  /**
   * Prefix text for log output messages.
   */
  logPrefix: 'quire',
  /**
   * Style of the log prefix.
   * - 'bracket': [quire] message
   * - 'emoji': 📖 message
   * - 'plain': quire: message
   * - 'none': message (no prefix)
   */
  logPrefixStyle: 'bracket',
  /**
   * Whether to show log level labels (INFO, WARN, ERROR).
   * Defaults to false for cleaner user output.
   */
  logShowLevel: false,
  /**
   * Whether to use colored output in terminal.
   */
  logUseColor: true,
  /**
   * Whether to color message text by log level (e.g., red for errors).
   * Requires logUseColor to be enabled.
   */
  logColorMessages: true,
  /**
   * Default PDF engine for quire pdf command.
   */
  pdfEngine: 'pagedjs',
  /**
   * Disable spinner animation and line overwriting.
   * When enabled, progress output uses static text instead of animated spinners,
   * and each stage prints on a new line rather than overwriting the current line.
   * Can be overridden per-command with --reduced-motion.
   */
  reducedMotion: false,
  /**
   * Project starter template to use when creating new projects.
   */
  projectTemplate: 'https://github.com/thegetty/quire-starter-default',
  /**
   * Relative path to quire-11ty installed in the project directory.
   */
  quire11tyPath: '.',
  /**
   * How stale an output must be before `quire doctor` warns.
   * - 'ZERO': any time difference (0 minutes)
   * - 'SHORT': 5 minutes
   * - 'HOURLY': 60 minutes (default)
   * - 'DAILY': 12 hours
   * - 'NEVER': disable stale output warnings
   */
  staleThreshold: 'HOURLY',
  /**
   * Version of quire-11ty to install when creating new projects.
   */
  quireVersion: 'latest',
  /**
   * Npm distribution tag to use when checking for version updates
   */
  updateChannel: 'rc',
  /**
   * Interval at which to check for updates to the Quire CLI
   * and to quire-11ty version for a prject.
   */
  updateInterval: 'DAILY',
  /**
   * Enable verbose output by default (detailed progress with paths, timing).
   * Can be overridden per-command with --verbose or --no-verbose.
   */
  verbose: false,
  /**
   * File name for the quire-11ty version file.
   */
  versionFile: '.quire',
  /**
   * Per-project data (internal).
   * Keyed by SHA-256 hash of the project's absolute path.
   */
  projects: {},
}
