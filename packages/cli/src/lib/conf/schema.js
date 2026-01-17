/**
 * Quire configuration schema
 * @see https://github.com/sindresorhus/conf#schema
 *
 * Nota bene: schema default values will are overwritten by `defaults.js` values
 * @see https://github.com/sindresorhus/conf#defaults
 */
export default {
  logLevel: {
    type: 'string',
    enum: ['trace', 'debug', 'info', 'warn', 'error', 'silent'],
    description: 'Minimum log level to display (trace, debug, info, warn, error, silent)'
  },
  logPrefix: {
    type: 'string',
    description: 'Prefix text shown before log messages'
  },
  logPrefixStyle: {
    type: 'string',
    enum: ['bracket', 'emoji', 'plain', 'none'],
    description: 'Style for displaying the log prefix (bracket: [quire], emoji: 📖, plain: quire:, none: no prefix)'
  },
  logShowLevel: {
    type: 'boolean',
    description: 'Show log level label (INFO, WARN, etc.) in output'
  },
  logUseColor: {
    type: 'boolean',
    description: 'Use colored output for log messages'
  },
  logPrefix: {
    type: 'string'
  },
  logPrefixStyle: {
    type: 'string',
    enum: ['bracket', 'emoji', 'plain', 'none']
  },
  logShowLevel: {
    type: 'boolean'
  },
  logUseColor: {
    type: 'boolean'
  },
  projectTemplate: {
    type: 'string',
    format: 'uri',
    description: 'URL of the default project template for quire new'
  },
  quire11tyPath: {
    type: 'string',
    description: 'Path to the quire-11ty package (use "." for local development)'
  },
  quireVersion: {
    type: 'string',
    description: 'Version of quire-11ty to use ("latest" or specific version)'
  },
  updateChannel: {
    type: 'string',
    enum: ['stable', 'rc', 'beta', 'alpha'],
    description: 'Release channel for updates (stable, rc, beta, alpha)'
  },
  updateInterval: {
    type: 'string',
    enum: ['DAILY', 'WEEKLY', 'MONTHLY', 'NEVER'],
    description: 'How often to check for updates (DAILY, WEEKLY, MONTHLY, NEVER)'
  },
  versionFile: {
    type: 'string',
    description: 'Filename used to identify Quire projects'
  }
}
