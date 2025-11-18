import { initEleventyEnvironment } from './helpers/index.js'
import { JSDOM } from 'jsdom'
import manifestFactory from '../_plugins/transforms/outputs/epub/manifest.js'
import test from 'ava'
import transform from '../_plugins/transforms/outputs/epub/transform.js'

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

test('epub transform should set accordion `details` to open and `summary` should have no tabIndex', async (t) => {
  // Run the eleventy environment to initialize userConfig
  const { eleventy } = t.context
  await eleventy.toJSON()

  // Render the accordion and pass results to the transform
  // NB: `main` emulates base.11ty.js layout -- should be programmatic instead?
  const accordionContent = `<main data-output-path>{% accordion '## Test' %}
  Test Accordion.
  {% endaccordion %}</main>`
  const accordionHtml = await eleventy.eleventyConfig.config.javascriptFunctions.renderTemplate(accordionContent, 'liquid,md', {})

  // Mock the collections object object so this content gets processed
  const collections = { epub: [{ path: 'test.md', outputPath: 'test.html', data: { title: 'Test Page' } }] }

  // Run the transform on the accordion content with the mocked configuration and collections
  const epubPage = transform.call({ outputPath: 'test.html' }, eleventy.writer.userConfig, collections, accordionHtml, true)
  const accordion = JSDOM.fragment(epubPage)

  const details = accordion.querySelector('details')
  t.is(details.open, true, '`details` tag should be open')

  // NB: tabIndex will read 0 even without the attribute on the element
  const summary = accordion.querySelector('summary')
  t.is(summary.tabIndex, 0, '`summary` tag should have no tabIndex')
})
