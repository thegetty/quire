const { oneLine } = require('common-tags')
const path = require('path')

/**
 * qcontributor shortcode
 * Renders contributor data with bio for contributors page
 * ---
 * @todo
 * ---
 * Render formats other than 'bio'
 *
 * @param  {Object} eleventyConfig
 * @param  {Object} params
 * @property  {Object} contributor
 * @property  {String} format              'bio' or... ?
 * @property  {String} entryType "publication" or "page"
 * 
 * @return {String} contributor markup
 */
module.exports = function (eleventyConfig) {
  const fullname = eleventyConfig.getFilter('fullname')
  const getContributor = eleventyConfig.getFilter('getContributor')
  const icon = eleventyConfig.getFilter('icon')
  const link = eleventyConfig.getFilter('link')
  const markdownify = eleventyConfig.getFilter('markdownify')
  const pageTitle = eleventyConfig.getFilter('pageTitle')
  const slugify = eleventyConfig.getFilter('slugify')

  return function (params) {
    const { contributor, format, entryType } = params
    const { bio, id, imagePath, pages=[], url } = contributor

    const name = fullname(contributor)

    const contributorPages = pages.map(({ data, url }) => {
      const { label, subtitle, title } = data
      return `${link({
        classes: ['quire-contributor__page-link'],
        name: pageTitle({ label, subtitle, title }),
        url,
      })}`
    })

    const contributorLink = url
      ? link({ classes: ["quire-contributor__url"], name: icon({ type: 'link', description:'' }), url })
      : ''

    const contributorImage = imagePath
      ? oneLine`
          <div class="media-left">
            <img class="image quire-contributor__pic" src="${imagePath}" alt="Picture of ${name}">
          </div>
      `
      : ''

    const contributorBio = bio
      ? oneLine`
          <div class="quire-contributor__bio">
            ${markdownify(bio)}
          </div>
      `
      : ''

    return oneLine`
      <ul class="quire-contributors-list bio">
        <li class="quire-contributor" id="${slugify(name)}">
          <div class="title is-5">
            <span class="quire-contributor__name">${name}</span>
            ${contributorLink}
          </div>
          <div class="media">
            <div class="quire-contributor__details media-content">
              ${contributorImage}
              ${contributorBio}
              ${contributorPages}
            </div>
          </div>
        </li>
      </ul>
    `
  }
}
