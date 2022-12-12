/**
 * Quire configuration defaults
 *
 * Nota bene: `defaults` values will overwrite schema `default` values
 * @see https://github.com/sindresorhus/conf#defaults
 */
export default {
  /**
   * The default logging level for the Quire CLI output.
   */
  logLevel: 'info',
  /**
   * A default project starter template to use when creating new projects.
   */
  projectTemplate: 'quire-starter-default',
  /**
   * The relative path to `quire-11ty` installed in the project directory.
   */
  quirePath: './11ty',
  /**
   * Version of `quire-11ty` to install when creating new Quire projects.
   */
  quireVersion: 'latest',
  /**
   * Send anonymous data about Quire usage **Not Implemented**
   */
  telemetry: false,
  /**
   * A list of distribution tags to use when checking for version updates.
   * To show notifications for pre-releases version updates include `'pre-release'` in the array of channels.
   */
  updateChannels: ['latest'],
  /**
   * Interval at which to check for updates to the Quire CLI and project's `quire-11ty` version.
   */
  updateInterval: 'DAILY',
  /**
   * The default file name for the `quire-11ty` version file.
   */
  versionFile: '.quire-version',
}
