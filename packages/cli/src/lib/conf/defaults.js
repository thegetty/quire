/**
 * Default values for Quire configuration properties
 *
 * Nota bene: these values will overwrite schema default values
 * @see https://github.com/sindresorhus/conf#defaults
 */
export default {
  /**
   * Logging level for the Quire CLI output.
   */
  logLevel: 'info',
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
