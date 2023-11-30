module.exports = function(eleventyConfig) {
  return function(...args) {
    const [data, id='quire-data'] = args
    return `<script type="application/json" id="${id}">${data}</script>`
  }
}
