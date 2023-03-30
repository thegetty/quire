require('module-alias/register')
const { mock, test } = require('node:test')
const Ajv = require('ajv')
const assert = require('assert/strict')
const Figure = require('../figure')
const figureFixtures = require('./__fixtures__/figures/index.js')
const iiifConfig = require('./__fixtures__/iiif-config.json')
const Manifest = require('../iiif/manifest')
const manifestSchema = require('../iiif/manifest/schema.json')

const ajv = new Ajv({allErrors: true})
const validate = ajv.compile(manifestSchema)

const createManifestFromFigureFixture = async (figureFixtureName) => {
  const {
    dimensions,
    figure: figureFixture,
    manifest: manifestFixture
  } = figureFixtures[figureFixtureName]
  const { height, width } = dimensions
  const figure = new Figure(iiifConfig, null, figureFixture)
  figure.canvasHeight = height
  figure.canvasWidth = width
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

test('figure with checkbox annotations creates a valid manifest', { skip: true }, async () => {
  const { manifestFixture, manifestJson } = await createManifestFromFigureFixture('annotationsCheckbox')
  assert.equal(validate(manifestJson), true)
})

test('figure with radio annotations creates a valid manifest', async () => {
  const { manifestFixture, manifestJson } = await createManifestFromFigureFixture('annotationsRadio')
  assert.deepStrictEqual(manifestFixture, manifestJson)
})

test('figure with radio annotations creates a valid manifest', { skip: true }, async () => {
  const { manifestFixture, manifestJson } = await createManifestFromFigureFixture('annotationsRadio')
  assert.equal(validate(manifestJson), true)
})

test('sequence figure creates a valid manifest', async () => {
  const { manifestFixture, manifestJson } = await createManifestFromFigureFixture('sequence')
  assert.deepStrictEqual(manifestFixture, manifestJson)
})

test('sequence figure creates a valid manifest', { skip: true }, async () => {
  const { manifestFixture, manifestJson } = await createManifestFromFigureFixture('sequence')
  assert.equal(validate(manifestJson), true)
})

test('sequence figure with annotations creates a valid manifest', async () => {
  const { manifestFixture, manifestJson } = await createManifestFromFigureFixture('sequenceWithAnnotations')
  assert.deepStrictEqual(manifestFixture, manifestJson)
})

test('sequence figure with annotations creates a valid manifest', { skip: true }, async () => {
  const { manifestFixture, manifestJson } = await createManifestFromFigureFixture('sequenceWithAnnotations')
  assert.equal(validate(manifestJson), true)
})

test('zoomable figure creates a valid manifest', async () => {
  const { manifestFixture, manifestJson } = await createManifestFromFigureFixture('zoomable')
  assert.deepStrictEqual(manifestFixture, manifestJson)
})

test('zoomable figure creates a valid manifest', { skip: true }, async () => {
  const { manifestFixture, manifestJson } = await createManifestFromFigureFixture('zoomable')
  assert.equal(validate(manifestJson), true)
})

/* Skipping the following two tests, since we are currently overriding zoom on all sequence manifests */
test('zoomable sequence figure creates a valid manifest', { skip: true }, async () => {
  const { manifestFixture, manifestJson } = await createManifestFromFigureFixture('zoomableSequence')
  assert.deepStrictEqual(manifestFixture, manifestJson)
})

test('zoomable sequence figure creates a valid manifest', { skip: true }, async () => {
  const { manifestFixture, manifestJson } = await createManifestFromFigureFixture('zoomableSequence')
  assert.equal(validate(manifestJson), true)
})
