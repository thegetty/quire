const path = require('path')

module.exports = function(eleventyConfig, { config }) {
  return `
    <switch>
      <use xlink:href="#cc-by-nc-sa"></use>
      <foreignObject width="135" height="30">
          <img src="${ path.join(config.params.imageDir, 'icons', 'cc-by-nc-sa.png') }" alt="CC-BY-NC-SA" />
      </foreignObject>
    </switch>
  `
}