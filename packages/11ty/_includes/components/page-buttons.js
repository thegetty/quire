const { html } = require('~lib/common-tags')

/**
 * Renders previous page and next page buttons
 *
 * @param {Object} eleventyConfig
 * 
 * @param {Object} params
 * @param {Object} options
 *
 * @return {String} "previous" and "next" buttons
 */
module.exports = function(eleventyConfig) {
  const icon = eleventyConfig.getFilter('icon')
  const { config } = eleventyConfig.globalData

  return function(params, options={}) {
    const { pagination } = params
    const { nextPage, previousPage } = pagination

    const prevPageButton = () => {
      const buttonText = config.params.prevPageButtonText
      if (!previousPage) return
      return html`
        <li class="quire-nav-button prev">
          <a href="${previousPage.url}">${icon({ type: 'left-arrow', description: 'Go back a page'})}&nbsp;<span class="nav-title">${buttonText}</span></a>
          <span class="visually-hidden">Previous Page (left keyboard arrow or swipe)</span>
        </li>
      `
    }

    const nextPageButton = () => {
      const buttonText = config.params.nextPageButtonText
      if (!nextPage) return
      return html`
        <li class="quire-nav-button next">
          <a href="${nextPage.url}"><span class="nav-title">${buttonText}</span>&nbsp;${icon({ type: 'right-arrow', description: 'Go back next page' })}</a>
            <span class="visually-hidden">Next Page (right keyboard arrow or swipe)</span>
        </li>
      `
    }

    return html`
      <div class="quire-contents-buttons ${ config.params.pdf ? 'visually-hidden' : '' }" data-outputs-exclude="epub,pdf">
        <ul>
          ${prevPageButton()}
          ${nextPageButton()}
        </ul>
      </div>
    `
  }
}
