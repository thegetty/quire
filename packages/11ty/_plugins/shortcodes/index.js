import accordion from './accordion.js'
import addComponentTag from '../../_plugins/components/addComponentTag.js'
import backmatter from './backmatter.js'
import bibliography from './bibliography.js'
import cite from './cite.js'
import contributors from './contributors.js'
import figure from './figure.js'
import figureGroup from './figureGroup.js'
import ref from './ref.js'
import shortcodeFactory from '../components/shortcodeFactory.js'
import title from './title.js'
import tombstone from './tombstone.js'

export default function (eleventyConfig, collections, options) {
  const { addShortcode, addPairedShortcode } = shortcodeFactory(eleventyConfig, collections)

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
}
