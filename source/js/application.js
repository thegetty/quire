/**
 * @fileOverview
 * @name application.js
 * @description This file serves as the entry point for Weback, the JS library
 * responsible for building all CSS and JS assets for the theme.
 */

// Stylesheets
import '../css/application.scss'

// JS Libraries (add them to package.json with `npm install [library]`)
import $ from 'jquery'
import 'smoothstate'
import 'velocity-animate'

// Modules (feel free to define your own and import here)
import Search from './search.js'
import Map from './map.js'

/**
 * toggleMenu
 * @description Show/hide the menu UI by changing CSS classes and Aria status.
 * This function is bound to the global window object so it can be called from
 * templates without additinoal binding.
 */
window.toggleMenu = () => {
  let menu = document.getElementById('site-menu')
  let menuAriaStatus = menu.getAttribute('aria-expanded')
  menu.classList.toggle('is-expanded')

  if (menuAriaStatus === 'true') {
    menu.setAttribute('aria-expanded', 'false')
  } else {
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
  let searchControls = document.getElementById('js-search')
  let searchInput = document.getElementById('js-search-input')
  let searchAriaStatus = searchControls.getAttribute('aria-expanded')
  searchControls.classList.toggle('is-active')

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
  let searchInput = document.getElementById('js-search-input')
  let searchQuery = searchInput.value
  let searchInstance = window.QUIRE_SEARCH
  let resultsContainer = document.getElementById('js-search-results-list')
  let resultsTemplate = document.getElementById('js-search-results-template')

  if (searchQuery.length >= 3) {
    let searchResults = searchInstance.search(searchQuery)
    displayResults(searchResults)
  }

  function clearResults() {
    resultsContainer.innerHTML = ''
  }

  function displayResults(results) {
    clearResults()
    results.forEach(result => {
      let clone = document.importNode(resultsTemplate.content, true)
      let item = clone.querySelector('.js-search-results-item')
      let title = clone.querySelector('.js-search-results-item-title')
      let subtitle = clone.querySelector('.js-search-results-item-subtitle')
      item.href = result.url
      title.textContent = result.title
      subtitle.textContent = result.type
      resultsContainer.appendChild(clone)
    })
  }
}

/**
 * globalSetup
 * @description Initial setup on first page load.
 */
function globalSetup() {
  let container = document.getElementById('container')
  container.classList.remove('no-js')
  pageSetup()
  loadSearchData()
}

/**
 * loadSearchData
 * @description Load full-text index data from the specified URL
 * and pass it to the search module.
 */
function loadSearchData() {
  // Grab search data
  let dataURL = $('#js-search').data('search-index')
  $.get(dataURL, { cache: true }).done(data => {
    window.QUIRE_SEARCH = new Search(data)
  })
}

/**
 * menuSetup
 * @description Set the menu to its default hidden state. This
 * function should be called again after each smootState reload.
 */
function menuSetup() {
  let menu = document.getElementById('site-menu')
  let menuAriaStatus = menu.getAttribute('aria-expanded')
  menu.classList.remove('is-expanded')
  if (menuAriaStatus === 'true') {
    menu.setAttribute('aria-expanded', 'false')
  }
}

function mapSetup() {
  let map = document.getElementById('js-map')

  if (map) {
    new Map()
  }
}

/**
 * pageSetup
 * @description This function is called after each smoothState reload.
 * Initialize any jquery plugins or set up page UI elements here.
 */
function pageSetup() {
  menuSetup()
  mapSetup()
}

// Start
// -----------------------------------------------------------------------------
//
// Run immediately
globalSetup()

// Run when document is ready
$(document).ready(() => {
  $('#container').smoothState({
    onStart: {
      duration: 200,
      render($container) {
        $container.velocity('fadeOut', { duration: 200 })
      }
    },
    onReady: {
      duration: 200,
      render($container, $newContent) {
        $container.html($newContent)
        $container.velocity('fadeIn', { duration: 200 })
        pageSetup()
      }
    },
    onAfter($container, $newContent) {}
  })
})
