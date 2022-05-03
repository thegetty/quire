const fs = require('fs');
const path = require('path');

/**
 * Renders <script> tags for all lit-element web components in `_assets/javascript/lit/`
 *
 * @param      {Object}  eleventyConfig
 * @param      {Object}  data
 *
 * @return     {String}  <script type="module"> for each lit-element
 */
module.exports = function(eleventyConfig, globalData) {
  const { input } = eleventyConfig.dir
  const litElementsPath = path.join('_assets', 'javascript', 'lit')
  const litElements = fs
    .readdirSync(path.join(input, litElementsPath))
    .filter((filename) => filename.endsWith('.js'))

  return function (params) {
    return litElements
      .map((filename) => `<script type="module" src="${path.join('/', litElementsPath, filename)}"></script>`)
      .join('')
  }
}
