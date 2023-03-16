const { html } = require('~lib/common-tags')
const path = require('path')

module.exports = function(eleventyConfig) {
  const renderFile = eleventyConfig.getFilter('renderFile')
  const renderTemplate = eleventyConfig.getFilter('renderTemplate')
  const { assetDir } = eleventyConfig.globalData.config.figures
  return async function(data) {
    const { WebC } = await import('@11ty/webc')
    const fileName = 'image-sequence.webc'
    const filePath = path.join(eleventyConfig.dir.input, eleventyConfig.dir.includes, 'components', 'figure', 'image', fileName)
    let page = new WebC();

    // This enables aggregation of CSS and JS
    // As of 0.4.0+ this is disabled by default
    page.setBundlerMode(true);

    page.setInputPath(filePath);

    const { html: markup, css, js, components } = await page.compile();
    console.warn('GOODS', { markup, css, js, components })

    return html(markup)
  }
}
