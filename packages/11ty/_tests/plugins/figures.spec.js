/**
 * figures.spec.js
 *
 * Tests for the `figures` plugin
 *
 **/
import esmock from 'esmock'
import { fileURLToPath } from 'url'
import fs from 'fs'
import path from 'path'
import sinon from 'sinon'
import test from 'ava'

const iiifConfigPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../_plugins/figures/test/__fixtures__/iiif-config.json')

/**
 * @function MockFigureMediaFactory
 *
 * @param {Object} iiifConfig
 * @param {Object.prototype} figureClass
 * @param {function} processStub
 *
 * Creates a FigureMediaFactory with `processStub` as mock processor
 *
 **/
async function MockFigureMediaFactory (sandbox, iiifConfig, processStub) {
  const FigureMedia = await esmock('#plugins/figures/figureMedia/index.js', {
    sharp: sandbox.stub().returns({
      metadata: sandbox.stub().returns({ height: 1000, width: 1000 })
    })
  })

  const FigureMediaFactory = await esmock('#plugins/figures/figureMedia/factory.js', {
    '#plugins/figures/image/processor.js': sandbox.stub().returns({
      processImage: sandbox.stub().callsFake(processStub)
    }),
    '#plugins/figures/figureMedia/index.js': FigureMedia
  })

  const factory = new FigureMediaFactory(iiifConfig)

  return factory
}

// Test fixtures and FigureMedia class that avoids real disk calls to sharp
test.before('', async (t) => {
  const iiifConfig = JSON.parse(fs.readFileSync(iiifConfigPath))
  const sandbox = sinon.createSandbox()

  t.context.iiifConfig = iiifConfig
  t.context.sandbox = sandbox
})

test('FigureMediaFactory should create a staticInlineFigureImage for zoomable figures', async (t) => {
  const { iiifConfig, sandbox } = t.context

  const figure = {
    id: 'iiif-figure',
    src: 'iiif-figure.jpg',
    zoom: true
  }

  let passed = false
  const isTransformedZoomedAndIIIF = async (path, _, options) => {
    passed = options.transformations?.length > 0 && options.tile && !options.iiifEndpoint
    return { errors: [] }
  }

  const factory = await MockFigureMediaFactory(sandbox, iiifConfig, isTransformedZoomedAndIIIF)
  await factory.create(figure)

  if (passed) {
    t.pass()
  } else {
    t.fail()
  }
})

test('FigureMediaFactory should create a staticInlineFigureImage for static figures', async (t) => {
  const { iiifConfig, sandbox } = t.context

  const figure = {
    id: 'static-figure',
    src: 'static-figure.jpg'
  }

  let passed = false
  const isTransformedOnly = async (path, _, options) => {
    passed = options.transformations?.length > 0 && !options.tile && !options.iiifEndpoint
    return { errors: [] }
  }

  const factory = await MockFigureMediaFactory(sandbox, iiifConfig, isTransformedOnly)
  await factory.create(figure)

  if (passed) {
    t.pass()
  } else {
    t.fail()
  }
})
