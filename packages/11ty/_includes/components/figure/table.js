const { html } = require('common-tags')
const path = require('path')

/**
 * A shortcode for embedding a table into the document.
 * @param {String}
 * @return {String}  An HTML <table> element
 */
module.exports = function(eleventyConfig, globalData) {
  const figurecaption = eleventyConfig.getFilter('figurecaption')
  const figurelabel = eleventyConfig.getFilter('figurelabel')
  const markdownify = eleventyConfig.getFilter('markdownify')
  const renderFile = eleventyConfig.getFilter('renderFile')

  const assetsDir = path.join(eleventyConfig.dir.input, '_assets/images')
  const { figureLabelLocation } = globalData.config.params

  return async function({ caption, credit, id, src }) {
    const modalLink = `#${id}`
    const tableFile = path.join(assetsDir, src)
    const title = markdownify(caption)

    return html`
      <a
        class="inline popup"
        data-type="inline"
        href="${modalLink}"
        title="${title}"
      >
        ${await renderFile(tableFile)}
      </a>
      ${figurecaption({ caption, credit })}
    `
  }
}
