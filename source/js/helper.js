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
export const preventDefault = (e) => {
    e = e || window.event;
    if (e.preventDefault)
        e.preventDefault();
    e.returnValue = false;
}

const preventDefaultForScrollKeys = (e) => {
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
}

/**
 * Disable scroll on element
 * @param  {Element} element The element that will be disabled 
 */
export const disableScroll = (element) => {
    document.querySelector('html').style.overflow = 'hidden'
    if (element.addEventListener) // older FF
        element.addEventListener('DOMMouseScroll', preventDefault, false);
    element.onwheel = preventDefault; // modern standard
    element.onmousewheel = element.onmousewheel = preventDefault; // older browsers, IE
    element.ontouchmove = preventDefault; // mobile
    element.onkeydown = preventDefaultForScrollKeys;
}

/**
 * Enable scroll on element
 * @param  {Element} element The element that will be enabled 
 */
export const enableScroll = (element) => {
    document.querySelector('html').style.overflow = ''
    if (element.removeEventListener)
        element.removeEventListener('DOMMouseScroll', preventDefault, false);
    element.onmousewheel = element.onmousewheel = null;
    element.onwheel = null;
    element.ontouchmove = null;
    element.onkeydown = null;
}

/**
 * Preload 
 * @param  {Array} srcs array of images
 */
export const preloadImages = (srcs, callback) => {
    let img;
    let remaining = srcs.length;
    for (let i = 0; i < srcs.length; i++) {
        img = new Image;
        img.onload = () => {
            --remaining;
            if (remaining <= 0) {
                callback();
            }
        };
        img.src = srcs[i];
    }
};

/**
 * Stop an iframe or HTML5 <video> from playing
 * @param  {Element} element The element that contains the video
 */
export const stopVideo = (element) => {
    let iframe = element.querySelector('iframe');
    let video = element.querySelector('video');
    if (iframe) {
        let iframeSrc = iframe.src;
        iframe.src = iframeSrc;
    }
    if (video) {
        video.pause();
    }
};