const { oneLine } = require('common-tags')
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
  const pageTitle = eleventyConfig.getFilter('pageTitle')
  const slugify = eleventyConfig.getFilter('slugify')

  return function (params) {
    const { bio, id, imagePath, pages=[], url } = params

    const name = fullname(params)

    const contributorPages = pages.map(({ data, url }) => {
      const { label, subtitle, title } = data
      return `${link({
        classes: ['quire-contributor__page-link'],
        name: pageTitle({ label, subtitle, title }),
        url,
      })}`
    })

    return oneLine`
      <li class="quire-contributor" id="${slugify(name)}">
        <div class="title is-5">
          <span class="quire-contributor__name">${name}</span>
          ${link({ classes: ["quire-contributor__url"], name: icon({ type: 'link', description:'' }), url })}
        </div>
        <div class="media">
          <div class="quire-contributor__details media-content">
            <div class="media-left">
              <img class="image quire-contributor__pic" src="${imagePath}" alt="Picture of ${name}">
            </div>
            <div class="quire-contributor__bio">
              ${bio}
            </div>
            ${contributorPages}
          </div>
        </div>
      </li>
    `
  }
}
