import PhotoSwipe from 'photoswipe'
import PhotoSwipeUI_Default from 'photoswipe/dist/photoswipe-ui-default.js'
export default function photoswipe(index) {
  function searchUpTree(el, query) {
    while (el.parentNode) {
      el = el.parentNode;
      if (el.querySelector(query))
        return el.querySelector(query);
    }
    return null;
  }
  function findCaption(figure) {
    if (figure.querySelector("figCaption")) {
      return figure.querySelector("figCaption").textContent
    } else if (searchUpTree(figure, "figCaption")) {
      return searchUpTree(figure, "figCaption").textContent
    } else {
      return null
    }
  }
  function isHtmlElement(figure) {
    return figure.classList.contains('q-figure__table-wrapper')
  }
  var pswpElement = document.querySelectorAll(".pswp")[0];
  // build items array
  var slides = [];
  var figures = document.querySelectorAll('.q-figure__wrapper');
  var options = { index: index };
  // document query selector returns an HTMLCollection, not a true array
  // So we need to proxy a true Array object to get forEach
  [].forEach.call(figures, function (figure) {
    var slide = {};
    if (isHtmlElement(figure)) {
      slide.html = '<div class="q-figure__table-wrapper--pswp">' + figure.innerHTML + '</div>'
    } else {
      slide.src = figure.querySelector("img").src;
      slide.w = figure.querySelector("img").naturalWidth;
      slide.h = figure.querySelector("img").naturalHeight;
    }
    slide.title = findCaption(figure)
    slides.push(slide);
  });
  var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, slides, options);
  gallery.init();
}