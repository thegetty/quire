const fs = require('fs-extra');
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
  const webComponentsPath = path.join('_assets', 'javascript', 'web-components')
  const webComponentDirs = fs
    .readdirSync(path.join(input, webComponentsPath), { withFileTypes: true })
    .reduce((dirs, filePath) => {
      if (filePath.isDirectory()) dirs.push(filePath.name);
      return dirs
    }, [])

  return function (params) {
    return webComponentDirs
      .map((filePath) => `<script type="module" src="${path.join('/', webComponentsPath, filePath, 'index.js')}"></script>`)
      .join('')
  }
}
