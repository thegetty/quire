/**
 * figures.spec.js
 *
 * Tests for the `figures` plugin
 *
 **/
import test from 'ava'
import esmock from 'esmock'
import sinon from 'sinon'

/**
 * Sets up a sandbox and fake functions for using FigureMediaFactory and globalData
 **/
test.before('', async (t) => {
  const sandbox = sinon.createSandbox()

  // Inspectable factory `create` member and eleventyConfig `addGlobalData` members
  const create = sandbox.fake(({ id }) => {
    //  `media()` gets called at the end of figures plugin init so must exist 
    return {
      id,
      figure: {
        id,
        media: () => { return { id } }
      }
    }
  })
  const addGlobalData = sandbox.fake()

  t.context.sandbox = sandbox
  t.context.create = create
  t.context.addGlobalData = addGlobalData
})

test('Annex publication images (logos, avatars, etc) should be added to figuresMedia globalData', async (t) => {
  const { addGlobalData, create, sandbox } = t.context

  // Import the plugin with our test function injected as a member
  const pluginInit = await esmock('#plugins/figures/index.js', {
    '#plugins/figures/figureMedia/factory.js': sandbox.stub().returns({ create })
  })

  /**
   * Stub configuration with the test function injected, useable input values,
   * and a minimal event loop that runs the initialized hooks.
   *
   * NB: `on` handlers are called synchronously so `runHooks()` executes the stack
   **/
  const eleventyConfig = {
    addGlobalData,
    globalData: {
      config: {
        epub: {
          defaultCoverImage: 'test-default-cover.jpg'
        },
        figures: {
          imageDir: '/_assets/images'
        }
      },
      directoryConfig: {
        inputDir: 'content', publicDir: 'public'
      },
      publication: {
        contributor: [
          { id: 'test-contributor', image: 'test-contributor-avatar.jpg' }
        ],
        promo_image: 'test-promo-image.jpg',
        publisher: [
          { name: 'Test Publisher', logo: 'test-publisher-logo.jpg' }
        ],
        url: new URL('http://localhost:8080')
      },
      figures: {
        figure_list: []
      }
    },
    _hooks: [],
    on: (eventKey, asyncHook) => {
      eleventyConfig._hooks.push(asyncHook)
    },
    runHooks: async () => await Promise.all(eleventyConfig._hooks.map((h) => h())),
    serverOptions: {
      port: 8080
    }
  }

  // Initialize the plugin and run the hooks
  pluginInit(eleventyConfig, {})
  await eleventyConfig.runHooks()

  t.true(create.calledWithMatch(sinon.match({ id: 'promo-image', src: 'test-promo-image.jpg' })),
    'Figures plugin should process promo image for derivatives')
  t.true(
    addGlobalData.calledWithMatch(
      sinon.match('figureMedia'), sinon.match((value) => {
        return Array.isArray(value) && value.some(d => d.id === 'promo-image')
      })),
    'globalData should be added for promo image'
  )

  t.true(create.calledWithMatch(sinon.match({ id: 'epub-default', src: 'test-default-cover.jpg' })),
    'Figures plugin should process epub default cover for derivatives')
  t.true(
    addGlobalData.calledWithMatch(
      sinon.match('figureMedia'), sinon.match((value) => {
        return Array.isArray(value) && value.some(d => d.id === 'epub-default')
      })),
    'globalData should be added for epub default cover'
  )

  t.true(create.calledWithMatch(sinon.match({ id: 'logo-test-publisher', src: 'test-publisher-logo.jpg' })),
    'Figures plugin should process logos for derivatives')
  t.true(
    addGlobalData.calledWithMatch(
      sinon.match('figureMedia'), sinon.match((value) => {
        return Array.isArray(value) && value.some(d => d.id === 'logo-test-publisher')
      })
    ),
    'globalData should be added for logos')

  t.true(create.calledWithMatch(sinon.match({ id: 'contributor-test-contributor', src: 'test-contributor-avatar.jpg' })),
    'Figures plugin should process contributor avatars for derivatives')
  t.true(
    addGlobalData.calledWithMatch(
      sinon.match('figureMedia'), sinon.match((value) => {
        return Array.isArray(value) && value.some(d => d.id === 'contributor-test-contributor')
      })
    ),
    'globalData should be added for contributor avatars')
})
