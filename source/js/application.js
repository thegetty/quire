/**
 * @fileOverview
 * @name application.js
 * @description This file serves as the entry point for Webpack, the JS library
 * responsible for building all CSS and JS assets for the theme.
 */

// Stylesheets
// console.log(webpack)

import '../css/application.scss'
// import '../css/fonts.scss'
import 'leaflet/dist/leaflet.css'
import 'leaflet-fullscreen/dist/leaflet.fullscreen.css'

// JS Libraries (add them to package.json with `npm install [library]`)
import $ from 'jquery'
import 'smoothstate'
import 'velocity-animate'

// Modules (feel free to define your own and import here)
import Search from './search.js'
import Map from './map.js'
import DeepZoom from './deepzoom.js'
import Navigation from './navigation.js'

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
 * sliderSetup
 * @description Set up the simple image slider used on catalogue entry pages for
 * objects with multiple figure images. See also slideImage function below.
 */
function sliderSetup() {
  let slider = $('.quire-entry__image__group-container')
  slider.each( function() {
    let sliderImages = $(this).find('figure')
    let firstImage = $( sliderImages.first() )
    let lastImage = $( sliderImages.last() )
    sliderImages.hide()
    firstImage.addClass('current-image first-image')
    firstImage.css('display','flex')
    lastImage.addClass('last-image')
  });
}

/**
 * slideImage
 * @description Slide to previous or next catalogue object image in a loop.
 * Supports any number of figures per object, and any number of obejects
 * per page.
 */
window.slideImage = (direction) => {
  let slider = $( event.target ).closest('.quire-entry__image__group-container')
  let firstImage = slider.children('.first-image' )
  let lastImage = slider.children('.last-image' )
  let currentImage = slider.children('.current-image' )
  let nextImage = currentImage.next('figure')
  let prevImage = currentImage.prev('figure')
  currentImage.hide()
  currentImage.removeClass('current-image')
  if ( direction == "next" ) {
    if ( currentImage.hasClass('last-image') ) {
      firstImage.addClass('current-image')
      firstImage.css('display','flex')
    } else {
      nextImage.addClass('current-image')
      nextImage.css('display','flex')
    }
  } else if ( direction == "prev" ) {
    if ( currentImage.hasClass('first-image') ) {
      lastImage.addClass('current-image')
      lastImage.css('display','flex')
    } else {
      prevImage.addClass('current-image')
      prevImage.css('display','flex')
    }
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
      let type = clone.querySelector('.js-search-results-item-type')
      let length = clone.querySelector('.js-search-results-item-length')
      item.href = result.url
      title.textContent = result.title
      type.textContent = result.type
      length.textContent = result.length
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
  loadSearchData()
  scrollToHash()
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

function deepZoomSetup() {
  let deepZoom = document.getElementById('js-deepzoom')

  if (deepZoom) {
    new DeepZoom()
  }
}

let navigation
function navigationSetup() {
  if (!navigation) {
    navigation = new Navigation()
  }
}

function navigationTeardown() {
  if (navigation) {
    navigation.teardown()
  }
  navigation = undefined
}

/**
 * scrollToHash
 * @description Scroll the #main area after each smoothState reload.
 * If a hash id is present, scroll to the location of that element,
 * taking into account the height of the navbar.
 */
function scrollToHash() {
  let $scroller = $("#main")
  let $navbar = $(".quire-navbar")
  let targetHash = window.location.hash;

  if(targetHash) {
    let targetHashEl = document.getElementById(targetHash.slice(1))
    let $targetHashEl = $(targetHashEl)

    if($targetHashEl.length){
      let newPosition = $targetHashEl.offset().top
      if ($navbar.length) {
        newPosition -= $navbar.height()
      }
      $scroller.scrollTop(newPosition)
    }
  } else {
    $scroller.scrollTop(0)
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
  deepZoomSetup()
  sliderSetup()
  navigationSetup()
}

/**
 * pageTeardown
 * @description This function is called before each smoothState reload.
 * Remove any event listeners here.
 */
function pageTeardown() {
  navigationTeardown()
}

// Start
// -----------------------------------------------------------------------------
//
// Run immediately
globalSetup()

// Run when document is ready
$(document).ready(() => {
  pageSetup()

  $('#container').smoothState({
    scroll: false,
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
    onAfter: function($container, $newContent) {
      scrollToHash();

      if (window.ga) {
        window.ga('send', 'pageview', window.location.pathname);
      }
    },
    onBefore($container, $newContent) {
      pageTeardown();
    }
  })
})
