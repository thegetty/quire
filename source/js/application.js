/**
 * @fileOverview
 * @name application.js
 * @description This file serves as the entry point for Weback, the JS library
 * responsible for building all CSS and JS assets for the theme.
 */

// Stylesheets
import 'leaflet/dist/leaflet.css'
import 'leaflet-fullscreen/dist/leaflet.fullscreen.css'
import '../css/application.scss'

// JS Libraries (add them to package.json with `npm install [library]`)
import $ from 'jquery'
import 'smoothstate'
import 'velocity-animate'

// Modules (feel free to define your own and import here)
import Search from './search.js'

/**
 * UI Functions
 * -----------------------------------------------------------------------------
 * Functions assigned to the global window object so that they can be called
 * from templates without additional binding.
 */

/**
 * toggleMenu
 * @description Show/hide the menu UI by changing CSS classes and Aria status
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
 * @description Show/hide the search UI by changing CSS classes and Aria status
 */
window.toggleSearch = () => {
  let searchControls = document.getElementById('js-search')
  let searchAriaStatus = searchControls.getAttribute('aria-expanded')
  searchControls.classList.toggle('is-active')

  if (searchAriaStatus === 'true') {
    searchControls.setAttribute('aria-expanded', 'false')
  } else {
    searchControls.setAttribute('aria-expanded', 'true')
  }
}

// window.handleMenuFocus = () => {
//   let $menu = $('#site-menu')
//   $menu.focusin(window.toggleMenu)
//   $menu.focusout(window.toggleMenu)
// }

/**
 * Setup Functions
 * -----------------------------------------------------------------------------
 * Functions that build up the basic functionality of the publication.
 */

/**
 * globalSetup
 * @description Initial setup on first page load.
 */
function globalSetup() {
  let container = document.getElementById('container')
  container.classList.remove('no-js')
  menuSetup()
  searchSetup()
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

/**
 * searchSetup
 * @description Load full-text index data from the specified URL
 * and pass it to the search module.
 */
function searchSetup() {
  // Grab search data
  let dataURL = $('#js-search').data('search-index')
  $.get(dataURL, { cache: true }).done(data => {
    window.QUIRE_SEARCH = new Search(data)
  })
}

// Start
// -----------------------------------------------------------------------------
//
globalSetup()

// Run these on $(document).ready()
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
        menuSetup()
      }
    },
    onAfter($container, $newContent) {}
  })
})
