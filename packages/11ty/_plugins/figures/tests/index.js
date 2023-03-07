require('module-alias/register')
const { mock, test } = require('node:test')
const assert = require('assert/strict')
// const { add, subtract, multiply, divide, power } = require('./index')
const figureFixtures = require('./__fixtures__/figures/index.js')
const iiifConfig = require('./__fixtures__/iiif-config.json')

const Figure = require('../figure')
const Manifest = require('../iiif/manifest')
// mock.method(Manifest, Manifest.write.name)
// const figures = Object
//   .keys(figureFixtures)
//   .map(({ figure }) => {
//     return new Figure(iiifConfig, null, figure)
//   })

// https://presentation-validator.iiif.io/validate?version=2.1&url=manifest-url-here
// NOTE: above validator tool only works if manifests are behind a URL

// console.warn('MAN JASON', manifestJson)
// console.warn('MAN FIXT', manifestFixture)
// const validation = await fetch(`https://presentation-validator.iiif.io/validate?version=2.1&url=${url}`)
// const validationResponse = await validation.json()

// test('synchronous passing test', (t) => {
//   assert.strictEqual(1, 1)
// })
const createManifestFromFigureFixture = async (figureFixtureName) => {
  const {
    figure: figureFixture,
    manifest: manifestFixture
  } = figureFixtures[figureFixtureName]
  const figure = new Figure(iiifConfig, null, figureFixture)
  const manifest = new Manifest(figure)
  const manifestJson = await manifest.toJSON()
  return {
    manifestFixture,
    manifestJson
  }
}

test('figure with checkbox annotations creates a valid manifest', async () => {
  const { manifestFixture, manifestJson } = await createManifestFromFigureFixture('annotationsCheckbox')
  assert.deepStrictEqual(manifestFixture, manifestJson)
})

test('figure with radio annotations creates a valid manifest', async () => {
  const { manifestFixture, manifestJson } = await createManifestFromFigureFixture('annotationsRadio')
  assert.deepStrictEqual(manifestFixture, manifestJson)
})

test('sequence figure creates a valid manifest', async () => {
  const { manifestFixture, manifestJson } = await createManifestFromFigureFixture('sequence')
  assert.deepStrictEqual(manifestFixture, manifestJson)
})

test('sequence figure with annotations creates a valid manifest', async () => {
  const { manifestFixture, manifestJson } = await createManifestFromFigureFixture('sequenceWithAnnotations')
  assert.deepStrictEqual(manifestFixture, manifestJson)
})

test('zoomable figure creates a valid manifest', async () => {
  const { manifestFixture, manifestJson } = await createManifestFromFigureFixture('zoomable')
  assert.deepStrictEqual(manifestFixture, manifestJson)
})
