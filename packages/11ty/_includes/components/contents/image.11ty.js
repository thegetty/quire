const path = require('path')
module.exports = function(eleventyConfig, globalData, imageDir, src) {
  if (!imageDir || !src) return ''
  const imgPath = path.join(imageDir, src)
  return `
    <div class="card-image">
      <figure class="image">
        <img src="${ imgPath }" alt="" />
      </figure>
    </div>
  `
}