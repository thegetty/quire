import { initEleventyEnvironment } from './helpers/index.js'
import { JSDOM } from 'jsdom'
import test from 'ava'
import transform from '../_plugins/transforms/outputs/pdf/transform.js'

// Initialize the eleventy environment with some basic data
test.before('Stub the eleventy environment', async (t) => {
  const imageDir = '/_assets/images'
  const promoImage = 'test.png'

  const stubData = {
    config: {
      epub: {
        defaultCoverImage: 'test-default.png',
        outputDir: '_epub'
      },
      pdf: {
        pagePDF: true
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

test('PDF transform should only relativize ', async (t) => {
  const { eleventy } = t.context

  // Set up some test link and data attributes with the expected output
  const content = `
    <DOCTYPE !html>
    <html>
      <body>
        <main data-output-path="test.html">
          <a href="test-page" data-expected="#page-test-page" >Test Link Local</a>
          <a href="test/nested-page" data-expected="#page-test-nested-page" >Test Link Local</a>
          <a href="https://example.org/test/" data-expected="https://example.org/test/" ></a>
        </main>
      </body>
    </html
  `

  // NB: PDF transform checks for other objects and mutates `collections`
  const collections = {
    pdf: [
      {
        path: 'test.md',
        outputPath: 'test.html',
        data: { title: 'Test Page' }
      },
      {
        path: 'test-1.md',
        outputPath: 'test-1.html',
        data: { title: 'Test Page 1' }
      }
    ]
  }

  // Run the build job so eleventyConfig matches the state when the transform gets it
  await eleventy.toJSON()
  const eleventyConfig = eleventy.writer.userConfig

  // Call the transform with a faked `page` for `this`
  // NB: epub transform returns unmodified content
  transform.call({ outputPath: 'test.html' }, eleventyConfig, collections, content)

  // Parse the output stored by the transform
  const rendered = collections.pdf.at(0).sectionElement
  if (!rendered) t.fail('The transform should produce output after running')

  const doc = JSDOM.fragment(rendered)

  // Grab all the anchor link hrefs and check their output hrefs to their expecteds
  doc.querySelectorAll('a[href]').forEach((a) => {
    const url = a.getAttribute('href')
    const expected = a.dataset.expected

    if (url !== expected && /https?:\/\//.test(expected)) {
      t.fail(`URLs with http(s):// as protocol should be emitted unchanged be unchanged: ${url} ${expected}`)
    } else if (url !== expected) {
      t.fail(`Local hrefs should be prefixed with "page-" and slugged: ${url} ${expected}`)
    }
  })

  t.pass()
})
