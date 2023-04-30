/** 
 * Set details elements to open in print
 */
module.exports = (element) => {
  const nodes = element.querySelectorAll('details')
  nodes.forEach((details) => {
    details.setAttribute('open', true)
  })
  return element
}