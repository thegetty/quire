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
import "../../styles/application.scss";
import "leaflet/dist/leaflet.css";
import quicklink from "quicklink";

// JS Libraries (add them to package.json with `npm install [library]`)
import "babel-polyfill";
import "velocity-animate";
import "./soundcloud-api";

// Modules (feel free to define your own and import here)
import { preloadImages, stopVideo, toggleFullscreen } from "./helper";
import DeepZoom from "./deepzoom";
import Map from "./map";
import Navigation from "./navigation";
import Search from "../../../../_plugins/search/search.js";

// array of leaflet instances
const mapArr = [];

/**
 * toggleMenu
 * @description Show/hide the menu UI by changing CSS classes and Aria status.
 * This function is bound to the global window object so it can be called from
 * templates without additional binding.
 */
window["toggleMenu"] = () => {
  const menu = document.getElementById("site-menu");
  const catalogEntryImage = document.querySelector(
    ".side-by-side > .quire-entry__image-wrap > .quire-entry__image"
  );
  const menuAriaStatus = menu.getAttribute("aria-expanded");
  menu.classList.toggle("is-expanded", !menu.classList.contains("is-expanded"));
  if (menuAriaStatus === "true") {
    catalogEntryImage && catalogEntryImage.classList.remove("menu_open")
    menu.setAttribute("aria-expanded", "false");
  } else {
    catalogEntryImage && catalogEntryImage.classList.add("menu_open")
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
 * Paul Frazee's easy templating function
 * https://twitter.com/pfrazee/status/1223249561063477250?s=20
 */
function createHtml(tag, attributes, ...children) {
  const element = document.createElement(tag);
  for (let attribute in attributes) {
    if (attribute === 'className') element.className = attributes[attribute];
    else element.setAttribute(attribute, attributes[attribute]);
  }
  for (let child of children) element.append(child);
  return element;
}

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

  const slider = document.querySelector(".quire-entry__image__group-container");
  if (slider) {
    const slides = slider.querySelectorAll("figure");
    const slidesCount = slides.length;
    slides.forEach((slide, index) => {
      if (slidesCount > 1) {
        const counterDownloadContainer = slide.querySelector(".quire-image-counter-download-container");
        counterDownloadContainer && counterDownloadContainer.append(
          createHtml(
            "div",
            { className: "quire-counter-container" },
            createHtml(
              "span",
              { className: "counter" },
              `${index + 1} of ${slidesCount}`
            )
          )
        );
        if (index > 0) {
          slide.classList.add("visually-hidden");
          // slide.style.display = "none";
        }
      }
    });
    const firstImage = slides[0];
    firstImage.classList.add("current-image", "first-image");
    const lastImage = slides[slidesCount - 1];
    lastImage.classList.add("last-image");
  }
  const images = [...document.querySelectorAll(".quire-deepzoom-entry")];
  const imageSrcs = images
    .filter((image) => {
      return image.getAttribute("src");
    })
    .map((image) => {
      return image.getAttribute("src");
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
 * scrollWindow
 * @description scroll viewport to a certain vertical offset, minus the height of the quire navbar
 * TODO add animation duration and style of easing function previously provided by jQuery `.animate()`
 */
function scrollWindow(verticalOffset, animationDuration = null, animationStyle = null) {
  const navBar = document.querySelector(".quire-navbar");
  const extraSpace = 7
  const scrollDistance = navBar
    ? verticalOffset - navBar.clientHeight - extraSpace
    : verticalOffset - extraSpace
  // redundancy here to ensure all possible document properties with `scrollTop` are being set for cross-browser compatibility
  [
    document.documentElement,
    document.body.parentNode,
    document.body
  ].forEach((documentPropertyWithScrollTop) => {
    documentPropertyWithScrollTop.scrollTop = scrollDistance;
  });
}

/**
 * scrollToHash
 * @description Scroll the #main area after each smoothState reload.
 * If a hash id is present, scroll to the location of that element,
 * taking into account the height of the navbar.
 */
function scrollToHash(hash) {
  // prefix all ':' and '.' in hash with '\\' to make them query-selectable
  hash = hash.replace(":", "\\:");
  hash = hash.replace(".", "\\.");
  // Figure out element to scroll to
  let target = document.querySelector(hash);
  target = target ? target : document.querySelector(`[name="${link.hash.slice(1)}"]`);
  // Does a scroll target exist?
  if (target) {
    const verticalOffset = target.getBoundingClientRect().top + window.scrollY;
    scrollWindow(verticalOffset);
    // handle focus after scrolling
    setTimeout(() => {
      target.focus();
    });
  }
}

function onHashLinkClick(event) {
  // only override default link behavior if it points to the same page
  const hash = event.target.hash;
  if (event.target.pathname.includes(window.location.pathname)) {
    // prevent default scrolling behavior
    event.preventDefault();
    // ensure the hash is manually set after preventing default
    window.location.hash = hash;

  }
  scrollToHash(hash);
}

function setupCustomScrollToHash() {
  const invalidHashLinkSelectors = [
    '[href="#"]',
    '[href="#0"]',
    '.popup'
  ];
  const validHashLinkSelector =
    'a[href*="#"]' +
    invalidHashLinkSelectors
      .map((selector) => `:not(${selector})`)
      .join('');
  // Select all links with hashes, ignoring links that don't point anywhere
  const validHashLinks = document.querySelectorAll(validHashLinkSelector);
  validHashLinks.forEach((link) => {
    link.addEventListener('click', onHashLinkClick);
  });
}

function scrollToHashOnLoad() {
  if (window.location.hash) {
    setTimeout(() => {
      // TODO see scrollToHash definition. Add animation duration and easing function style previously provided as args to jQuery `.animate()`
      scrollToHash(window.location.hash, 75, 'swing');
    });
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
  setupCustomScrollToHash();
}

/**
 * loadSearchData
 * @description Load full-text index data from the specified URL
 * and pass it to the search module.
 */
function loadSearchData() {
  // Grab search data
  const dataURL = document.getElementById('js-search').dataset.searchIndex;
  if (!dataURL) {
    console.warn('Search data url is undefined');
    return;
  }
  fetch(dataURL).then(async (response) => {
    const { ok, statusText, url } = response
    if (!ok) {
      console.warn(`Search data ${statusText.toLowerCase()} at ${url}`)
    }
    const data = await response.json();
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
  if (!figureModal) {
    mapSetup(".quire-map");
    deepZoomSetup(".quire-deepzoom", mapArr);
  }
}

/**
 * @description
 * Render Map if figureModal @false
 */
function mapSetup(ele) {
  return [...document.querySelectorAll(ele)].forEach(v => {
    let id = v.getAttribute("id");
    new Map(id);
  });
}

/**
 * @description
 * Render deepzoom or iiif if figureModal @false
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
  const dateSpan = document.querySelector(".cite-current-date");
  const formattedDate = mlaDate(new Date());
  if (dateSpan) {
    dateSpan.innerHTML = formattedDate;
  }
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

  const hideElement = (element) => {
    element.style.display = "none";
  };

  const showElement = (element, displayValue) => {
    element.style.display = displayValue;
  };

  const slider = document.querySelector(".quire-entry__image__group-container");
  const leafletImages = Array.from(document.querySelector(".leaflet-image-layer"));
  const slides = Array.from(slider.querySelectorAll("figure"));
  const currentSlide = slider.querySelector(".current-image");
  const currentSlideIndex = slides.findIndex((item) => item.classList.contains("current-image"));
  const nextSlide = slides.slice((currentSlideIndex + 1) % slides.length)[0];
  const prevSlide = slides.slice((currentSlideIndex - 1) % slides.length)[0];

  const showSlide = (slide) => {
    // TODO refactor slideshow navigation logic to not require a complex combination of setting/unsetting class names and inline styles
    // the `visually-hidden` class is added to keep slides in the DOM but not visible
    // toggling `display: none`/`display: flex` on <figure>s (slide containers) replaced previous slideshow display logic depending on <jQueryElement>.hide()
    // toggling `display: none`/`display: block` and `class="current-image"` on leaflet image layer `<img>` tags triggers CSS `fadeIn` animation, replacing animation delays previously set with a `setTimeout`
    leafletImages.forEach((image) => {
      hideElement(image);
    });
    stopVideo(currentSlide);
    hideElement(currentSlide);
    currentSlide.classList.remove("current-image");
    slides.forEach((item) => {
      item.classList.add("visually-hidden");
    });
    slide.classList.add("current-image");
    showElement(slide, "flex")
    slide.classList.remove("visually-hidden")
    mapArr.forEach((map) => {
      validateSize(map)
        .then(() => {
          leafletImages.forEach((image) => {
            showElement(image, "block")
          });
        })
        .catch((error) => console.error(error));
    });
  };

  switch(direction) {
    case "next":
      showSlide(nextSlide);
      break;
    case "prev":
      showSlide(prevSlide);
      break;
    default:
      break;
  }
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
    resolve(map.invalidateSize());
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
 * Set up page UI elements here.
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

// Run when DOM content has loaded
window.addEventListener('DOMContentLoaded', () => {
  pageSetup();
  scrollToHashOnLoad();
})
