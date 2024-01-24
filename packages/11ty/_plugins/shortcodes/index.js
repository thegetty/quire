import accordion from './accordion.js'
import addComponentTag from '../../_plugins/components/addComponentTag'
import backmatter from './backmatter'
import bibliography from './bibliography'
import cite from './cite'
import contributors from './contributors'
import figure from './figure'
import figureGroup from './figureGroup'
import ref from './ref'
import shortcodeFactory from '../components/shortcodeFactory'
import title from './title'
import tombstone from './tombstone'

export default function(eleventyConfig, collections, options) {
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
