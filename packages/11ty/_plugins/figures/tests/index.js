require('module-alias/register')
const test = require('node:test')
const assert = require('assert/strict')
// const { add, subtract, multiply, divide, power } = require('./index')
const figuresData = require('./__fixtures__/figures/index.js')
const iiifConfig = require('./__fixtures__/iiifConfig.json')
const manifest = require('./__fixtures__/manifest.json')

const Figure = require('../figure')
const figures = Object
  .keys(figuresData)
  .map((figureData) => {
    return new Figure(iiifConfig, null, figureData)
  })

// https://presentation-validator.iiif.io/validate?version=2.1&url=manifest-url-here

// test('synchronous passing test', (t) => {
//   assert.strictEqual(1, 1)
// })
