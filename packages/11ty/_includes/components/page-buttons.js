const { html } = require('common-tags')

/**
 * Renders previous page and next page buttons
 *
 * @param {Object} eleventyConfig
 * @param {Object} data
 *
 * @return {String} "previous" and "next" buttons
 */
module.exports = function(eleventyConfig, data) {
  const qicon = eleventyConfig.getFilter('qicon')

  const { config, pagination } = data
  const { nextPage, previousPage } = pagination

  const prevPageButton = () => {
    const buttonText = config.params.prevPageButtonText
    if (!previousPage) return
    return html`
      <li class="quire-nav-button prev">
        <a href="${previousPage.url}">${qicon('left-arrow', 'Go back a page')}&nbsp;<span class="nav-title">${buttonText}</span></a>
        <span class="visually-hidden">Previous Page (left keyboard arrow or swipe)</span>
      </li>
    `
  }

  const nextPageButton = () => {
    const buttonText = config.params.nextPageButtonText
    if (!nextPage) return
    return html`
      <li class="quire-nav-button next">
        <a href="${nextPage.url}"><span class="nav-title">${buttonText}</span>&nbsp;${qicon('right-arrow', 'Go back next page')}</a>
          <span class="visually-hidden">Next Page (right keyboard arrow or swipe)</span>
      </li>
    `
  }

  return html`
    <div class="quire-contents-buttons remove-from-epub ${ config.params.pdf ? 'visually-hidden' : '' }">
      <ul>
        ${prevPageButton()}
        ${nextPageButton()}
      </ul>
    </div>
  `
}
