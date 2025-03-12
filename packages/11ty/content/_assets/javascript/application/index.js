// @ts-check

/**
 * @fileOverview
 * @name application.js
 * @description This file serves as the entry point for Webpack, the JS library
 * responsible for building all CSS and JS assets for the theme.
 */

// Stylesheets
import '../../fonts/index.scss'
import '../../styles/application.scss'
import '../../styles/screen.scss'
import '../../styles/custom.css'

// Modules (feel free to define your own and import here)
import './soundcloud-api.min.js'
import { goToFigureState, setUpUIEventHandlers } from './canvas-panel.js'
import Accordion from './accordion.js'
import Search from '../../../../_plugins/search/search.js'
import scrollToHash from './scroll-to-hash.js'

/**
 * toggleMenu
 * @description Show/hide the menu UI by changing CSS classes and Aria status.
 * This function is bound to the global window object so it can be called from
 * templates without additional binding.
 */
window.toggleMenu = () => {
  const menu = document.getElementById('site-menu')
  const catalogEntryImage = document.querySelector(
    '.side-by-side > .quire-entry__image-wrap > .quire-entry__image'
  )
  const menuAriaStatus = menu.getAttribute('aria-expanded')
  menu.classList.toggle('is-expanded', !menu.classList.contains('is-expanded'))
  if (menuAriaStatus === 'true') {
    catalogEntryImage && catalogEntryImage.classList.remove('menu_open')
    menu.setAttribute('aria-expanded', 'false')
  } else {
    catalogEntryImage && catalogEntryImage.classList.add('menu_open')
    menu.setAttribute('aria-expanded', 'true')
  }
}

/**
 * toggleSearch
 * @description Show/hide the search UI by changing CSS classes and Aria status.
 * This function is bound to the global window object so it can be called from
 * templates without additinoal binding.
 */
window.toggleSearch = () => {
  const searchControls = document.getElementById('js-search')
  const searchInput = document.getElementById('js-search-input')
  const searchAriaStatus = searchControls.getAttribute('aria-expanded')
  searchControls.classList.toggle(
    'is-active',
    !searchControls.classList.contains('is-active')
  )
  if (searchAriaStatus === 'true') {
    searchControls.setAttribute('aria-expanded', 'false')
  } else {
    searchInput.focus()
    searchControls.setAttribute('aria-expanded', 'true')
  }
}

/**
 * search
 * @description makes a search query using Lunr
 */
window.search = () => {
  const searchInput = document.getElementById('js-search-input')
  const searchQuery = searchInput.value
  const searchInstance = window.QUIRE_SEARCH
  const resultsContainer = document.getElementById('js-search-results-list')
  const resultsTemplate = document.getElementById('js-search-results-template')
  if (searchQuery.length >= 3) {
    const searchResults = searchInstance.search(searchQuery)
    displayResults(searchResults)
  }

  function clearResults () {
    resultsContainer.innerText = ''
  }

  function displayResults (results) {
    clearResults()
    results.forEach(result => {
      const clone = document.importNode(resultsTemplate.content, true)
      const item = clone.querySelector('.js-search-results-item')
      const title = clone.querySelector('.js-search-results-item-title')
      const type = clone.querySelector('.js-search-results-item-type')
      const length = clone.querySelector('.js-search-results-item-length')
      item.href = result.url
      title.textContent = result.title
      type.textContent = result.type
      length.textContent = result.length
      resultsContainer.appendChild(clone)
    })
  }
}

function onHashLinkClick (event) {
  // only override default link behavior if it points to the same page
  const anchor = event.target.closest('a')
  const hash = anchor.hash
  if (anchor.pathname.includes(window.location.pathname)) {
    // prevent default scrolling behavior
    event.preventDefault()
    // ensure the hash is manually set after preventing default
    window.location.hash = hash
  }
  scrollToHash(hash)
}

function setupCustomScrollToHash () {
  const invalidHashLinkSelectors = [
    '[href="#"]',
    '[href="#0"]',
    '.accordion-section__heading-link',
    '.q-figure__modal-link'
  ]
  const validHashLinkSelector =
    'a[href*="#"]' +
    invalidHashLinkSelectors
      .map((selector) => `:not(${selector})`)
      .join('')
  // Select all links with hashes, ignoring links that don't point anywhere
  const validHashLinks = document.querySelectorAll(validHashLinkSelector)
  validHashLinks.forEach((link) => {
    link.addEventListener('click', onHashLinkClick)
  })
}

/**
 * globalSetup
 * @description Initial setup on first page load.
 */
function globalSetup () {
  const container = document.getElementById('container')
  container.classList.remove('no-js')
  const classNames = []
  if (navigator.userAgent.match(/(iPad|iPhone|iPod)/i)) { classNames.push('device-ios') }

  if (navigator.userAgent.match(/android/i)) classNames.push('device-android')

  if (classNames.length) classNames.push('on-device')

  loadSearchData()
  setupCustomScrollToHash()
}

/**
 * loadSearchData
 * @description Load full-text index data from the specified URL
 * and pass it to the search module.
 */
function loadSearchData () {
  // Grab search data
  const dataURL = document.getElementById('js-search').dataset.searchIndex
  if (!dataURL) {
    console.warn('Search data url is undefined')
    return
  }
  fetch(dataURL).then(async (response) => {
    const { ok, statusText, url } = response
    if (!ok) {
      console.warn(`Search data ${statusText.toLowerCase()} at ${url}`)
      return
    }
    const data = await response.json()
    window.QUIRE_SEARCH = new Search(data)
  })
}

/**
 * Applies MLA format to date
 *
 * @param  {Date}   date   javascript date object
 * @return {String}        MLA formatted date
 */
function mlaDate (date) {
  const options = {
    month: 'long'
  }
  const monthNum = date.getMonth()
  let month
  if ([4, 5, 6].includes(monthNum)) {
    const dateString = date.toLocaleDateString('en-US', options)
    month = dateString.replace(/[^A-Za-z]+/, '')
  } else {
    month = (month === 8) ? 'Sept' : date.toLocaleDateString('en-US', options).slice(0, 3)
    month += '.'
  }
  const day = date.getDate()
  const year = date.getFullYear()
  return [day, month, year].join(' ')
}

/**
 * @description
 * Set the date for the cite this partial
 * https://github.com/gettypubs/quire/issues/153
 * Quire books include a "Cite this Page" feature with page-level citations formatted in both Chicago and MLA style.
 * For MLA, the citations need to include a date the page was accessed by the reader.
 *
 */
function setDate () {
  const dateSpans = document.querySelectorAll('.cite-current-date')
  const formattedDate = mlaDate(new Date())
  dateSpans.forEach((dateSpan) => {
    dateSpan.innerHTML = formattedDate
  })
}

/**
* Translates the X-position of an element inside a container so that its contents
* are contained
* Expects the contained element to already be translated so that it's centered above
* another element
*
* @param {object} element to position
* @param {object} container element
* @param {number} container margin
*/
function setPositionInContainer (el, container) {
  const margin = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--gap'))
  const elRect = el.getBoundingClientRect()
  const containerRect = container.getBoundingClientRect()

  const leftDiff = containerRect.left - elRect.left
  const rightDiff = elRect.right - containerRect.right
  const halfElWidth = elRect.width / 2
  // x
  if (rightDiff > 0) {
    el.style.transform = `translateX(-${halfElWidth + rightDiff + margin}px)`
  } else if (leftDiff > 0) {
    el.style.transform = `translateX(-${halfElWidth - leftDiff - margin}px)`
  }
  // @todo y
}

/**
 * @description
 * find expandable class and look for aria-expanded
 * https://github.com/gettypubs/quire/issues/152
 * Cite button where users can select, tied to two config settings:
 * citationPopupStyle - text for text only | icon for text and icon
 * citationPopupLinkText which is whatever text you it to say
 */
function toggleCite () {
  const expandables = document.querySelectorAll('.expandable [aria-expanded]')
  for (let i = 0; i < expandables.length; i++) {
    expandables[i].addEventListener('click', event => {
      // Allow these links to bubble up
      event.stopPropagation()
      const expanded = event.target.getAttribute('aria-expanded')
      if (expanded === 'false') {
        event.target.setAttribute('aria-expanded', 'true')
      } else {
        event.target.setAttribute('aria-expanded', 'false')
      }
      const content = event.target.parentNode.querySelector(
        '.quire-citation__content'
      )
      if (content) {
        content.getAttribute('hidden')
        if (typeof content.getAttribute('hidden') === 'string') {
          content.removeAttribute('hidden')
        } else {
          content.setAttribute('hidden', 'hidden')
        }
        setPositionInContainer(content, document.documentElement)
      }
    })
  }
  document.addEventListener('click', event => {
    const content = event.target.parentNode
    if (!content) return
    if (
      content.classList.contains('quire-citation') ||
      content.classList.contains('quire-citation__content')
    ) {
      // do nothing
    } else {
      // find all Buttons/Cites
      const citeButtons = document.querySelectorAll('.quire-citation__button')
      const citesContents = document.querySelectorAll('.quire-citation__content')
      // hide all buttons
      if (!citesContents) return
      for (let i = 0; i < citesContents.length; i++) {
        if (!citeButtons[i]) return
        citeButtons[i].setAttribute('aria-expanded', 'false')
        citesContents[i].setAttribute('hidden', 'hidden')
      }
    }
  })
}

/**
 * pageSetup
 * @description This function is called after each smoothState reload.
 * Set up page UI elements here.
 */
function pageSetup () {
  setDate()
  toggleCite()
}

function parseQueryParams () {
  const url = new URL(window.location)
  const uniqueKeys = [...new Set(url.searchParams.keys())]
  return Object.fromEntries(
    uniqueKeys.map((key) => [
      key,
      url.searchParams.getAll(key).map(decodeURIComponent)
    ])
  )
}

// Start
// -----------------------------------------------------------------------------
//
// Run immediately
globalSetup()

// Run when DOM content has loaded
window.addEventListener('load', () => {
  pageSetup()
  scrollToHash(window.location.hash, 75, 'swing')
  const params = parseQueryParams()
  /**
   * Accordion Setup
   */
  Accordion.setup()
  /**
   * Canvas Panel Setup
   */
  setUpUIEventHandlers()
  if (window.location.hash) {
    goToFigureState({
      figureId: window.location.hash.replace(/^#/, ''),
      annotationIds: params['annotation-id'],
      region: params.region ? params.region[0] : null,
      sequence: {
        index: params['sequence-index'] ? params['sequence-index'][0] : null
      }
    })
  }
})
