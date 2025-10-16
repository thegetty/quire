import { JSDOM } from 'jsdom'
import test from 'ava'
import { initEleventyEnvironment } from './helpers/index.js'

/**
 * @function renderAndTestIds
 *
 * @param {String} content
 * @param {Eleventy} eleventy
 * @param {ava.test} t
 *
 * Renders `content` and tests it for unique IDs
 **/
const renderAndTestIds = async (content, eleventy, t) => {
  const rendered = await eleventy.eleventyConfig.config.javascriptFunctions.renderTemplate(content, 'liquid,md', {})
  const markup = JSDOM.fragment(rendered)

  const ids = Array.from(markup.querySelectorAll('[id]')).map((el) => el.id)
  const uniques = new Set(ids)

  if (ids.length !== uniques.size) t.fail('Accordion shortcode should not emit duplicate ids.')
}

// Initialize Eleventy and pass into test context
test.before('Stub the eleventy environment', async (t) => {
  const elev = await initEleventyEnvironment({})

  t.context.eleventy = elev
})

test('Accordion sections should never produce duplicate ids', async (t) => {
  const { eleventy } = t.context

  const content = `{% accordion '## Test Section' %}
  Test content.
  {% endaccordion %}`

  const contentWithFootnote = `{% accordion '## Test Section' %}
  Test content.[^1]
  {% endaccordion %}`

  const testContent = [content, contentWithFootnote]
  testContent.forEach(async (c) => await renderAndTestIds(c, eleventy, t))

  t.pass()
})

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
