/**
 * Quire configuration migrations
 * @see https://github.com/sindresorhus/conf#migrations
 */
const migrations = {
  '1.0.0-rc.1': (store) => {
    store.set('quire11tyPath', './11ty')
    store.set('versionFile', '.quire-version')
  },
  '1.0.0': (store) => {
    store.set('updateChannels', ['latest'])
  }
}

export default migrations
