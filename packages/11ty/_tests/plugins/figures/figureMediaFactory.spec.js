/**
 * figuresMediaFactory.spec.js
 *
 * Tests for the figures plugin's `FigureMediaFactory`
 *
 **/
import esmock from 'esmock'
import { fileURLToPath } from 'url'
import fs from 'fs'
import path from 'path'
import sinon from 'sinon'
import test from 'ava'

const iiifConfigPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../_plugins/figures/test/__fixtures__/iiif-config.json')

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
async function MockFigureMediaFactory (sandbox, iiifConfig, processStub, fetchStub = () => {}) {
  const FigureMedia = await esmock('#plugins/figures/figureMedia/index.js', {
    '@11ty/eleventy-fetch': sandbox.stub().callsFake(fetchStub),
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
  const processor = sandbox.fake.returns({ errors: [], metadata: { full: { height: 1000, width: 1000 } } })
  const factory = await MockFigureMediaFactory(sandbox, iiifConfig, processor)

  const { figure: figureModel } = await factory.create(figure)
  const figureMedia = figureModel.media()

  const { derivatives } = figureMedia

  // Check that the processor was not called?
  t.falsy(processor.callCount,
    'The figures processor should not be called on URL sources')

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
  const processor = sandbox.fake.returns({ errors: [], metadata: { full: { height: 1000, width: 1000 } } })
  const factory = await MockFigureMediaFactory(sandbox, iiifConfig, processor)
  await factory.create(figure)

  // Check if processor was called with at least one transformation and tile=true
  t.truthy(
    processor.calledWith(
      sinon.match('iiif-figure.jpg'),
      sinon.match('iiif/iiif-figure'),
      sinon.match.has('transformations', sinon.match.some(sinon.match.defined)).and(sinon.match.has('tile', sinon.match.truthy))
    ),
    'IIIF figures should be processed for transformations and tiling'
  )
})

test('FigureMediaFactory should create a staticInlineFigureImage for static figures', async (t) => {
  // Set up a figure to be transformed
  const { iiifConfig, sandbox } = t.context
  const figure = {
    id: 'static-figure',
    src: 'static-figure.jpg'
  }

  // Fake processor for checking in on media derivative operations
  const processor = sandbox.fake.returns({ errors: [], metadata: { full: { height: 1000, width: 1000 } } })
  const factoryRoot = await MockFigureMediaFactory(sandbox, iiifConfig, processor)
  await factoryRoot.create(figure)

  t.truthy(
    processor.calledWith(
      sinon.match('static-figure.jpg'),
      sinon.match('iiif/static-figure'),
      sinon.match((val) => ('transformations' in val && val.transformations.length > 0) && !('tile' in val))
    ),
    'Image figures without zoom should be transformed but not tiled'
  )

  iiifConfig.baseURI = new URL('subpath', iiifConfig.baseURI).href
  const factorySubpath = await MockFigureMediaFactory(sandbox, iiifConfig, processor)
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

test('Media factory should correctly handle metadata and posters for video figures', async (t) => {
  // Set up a figure to be transformed
  const { iiifConfig, sandbox } = t.context
  const figure = {
    id: 'video-figure',
    src: 'cat-1-video.mp4',
    poster: 'cat-1-video-poster.jpg',
    media_type: 'video'
  }

  // Fake processor for checking in on media derivative operations
  const processor = sandbox.fake.returns({ errors: [], metadata: { full: { height: 1000, width: 1000 } } })
  const factoryRoot = await MockFigureMediaFactory(sandbox, iiifConfig, processor)
  const { figure: figureMedia } = await factoryRoot.create(figure)

  // Test that the poster is transformed but not tiled
  t.truthy(
    processor.calledWith(
      sinon.match('cat-1-video-poster.jpg'),
      sinon.match('iiif/video-figure'),
      sinon.match((val) => ('transformations' in val && val.transformations.length > 0) && !('tile' in val))
    ),
    'Videos and audios with poster images should have their posters transformed'
  )

  // Check output paths and dimensions are correct
  const { full, media } = figureMedia.derivatives

  t.truthy(full.paths.internal === '/iiif/video-figure/cat-1-video-poster/full.jpg',
    'Video printImage from poster should have paths')
  t.truthy(full.dimensions.height > 0 && full.dimensions.width > 0,
    'Video printImage from poster should have dimensions')
  t.truthy(media.paths.internal === '_assets/images/cat-1-video.mp4',
    'Video media should have paths')
})

test('Media factory should correctly handle embed URLs for youtube, vimeo, soundcloud figures', async (t) => {
  // Set up a figure to be transformed
  const { iiifConfig, sandbox } = t.context
  const figure = {
    id: 'youtube-figure',
    media_id: '12345',
    media_type: 'youtube'
  }

  // Fake processor for checking in on media derivative operations
  const processor = sandbox.fake.returns({ errors: [], metadata: { full: { height: 1000, width: 1000 } } })
  const factoryRoot = await MockFigureMediaFactory(sandbox, iiifConfig, processor)
  const { figure: figureMedia } = await factoryRoot.create(figure)

  // Test that the processor is not used
  t.truthy(
    processor.getCalls().length === 0,
    'Youtube embeds should not trigger the processor'
  )

  // Test that embed URLs are correct
  const { embed } = figureMedia.derivatives
  t.is(embed.sourceUrl,
    'https://youtu.be/12345',
    'Youtube embed sourceUrl should be properly formatted')
  t.is(embed.embedUrl,
    'https://www.youtube-nocookie.com/embed/12345',
    'Youtube embed embedUrl should be properly formatted')
})

test('Media factory should properly handle figures with http(s) sources', async (t) => {
  // Set up a figure to be transformed
  const { iiifConfig, sandbox } = t.context
  const figure = {
    id: 'url-figure',
    src: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Cat03.jpg',
    alt: '',
    caption: 'Figure from an URL'
  }

  // Fake processor and URL fetcher for checking in on media derivative operations
  const processor = sandbox.fake.returns({ errors: [], metadata: { full: { height: 1000, width: 1000 } } })
  const fetch = sandbox.fake.returns([])
  const factoryRoot = await MockFigureMediaFactory(sandbox, iiifConfig, processor, fetch)
  const { figure: figureMedia } = await factoryRoot.create(figure)

  // Test that the URL was fetched
  t.truthy(
    fetch.calledWith(sinon.match(figure.src)),
    'Figure image src URLs should be fetched for dimension-checking'
  )

  // Test that the tiling processor was not used
  t.truthy(
    processor.getCalls().length === 0,
    'Figure images from URLs should be processed for dimensions'
  )

  // Test that all emitted URLs are the source URL
  const derivativeTypes = [
    'full',
    'printImage',
    'staticInlineFigureImage',
    'thumbnail'
  ]

  for (const type of derivativeTypes) {
    const { internal, absolute, uri } = figureMedia.derivatives[type].paths
    t.is(internal,
      figure.src,
      `Internal path of ${type} derivative for http(s) figures should be the original URL`)
    t.is(absolute,
      figure.src,
      `Absolute path of ${type} derivative for http(s) figures should be the original URL`)
    t.is(uri,
      figure.src,
      `URI path of ${type} derivative for http(s) figures should be the original URL`)
  }
})
