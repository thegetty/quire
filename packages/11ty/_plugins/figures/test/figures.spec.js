import { describe, test } from 'node:test'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readFileSync } from 'node:fs'
import Ajv from 'ajv'
import Figure from '../figure/index.js'
import Manifest from '../iiif/manifest/index.js'
import assert from 'assert/strict'
import figureFixtures from './__fixtures__/figures/index.js'

const resolver = (path) => {
  const __dirname = dirname(fileURLToPath(import.meta.url))
  return resolve(__dirname, path)
}

const readJson = (path) => {
  try {
    return JSON.parse(readFileSync(resolver(path)))
  } catch (error) {
    console.error(error)
  }
}

const iiifConfig = readJson('./__fixtures__/iiif-config.json')
const manifestSchema = readJson('../iiif/manifest/schema.json')

const createManifestFromFigureFixture = async (figureFixtureName) => {
  const {
    dimensions,
    figure: figureFixture,
    files,
    manifest: manifestFixture
  } = figureFixtures[figureFixtureName]
  const { height, width } = dimensions
  const figure = new Figure(iiifConfig, null, figureFixture)
  figure.canvasHeight = height
  figure.canvasWidth = width
  const manifest = files && figure.isSequence
    ? new Manifest({ ...figure, sequences: figure.sequenceFactory.create(files) })
    : new Manifest(figure)
  const manifestJson = await manifest.toJSON()
  return {
    manifestFixture,
    manifestJson
  }
}

describe('validating manifests via deepStrictEqual', () => {
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

  /* Skipping this test, since we are currently overriding zoom on all sequence manifests */
  test('zoomable sequence figure creates a valid manifest', { skip: true }, async () => {
    const { manifestFixture, manifestJson } = await createManifestFromFigureFixture('zoomableSequence')
    assert.deepStrictEqual(manifestFixture, manifestJson)
  })
})

/* Skipping all ajv validation tests. The IIIF 3.0 schema is not ready for prime-time */
describe('validating manifests via ajv', { skip: true }, () => {
  const ajv = new Ajv({ allErrors: true })
  const validate = ajv.compile(manifestSchema)

  test('figure with checkbox annotations creates a valid manifest', { skip: true }, async () => {
    const { manifestJson } = await createManifestFromFigureFixture('annotationsCheckbox')
    assert.equal(validate(manifestJson), true)
  })

  test('figure with radio annotations creates a valid manifest', { skip: true }, async () => {
    const { manifestJson } = await createManifestFromFigureFixture('annotationsRadio')
    assert.equal(validate(manifestJson), true)
  })

  test('sequence figure creates a valid manifest', { skip: true }, async () => {
    const { manifestJson } = await createManifestFromFigureFixture('sequence')
    assert.equal(validate(manifestJson), true)
  })

  test('sequence figure with annotations creates a valid manifest', { skip: true }, async () => {
    const { manifestJson } = await createManifestFromFigureFixture('sequenceWithAnnotations')
    assert.equal(validate(manifestJson), true)
  })

  test('zoomable figure creates a valid manifest', { skip: true }, async () => {
    const { manifestJson } = await createManifestFromFigureFixture('zoomable')
    assert.equal(validate(manifestJson), true)
  })

  test('zoomable sequence figure creates a valid manifest', { skip: true }, async () => {
    const { manifestJson } = await createManifestFromFigureFixture('zoomableSequence')
    assert.equal(validate(manifestJson), true)
  })
})
