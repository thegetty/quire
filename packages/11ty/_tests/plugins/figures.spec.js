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
 * @function MockFigureFactory
 *
 * @param {Object} iiifConfig
 * @param {Object.prototype} figureClass
 * @param {function} processStub
 *
 * Creates a FigureFactory with `processStub` as mock processor
 *
 **/
async function MockFigureFactory (sandbox, iiifConfig, processStub) {
  const Figure = await esmock('#plugins/figures/figure/index.js', {
    sharp: sandbox.stub().returns({
      metadata: sandbox.stub().returns({ height: 100, width: 100 })
    })
  })

  const FigureFactory = await esmock('#plugins/figures/figure/factory.js', {
    '#plugins/figures/image/processor.js': sandbox.stub().returns({
      processImage: sandbox.stub().callsFake(processStub)
    }),
    '#plugins/figures/figure/index.js': Figure
  })

  const factory = new FigureFactory(iiifConfig)

  return factory
}

// Test fixtures and Figure class that avoids real disk calls to sharp
test.before('', async (t) => {
  const iiifConfig = JSON.parse(fs.readFileSync(iiifConfigPath))
  const sandbox = sinon.createSandbox()

  t.context.iiifConfig = iiifConfig
  t.context.sandbox = sandbox
})

test('FigureFactory should create a staticInlineFigureImage for zoomable figures', async (t) => {
  const { iiifConfig, sandbox } = t.context

  const figure = {
    id: 'iiif-figure',
    src: 'iiif-figure.jpg',
    zoom: true
  }

  let passed = false
  const isTransformedZoomedAndIIIF = async (path, _, options) => {
    passed = options.transformations?.length > 0 && options.tile && options.iiifEndpoint
    return { errors: [] }
  }

  const factory = await MockFigureFactory(sandbox, iiifConfig, isTransformedZoomedAndIIIF)
  await factory.create(figure)

  if (passed) {
    t.pass()
  } else {
    t.fail()
  }
})

test('FigureFactory should create a staticInlineFigureImage for static figures', async (t) => {
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

  const factory = await MockFigureFactory(sandbox, iiifConfig, isTransformedOnly)
  await factory.create(figure)

  if (passed) {
    t.pass()
  } else {
    t.fail()
  }
})
