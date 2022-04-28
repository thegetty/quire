const path = require('path')

module.exports = function(eleventyConfig) {
  const imageDir = eleventyConfig.globalData.config.params.imageDir
  return function(params) {
    return `
      <switch>
        <use xlink:href="#cc-by-nc-sa"></use>
        <foreignObject width="135" height="30">
          <img src="${path.join(imageDir, 'icons', 'cc-by-nc-sa.png')}" alt="CC-BY-NC-SA" />
        </foreignObject>
      </switch>
    `
  }
}
