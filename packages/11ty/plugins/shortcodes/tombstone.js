const { html, oneLine } = require('common-tags')
const icon = require('../../_includes/components/icon.js')
const path = require('path')

/**
 * A shortcode for tombstone display of object data on an entry page
 */
module.exports = function(context, pageObjects) {
  const { eleventyConfig, globalData: { config, objects } } = context
  const capitalize = eleventyConfig.getFilter('capitalize')
  const markdownify = eleventyConfig.getFilter('markdownify')
  const properties = objects.object_display_order

  const tableRow = (object, property) => {
    if (!object || !property || !object[property]) return ''

    return html`
      <tr>
        <td>${capitalize(property)}</td>
        <td>${markdownify(object[property].toString())}</td>
      </tr>
    `
  }

  const objectLink = (object) => object.link 
    ? oneLine`
      <a class="button" href="${object.link}" target="_blank">
        ${config.params.entryPageObjectLinkText} ${icon('link', '')}
      </a>`
    : ''

  const table = (object) => html`
    <section class="quire-entry__tombstone">
      <div class="container">
        <table class="table is-fullwidth">
          <tbody>
            ${properties.map((property) => tableRow(object, property)).join('')}
          </tbody>
        </table>
        ${objectLink(object)}
      </div>
    </section>
  `

  return pageObjects.map((object) => table(object)).join('')
}
