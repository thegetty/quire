import SmoothScroll from "smooth-scroll";
import fullscreen from "./fullscreen";

/**
 * @fileOverview
 * @name helper.js
 * @description This file contains functions that are used to aid core concepts in other files.
 * Also some of these functions are more utility in nature.
 */

/**
 * Prevent and store scroll for expanded menu
 * @description When the show/hide for nav is triggered we want to
 * lock the position of the users state in scroll and also prevent
 * the nav from going back to 0,0 in fixed state. These functions prevent that.
 */
export const preventDefault = e => {
  e = e || window.event;
  if (e.preventDefault) e.preventDefault();
  e.returnValue = false;
};

const preventDefaultForScrollKeys = e => {
  /*
    left: 37, 
    up: 38, 
    right: 39, 
    down: 40, 
    spacebar: 32, 
    pageup: 33, 
    pagedown: 34, 
    end: 35, 
    home: 36
    */
  let keys = {
    37: 1,
    38: 1,
    39: 1,
    40: 1
  };
  if (keys[e.keyCode]) {
    preventDefault(e);
    return false;
  }
};

/**
 * function to trigger and use smooth scrolling, docs: https://www.npmjs.com/package/smooth-scroll
 * scroll behavior specifications:
 * - https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView
 * - https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollTo
 */
export const smoothScroll = e => {
  return new SmoothScroll('a[href*="#"]', {
    // Selectors
    ignore: ".quire-navbar, .quire-figure a", // Selector for links to ignore (must be a valid CSS selector)
    header: ".quire-navbar", // Selector for fixed headers (must be a valid CSS selector)
    topOnEmtyHash: true, // Scroll to the top of the page for links with href="#"
    // Speed & Duration
    speed: 500, // Integer. Amount of time in milliseconds it should take to scroll 1000px
    speedAsDuration: false, // If true, use speed as the total duration of the scroll animation
    durationMax: null, // Integer. The maximum amount of time the scroll animation should take
    durationMin: null, // Integer. The minimum amount of time the scroll animation should take
    clip: true, // If true, adjust scroll distance to prevent abrupt stops near the bottom of the page
    offset: 50, // Integer or Function returning an integer. How far to offset the scrolling anchor location in pixels
    // Easing
    easing: "easeInOutCubic",
    // History
    updateURL: true, // Update the URL on scroll
    popstate: true, // Animate scrolling with the forward/backward browser buttons (requires updateURL to be true)
    emitEvents: true // Emit custom events
  });
};

/**
 * Disable scroll on element
 * @param  {Element} element The element that will be disabled
 */
export const disableScroll = element => {
  document.querySelector("html").style.overflow = "hidden";
  if (element.addEventListener)
    // older FF
    element.addEventListener("DOMMouseScroll", preventDefault, false);
  element.onwheel = preventDefault; // modern standard
  element.onmousewheel = element.onmousewheel = preventDefault; // older browsers, IE
  element.ontouchmove = preventDefault; // mobile
  element.onkeydown = preventDefaultForScrollKeys;
};

/**
 * Enable scroll on element
 * @param  {Element} element The element that will be enabled
 */
export const enableScroll = element => {
  document.querySelector("html").style.overflow = "";
  if (element.removeEventListener)
    element.removeEventListener("DOMMouseScroll", preventDefault, false);
  element.onmousewheel = element.onmousewheel = null;
  element.onwheel = null;
  element.ontouchmove = null;
  element.onkeydown = null;
};

/**
 * Preload Images
 * @param  {Array} srcs array of images
 * @return {Promise}
 */
export const preloadImages = (srcs) => {
  return new Promise((resolve) => {
    if (!srcs.length) resolve();
    for (let i = srcs.length; i >= 0; --i) {
      const img = new Image();
      img.onload = () => {
        if (i <= 0) resolve();
      };
      img.src = srcs[i];
    }
  });
};

/**
 * Stop an iframe or HTML5 <video> from playing
 * @param  {Element} element The element that contains the video
 */
export const stopVideo = element => {
  let iframe = element.querySelector("iframe");
  let video = element.querySelector("video");
  if (iframe) {
    let iframeSrc = iframe.src;
    iframe.src = iframeSrc;
  }
  if (video) {
    video.pause();
  }
};

/**
 * @description toggle fullscreen for entry leaflet images
 * Also pass in the maps array to invalidate size after transition.
 * @param {array} mapArr must be an integer
 * @param {element} fullscreenButton must be an element
 * @param {element} elementToFullscreen must be an element
 */
export const toggleFullscreen = (
  mapArr,
  fullscreenButton,
  elementToFullscreen
) => {
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
        let modal = document.querySelector(".mfp-content");
        if (modal) {
          if (
            map._container ===
            modal.getElementsByTagName("figure")[0].children[0]
          ) {
            resolve(map.invalidateSize());
          }
        } else {
          resolve(map.invalidateSize());
        }
      }, 250);
    });
  }

  const el = elementToFullscreen;
  let toggleFullscreen = fullscreenButton;
  if (toggleFullscreen) {
    toggleFullscreen.addEventListener("click", event => {
      event.stopPropagation();
      event.preventDefault();
      if (fullscreen.enabled && el) {
        el.classList.toggle("fullscreen", !el.classList.contains("fullscreen"));
        // @ts-ignore
        event.target.classList.toggle(
          "fullscreen",
          // @ts-ignore
          !event.target.classList.contains("fullscreen")
        );
        fullscreen.toggle(el);
        mapArr.forEach(v => {
          validateSize(v).catch(err => console.log(err));
        });
      }
      return false;
    });
  }
};
