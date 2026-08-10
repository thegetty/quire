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

  // addGlobalData() and create() functions for testing whether the factory was passed the figure
  const addGlobalData = sandbox.fake.returns({})
  const create = sandbox.fake.returns({
    media: () => { return {} }
  })

  // Initialize the plugin against a config that auto-runs the plugin's event hook
  const pluginInit = await esmock('#plugins/figures/index.js', {
    '#plugins/figures/figureMedia/factory.js': { create }
  })
  // TODO: Stub globalData with our test figures
  const eleventyConfig = {
    addGlobalData,
    globalData: {
      epub: {
        defaultCoverImage: 'test-default-cover.jpg'
      },
      publication: {
        contributor: [
          { id: 'test-contributor', image: 'test-contributor-avatar.jpg' }
        ],
        publisher: [
          { id: 'test-publisher', logo: 'test-publisher-logo.jpg' }
        ]
      },
      figures: {
        figure_list: []
      }
    },
    on: (eventKey, hook) => hook()
  }
  pluginInit(eleventyConfig, {})

  t.true('Figures plugin should process promo image for derivatives', create.calledWithMatch(sinon.match({ id: '', src: '' })))
  t.true('globalData should be added for promo image', addGlobalData.calledWithMatch(sinon.match({ id: '' })))

  t.true('Figures plugin should process epub default cover for derivatives', create.calledWithMatch(sinon.match({ id: '', src: '' })))
  t.true('globalData should be added for epub default cover', addGlobalData.calledWithMatch(sinon.match({ id: '' })))

  t.true('Figures plugin should process logos for derivatives', create.calledWithMatch(sinon.match({ id: '', src: '' })))
  t.true('globalData should be added for logos', addGlobalData.calledWithMatch(sinon.match({ id: '' })))

  t.true('Figures plugin should process contributor avatars for derivatives', create.calledWithMatch(sinon.match({ id: '', src: '' })))
  t.true('globalData should be added for contributor avatars', addGlobalData.calledWithMatch(sinon.match({ id: '' })))
})
