const { oneLine } = require('common-tags')
const path = require('path')

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
module.exports = function(context, contributor, format) {
  const { eleventyConfig, globalData: { config, references }, page } = context
  const contributorName = eleventyConfig.getFilter('contributorName')
  const contributorPageLinks = eleventyConfig.getFilter('contributorPageLinks')
  const getContributor = eleventyConfig.getFilter('getContributor')
  const pageTitlePartial = eleventyConfig.getFilter('pageTitle')
  const qicon = eleventyConfig.getFilter('qicon')
  const slugify = eleventyConfig.getFilter('slugify')

  const { bio, id, pages, pic, url } = contributor
  const imagePath = path.join('..', '_assets', config.params.imageDir, pic)
  const name = contributorName(contributor)

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
            ${contributorPageLinks(contributor)}
          </div>
        </div>
      </li>
    </ul>
  `
}
