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


// Declaring this globally for now.
window.toggleMenu = function() {
  var menu = document.getElementById("quire-menu");
  var button = document.getElementById("quire-controls-menu-button");

  var buttonAriaStatus = button.getAttribute("aria-expanded");
  var menuAriaStatus = menu.getAttribute("aria-expanded");
  menu.classList.toggle("quire-menu--is-visible");

  if (buttonAriaStatus == "true") {
    button.setAttribute("aria-expanded", "false")
  } else if (buttonAriaStatus == "false") {
    button.setAttribute("aria-expanded", "true")
  }

  if (menuAriaStatus == "true") {
    menu.setAttribute("aria-expanded", "false")
  } else if (menuAriaStatus == "false") {
    menu.setAttribute("aria-expanded", "true")
  }
}

$(document).ready(function() {
  // window.toggleMenu()
});
