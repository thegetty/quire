const { html } = require('../../_lib/common-tags')

/**
 * This file contains inline SVG elements which can be referenced elsewhere in
 * the templates. This file can be included at the end of the <body> tag.
 */
module.exports = function(eleventyConfig) {
  return function(params) {
    return html`
      <svg style="display:none">
        <symbol id="left-arrow-icon" viewBox="0 0 18 32">
          <path d="M23.1,11.1L21,9l-9,9l9,9l2.1-2.1L16.2,18L23.1,11.1z"/>
        </symbol>
        <symbol id="right-arrow-icon" viewBox="0 0 18 32">
          <path d="M12.9,11.1L15,9l9,9l-9,9l-2.1-2.1l6.9-6.9L12.9,11.1z"/>
        </symbol>
        <symbol id="search-icon" viewBox="0 0 32 32">
          <path d="M18.6,16.4h-1.2L17,16c1.5-1.7,2.3-3.9,2.3-6.3C19.3,4.3,15,0,9.7,0S0,4.3,0,9.7s4.3,9.7,9.7,9.7c2.4,0,4.6-0.9,6.3-2.3
        l0.4,0.4v1.2l7.4,7.4l2.2-2.2L18.6,16.4z M9.7,16.4C6,16.4,3,13.4,3,9.7S6,3,9.7,3s6.7,3,6.7,6.7S13.4,16.4,9.7,16.4z"/>
        </symbol>
        <symbol id="nav-icon" viewBox="0 0 32 32">
          <path d="M0,6.7h24.9V3.1H0V6.7z M0,13.8h24.9v-3.6H0V13.8z M0,20.9h24.9v-3.6H0V20.9z M28.4,20.9H32v-3.6h-3.6V20.9z M28.4,3.1v3.6
        H32V3.1H28.4z M28.4,13.8H32v-3.6h-3.6V13.8z"/>
        </symbol>
        <symbol id="arrow-forward-icon" viewBox="0 0 32 32">
          <path d="M16,5.3l-1.9,1.9l7.4,7.5H5.3v2.7h16.2l-7.4,7.5l1.9,1.9L26.7,16L16,5.3z"/>
        </symbol>
        <symbol id="home-icon" viewBox="0 0 32 32">
          <path d="M11,18V6l-8.5,6L11,18z M11.5,12l8.5,6V6L11.5,12z"/>
        </symbol>
        <symbol id="start-icon" viewBox="0 0 32 32">
          <path d="M8,5v14l11-7L8,5z"/>
        </symbol>
        <symbol id="down-arrow-icon" viewBox="0 0 32 32">
          <path d="M16.6,8.6L12,13.2L7.4,8.6L6,10l6,6l6-6L16.6,8.6z"/>
        </symbol>
        <symbol id="link-icon" viewBox="0 0 20 20">
          <path d="M3.3,16.7c-1.4-1.4-1.4-3.7,0-5.1l3.3-3.3L5,6.7L1.7,10c-2.3,2.3-2.3,6,0,8.3s6,2.3,8.3,0l3.3-3.3l-1.6-1.6l-3.3,3.3
            C7,18.1,4.7,18.1,3.3,16.7z M7.5,14.1l6.6-6.6l-1.7-1.7l-6.6,6.6L7.5,14.1z M10,1.7L6.7,5l1.6,1.6l3.3-3.3c1.4-1.4,3.7-1.4,5.1,0
            s1.4,3.7,0,5.1l-3.3,3.3l1.6,1.6l3.3-3.3c2.3-2.3,2.3-6,0-8.3S12.3-0.6,10,1.7z"/>
        </symbol>
        <symbol id="close-icon" viewBox="0 0 48 48">
          <path d="M38 12.83L35.17 10 24 21.17 12.83 10 10 12.83 21.17 24 10 35.17 12.83 38 24 26.83 35.17 38 38 35.17 26.83 24z"/>
        </symbol>
        <symbol id="download-icon" viewBox="0 0 32 32">
          <path d="M28.4,16v12.4H3.6V16H0v12.4c0,2,1.6,3.6,3.6,3.6h24.9c2,0,3.6-1.6,3.6-3.6V16H28.4z M17.8,17.2l4.6-4.6l2.5,2.5L16,24
            l-8.9-8.9l2.5-2.5l4.6,4.6V0h3.6V17.2z"/>
        </symbol>
        <symbol id="plus-icon" viewBox="0 0 16 16">
          <path
            d="M26 0C11.664 0 0 11.663 0 26s11.664 26 26 26 26-11.663 26-26S40.336 0 26 0zm0 50C12.767 50 2 39.233 2 26S12.767 2 26 2s24 10.767 24 24-10.767 24-24 24z" />
          <path
            d="M38.5 25H27V14c0-.553-.448-1-1-1s-1 .447-1 1v11H13.5c-.552 0-1 .447-1 1s.448 1 1 1H25v12c0 .553.448 1 1 1s1-.447 1-1V27h11.5c.552 0 1-.447 1-1s-.448-1-1-1z" />
        </symbol>
        <symbol id="fullscreen-icon" viewBox="0 0 24 24">
          <path d="M0 0h24v24H0z" fill="none"/><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
        </symbol>
      </svg>
    `
  }
}
