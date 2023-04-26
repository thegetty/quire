/**
 * Polling module
 * 
 * @property  {Function} callback Function to call if validate succeeds
 * @property  {Number} interval Interval between tries
 * @property  {Number} maxTries Maximum number of polling attempts
 * @property  {Function} validate Function that evaluates to true to indicate that polling should end
 */
export default ({ callback, interval=200, maxTries=10, tries=0, validate }) => {
  const poll = () => {
    if (tries === maxTries) {
      console.error(`Polling reached maximum number of attempts`)
      return
    }

    tries++

    const valid = validate()

    if (valid) {
      callback()
    } else {
      setTimeout(poll, interval)
    }
  }
  poll()
}
