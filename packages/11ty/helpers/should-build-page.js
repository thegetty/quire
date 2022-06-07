/**
 * Returns true if page should be built
 * for the current output type defined in `env.QUIRE_OUTPUT`
 * @param  {Object} outputs Page frontmatter property `outputs`
 * @return {Boolean}
 */
module.exports = function (outputs) {
  return outputs !== "none" &&
    outputs !== false &&
    (!outputs ||
      Array.isArray(outputs) && outputs.includes(process.env.QUIRE_OUTPUT) ||
      outputs === process.env.QUIRE_OUTPUT)
}
