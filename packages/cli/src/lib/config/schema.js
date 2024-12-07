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
  projectTemplate: {
    type: 'string'
  },
  quire11tyPath: {
    type: 'string'
  },
  quireVersion: {
    type: 'string'
  },
  updateChannels: {
    type: 'array'
  },
  updateInterval: {
    type: 'string'
  },
  versionFile: {
    type: 'string'
  }
}
