import Eleventy from '@11ty/eleventy'
import { JSDOM } from 'jsdom'
import test from 'ava'
import { initEleventyEnvironment, minimalBuildingData, stubGlobalData } from '../helpers/index.js'

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

// NB: Eleventy envs conflicted with one another (user error?) thus serial()
test.serial('publicationContributors / contributors page lists should be displayed in publication order', async (t) => {
  // Use a minimal data stub to create a buildable enviornment
  const data = structuredClone(minimalBuildingData)
  data.publication.contributor = [
    { id: 'test-contributor', full_name: 'Test Contributor' },
    { id: 'other-contributor', full_name: 'Other Contributor' }
  ]

  // Create an environment and add test templates
  const environment = new Eleventy('.', '_site', {
    config: stubGlobalData(data, (eleventyConfig) => {
      eleventyConfig.addTemplate('b-page.md', '# B Page\n{% contributors context=pageContributors format="bio" %}', { abstract: '', contributor: [{ id: 'test-contributor', sort_as: '1' }, { id: 'other-contributor', sort_as: '2' }], title: 'B Page', layout: 'base.11ty.js', order: 1, outputs: ['html'] })
      eleventyConfig.addTemplate('a-page.md', '# A Page\n{% contributors context=publicationContributors format="bio" %}', { abstract: '', contributor: [{ id: 'test-contributor' }], title: 'A Page', layout: 'base.11ty.js', order: 2, outputs: ['html'] })
    })
  })

  // Build the publication
  const pages = await environment.toJSON()

  // Get the publication contributors page
  const publicationContributors = pages.find(p => p.inputPath === './content/a-page.md')
  const publicationContributorsDom = JSDOM.fragment(publicationContributors.content)

  // Test that all publication contributors are present -- in alpha order by full_name
  // NB: Unclear whether the contributor array is always ordered
  const contributorElementIds = Array.from(publicationContributorsDom.querySelectorAll('li.quire-contributor')).map(c => c.id)
  t.is(contributorElementIds.includes('test-contributor') && contributorElementIds.includes('other-contributor'), true)

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

  // Test that pageContributors only lists *other* pages for contributors
  const pageContributorListItems = Array.from(pageContributorsDom.querySelectorAll('li.quire-contributor#test-contributor a.quire-contributor__page-link')).map(a => a.href)
  t.like(pageContributorListItems, ['/a-page/'])
})

test.serial('contributors from page data behave properly on content=pageContributors and content=publicationContributors', async (t) => {
  // Create a publication without configured contributors
  const data = structuredClone(minimalBuildingData)

  // Create an environment and add test templates:
  // - Publication contributors by Contributor One
  // - Page contributors by Contributor Two
  // - A page with no contributor
  // - Page contributors by Contributor One, Contributor Three

  // NB: Page without a contributor element to tracks https://github.com/thegetty/quire/issues/853#issuecomment-3534338465
  // Page with multiple contributors tracks https://github.com/thegetty/quire/issues/853#issuecomment-3577118911
  const environment = new Eleventy('.', '_site', {
    config: stubGlobalData(data, (eleventyConfig) => {
      eleventyConfig.addTemplate('publication-contributors.md', '# A Page\n{% contributors context=publicationContributors format="bio" %}', { abstract: '', contributor: [{ first_name: 'Contributor', last_name: 'One' }], title: 'A Page', layout: 'base.11ty.js', order: 0, outputs: ['html'] })
      eleventyConfig.addTemplate('page-contributors.md', '# B Page\n{% contributors context=pageContributors format="bio" %}', { abstract: '', contributor: [{ first_name: 'Contributor', last_name: 'Two' }], title: 'B Page', layout: 'base.11ty.js', order: 1, outputs: ['html'] })
      eleventyConfig.addTemplate('page-without-contributor.md', '# No Contributor Page\n{% contributors context=pageContributors format="bio" %}', { abstract: '', title: 'B Page', layout: 'base.11ty.js', order: 2, outputs: ['html'] })
      eleventyConfig.addTemplate('page-with-multiple-contributors.md', '# Multiple Page Contributors\n{% contributors context=pageContributors format="bio" %}', { abstract: '', contributor: [{ first_name: 'Contributor', last_name: 'One' }, { first_name: 'Contributor', last_name: 'Three' }], title: 'Multiple contributors page', layout: 'base.11ty.js', order: 3, outputs: ['html'] })
    })
  })

  // Build the pages and read each page's HTML to a DOM object
  const pages = await environment.toJSON()

  const pageContributors = pages.find((page) => page.inputPath === './content/page-contributors.md')
  const pageContributorsDom = JSDOM.fragment(pageContributors.content)

  const publicationContributors = pages.find((page) => page.inputPath === './content/publication-contributors.md')
  const publicationContributorsDom = JSDOM.fragment(publicationContributors.content)

  // pageContributors should have the name but not pages that contrib appears on
  const contributorNameSpan = pageContributorsDom.querySelector('li.quire-contributor .quire-contributor__name')
  const contributorPageLink = pageContributorsDom.querySelector('li.quire-contributor .quire-contributor__page-link')

  t.is(contributorNameSpan.textContent, 'Contributor Two', 'Page data contributor name should be in context=pageContributors')
  t.is(contributorPageLink, null, 'Page data contributors should not have their page with context=pageContributors')

  // publicationContributors should have each contributors with their page
  Array.from(publicationContributorsDom.querySelectorAll('li.quire-contributor')).forEach((contributor) => {
    const contributorNameSpan = contributor.querySelector('.quire-contributor__name')
    const contributorPageLink = Array.from(contributor.querySelectorAll('.quire-contributor__page-link'))

    // And the page should be the one(s) assigned
    if (contributorNameSpan.textContent === 'Contributor One') {
      t.is(contributorPageLink.at(0).href, '/publication-contributors/')
      t.is(contributorPageLink.length, 2)
    } else if (contributorNameSpan.textContent === 'Contributor Two') {
      t.is(contributorPageLink.at(0).href, '/page-contributors/')
      t.is(contributorPageLink.length, 1)
    } else if (contributorNameSpan.textContent === 'Contributor Three') {
      t.is(contributorPageLink.at(0).href, '/page-with-multiple-contributors/')
      t.is(contributorPageLink.length, 1)
    } else {
      t.fail()
    }
  })

  t.pass()
})
