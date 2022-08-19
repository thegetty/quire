module.exports = class Base {
  constructor(data) {
    const { figure, eleventyConfig } = data
    const { outputDir } = eleventyConfig.globalData.iiifConfig
    const baseId = [process.env.URL, outputDir, data.figure.id].join('/')

    this.baseId = baseId
    this.data = data
    this.figure = figure
    this.iiifConfig = eleventyConfig.globalData.iiifConfig
  }
}
