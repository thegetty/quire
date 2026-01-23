/**
 * Default values for Quire configuration properties
 *
 * Nota bene: these values will overwrite schema default values
 * @see https://github.com/sindresorhus/conf#defaults
 */
export default {
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
   * Default PDF engine for quire pdf command.
   */
  pdfEngine: 'pagedjs',
  /**
   * Project starter template to use when creating new projects.
   */
  projectTemplate: 'https://github.com/thegetty/quire-starter-default',
  /**
   * Relative path to quire-11ty installed in the project directory.
   */
  quire11tyPath: '.',
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
   * File name for the quire-11ty version file.
   */
  versionFile: '.quire',
}
