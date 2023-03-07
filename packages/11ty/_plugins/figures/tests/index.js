require('module-alias/register')
const { mock, test } = require('node:test')
const assert = require('assert/strict')
// const { add, subtract, multiply, divide, power } = require('./index')
const Figure = require('../figure')
const figureFixtures = require('./__fixtures__/figures/index.js')
const iiifConfig = require('./__fixtures__/iiif-config.json')
const Manifest = require('../iiif/manifest')

const createManifestFromFigureFixture = async (figureFixtureName) => {
  const {
    dimensions,
    figure: figureFixture,
    manifest: manifestFixture
  } = figureFixtures[figureFixtureName]
  const { height, width } = dimensions
  const figure = new Figure(iiifConfig, null, figureFixture)
  figure.canvasHeight = Number(height)
  figure.canvasWidth = Number(width)
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

// TODO fix `calcCanvasDimensions` to work with sequences -- sequence figure fixture data does not have calculated dimensions
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
