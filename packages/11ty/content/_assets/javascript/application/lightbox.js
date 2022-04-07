import { createHtml, preloadImages, stopVideo, toggleFullscreen } from "./helper";

export default class Lightbox {
  static figures = document.querySelectorAll('.q-figure')
  static triggerSelector = 'a.popup, .open-lightbox';
  static lightboxClass = 'lightbox';
  static lightboxClassHidden = `${this.lightboxClass}--hidden`;

  constructor() {
    this.lightbox = this.createLightbox();
    this.currentTrigger = null;
    this.currentFigure = null;
    this.init();
  }

  createLightbox() {
    const { lightboxClass, lightboxClassHidden } = this.constructor;
    function caption() {
      return createHtml('div', { className: `${lightboxClass}__caption` });
    }
    function lightboxContent() {
      return createHtml('div', { className: `${lightboxClass}__content` });
    }
    function navigationButtons() {
      return createHtml('div', { className: `${lightboxClass}__navigation` });
    }
    function slideCounterAndCloseButton() {
      return createHtml('div', { className: `${lightboxClass}__slide-counter-container` });
    }
    function zoomControls() {
      return createHtml('div', { className: `${lightboxClass}__zoom-controls` });
    }
    return createHtml(
      'div',
      { className: `${lightboxClass} ${lightboxClassHidden}` },
      [
        lightboxContent(),
        zoomControls(),
        slideCounterAndCloseButton(),
        navigationButtons(),
        caption()
      ]
    );
  }

  close() {
    this.lightbox.classList.add(this.constructor.lightboxClassHidden);
    this.currentTrigger.focus();
  }

  init() {
    this.setupTriggers();
    this.renderLightbox();
  }

  open({ target, currentTarget }) {
    console.warn('CURRRENT TARGET', currentTarget);
    let trigger = target;
    let figure = target;
    console.warn('CLICK EVENT BEFORE PARENTS', typeof trigger, trigger, typeof figure, figure);
    while (!trigger.matches(this.constructor.triggerSelector)) {
      trigger = trigger.parentNode;
    }
    while (!figure.matches('figure')) {
      figure = figure.parentNode;
    }
    console.warn('CLICK EVENT AFTER PARENTS', trigger, figure);
    this.currentTrigger = trigger;
    this.currentFigure = figure;
    this.lightbox.classList.remove(this.constructor.lightboxClassHidden);
    this.lightbox.focus();
  }

  renderLightbox() {
    const quireContainer = document.getElementById('container');
    quireContainer.insertAdjacentElement('afterend', this.lightbox);
  }

  setupTriggers() {
    document.querySelectorAll(this.constructor.triggerSelector).forEach((item) => {
      item.addEventListener('click', this.open);
    });
  }
}
