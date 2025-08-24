import Eleventy from '@11ty/eleventy'
import { JSDOM } from 'jsdom'
import test from 'ava'

/**
 * @function stubGlobalData
 *
 * @param {Object} eleventyConfig
 *
 * Inserts keys / values into globalData suitable to make Eleventy() init
 *
 **/
const stubGlobalData = (eleventyConfig) => {
  eleventyConfig.addGlobalData('publication', {})

  const config = {
    accordion: {
      copyButton: {}
    },
    epub: {},
    figures: {}
  }
  eleventyConfig.addGlobalData('config', config)

  const figures = { figure_list: [] }
  eleventyConfig.addGlobalData('figures', figures)
}

/**
 * @function stubEleventy
 *
 * Initializes an Eleventy object suitable for rendering out shortcodes
 *
 **/
const stubEleventy = async () => {
  const elev = new Eleventy('../', '_site', { config: stubGlobalData })
  await elev.init()

  return elev
}

// Initialize Eleventy and pass into test context
test.before('Stub eleventyConfig', async (t) => {
  const elev = await stubEleventy()

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
  testContent.forEach(async (c) => {
    const rendered = await eleventy.eleventyConfig.config.javascriptFunctions.renderTemplate(contentWithFootnote, 'liquid,md', {})
    const markup = JSDOM.fragment(rendered)

    const ids = Array.from(markup.querySelectorAll('[id]')).map((el) => el.id)
    const uniques = new Set(ids)

    if (ids.length !== uniques.length) t.fail('Accordion shortcode should not emit duplicate ids.')
  })

  t.pass()
})

test('Accordion sections should not produce duplicate ids in the markup with a footnote', async (t) => {
  const { eleventy } = t.context

  const contentWithFootnote = `{% accordion '## Test Section' %}
  Test content.[^1]
  {% endaccordion %}`

  const rendered = await eleventy.eleventyConfig.config.javascriptFunctions.renderTemplate(contentWithFootnote, 'liquid,md', {})
  const markup = JSDOM.fragment(rendered)

  const ids = Array.from(markup.querySelectorAll('[id]')).map((el) => el.id)
  const uniques = new Set(ids)

  if (ids.length !== uniques.length) t.fail('Accordion shortcode should not emit duplicate ids.')
})
