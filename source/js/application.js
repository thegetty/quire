/**
 * @fileOverview
 * @name application.js
 * @description This file serves as the entry point for Webpack, the JS library
 * responsible for building all CSS and JS assets for the theme.
 */
// Stylesheets

import '../css/application.scss'
import 'leaflet/dist/leaflet.css'
import 'leaflet-fullscreen/dist/leaflet.fullscreen.css'

// JS Libraries (add them to package.json with `npm install [library]`)
import $ from 'jquery'
import 'velocity-animate'

// Modules (feel free to define your own and import here)
import Search from './search.js'
import Map from './map.js'
import DeepZoom from './deepzoom.js'
import Navigation from './navigation.js'

// Photoswipe 
// import 'photoswipe/dist/photoswipe.css'
// import 'photoswipe/dist/default-skin/default-skin.css'
// import photoswipe from './photoswipe'
// import Popup from './popup'
import 'magnific-popup/dist/magnific-popup.css'
// import magnificPopup from 'magnific-popup'
require('magnific-popup')

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
  slider.each(function () {
    let sliderImages = $(this).find('figure')
    let firstImage = $(sliderImages.first())
    let lastImage = $(sliderImages.last())
    sliderImages.hide()
    firstImage.addClass('current-image first-image')
    firstImage.css('display', 'flex')
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
  let slider = $(event.target).closest('.quire-entry__image__group-container')
  let firstImage = slider.children('.first-image')
  let lastImage = slider.children('.last-image')
  let currentImage = slider.children('.current-image')
  let nextImage = currentImage.next('figure')
  let prevImage = currentImage.prev('figure')
  currentImage.hide()
  currentImage.removeClass('current-image')
  if (direction == "next") {
    if (currentImage.hasClass('last-image')) {
      firstImage.addClass('current-image')
      firstImage.css('display', 'flex')
    } else {
      nextImage.addClass('current-image')
      nextImage.css('display', 'flex')
    }
  } else if (direction == "prev") {
    if (currentImage.hasClass('first-image')) {
      lastImage.addClass('current-image')
      lastImage.css('display', 'flex')
    } else {
      prevImage.addClass('current-image')
      prevImage.css('display', 'flex')
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
/*
function menuSetup() {
  let menu = document.getElementById('site-menu')
  let menuAriaStatus = menu.getAttribute('aria-expanded')
  menu.classList.remove('is-expanded')
  if (menuAriaStatus === 'true') {
    menu.setAttribute('aria-expanded', 'false')
  }
}
*/

function mapSetup() {
  let map = document.getElementById('js-map')

  if (map) {
    new Map()
  }
}

function deepZoomSetup() {
  [...document.querySelectorAll('.quire-deepzoom')].forEach(v => {
    let id = v.getAttribute('id')
    new DeepZoom(id)
  })
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

  if (targetHash) {
    let targetHashEl = document.getElementById(targetHash.slice(1))
    let $targetHashEl = $(targetHashEl)

    if ($targetHashEl.length) {
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
 * Set up photoswipe
 */
function photoswipeSetup() {

  [...document.querySelectorAll('.q-figure__wrapper > a')].forEach(v => {
    let image = new Image()
    image.src = v.children[0].src
    v.setAttribute('data-size', `${image.naturalWidth}x${image.naturalHeight}`)
  })
  // photoswipe('.content')
  /*
   console.log(magnificPopup)
   $('.q-figure__wrapper').magnificPopup({
     delegate: 'a',
     type: 'inline',
     tLoading: 'Loading image #%curr%...',
     mainClass: 'mfp-img-mobile',
     gallery: {
       enabled: true,
       navigateByImgClick: true,
       preload: [0, 1] // Will preload 0 - before current, and 1 after the current image
     },
     image: {
       tError: '<a href="%url%">The image #%curr%</a> could not be loaded.',
       titleSrc: function (item) {
         return item.el.attr('title') + '<small>by Marsel Van Oosten</small>';
       }
     }
   });
  */
  $('.q-figure__wrapper').magnificPopup({
    delegate: 'a',
    type: 'image',
    gallery: {
      enabled: true,
      navigateByImgClick: true,

      preload: [0, 2], // read about this option in next Lazy-loading section

      navigateByImgClick: true,

      arrowMarkup: '<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"></button>', // markup of an arrow button

      tPrev: 'Previous (Left arrow key)', // title for left button
      tNext: 'Next (Right arrow key)', // title for right button
      tCounter: '' // markup of counter
    },
    callbacks: {
      beforeOpen: function () {
        console.log('Start of popup initialization');
      },
      elementParse: function (item) {
        console.log('Parsing content. Item object that is being parsed:', item);
        if (item.el[0].className == 'video') {
          item.type = 'iframe',
            item.iframe = {
              markup: '<div class="mfp-iframe-scaler">' +
                '<div class="mfp-close"></div>' +
                '<iframe class="mfp-iframe" frameborder="0" allowfullscreen></iframe>' +
                '<div class="mfp-counter"></div>' +
                '</div>', // HTML markup of popup, `mfp-close` will be replaced by the close button
              patterns: {
                youtube: {
                  index: 'youtube.com/', // String that detects type of video (in this case YouTube). Simply via url.indexOf(index).

                  id: 'v=', // String that splits URL in a two parts, second part should be %id%
                  // Or null - full URL will be returned
                  // Or a function that should return %id%, for example:
                  // id: function(url) { return 'parsed id'; } 

                  src: '//www.youtube.com/embed/%id%?autoplay=1' // URL that will be set as a source for iframe. 
                },
                vimeo: {
                  index: 'vimeo.com/',
                  id: '/',
                  src: '//player.vimeo.com/video/%id%?autoplay=1'
                },
                gmaps: {
                  index: '//maps.google.',
                  src: '%id%&output=embed'
                }
              }
            }
        } else if (item.el[0].className == 'inline') {

          item.type = 'inline'
          /*
          // console.log($('.mfp-content'))
          if ($('.mfp-content')) {
            // console.log($('.mfp-content').children().children().attr('id'))
            if ($('.mfp-content').children().children() !== undefined) {
              // console.log($('.mfp-content').children().children().attr('id'))
              let id = $('.mfp-content').children().children().attr('id')
              if (id) {
                if (id.indexOf('map') !== -1) {
                  new Map(id)
                }
                if (id.indexOf('deepzoom') !== -1) {
                  new DeepZoom(id)
                }
                if (id.indexOf('iiif') !== -1) {
                  new DeepZoom(id)
                }
              }
            }
          }
          */

        } else {
          item.type = 'image',
            item.tLoading = 'Loading image #%curr%...',
            item.mainClass = 'mfp-img-mobile',
            item.image = {
              tError: '<a href="%url%">The image #%curr%</a> could not be loaded.'
            }
        }

      },
      change: function () {
        console.log('Content changed');
        console.log(this.content); // Direct reference to your popup element
        console.log(this.content.children()[0].id); // Direct reference to your popup element

        let id = this.content.children()[0].id
        let waitForDOMUpdate = 100
        if (id !== '' || id !== undefined) {
          if (id.indexOf('map') !== -1) {
            setTimeout(() => {
              new Map(id)
            }, waitForDOMUpdate)
          }
          if (id.indexOf('deepzoom') !== -1) {

            setTimeout(() => {
              new DeepZoom(id)
            }, waitForDOMUpdate)
          }
          if (id.indexOf('iiif') !== -1) {
            setTimeout(() => {
              new DeepZoom(id)
            }, waitForDOMUpdate)
          }

        }

      },
      resize: function () {
        console.log('Popup resized');
        // resize event triggers only when height is changed or layout forced
      },
      open: function () {
        console.log(this); // Direct reference to your popup element
        console.log('Popup is opened');
      },

      beforeClose: function () {
        // Callback available since v0.9.0
        console.log('Popup close has been initiated');
      },
      close: function () {
        console.log('Popup removal initiated (after removalDelay timer finished)');
      },
      afterClose: function () {
        console.log('Popup is completely closed');
      },

      markupParse: function (template, values, item) {
        // Triggers each time when content of popup changes
        console.log('Parsing:', template, values, item);
      },
      updateStatus: function (data) {
        console.log('Status changed', data);
        // "data" is an object that has two properties:
        // "data.status" - current status type, can be "loading", "error", "ready"
        // "data.text" - text that will be displayed (e.g. "Loading...")
        // you may modify this properties to change current status or its text dynamically
      },
      imageLoadComplete: function () {
        // fires when image in current popup finished loading
        // avaiable since v0.9.0
        console.log('Image loaded');
      },


      // Only for ajax popup type
      parseAjax: function (mfpResponse) {
        // mfpResponse.data is a "data" object from ajax "success" callback
        // for simple HTML file, it will be just String
        // You may modify it to change contents of the popup
        // For example, to show just #some-element:
        // mfpResponse.data = $(mfpResponse.data).find('#some-element');

        // mfpResponse.data must be a String or a DOM (jQuery) element

        console.log('Ajax content loaded:', mfpResponse);
      },
      ajaxContentAdded: function () {
        // Ajax content is loaded and appended to DOM
        console.log(this.content);
      }
    }
  });

}

/**
 * pageSetup
 * @description This function is called after each smoothState reload.
 * Initialize any jquery plugins or set up page UI elements here.
 */
function pageSetup() {
  // mapSetup()
  //deepZoomSetup()
  sliderSetup()
  navigationSetup()
  photoswipeSetup()
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
})
