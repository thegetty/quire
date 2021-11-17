/**
 * qcontributor shortcode
 * Renders contributor data with bio for contributors page
 * ---
 * @todo
 * ---
 * Previously this shortcode did A LOT. 
 * it needs to be broken into multiple components that:
 * @param  {Object} eleventyConfig      
 * @param  {Object} globalData          
 * @param  {Object} contributor         
 * @param  {String} format              bio or... ?
 * @return {String} contributor markup 
 */
const { oneLine } = require('common-tags')
const path = require('path')
const pageTitlePartial = require('../../_includes/page/title.11ty.js')

module.exports = function(eleventyConfig, { config, publication }, contributor, format) {
  const contributorName = eleventyConfig.getFilter('contributorName')
  const getContributor = eleventyConfig.getFilter('getContributor')
  const qicon = eleventyConfig.getFilter('qicon')
  const slugify = eleventyConfig.getFilter('slugify')

  const { bio, id, pages, pic, url } = contributor
  const imagePath = path.join('..', '_assets', config.params.imageDir, pic)
  const name = contributorName(contributor)

  const pageLinkElements = pages ? pages.map(({ data, url }) => {
    const pageTitle = data.label 
      ? `${data.label}${config.params.pageLabelDivider} ${pageTitlePartial(data)}` 
      : pageTitlePartial(data)
    return `
      <p class="quire-contributor__page-link">
        <a href="${url}">
          ${pageTitle}
        </a>
      </p>`
  }) : []
  return oneLine`
    <ul class="quire-contributors-list bio">
      <li class="quire-contributor" id="${slugify(name)}">
        <div class="title is-5">
          <span class="quire-contributor__name">${name}</span> 
          <a href="${url}" class="quire-contributor__url" taget="_blank">
            ${qicon('link', '')}
          </a>
        </div>
        <div class="media">
          <div class="quire-contributor__details media-content">
            <div class="media-left">
              <img class="image quire-contributor__pic" src="${imagePath}" alt="Picture of ${name}">
            </div>
            <div class="quire-contributor__bio">
              ${bio}
            </div>
            ${pageLinkElements.join('')}
          </div>
        </div>
      </li>
    </ul>
  `
}
