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
    default: 'info',
  },
  projectTemplate: {
    type: 'string',
    default: 'quire-starter-default',
  },
  quire11tyPath: {
    type: 'string',
    default: './',
  },
  quireVersion: {
    type: 'string',
    default: 'latest',
  },
  telemetry: {
    type: 'boolean',
    default: false,
  },
  updateChannels: {
    type: 'array',
    dafault: ['latest', 'pre-release']
  },
  updateInterval: {
    type: 'string',
    default: 'DAILY',
  },
  versionFile: {
    type: 'string',
    default: '.quire',
  }
}
