/**
 * Quire configuration schema
 * @see https://github.com/sindresorhus/conf#schema
 *
 * Nota bene: schema default values will are overwritten by `defaults.js` values
 * @see https://github.com/sindresorhus/conf#defaults
 */
export default {
  logLevel: {
    type: 'string'
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
    type: 'string'
  },
  quire11tyPath: {
    type: 'string'
  },
  quireVersion: {
    type: 'string'
  },
  updateChannel: {
    type: 'string'
  },
  updateInterval: {
    type: 'string'
  },
  versionFile: {
    type: 'string'
  }
}
