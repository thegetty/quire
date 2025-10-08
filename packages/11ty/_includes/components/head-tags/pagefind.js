/* eslint-disable camelcase */
import { html } from 'common-tags'

/**
 * Renders <head> <meta> data tags for PageFind search
 *
 * @param      {Object}  eleventyConfig
 *
 * @return     {String}  HTML meta elements
 */
export default function (eleventyConfig) {
  const contributors = eleventyConfig.getFilter('contributors')
  const removeHTML = eleventyConfig.getFilter('removeHTML')

  return function ({ page, layout }) {
    if (!page) {
      return
    }

    const meta = [
      {
        property: 'type',
        content: layout
      }
    ]

    if (page.contributor) {
      const contributorContent = contributors({ context: page.contributor, format: 'string', type: 'primary' })
      meta.push({
        property: 'contributors',
        content: removeHTML(contributorContent)
      })
    }

    return html`${meta.map(({ property, content }) => `<meta property="pagefind:${property}" content="${content}" data-pagefind-meta="${property}[content]">`)}`
  }
}
