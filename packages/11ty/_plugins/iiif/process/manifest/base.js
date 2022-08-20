module.exports = class Base {
  constructor(data) {
    this.iiifConfig = data
  }

  getBaseId(figure) {
    return [process.env.URL, this.iiifConfig.outputDir, figure.id].join('/')
  }
}
