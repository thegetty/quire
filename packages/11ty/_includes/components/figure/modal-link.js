const { html } = require('~lib/common-tags')

module.exports = function (eleventyConfig) {
  const { figureModal } = eleventyConfig.globalData.config.params

  return function({ content, id }) {
    return figureModal
      ? html`<a
          href="#${id}"
          class="q-figure__modal-link"
        >
          ${content}
        </a>`
      : content
  }
}
