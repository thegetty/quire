/**
 * Quire configuration migrations
 * @see https://github.com/sindresorhus/conf#migrations
 */
const migrations = {
  '1.0.0': (store) => {
    store.set('updateChannel', 'latest')
  }
}

export default migrations
