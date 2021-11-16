/**
 * Template to render previous and next page buttons
 */

exports.data = {
  data: (data) => data
}

exports.render = (data) => {
  const { config, pagination } = data
  const { nextPage, previousPage } = pagination

  const prevPageButton = () => {
    const buttonText = config.params.prevPageButtonText
    if (!previousPage) return
    return html`
      <li class="quire-nav-button prev">
        <a href="${previousPage.url}">${this.qicon('left-arrow', 'Go back a page')}&nbsp;<span class="nav-title">${buttonText}</span></a>
        <span class="visually-hidden">Previous Page (left keyboard arrow or swipe)</span>
      </li>
    `
  }

  const nextPageButton = () => {
    const buttonText = config.params.nextPageButtonText
    if (!nextPage) return
    return html`
      <li class="quire-nav-button next">
        <a href="${nextPage.url}"><span class="nav-title">${buttonText}</span>&nbsp;${this.qicon('right-arrow', 'Go back next page')}</a>
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
