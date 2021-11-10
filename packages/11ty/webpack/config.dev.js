const prodConfig = require('./config.prod.js')

module.exports = {
  ...prodConfig,
  watch: true,
  watchOptions: {
    ignored: '**/node_modules'
  }
}
