const path = require('path')

module.exports = function(eleventyConfig) {
  const imageDir = eleventyConfig.globalData.config.params.imageDir
  return function(params) {
    return `
      <switch>
        <use xlink:href="#cc-by"></use>
        <foreignObject width="135" height="30">
          <img src="${path.join(imageDir, 'icons', 'cc-by.png')}" alt="CC-BY" />
        </foreignObject>
      </switch>
    `
  }
}
