import test from 'ava'
import manifestFactory from '../_plugins/transforms/outputs/epub/manifest.js'
import transform from '../_plugins/transforms/outputs/epub/transform.js'
import { initEleventyEnvironment } from './helpers/index.js'

// Initialize the eleventy environment with
test.before('Stub the eleventy environment', async (t) => {
  const imageDir = '/_assets/images'
  const promoImage = 'test.png'

  const stubData = {
    config: {
      epub: {
        defaultCoverImage: 'test-default.png',
        outputDir: '_epub'
      },
      figures: {
        imageDir
      },
      pageTitle: {
        labelDivider: '|'
      }
    },
    publication: {
      title: 'Test Publication',
      description: {
        full: 'Test Publication'
      },
      pub_date: new Date('2022-12-01'),
      promo_image: promoImage
    }
  }

  const eleventy = await initEleventyEnvironment(stubData)

  t.context.eleventy = eleventy
})

test('Manifest factory should only expose POSIX-style resource paths', async (t) => {
  const { eleventy } = t.context

  const content = `
    <DOCTYPE !html>
    <html>
      <body>
        <main data-output-path="test.html">
          <img src="/_assets/test.jpg">
        </main>
      </body>
    </html
  `
  const collections = { epub: [{ path: 'test.md', outputPath: 'test.html', data: { title: 'Test Page' } }] }

  // Run the build job so eleventyConfig matches the state when the transform gets it
  await eleventy.toJSON()
  const eleventyConfig = eleventy.writer.userConfig

  // Call the transform with a faked `page` for `this`
  // NB: epub transform returns unmodified content
  transform.call({ outputPath: 'test.html' }, eleventy.writer.userConfig, collections, content)

  // Get the manifest object
  const manifest = manifestFactory(eleventyConfig)

  // Test that each `resources` url doesm't use '\' as a separator
  manifest.resources.forEach((r) => {
    if (r.url.includes('\\')) t.fail('epub manifest resources must use POSIX-style path separators!')
  })

  t.pass()
})
