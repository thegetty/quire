function* UidGenerator() {
  let i = 0
  while (true) yield i++
}
const generator = UidGenerator()
const uid = () => generator.next().value

/**
 * Adds a `uid` property to all objects containing an `id` property
 * @param {Object|Array} data
 */
const addUids = function(data) {
  if (!data) return
  if (data.hasOwnProperty('id')) {
    data.uid = `uid-${uid()}`
    return data
  }
  switch (true) {
    case Array.isArray(data):
      data.forEach((item, index) => {
        data[index] = addUids(item)
      })
      break;
    case typeof data === 'object':
      Object.keys(data).forEach((key) => {
        data[key] = addUids(data[key])
      })
      break;
    default:
      break;
  }
  return data;
}

module.exports = {
  addUids,
  uid
}
