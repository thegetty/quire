module.exports = function(eleventyConfig) {
  return function(params) {
    return `
      <switch>
        <use xlink:href="#cc"></use>
      </switch>
    `
  }
}
