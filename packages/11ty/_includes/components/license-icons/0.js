const path = require('path')

module.exports = function(eleventyConfig) {
  const imageDir = eleventyConfig.globalData.config.params.imageDir
  return function(params) {
    return `
      <switch>
        <use xlink:href="#cc-zero"></use>
        <foreignObject width="135" height="30">
          <img src="${path.join(imgDir, 'icons', 'cc-zero.png')}" alt="CC-ZERO" />
        </foreignObject>
      </switch>
    `
  }
}
