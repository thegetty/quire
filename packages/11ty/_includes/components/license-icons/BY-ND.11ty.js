const path = require('path')

module.exports = function(eleventyConfig, { config }) {
  return `
    <switch>
      <use xlink:href="#cc-by-nd"></use>
      <foreignObject width="135" height="30">
          <img src="${ path.join(config.params.imageDir, 'icons', 'cc-by-nd.png') }" alt="CC-BY-ND" />
      </foreignObject>
    </switch>
  `
}