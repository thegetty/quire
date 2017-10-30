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

window.toggleMenu = function () {
  var menu = document.getElementById('site-menu');
  var menuAriaStatus = menu.getAttribute('aria-expanded');
  menu.classList.toggle('is-expanded');

  if (menuAriaStatus === "true") {
    menu.setAttribute('aria-expanded', "false")
  } else {
    menu.setAttribute('aria-expanded', "true")
  }
}

$(document).ready(function() {
  document.body.classList.remove('no-js');
  toggleMenu()

  // Site menu keyboard accessibility
  var $menu = $('#site-menu');
  $menu.focusin(toggleMenu)
  $menu.focusout(toggleMenu)
});
