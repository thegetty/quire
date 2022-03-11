const { html } = require('common-tags')

/**
 * Publication abstract
 * @param      {Object}  eleventyConfig
 * @param      {Object}  globalData
 */
module.exports = function(eleventyConfig, globalData) {
  const markdownify = eleventyConfig.getFilter('markdownify')
  return function (params) {
    const { abstract } = params
    return html`
      <section class="section quire-page__abstract">
        <div class="container">
          <div class="content">
            ${markdownify(abstract)}
          </div>
        </div>
      </section>
    `
  }
}
