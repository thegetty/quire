/**
 * figures.spec.js
 *
 * Tests for the `figures` plugin
 *
 **/
import test from 'ava'
import esmock from 'esmock'
import sinon from 'sinon'

test.before('', async (t) => {
  const sandbox = sinon.createSandbox()

  t.context.sandbox = sandbox
})

test('Annex publication images (logos, avatars, etc) should be added to figuresMedia globalData', async (t) => {
  const { sandbox } = t.context

  // fake functions for tracking calls on the factory mock and global data
  const create = sandbox.fake(({ id }) => {
    return {
      id,
      figure: {
        id,
        media: () => { return { id } }        
      }
    }
  })
  const addGlobalData = sandbox.fake()

  // Initialize the plugin against a config that auto-runs the plugin's event hook
  const pluginInit = await esmock('#plugins/figures/index.js', {
    '#plugins/figures/figureMedia/factory.js': sandbox.stub().returns({ create })
  })

  // Stub globalData with our test figures
  const eleventyConfig = {
    addGlobalData,
    globalData: {
      directoryConfig: {
        inputDir: 'content', publicDir: 'public'
      },
      epub: {
        defaultCoverImage: 'test-default-cover.jpg'
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
    on: async (eventKey, hook) => {
      await hook()
    },
    serverOptions: {
      port: 8080
    }
  }

  pluginInit(eleventyConfig, {})
  console.log('suppers', addGlobalData.notCalled)
  t.true(create.calledWithMatch(sinon.match({ id: 'promo-image', src: 'test-promo-image.jpg' })),
    'Figures plugin should process promo image for derivatives')
  // TODO: Test that addGlobalData was called for this figure
  // t.true(
  //   addGlobalData.calledWithMatch(
  //     sinon.match('figureMedia'),
  //     sinon.match.has('id', 'promo-image')
  //   ),
  //   'globalData should be added for promo image')

  t.true(create.calledWithMatch(sinon.match({ id: 'epub-default', src: 'test-default-cover.jpg' })),
    'Figures plugin should process epub default cover for derivatives')
  // TODO: Test that addGlobalData was called for this figure
  // t.true(
  //   addGlobalData.calledWithMatch(
  //     sinon.match('figureMedia'),
  //     sinon.match.has('id', 'promo-image')
  //   ),
  //   'globalData should be added for epub default cover'
  // )

  t.true(create.calledWithMatch(sinon.match({ id: 'logo-test-publisher', src: 'test-publisher-logo.jpg' })),
    'Figures plugin should process logos for derivatives')
  // TODO
  // t.true(addGlobalData.calledWithMatch(sinon.match({ id: '' })),
  //   'globalData should be added for logos')

  t.true(create.calledWithMatch(sinon.match({ id: 'contributor-test-contributor', src: 'test-contributor-avatar.jpg' })),
    'Figures plugin should process contributor avatars for derivatives')
  // TODO
  // t.true(addGlobalData.calledWithMatch(sinon.match({ id: '' })),
  //   'globalData should be added for contributor avatars')
})
