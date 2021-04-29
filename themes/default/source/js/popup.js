// @ts-check

import $ from "jquery";
import DeepZoom from "./deepzoom.js";
import Map from "./map.js";
import { toggleFullscreen } from "./helper";
import "magnific-popup/dist/magnific-popup.css";
// eslint-disable-next-line no-undef
require("magnific-popup");

export default function(gallerySelector, mapArr) {
  /** set var */
  const fullscreenButton = `
  <div 
  class="leaflet-control-fullscreen leaflet-bar leaflet-control remove-from-epub"
  >
    <a
    id="toggleFullscreen" 
    class="leaflet-control-fullscreen-button leaflet-bar-part" 
    href="#" 
    title="View Fullscreen" 
    style="outline: none;">
    </a>
  </div>
  `;

  /**
  * Popup Leaflet instances
  */
  let deepzoom;
  let map;

  /**
   * @description Find all instances of soundcloud players
   * and stop them
   */
  const findSoundCloudWidgetsAndStopThem = () => {
    const items = [...document.querySelectorAll(`.quire-figure`)];
    items
      .filter(item => {
        return [...item.children][0].src !== undefined &&
          [...item.children][0].src.indexOf(`soundcloud`)
          ? [...item.children][0]
          : ``;
      })
      .map(item => {
        let iframeElementID = [...item.children][0].id;
        let widget = SC.Widget(iframeElementID);
        return widget;
      })
      .forEach(item => {
        return item.pause();
      });
  };

  /**
   * @param {*} self
   * @description update caption in modal viewer if
   * needed and clear before update
   */
  const captionUpdate = self => {
    const setCaption = self => {
      if (self) {
        $(".mfp-title").hide();
        const figureWrapper = $(self.currItem.el).closest('.q-figure__wrapper');
        const captionParts = ['label-text', 'caption-content', 'credit'];
        const captionWrapper =$(`<span class="caption"></span>`);
        captionParts.forEach((item) => {
          const content = $(figureWrapper).find(`.quire-figure__${item}`).prop('outerHTML');
          content ? captionWrapper.append(content) : null;
        })
        if (captionWrapper.html()) {
          self.captionCont = `
            <div class="quire-caption-container">${captionWrapper.prop('outerHTML')}</div>`;
          $(".mfp-wrap").prepend(self.captionCont);
        }
      } else {
        if ($(".quire-caption-container")) {
          $(".quire-caption-container").remove();
        }
      }
    };
    setCaption();
    switch (self.currItem.type) {
      case "inline":
        setCaption(self);
        break;
      case "iframe":
        setCaption(self);
        break;
      case "image":
        setCaption(self);
        break;
      default:
        setCaption();
        break;
    }
  };

  /**
   * If map or deepzoom leaflet instances are defined, removes them.
   * There should only be one defined at a time
   * @todo The Map and Deepzoom classes should be refactored, at least to have the same signature
   */
  const tearDownMap = () => {
    if (deepzoom) {
      deepzoom.map.remove();
      return;
    }
    if (map) {
      map.remove();
      return;
    }
  };

  // add link to first slide when view as slides is present
  const updateViewSlidesLink = () => {
    let items = [...document.querySelectorAll(`.quire-figure--group`)];
    items
      .filter(item => {
        return item;
      })
      .map(item => {
        return [$(item).find(".viewSlides"), $(item).find(`a:first`)];
      })
      .forEach(item => {
        $(item[0]).on("click", e => {
          e.preventDefault();
          $(item[1]).click();
        });
      });
  };
  updateViewSlidesLink();

  /**
   *
   * @description e magnificPopup object
   *
   */
  $(gallerySelector).magnificPopup({
    delegate: "a.popup",
    type: "image",
    closeBtnInside: false,
    closeOnBgClick: false,
    fixedContentPos: false,
    fixedBgPos: "auto",
    overflowY: "hidden",
    image: {
      titleSrc: function(item) {
        return item.el.find(".figure-caption-container").html();
      }
    },
    gallery: {
      enabled: true,
      preload: [0, 2], // read about this option in next Lazy-loading section
      navigateByImgClick: true,
      arrowMarkup:
        '<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"><span class="mfp-prevent-close arrow-img-%dir%"></span></button>', // markup of an arrow button
      tPrev: "Previous (Left arrow key)", // title for left button
      tNext: "Next (Right arrow key)", // title for right button
      tCounter: "",
      closeMarkup:
        '<button title="Close (Esc)" type="button" class="mfp-close"></button>'
    },
    callbacks: {
      beforeOpen: function() {
        findSoundCloudWidgetsAndStopThem();
        $("body").addClass("android-fixed");
        this.current = this.index + 1;
        this.total = this.items.length - 1;
        this.counter = `<span class="counter">${this.current} of ${this.items.length}</span>`;
        this.cont = `<div class="quire-counter-container">${this.counter}</div>`;
      },
      elementParse: function(item) {
        if (item.el[0].getAttribute("data-type") === "video") {
          // eslint-disable-next-line no-unused-expressions
          (item.type = "iframe"),
            (item.iframe = {
              patterns: {
                youtube: {
                  index: "youtube.com/", // String that detects type of video (in this case YouTube). Simply via url.indexOf(index).
                  id: "v=", // String that splits URL in a two parts, second part should be %id%
                  // Or null - full URL will be returned
                  // Or a function that should return %id%, for example:
                  // id: function(url) { return 'parsed id'; }
                  src: "//www.youtube.com/embed/%id%?autoplay=1" // URL that will be set as a source for iframe.
                },
                vimeo: {
                  index: "vimeo.com/",
                  id: "/",
                  src: "//player.vimeo.com/video/%id%?autoplay=1"
                },
                gmaps: {
                  index: "//maps.google.",
                  src: "%id%&output=embed"
                }
              }
            });
        } else if (item.el[0].getAttribute("data-type") === "inline") {
          item.type = "inline";
        } else {
          // eslint-disable-next-line no-unused-expressions
          (item.type = "image"),
            (item.tLoading = "Loading image #%curr%..."),
            (item.mainClass = "mfp-img-mobile"),
            (item.image = {
              tError:
                '<a href="%url%">The image #%curr%</a> could not be loaded.'
            });
        }
      },
      change: function() {
        tearDownMap();
        this.current = this.index + 1;
        if (document.querySelector(".counter")) {
          document.querySelector(
            ".counter"
          ).innerHTML = `${this.current} of ${this.items.length}`;
        }
        captionUpdate(this);
        let id = this.content.children()[0].id;
        let waitForDOMUpdate = 0;
        if (id !== "" || id !== undefined) {
          if (id.indexOf("map") !== -1) {
            setTimeout(() => {
              map = new Map(id);
            }, waitForDOMUpdate);
          }
          if (id.indexOf("deepzoom") !== -1) {
            setTimeout(() => {
              let url = $(`#${id}`).attr("src");
              let image = new Image();
              image.src = url;
              image.onload = function() {
                deepzoom = new DeepZoom(id, mapArr);
              };
            }, waitForDOMUpdate);
          }
          if (id.indexOf("iiif") !== -1) {
            setTimeout(() => {
              deepzoom = new DeepZoom(id, mapArr);
            }, waitForDOMUpdate);
          }
        }
        $(".mfp-content").prepend(fullscreenButton);
      },
      resize: function() {
        // console.log('Popup resized ' + $(window).innerHeight());
        // resize event triggers only when height is changed or layout forced
      },
      open: function() {
        // console.log('Popup open');
        captionUpdate(this);
        $(".mfp-wrap").prepend(this.cont);
        $(".mfp-content").prepend(fullscreenButton);
        toggleFullscreen(
          mapArr,
          document.getElementById("toggleFullscreen"),
          document.querySelector(".mfp-wrap")
        );
      },
      beforeClose: function() {
        // Callback available since v0.9.0
        // console.log('Popup close has been initiated');
        $("body").removeClass("android-fixed");
        $(".quire-counter-container, .quire-caption-container").remove();
      },
      close: function() {
        // console.log('Popup removal initiated (after removalDelay timer finished)');
      },
      afterClose: function() {
        // console.log('Popup is completely closed');
      },

      markupParse: function(template, values, item) {
        // Triggers each time when content of popup changes
        // console.log('Parsing:', template, values, item);
      },
      updateStatus: function(data) {
        // console.log('Status changed', data);
        // "data" is an object that has two properties:
        // "data.status" - current status type, can be "loading", "error", "ready"
        // "data.text" - text that will be displayed (e.g. "Loading...")
        // you may modify this properties to change current status or its text dynamically
      },
      imageLoadComplete: function() {
        // fires when image in current popup finished loading
        // avaiable since v0.9.0
        // console.log('Image loaded');
      },
      // Only for ajax popup type
      parseAjax: function(mfpResponse) {
        // mfpResponse.data is a "data" object from ajax "success" callback
        // for simple HTML file, it will be just String
        // You may modify it to change contents of the popup
        // For example, to show just #some-element:
        // mfpResponse.data = $(mfpResponse.data).find('#some-element');
        // mfpResponse.data must be a String or a DOM (jQuery) element
        // console.log('Ajax content loaded:', mfpResponse);
      },
      ajaxContentAdded: function() {
        // Ajax content is loaded and prepended to DOM
        // console.log(this.content);
      }
    }
  });
}
