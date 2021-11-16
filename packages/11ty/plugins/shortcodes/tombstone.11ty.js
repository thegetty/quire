/**
 * A shortcode for tombstone display of object data on an entry page
 */
const path = require('path')

module.exports = function(eleventyConfig, { config, objects }, pageObjects) {
  const capitalize = eleventyConfig.getFilter('capitalize')
  const markdownify = eleventyConfig.getFilter('markdownify')
  const properties = objects.object_display_order
  const qicon = eleventyConfig.getFilter('qicon')

  const tableRow = (object, property) => {
    if (!object || !property || !object[property]) return ''

    return `
      <tr>
        <td>${capitalize(property)}</td>
        <td>${markdownify(object[property].toString())}</td>
      </tr>
    `
  }

  const objectLink = (object) => object.link 
    ? 
      `<a class="button" href="${object.link}" target="_blank">
        ${config.params.entryPageObjectLinkText} ${qicon('link', '')}
      </a>`
    : ''

  const table = (object) => `
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