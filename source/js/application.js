// Application JS
//
// This file serves as the entry point for Weback, the JS library responsible
// for building all CSS and JS assets for the theme. It is advisable for this
// file to remain mostly empty; use it as a manifest to import various
// components that live in separate files.
//

// Dependencies
// -----------------------------------------------------------------------------
// Even though this is a JS file, an import statement for the application.scss
// file must remain here so that Sass files are compiled when the theme builds.

// Stylesheets
//
import 'leaflet/dist/leaflet.css'
import 'leaflet-fullscreen/dist/leaflet.fullscreen.css'
import '../css/application.scss'

// JS Libraries (add them to package.json with `npm install [library]`)
//
import $ from 'jquery'
import 'smoothstate'
import 'velocity-animate'

// Functions defined on the window object for use in the UI for now.
//
window.toggleMenu = () => {
  let menu = document.getElementById('site-menu')
  let menuAriaStatus = menu.getAttribute('aria-expanded')
  menu.classList.toggle('is-expanded')

  if (menuAriaStatus === "true") {
    menu.setAttribute('aria-expanded', "false")
  } else {
    menu.setAttribute('aria-expanded', "true")
  }
}

window.handleMenuFocus = () => {
  let $menu = $('#site-menu')
  $menu.focusin(toggleMenu)
  $menu.focusout(toggleMenu)
}

window.initialSetup = () => {
  let menu = document.getElementById('site-menu')
  let menuAriaStatus = menu.getAttribute('aria-expanded')
  menu.classList.remove('is-expanded')
  if (menuAriaStatus === "true") { menu.setAttribute('aria-expanded', "false") }
}

// Start
//------------------------------------------------------------------------------

// Run these immediately
let container = document.getElementById('container')
container.classList.remove('no-js')
initialSetup()

// Run these on $(document).ready()
$(document).ready(() => {
  $("#container").smoothState({
    onStart: {
      duration: 200,
      render ($container) {
        $container.velocity('fadeOut', { duration: 200 })
      }
    },
    onReady: {
      duration: 200,
      render ($container, $newContent) {
        $container.html($newContent)
        $container.velocity('fadeIn', { duration: 200 })
        window.initialSetup()
      }
    },
    onAfter ($container, $newContent) {
    }
  })
});
