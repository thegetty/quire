/**
 * Remove elements that should not be rendered in the provided output type
 * 
 * @param  {Object} element HTML elmeent
 * @param  {String} output  pdf, epub, html
 */
module.exports = function (element, output) {
  for (const item of element.querySelectorAll('[data-outputs-include]')) {
    const value = item.dataset.outputsInclude
    if (!value.split(',').map((item) => item.trim()).includes(output)) {
      item.remove()
    }
  }
  for (const item of element.querySelectorAll('[data-outputs-exclude]')) {
    const value = item.dataset.outputsExclude
    if (value.split(',').map((item) => item.trim()).includes(output)) {
      item.remove()
    }
  }
  return element
}
