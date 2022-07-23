const { html } = require('~lib/common-tags')

module.exports = function (eleventyConfig) {
  const { figureModal } = eleventyConfig.globalData.config.params

  return ({ content, id }) => figureModal
    ? html`<a class="q-figure__modal-link" href="#${id}">${content}</a>`
    : content
}
