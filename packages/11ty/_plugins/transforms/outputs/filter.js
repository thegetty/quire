/**
 * Remove elements that should not be rendered in the provided output type
 * 
 * @param  {Object} element HTML elmeent
 * @param  {String} output  pdf, epub, html
 */
module.exports = function (element, output) {
  for (item of element.querySelectorAll('[data-outputs-include]')) {
    const value = item.dataset.includeInOutput
    if (!value.split(',').includes(output)) {
      item.remove()
    }
  }
  for (item of element.querySelectorAll('[data-outputs-exclude]')) {
    const value = item.dataset.excludeFromOutput
    if (value.split(',').includes(output)) {
      item.remove()
    }
  }
  return element
}
