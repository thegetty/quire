const path = require('path')

module.exports = function(eleventyConfig, globalData) {
  const imageDir = globalData.config.params.imageDir
  return function(params) {
    return `
      <switch>
        <use xlink:href="#cc-by-nc"></use>
        <foreignObject width="135" height="30">
          <img src="${path.join(imageDir, 'icons', 'cc-by-nc.png')}" alt="CC-BY-NC" />
        </foreignObject>
      </switch>
    `
  }
}
