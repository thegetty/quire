//@ts-check

/**
 * @fileOverview
 * @name application.js
 * @description This file serves as the entry point for Webpack, the JS library
 * responsible for building all CSS and JS assets for the theme.
 */

// Stylesheets
import "intersection-observer";
import "leaflet-fullscreen/dist/leaflet.fullscreen.css";
import "../css/application.scss";
import "leaflet/dist/leaflet.css";
import quicklink from "quicklink";

// JS Libraries (add them to package.json with `npm install [library]`)
import "babel-polyfill";
import $ from "jquery";
import "velocity-animate";
import "./soundcloud-api";

// Modules (feel free to define your own and import here)
import { preloadImages, stopVideo, toggleFullscreen } from "./helper";
import Search from "./search";
import Navigation from "./navigation";
import Popup from "./popup";
import DeepZoom from "./deepzoom";
import Map from "./map";

// array of leaflet instances
const mapArr = [];

/**
 * toggleMenu
 * @description Show/hide the menu UI by changing CSS classes and Aria status.
 * This function is bound to the global window object so it can be called from
 * templates without additional binding.
 */
window["toggleMenu"] = () => {
  let menu = document.getElementById("site-menu");
  document.getElementsByClassName;
  let menuAriaStatus = menu.getAttribute("aria-expanded");
  menu.classList.toggle("is-expanded", !menu.classList.contains("is-expanded"));
  if (menuAriaStatus === "true") {
    $(
      ".side-by-side > .quire-entry__image-wrap > .quire-entry__image"
    ).removeClass("menu_open");
    menu.setAttribute("aria-expanded", "false");
  } else {
    $(
      ".side-by-side > .quire-entry__image-wrap > .quire-entry__image"
    ).addClass("menu_open");
    menu.setAttribute("aria-expanded", "true");
  }
};

/**
 * activeMenuPage
 * @description This function is called on pageSetup to go through the navigation
 * (#nav in partials/menu.html) and find all the anchor tags.  Then find the user's
 * current URL directory. Then it goes through the array of anchor tags and if the
 * current URL directory matches the nav anchor, it's the active link.
 */
function activeMenuPage() {
  let nav = document.getElementById("nav");
  let anchor = nav.getElementsByTagName("a");
  let current =
    window.location.protocol +
    "//" +
    window.location.host +
    window.location.pathname;
  for (var i = 0; i < anchor.length; i++) {
    if (anchor[i].href == current) {
      anchor[i].className = "active";
    }
  }
}

/**
 * toggleSearch
 * @description Show/hide the search UI by changing CSS classes and Aria status.
 * This function is bound to the global window object so it can be called from
 * templates without additinoal binding.
 */
window["toggleSearch"] = () => {
  let searchControls = document.getElementById("js-search");
  let searchInput = document.getElementById("js-search-input");
  let searchAriaStatus = searchControls.getAttribute("aria-expanded");
  searchControls.classList.toggle(
    "is-active",
    !searchControls.classList.contains("is-active")
  );
  if (searchAriaStatus === "true") {
    searchControls.setAttribute("aria-expanded", "false");
  } else {
    searchInput.focus();
    searchControls.setAttribute("aria-expanded", "true");
  }
};

/**
 * sliderSetup
 * @description Set up the simple image slider used on catalogue entry pages for
 * objects with multiple figure images. See also slideImage function below.
 */
async function sliderSetup() {
  toggleFullscreen(
    mapArr,
    document.getElementById("toggleFullscreen"),
    document.getElementById("quire-entry__image")
  );

  let slider = $(".quire-entry__image__group-container");
  slider.each(function() {
    let sliderImages = $(this).find("figure");
    sliderImages.each((i, v) => {
      if (sliderImages.length > 1) {
        $(v)
          .find(".quire-image-counter-download-container")
          .append(
            `<div class="quire-counter-container"><span class="counter">${i +
              1} of ${sliderImages.length}</span></div>`
          );
      }
    });
    let firstImage = $(sliderImages.first());
    let lastImage = $(sliderImages.last());
    sliderImages.addClass("visually-hidden");
    firstImage.addClass("current-image first-image");
    firstImage.removeClass("visually-hidden");
    firstImage.css("display", "flex");
    lastImage.addClass("last-image");
  });
  const images = [...document.querySelectorAll(".quire-deepzoom-entry")];
  const imageSrcs = images.filter(v => {
      return v.getAttribute("src") !== null ? v : "";
    })
    .map(v => {
      return v.getAttribute("src");
    });
  await preloadImages(imageSrcs);
  mapSetup(".quire-map-entry");
  deepZoomSetup(".quire-deepzoom-entry", mapArr);
}

/**
 * search
 * @description makes a search query using Lunr
 */
window["search"] = () => {
  let searchInput = document.getElementById("js-search-input");
  let searchQuery = searchInput["value"];
  let searchInstance = window["QUIRE_SEARCH"];
  let resultsContainer = document.getElementById("js-search-results-list");
  let resultsTemplate = document.getElementById("js-search-results-template");
  if (searchQuery.length >= 3) {
    let searchResults = searchInstance.search(searchQuery);
    displayResults(searchResults);
  }

  function clearResults() {
    resultsContainer.innerText = "";
  }

  function displayResults(results) {
    clearResults();
    results.forEach(result => {
      let clone = document.importNode(resultsTemplate.content, true);
      let item = clone.querySelector(".js-search-results-item");
      let title = clone.querySelector(".js-search-results-item-title");
      let type = clone.querySelector(".js-search-results-item-type");
      let length = clone.querySelector(".js-search-results-item-length");
      item.href = result.url;
      title.textContent = result.title;
      type.textContent = result.type;
      length.textContent = result.length;
      resultsContainer.appendChild(clone);
    });
  }
};

/**
 * scrollToHash
 * @description Scroll the #main area after each smoothState reload.
 * If a hash id is present, scroll to the location of that element,
 * taking into account the height of the navbar.
 */
function scrollToHash() {
  // Select all links with hashes
  $('a[href*="#"]')
    // Remove links that don't actually link to anything
    .not('[href="#"]')
    .not('[href="#0"]')
    .not('.popup')
    .click(function(event) {
      // only override default link behavior if it points to the same page
      if (this.pathname.includes(window.location.pathname)) {
        // prevent default scrolling behavior
        event.preventDefault();
        // ensure the hash is manually set after preventing default
        window.location.hash = this.hash;
      }
      // save current hash, prefixing all ':' and '.' with '\\' to make them query-selectable
      var hash = this.hash.replace(":", "\\:");
      hash = hash.replace(".", "\\.");
      // Figure out element to scroll to
      var target = $(hash);
      target = target.length ? target : $("[name=" + this.hash.slice(1) + "]");
      // Does a scroll target exist?
      if (target.length) {
        $("html, body").animate(
          {
            scrollTop: target.offset().top - $(".quire-navbar").height() - 7
          },
          1,
          function() {
            // Callback after animation
            // Must change focus!
            var $target = $(target);
            $target.focus();
            if ($target.is(":focus")) {
              // Checking if the target was focused
              return false;
            } else {
              $target.attr("tabindex", "-1"); // Adding tabindex for elements not focusable
              $target.focus(); // Set focus again
            }
          }
        );
      }
    });
}

function scrollToHashOnLoad() {
  if (window.location.hash) {
    var hash = window.location.hash;
    hash = hash.replace(":", "\\:");
    hash = hash.replace(".", "\\.");
    $("html, body").animate(
      {
        scrollTop: $(hash).offset().top - $(".quire-navbar").height() - 7
      },
      75,
      "swing"
    );
  }
}

/**
 * globalSetup
 * @description Initial setup on first page load.
 */
function globalSetup() {
  let container = document.getElementById("container");
  container.classList.remove("no-js");
  var classNames = [];
  if (navigator.userAgent.match(/(iPad|iPhone|iPod)/i))
    classNames.push("device-ios");

  if (navigator.userAgent.match(/android/i)) classNames.push("device-android");

  if (classNames.length) classNames.push("on-device");

  loadSearchData();
  scrollToHash();
}

/**
 * loadSearchData
 * @description Load full-text index data from the specified URL
 * and pass it to the search module.
 */
function loadSearchData() {
  // Grab search data
  let dataURL = $("#js-search").data("search-index");
  $.get(dataURL, {
    cache: true
  }).done(data => {
    data = typeof data === "string" ? JSON.parse(data) : data;
    window["QUIRE_SEARCH"] = new Search(data);
  });
}

/**
 * navigation
 * @description Turn on ability to use arrow keys
 * to get next adn previous pages
 */
let navigation;

function navigationSetup() {
  if (!navigation) {
    navigation = new Navigation();
  }
}

/**
 * @description
 * Set up modal for media
 */
function popupSetup(figureModal) {
  toggleFullscreen(
    mapArr,
    document.getElementById("toggleFullscreen"),
    document.querySelector(".mfp-wrap")
  );
  if (figureModal) {
    Popup(".q-figure__wrapper", mapArr);
  } else {
    mapSetup(".quire-map");
    deepZoomSetup(".quire-deepzoom", mapArr);
  }
}

/**
 * @description
 * Render Map if Popup @false
 */
function mapSetup(ele) {
  return [...document.querySelectorAll(ele)].forEach(v => {
    let id = v.getAttribute("id");
    new Map(id);
  });
}

/**
 * @description
 * Render deepzoom or iiif if Popup @false
 */
function deepZoomSetup(ele, mapArr) {
  return [...document.querySelectorAll(ele)].forEach(v => {
    let id = v.getAttribute("id");
    new DeepZoom(id, mapArr);
  });
}

/**
 * @description
 * Adding GoogleChromeLabs quicklinks https://github.com/GoogleChromeLabs/quicklink
 * For faster subsequent page-loads by prefetching in-viewport links during idle time
 */
function quickLinksSetup() {
  let links = [...document.getElementsByTagName("a")];
  links = links.filter(a => {
    return a.hostname === window.location.hostname;
  });
  quicklink({
    urls: links,
    timeout: 4000,
    ignores: [
      /tel:/g,
      /mailto:/g,
      /#(.+)/,
      uri => uri.includes("tel:"),
      uri => uri.includes("mailto:"),
      uri => uri.includes("#"),
      uri => uri.includes(".zip"),
      uri => uri.includes(".epub"),
      uri => uri.includes(".pdf"),
      uri => uri.includes(".mobi")
    ]
  });
}

/**
 * Applies MLA format to date
 * 
 * @param  {Date}   date   javascript date object
 * @return {String}        MLA formatted date
 */
function mlaDate(date) {
  const options = {
    month: "long"
  };
  const monthNum = date.getMonth();
  let month;
  if ([4, 5, 6].includes(monthNum)) {
    let dateString = date.toLocaleDateString("en-US", options);
    month = dateString.replace(/[^A-Za-z]+/, '');
  } else {
    month = (month === 8) ? "Sept" : date.toLocaleDateString("en-US", options).slice(0, 3);
    month += '.';
  }
  const day = date.getDate();
  const year = date.getFullYear();
  return [day, month, year].join(' ');
}

/**
 * @description
 * Set the date for the cite this partial
 * https://github.com/gettypubs/quire/issues/153
 * Quire books include a "Cite this Page" feature with page-level citations formatted in both Chicago and MLA style.
 * For MLA, the citations need to include a date the page was accessed by the reader.
 *
 */
function setDate() {
  const $date = $(".cite-current-date");
  const formattedDate = mlaDate(new Date());
  $date.empty();
  $date.text(formattedDate);
}

/**
 * slideImage
 * @description Slide to previous or next catalogue object image in a loop.
 * Supports any number of figures per object, and any number of objects
 * per page. Also pass in the maps array to invalidate size after transition.
 * @param {string} direction must be an integer
 * @param {object} event must be an object
 * @param {array} mapArr must be an array
 */
function slideImage(direction, event, mapArr) {
  event.stopPropagation();
  let deepzoomCont = $(".leaflet-image-layer");
  deepzoomCont.hide();
  let slider = $(".quire-entry__image__group-container");
  let firstImage = slider.children(".first-image");
  let lastImage = slider.children(".last-image");
  let currentImage = slider.children(".current-image");
  let nextImage = currentImage.next("figure");
  let prevImage = currentImage.prev("figure");
  stopVideo(document.querySelector(".current-image"));
  currentImage.hide();
  currentImage.removeClass("current-image");
  if (direction == "next") {
    if (currentImage.hasClass("last-image")) {
      firstImage.addClass("current-image");
      firstImage.css("display", "flex");
      firstImage.removeClass("visually-hidden");
    } else {
      nextImage.addClass("current-image");
      nextImage.css("display", "flex");
      nextImage.removeClass("visually-hidden");
    }
  } else if (direction == "prev") {
    if (currentImage.hasClass("first-image")) {
      lastImage.addClass("current-image");
      lastImage.css("display", "flex");
      lastImage.removeClass("visually-hidden");
    } else {
      prevImage.addClass("current-image");
      prevImage.css("display", "flex");
      prevImage.removeClass("visually-hidden");
    }
  }

  mapArr.forEach(v => {
    validateSize(v)
      .then(() => {
        deepzoomCont.fadeIn({
          duration: "fast"
        });
      })
      .catch(err => console.log(err));
  });
}

/**
 * validateSize
 * @description
 * invalidateSize map as a promise
 * @param {object} map must be an object
 */
function validateSize(map) {
  return new Promise((resolve, reject) => {
    if (!map) reject(new Error("No map!"));
    setTimeout(() => {
      resolve(map.invalidateSize());
    }, 250);
  });
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
function setPositionInContainer(el, container) {
  const margin = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--gap'));
  const elRect = el.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();

  const leftDiff = containerRect.left - elRect.left;
  const rightDiff = elRect.right - containerRect.right;
  const halfElWidth = elRect.width/2;
  // x
  if (rightDiff > 0) {
    el.style.transform = `translateX(-${halfElWidth+rightDiff+margin}px)`;
  } else if (leftDiff > 0) {
    el.style.transform = `translateX(-${halfElWidth-leftDiff-margin}px)`;
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
function toggleCite() {
  let expandables = document.querySelectorAll(".expandable [aria-expanded]");
  for (let i = 0; i < expandables.length; i++) {
    expandables[i].addEventListener("click", event => {
      // Allow these links to bubble up
      event.stopPropagation();
      let expanded = event.target.getAttribute("aria-expanded");
      if (expanded === "false") {
        event.target.setAttribute("aria-expanded", "true");
      } else {
        event.target.setAttribute("aria-expanded", "false");
      }
      let content = event.target.parentNode.querySelector(
        ".quire-citation__content"
      );
      if (content) {
        content.getAttribute("hidden");
        if (typeof content.getAttribute("hidden") === "string") {
          content.removeAttribute("hidden");
        } else {
          content.setAttribute("hidden", "hidden");
        }
        setPositionInContainer(content, document.documentElement);
      }
    });
  }
  document.addEventListener("click", event => {
    let content = event.target.parentNode;
    if (!content) return;
    if (
      content.classList.contains("quire-citation") ||
      content.classList.contains("quire-citation__content")
    ) {
      // do nothing
    } else {
      // find all Buttons/Cites
      let citeButtons = document.querySelectorAll(".quire-citation__button");
      let citesContents = document.querySelectorAll(".quire-citation__content");
      // hide all buttons
      if (!citesContents) return;
      for (let i = 0; i < citesContents.length; i++) {
        if (!citeButtons[i]) return;
        citeButtons[i].setAttribute("aria-expanded", "false");
        citesContents[i].setAttribute("hidden", "hidden");
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
  setDate();
  quickLinksSetup();
  activeMenuPage();
  sliderSetup();
  navigationSetup();
  popupSetup(figureModal);
  toggleCite();
  // smoothScroll();

  // Wire up event listeners here, so we can pass in the maps array
  const prev = document.getElementById("prev-image");
  const next = document.getElementById("next-image");
  if (prev)
    prev.addEventListener("click", e => slideImage("prev", e, mapArr), false);
  if (next)
    next.addEventListener("click", e => slideImage("next", e, mapArr), false);
}

/**
 * pageTeardown
 * @description This function is called before each smoothState reload.
 * Remove any event listeners here.
 */
/*
function pageTeardown() {
  navigationTeardown();
}
*/

// Start
// -----------------------------------------------------------------------------
//
// Run immediately
globalSetup();

// Run when document is ready
$(window).ready(() => {
  pageSetup();
  scrollToHashOnLoad();
});
