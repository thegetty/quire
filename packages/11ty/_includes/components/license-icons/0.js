const path = require('path')

module.exports = function({ eleventyConfig, globalData }) {
  const { config } = globalData
  return `
    <switch>
      <use xlink:href="#cc-zero"></use>
      <foreignObject width="135" height="30">
          <img src="${ path.join(config.params.imageDir, 'icons', 'cc-zero.png') }" alt="CC-ZERO" />
      </foreignObject>
    </switch>
  `
}
