import Accordion from './accordion'
/**
 * scrollToHash
 * @description Scroll the #main area after each smoothState reload.
 * If a hash id is present, scroll to the location of that element,
 * taking into account the height of the navbar.
 */

/**
 * scrollWindow
 * @description scroll viewport to a certain vertical offset, minus the height of the quire navbar
 * TODO add animation duration and style of easing function previously provided by jQuery `.animate()`
 */
function scrollWindow(verticalOffset, animationDuration = null, animationStyle = null) {
  const navBar = document.querySelector('.quire-navbar')
  const extraSpace = 7
  const scrollDistance = navBar
    ? verticalOffset - navBar.clientHeight - extraSpace
    : verticalOffset - extraSpace
  // redundancy here to ensure all possible document properties with `scrollTop` are being set for cross-browser compatibility
  const documentProperties = [
    document.documentElement,
    document.body.parentNode,
    document.body
  ]
  documentProperties.forEach((element) => {
    element.scrollTop = scrollDistance
  })
}

export default (hash) => {
  if (!hash) return
  // prefix all ':' and '.' in hash with '\\' to make them query-selectable
  hash = hash.replace(':', '\\:')
  hash = hash.replace('.', '\\.')
  // Figure out element to scroll to
  const target = document.querySelector(hash)
  // Does a scroll target exist?
  if (target) {
    if (Accordion.partOfAccordion(target)) {
      const accordion = new Accordion(target.closest(`.${Accordion.className}`))
      accordion.setStateFromUrl()
    }
    const verticalOffset = target.getBoundingClientRect().top + window.scrollY
    scrollWindow(verticalOffset)
    // handle focus after scrolling
    setTimeout(() => target.focus())
  }
}
