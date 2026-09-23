/**
 * globalData.spec.js
 * Tests for `globalData` plugin
 */
import esmock from 'esmock'
import test from 'ava'
import sinon from 'sinon'

const fakeFs = {
  existsSync: () => true,
  readdirSync: () => ['figures.yaml'],
  readFileSync: () => ''
}
const fakeParser = () => (filepath) => ({ figure_list: eleventyStub.config.figure_list })
const fakeValidator = { validateUserConfig: (k, v) => v }
const fakeChalk = () => ({ error: console.error, warn: console.warn })
const fakeExit = sinon.stub(process, 'exit').callsFake(() => {
  throw new Error('exited with a non-zero exit code: 1')
})

const eleventyStub = {
  config: {
    figure_list: [
      {
        id: 'lange',
        src: 'figures/lange.jpg',
        caption: '*Dorothea Lange, Resettlement Administration photographer, in California*, 1936.',
        credit: 'Library of Congress Prints and Photographs Division',
        alt: 'Shot low and looking up at an old model car on a dirt row with a hill behind. A woman sits on the roof of the car holding a large camera and smiling.'
      },
      {
        id: 'evans',
        src: 'figures/evans.jpg',
        caption: '*Walker Evans, profile, hand up to face*, 1937.',
        credit: 'Library of Congress Prints and Photographs Division',
        alt: 'A seated man looking away to the left, his hand at his cheek, his hair mussed, a slight worried expression on his face.'
      }
    ]
  },
  globalData: {
    directoryConfig: { inputDir: 'content', outputDir: '_site', publicDir: 'public' }
  }
}

test.before('Load plugin with mocks', async (t) => {
  t.context.GlobalData = await esmock(
    '../../_plugins/globalData/index.js',
    {
      'fs-extra': fakeFs,
      '../../_plugins/globalData/parser.js': fakeParser,
      '../../_plugins/globalData/validator.js': fakeValidator,
      '#lib/chalk/index.js': { default: fakeChalk }
    }
  )
})

test('Validate Figures added to eleventyConfig.globalData', async (t) => {
  const { GlobalData } = t.context

  const eleventyConfig = {
    addGlobalData: sinon.stub().callsFake((key, value) => {
      eleventyConfig.globalData[key] = value
    }),
    globalData: {}
  }

  const directoryConfig = { inputDir: 'content', outputDir: '_site', publicDir: 'public' }

  GlobalData(eleventyConfig, directoryConfig)
  t.true(eleventyConfig.addGlobalData.calledWith('figures', sinon.match.any))
  t.deepEqual(eleventyConfig.globalData.figures.figure_list, eleventyStub.config.figure_list)
})

test('Validate Figures throws missing id error', async (t) => {
  const missingIdParser = () => (filepath) => ({
    figure_list: [
      { id: 'lange', src: 'figures/lange.jpg', caption: 'Test' },
      { id: '', src: 'figures/missing-id.jpg', caption: 'Test 2' }
    ]
  })
  const badGlobalData = await esmock(
    '../../_plugins/globalData/index.js',
    {
      'fs-extra': fakeFs,
      '../../_plugins/globalData/parser.js': missingIdParser,
      '../../_plugins/globalData/validator.js': fakeValidator,
      '#lib/chalk/index.js': { default: fakeChalk }
    }
  )

  const eleventyConfig = {
    addGlobalData: sinon.stub().callsFake((key, value) => {
      eleventyConfig.globalData[key] = value
    }),
    globalData: {}
  }
  const directoryConfig = { inputDir: 'content', outputDir: '_site', publicDir: 'public' }
  const error = t.throws(() => {
    badGlobalData(eleventyConfig, directoryConfig)
  })

  t.is(error.message, 'exited with a non-zero exit code: 1')
  fakeExit.restore()
})
