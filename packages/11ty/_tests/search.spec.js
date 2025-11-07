import test from 'ava'
import { initEleventyEnvironment } from './helpers/index.js'
import sinon from 'sinon'
import SearchIndex from '../_plugins/search/search.js'

const imageDir = '/_assets/images'
const promoImage = 'test.png'
const stubData = {
  config: {
    epub: {
      outputDir: '_epub'
    },
    pdf: {
      pagePDF: true
    },
    figures: {
      imageDir,
      figure_list: [
        {
          id: 'fig1',
          label: 'Figure 1',
          caption: 'This is a test figure.',
          src: 'figure1.jpg',
          alt: 'A photo of a tree',
          credit: 'John Doe',
          mediaType: 'image'
        }
      ]
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
    pub_date: new Date('2025-01-11'),
    promo_image: promoImage,
    language: 'en-us',
    url: 'https://example.com/test-publication/'
  }
}

const results = [
  {
    url: 'https://example.com/test-publication/page1/',
    content: '<html><body><p>This is a test page.</p></body></html>',
    inputPath: 'path/to/page1.html',
    outputPath: '_site/page1.html'
  },
  {
    url: 'https://example.com/test-publication/page2/',
    content: '<html><body><p>This is another test page.</p></body></html>',
    inputPath: 'path/to/page2.html',
    outputPath: '_site/page2.html'
  }
]

const collections = {
  html: [
    {
      path: 'page-1.md',
      outputPath: 'page-1.html',
      data: {
        canonicalURL: 'https://example.com/test-publication/page1/index.html',
        page: {
          figures: [
            stubData.config.figures.figure_list[0]
          ]
        },
        title: 'Test Page 1',
        label: 'A',
        subtitle: 'subtitle'
      }
    },
    {
      path: 'page-2.md',
      outputPath: 'page-2.html',
      data: {
        canonicalURL: 'https://example.com/test-publication/page2/index.html',
        page: { }
      }
    },
    {
      path: 'page-3.md',
      outputPath: 'page-3.html',
      data: {
        search: false,
        page: {
          canonicalURL: 'https://example.com/test-publication/page3/index.html',
          figures: [
            stubData.config.figures.figure_list[0]
          ]
        },
        title: 'Test Page 2',
        label: '',
        subtitle: ''
      }
    }
  ]
}

const figureRecords = [
  {
    content: 'This is a test figure.',
    language: 'en-us',
    meta: {
      credit: 'John Doe',
      image: '/_assets/images/figure1.jpg',
      image_alt: 'A photo of a tree',
      pageTitle: 'A|Test Page 1: subtitle',
      title: 'Figure 1',
      type: 'image'
    },
    url: 'https://example.com/test-publication/page1/index.html#fig1'
  }
]

function FakePagefindIndex (sandbox) {
  return {
    addHTMLFile: sandbox.stub().resolves(),
    addCustomRecord: sandbox.stub().resolves(),
    writeFiles: sandbox.stub().resolves()
  }
}

// Initialize Eleventy and pass into test context
test.before('Stub the eleventy environment', async (t) => {
  const eleventy = await initEleventyEnvironment(stubData)

  t.context.eleventy = eleventy
  // Build the site
  await eleventy.toJSON()
})

test('Validate page records added to PageFind index', async (t) => {
  const sandbox = sinon.createSandbox()

  const { eleventy } = t.context

  const eleventyConfig = eleventy.writer.userConfig

  const search = new SearchIndex(eleventyConfig, { dirName: '_search' })
  // Stub out the index
  search.index = FakePagefindIndex(sandbox)

  // Check we can use an 11ty result like we get from eleventy.after to add page records,
  // and check that the stubs are working.
  await Promise.all(
    results.map(async ({ url, content }) => {
      await search.addPageRecord({ url, content })
    })
  )

  t.is(search.index.addHTMLFile.callCount, results.length, 'All HTML files were indexed')
  results.forEach((result, index) => {
    const { url, content } = result
    t.assert(
      search.index.addHTMLFile.getCall(index).calledWith({ url, content })
    )
  })

  // Make sure the index can be written.
  const outputPath = '_site/_search'
  await search.write(outputPath)
  t.deepEqual(
    search.index.writeFiles.getCall(0).args[0],
    { outputPath }
  )
})

test('Validate figure records added to PageFind index', async (t) => {
  const sandbox = sinon.createSandbox()

  const { eleventy } = t.context

  // Build the site
  await eleventy.toJSON()
  const eleventyConfig = eleventy.writer.userConfig

  const search = new SearchIndex(eleventyConfig, { indexFigures: true })
  // Stub out the index
  search.index = FakePagefindIndex(sandbox)

  await Promise.all(collections.html.map(async ({ data }) => {
    await search.addFiguresFromPage(data)
  }))

  t.is(
    search.index.addCustomRecord.callCount, figureRecords.length,
    'Only figures from pages with search enabled were indexed'
  )

  figureRecords.forEach((record, index) => {
    t.deepEqual(
      search.index.addCustomRecord.getCall(index).args[0],
      record
    )
  })
})
