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

test('FigureMediaFactory should use unmutated `src` properties for figure images from URLs', async (t) => {
  const { iiifConfig, sandbox } = t.context

  const figure = {
    id: 'https-figure',
    src: 'https://example.org/test.jpg'
  }

  // Test that src will be passed unmutated to the paths on figureMedia
  const noopProcessor = async (path, _, options) => {
    return { errors: [], metadata: { full: { height: 1000, width: 1000 } } }
  }

  const factory = await MockFigureMediaFactory(sandbox, iiifConfig, noopProcessor)
  const { figure: figureModel } = await factory.create(figure)
  const figureMedia = figureModel.media()

  const { derivatives } = figureMedia

  // Check that the paths of each transformation are unmutated
  for (const [name, derivative] of Object.entries(derivatives)) {
    const { paths } = derivative

    if (paths.absolute !== figure.src || paths.internal !== figure.src || paths.uri !== figure.src) {
      t.fail(`The transformation ${name} should not mutate external resource URLs`)
    }
  }

  t.pass()
})

test('FigureMediaFactory should create derivatives for zoomable figures', async (t) => {
  const { iiifConfig, sandbox } = t.context

  const figure = {
    id: 'iiif-figure',
    src: 'iiif-figure.jpg',
    zoom: true
  }

  // Check whether the figure will be processed as zoomed and tiled
  let passed = false
  const zoomedAndTiled = async (path, _, options) => {
    passed = options.transformations?.length > 0 && options.tile && !options.iiifEndpoint
    return { errors: [], metadata: { full: { height: 1000, width: 1000 } } }
  }

  const factory = await MockFigureMediaFactory(sandbox, iiifConfig, zoomedAndTiled)
  await factory.create(figure)

  if (passed) {
    t.pass()
  } else {
    t.fail()
  }
})

test('FigureMediaFactory should create a staticInlineFigureImage for static figures', async (t) => {
  // Set up a figure to be transformed
  const { iiifConfig, sandbox } = t.context
  const figure = {
    id: 'static-figure',
    src: 'static-figure.jpg'
  }

  // Set up a mock processor that checks whether the right options are passed in
  let passed = false
  const transformedNotTiled = async (path, _, options) => {
    passed = options.transformations?.length > 0 && !options.tile && !options.iiifEndpoint
    return { errors: [], metadata: { full: { height: 1000, width: 1000 } } }
  }

  const factoryRoot = await MockFigureMediaFactory(sandbox, iiifConfig, transformedNotTiled)
  await factoryRoot.create(figure)

  if (!passed) {
    t.fail()
  }

  iiifConfig.baseURI = new URL('subpath', iiifConfig.baseURI).href
  const factorySubpath = await MockFigureMediaFactory(sandbox, iiifConfig, transformedNotTiled)
  const { figure: subpathFigureMedia } = await factorySubpath.create(figure)

  const { paths, dimensions } = subpathFigureMedia.derivatives.full
  const { absolute, internal, uri } = paths
  const { height, width } = dimensions

  // Test that:
  // - Absolute and internal paths begin with '/'
  // - Absolute and uri contain the subpath but internal does not
  t.is(absolute.at(0), '/')
  const absoluteComponents = absolute.split('/')
  t.is(absoluteComponents.at(1), 'subpath')

  t.is(internal.at(0), '/')
  const internalComponents = internal.split('/')
  t.not(internalComponents.at(1), 'subpath')

  const mediaUrl = new URL(uri)
  const mediaComponents = mediaUrl.pathname.split('/')
  t.is(mediaComponents.at(1), 'subpath')

  // Test that dimensions exist
  t.is(height, 1000)
  t.is(width, 1000)
})