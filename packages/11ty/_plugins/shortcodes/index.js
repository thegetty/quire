const accordion = require('./accordion.js')
const addComponentTag = require('../../_plugins/components/addComponentTag')
const backmatter = require('./backmatter')
const bibliography = require('./bibliography')
const cite = require('./cite')
const contributors = require('./contributors')
const figure = require('./figure')
const figureGroup = require('./figureGroup')
const ref = require('./ref')
const shortcodeFactory = require('../components/shortcodeFactory')
const title = require('./title')
const tombstone = require('./tombstone')

module.exports = function(eleventyConfig, collections, options) {
  const { addShortcode, addPairedShortcode, addWebcShortcode } = shortcodeFactory(eleventyConfig, collections)

  addPairedShortcode('accordion', accordion)
  addComponentTag(eleventyConfig, 'ref', ref)
  addPairedShortcode('backmatter', backmatter)
  addShortcode('bibliography', bibliography)
  addShortcode('cite', cite)
  addComponentTag(eleventyConfig, 'contributors', contributors)
  addShortcode('figure', figure)
  addShortcode('figuregroup', figureGroup)
  addShortcode('title', title)
  addShortcode('tombstone', tombstone)
  /**
   * Note: WebC attribute names must be all lowercase or snake_case
   */
  addWebcShortcode('quireFigure', 'quire-figure', ['classes', 'id', 'image_dir'])
}
