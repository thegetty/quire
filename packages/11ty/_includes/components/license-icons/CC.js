module.exports = function(eleventyConfig, globalData) {
  return function(params) {
    return `
      <switch>
        <use xlink:href="#cc"></use>
      </switch>
    `
  }
}
