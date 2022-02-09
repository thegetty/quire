const path = require('path')

module.exports = function(eleventyConfig, data) {
  const { config } = data
  return `
    <switch>
      <use xlink:href="#cc-by"></use>
      <foreignObject width="135" height="30">
          <img src="${ path.join(config.params.imageDir, 'icons', 'cc-by.png') }" alt="CC-BY" />
      </foreignObject>
    </switch>
  `
}
