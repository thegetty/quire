const { html } = require('common-tags')
const path = require('path')

/**
 * A shortcode for embedding a table into the document.
 * @param {String}
 * @return {String}  An HTML <table> element
 */
module.exports = function(eleventyConfig) {
  const figurecaption = eleventyConfig.getFilter('figurecaption')
  const markdownify = eleventyConfig.getFilter('markdownify')
  const renderFile = eleventyConfig.getFilter('renderFile')

  const assetsDir = path.join(eleventyConfig.dir.input, '_assets/images')
  const { figureLabelLocation } = eleventyConfig.globalData.config.params

  return async function({ caption, credit, id, src }) {
    const table = await renderFile(path.join(assetsDir, src))
    const title = markdownify(caption)

    return html`
      <a
        class="inline popup"
        data-type="inline"
        href="#${id}"
        title="${title}"
      >
        ${table}
      </a>
      ${figurecaption({ caption, credit })}
    `
  }
}
