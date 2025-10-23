import { JSDOM } from 'jsdom'
import test from 'ava'
import { initEleventyEnvironment } from '../helpers/index.js'

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
