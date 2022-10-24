/**
 * Render all `table-of-contents` outputs
 *
 * Nota bene: The Table of Contents component renders the same markup
 * for each output with different data.
 * Each output file (`html.js`, `pdf.js`, `epub.js`) accepts all `collections`, 
 * extracts the table of contents `collection` for the current output,
 * and provides it to `tableOfContentsList`.
 */
module.exports = function(eleventyConfig) {
  const renderOutputs = eleventyConfig.getFilter('renderOutputs')
  return function(params) {
    return renderOutputs(__dirname, params)
  }
}
