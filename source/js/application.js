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
function sliderSetup() {
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
  let images = [...document.querySelectorAll(".quire-deepzoom-entry")]
    .filter(v => {
      return v.getAttribute("src") !== null ? v : "";
    })
    .map(v => {
      return v.getAttribute("src");
    });
  preloadImages(images, () => {
    mapSetup(".quire-map-entry");
    deepZoomSetup(".quire-deepzoom-entry", mapArr);
  });
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

  var body = document.getElementsByTagName("body")[0];

  if (classNames.length) classNames.push("on-device");
  // if (body) body.classList.add(...classNames);
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

/*
function navigationTeardown() {
  if (navigation) {
    navigation.teardown();
  }
  navigation = undefined;
}
*/

/**
 * scrollToHash
 * @description Scroll the #main area after each smoothState reload.
 * If a hash id is present, scroll to the location of that element,
 * taking into account the height of the navbar.
 */
function scrollToHash() {
  let $scroller = $("#main");
  let $navbar = $(".quire-navbar");
  let targetHash = window.location.hash;

  if (targetHash) {
    let targetHashEl = document.getElementById(targetHash.slice(1));
    let $targetHashEl = $(targetHashEl);

    if ($targetHashEl.length) {
      let newPosition = $targetHashEl.offset().top;
      if ($navbar.length) {
        newPosition -= $navbar.height();
      }
      $scroller.scrollTop(newPosition);
    }
  } else {
    $scroller.scrollTop(0);
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
 * @description
 * Set the date for the cite this partial
 * https://github.com/gettypubs/quire/issues/153
 * Quire books include a "Cite this Page" feature with page-level citations formatted in both Chicago and MLA style.
 * For MLA, the citations need to include a date the page was accessed by the reader.
 *
 */
function setDate() {
  let $date = $(".cite-current-date");
  let options = {
    year: "numeric",
    month: "short",
    day: "numeric"
  };
  let today = new Date();
  let formattedDate =
    today.toLocaleDateString("en-US", options).indexOf("May") !== -1
      ? today.toLocaleDateString("en-US", options)
      : [
          today.toLocaleDateString("en-US", options).slice(0, 3),
          ". ",
          today.toLocaleDateString("en-US", options).slice(4)
        ].join("");
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
    expandables[i].addEventListener("click", function() {
      var expanded = this.getAttribute("aria-expanded");
      if (expanded === "false") {
        this.setAttribute("aria-expanded", "true");
      } else {
        this.setAttribute("aria-expanded", "false");
      }
      var content = this.parentNode.querySelector("span");
      if (content) {
        content.getAttribute("hidden");
        if (typeof content.getAttribute("hidden") === "string") {
          content.removeAttribute("hidden");
        } else {
          content.setAttribute("hidden", "hidden");
        }
      }
    });
  }
  document.addEventListener("click", function(event) {
    let content = event.target.parentNode;
    if (
      content.classList.contains("quire-citation") ||
      content.classList.contains("quire-citation__content")
    ) {
      // do nothing
    } else {
      // find all Buttons/Cites
      let citeButtons = document.querySelectorAll(".quire-citation button");
      let citesContents = document.querySelectorAll(".quire-citation__content");
      // hide all buttons
      for (let i = 0; i < citesContents.length; i++) {
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
});
