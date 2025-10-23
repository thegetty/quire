import Eleventy from '@11ty/eleventy'
import { JSDOM } from 'jsdom'
import test from 'ava'
import { initEleventyEnvironment, stubGlobalData } from '../helpers/index.js'

/**
 * `contributors` shortcode tests
 *
 * Spin up canned 11ty environment(s), renders the shortcode, and test-asserts
 *
 **/

test('contributors shortcode should use serial commas to join with format == "initials", "name-title", "string"', async (t) => {
  const contributorEnvironments = {
    0: await initEleventyEnvironment({ publication: { contributors: [] } }),
    1: await initEleventyEnvironment({ publication: { contributors: [{ id: 'test-0', full_name: 'Test 0Contributor', first_name: 'Test', last_name: '0Contributor' }] } }),
    2: await initEleventyEnvironment({
      publication: {
        contributors: [
          { id: 'test-0', full_name: 'Test 0Contributor', first_name: 'Test', last_name: '0Contributor' },
          { id: 'test-1', full_name: 'Test 1Contributor', first_name: 'Test', last_name: '1Contributor' }
        ]
      }
    }),
    3: await initEleventyEnvironment({
      publication: {
        contributors: [
          { id: 'test-0', full_name: 'Test 0Contributor', first_name: 'Test', last_name: '0Contributor' },
          { id: 'test-1', full_name: 'Test 1Contributor', first_name: 'Test', last_name: '1Contributor' },
          { id: 'test-2', full_name: 'Test 2Contributor', first_name: 'Test', last_name: '2Contributor' }]
      }
    })
  }

  // NB: Traditional iteration to avoid an outer Promise.all()
  for (const [count, environment] of Object.entries(contributorEnvironments)) {
    const contributors = environment.eleventyConfig.config.globalData.publication.contributors
    const initialsOutput = await environment.eleventyConfig.config.javascriptFunctions.renderTemplate('{% contributors context=contributors format="initials" %}', 'liquid', { contributors })
    const stringOutput = await environment.eleventyConfig.config.javascriptFunctions.renderTemplate('{% contributors context=contributors format="string" %}', 'liquid', { contributors })

    const initialsElement = JSDOM.fragment(initialsOutput)
    const stringElement = JSDOM.fragment(stringOutput)

    switch (count) {
      // All should be empty
      case '0':
        t.is(initialsOutput, '')
        t.is(stringOutput, '')

        break
      // Should be just the contributor
      case '1':
        t.is(initialsElement.firstElementChild.textContent, 'T.0.')
        t.is(stringElement.firstElementChild.textContent, 'Test 0Contributor')

        break
      // Should be joined by 'and'
      case '2':
        t.is(initialsElement.firstElementChild.textContent, 'T.0. and T.1.')
        t.is(stringElement.firstElementChild.textContent, 'Test 0Contributor and Test 1Contributor')

        break
      // Should be serial-comma joined
      case '3':
        t.is(initialsElement.firstElementChild.textContent, 'T.0., T.1., and T.2.')
        t.is(stringElement.firstElementChild.textContent, 'Test 0Contributor, Test 1Contributor, and Test 2Contributor')

        break
      default:
        console.warn('Got an unexpected constributor count', count)
    }
  }
})

test('publicationContributors / contributors page lists should be displayed in publication order', async (t) => {
  // Populate enough data to complete an entire site build, plus the test contributor
  const stub = {
    config: {
      analytics: {
      },
      bibliography: {
        displayOnPage: true,
        displayShort: true,
        heading: 'Bibliography'
      },
      epub: {
        outputDir: '_epub'
      },
      figures: {
        imageDir: '_assets/images/figures'
      },
      pageTitle: {
        labelDivider: '. '
      }
    },
    publication: {
      contributor: [
        { id: 'test-contributor', full_name: 'Test Contributor' },
        { id: 'other-contributor', full_name: 'Other Contributor' }
      ],
      description: {
        full: 'Publication Description'
      },
      identifier: {
        isbn: ''
      },
      license: {
      },
      resource_link: [],
      revision_history: {
      },
      promo_image: 'image.jpg',
      pub_date: new Date(),
      publisher: [{ name: 'Publisher' }],
      subject: [],
      title: 'Publication',
      url: 'http://localhost:8080'
    }
  }

  // Create an environment and add test templates
  const environment = new Eleventy('.', '_site', {
    config: stubGlobalData(stub, (eleventyConfig) => {
      eleventyConfig.addTemplate('b-page.md', '# B Page\n{% contributors context=pageContributors format="name" %}', { abstract: '', contributor: [{ id: 'test-contributor', sort_as: '1' }, { id: 'other-contributor', sort_as: '2' }], title: 'B Page', layout: 'base.11ty.js', order: 1, outputs: ['html'] })
      eleventyConfig.addTemplate('a-page.md', '# A Page\n{% contributors context=publicationContributors format="bio" %}', { abstract: '', contributor: [{ id: 'test-contributor' }], title: 'A Page', layout: 'base.11ty.js', order: 2, outputs: ['html'] })
    })
  })

  // Build the publication
  const pages = await environment.toJSON()

  // Get the publication contributors page
  const publicationContributors = pages.find(p => p.inputPath === './content/a-page.md')
  const publicationContributorsDom = JSDOM.fragment(publicationContributors.content)

  // Test that all publication contributors are present
  const contributorElementIds = Array.from(publicationContributorsDom.querySelectorAll('li.quire-contributor')).map(c => c.id)
  t.like(contributorElementIds, ['test-contributor', 'other-contributor'], 'all publication contributors should be shown')

  // Test that pages are in the correct order
  // NB: `like` because they are not the same instance
  const actualLinks = Array.from(publicationContributorsDom.querySelectorAll('li.quire-contributor#test-contributor a.quire-contributor__page-link')).map(a => a.href)
  t.like(actualLinks, ['/b-page/', '/a-page/'], 'contributor pages should be in publication order')

  // Get the page contributors page
  const pageContributors = pages.find(p => p.inputPath === './content/b-page.md')
  const pageContributorsDom = JSDOM.fragment(pageContributors.content)

  // Test that page contributors follow page data sort_as
  const pageContributorIds = Array.from(pageContributorsDom.querySelectorAll('li.quire-contributor')).map(pc => pc.id)
  t.like(pageContributorIds, ['test-contributor', 'other-contributor'], 'contributor order should follow page data sort_as')
})
