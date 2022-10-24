const { html } = require('~lib/common-tags')
const path = require('path')

/**
 * Contributor bio subcomponent
 * Renders contributor list item for 'bio' format
 *
 * @param  {Object} eleventyConfig
 * @param  {Object} params
 * @property  {Object} contributor
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
    const { bio, id, imagePath, pages=[], url } = params

    const name = fullname(params)

    const contributorLink = url
      ? link({ classes: ["quire-contributor__url"], name: icon({ type: 'link', description:'' }), url })
      : ''

    const contributorImage = imagePath
      ? html`
          <div class="media-left">
            <img class="image quire-contributor__pic" src="${imagePath}" alt="Picture of ${name}">
          </div>
      `
      : ''

    const contributorBio = bio
      ? html`
          <div class="quire-contributor__bio">
            ${markdownify(bio)}
          </div>
      `
      : ''

    const contributorPagesList = () => {
      const items = pages.map(({ data, url }) => {
        const { label, subtitle, title } = data
        const classes = ['quire-contributor__page-link']
        const name = pageTitle({ label, subtitle, title })
        return `<li>${link({ classes, name, url })}</li>`
      })
      return html`
        <ul>
          ${items}
        </ul>
      `
    }

    return html`
      <li class="quire-contributor" id="${slugify(name)}">
        <div class="title is-5">
          <span class="quire-contributor__name">${name}</span>
          ${contributorLink}
        </div>
        <div class="media">
          <div class="quire-contributor__details media-content">
            ${contributorImage}
            ${contributorBio}
            ${contributorPagesList()}
          </div>
        </div>
      </li>
    `
  }
}
