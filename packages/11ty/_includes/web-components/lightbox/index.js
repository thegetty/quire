import { LitElement, html } from 'lit';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import { styles } from './styles.js'

class Lightbox extends LitElement {
  static properties = {
    currentId: { attribute: 'current-id', type: String },
    figures: {
      converter: ((value) => value ? JSON.parse(decodeURIComponent(value)) : null)
    },
    height: { type: Number },
    imageDir: { attribute: 'image-dir', type: String },
    isInsideOpenModal: { attribute: 'is-inside-open-modal', type: Boolean },
    width: { type: Number }
  }

  static styles = styles

  constructor() {
    super();
    this.setupKeyboardControls();
  }

  get slides() {
    return this.querySelectorAll('[data-lightbox-slide]')
  }

  get slideIds() {
    return Array
      .from(this.slides)
      .map((slide) => slide.dataset.lightboxId)
  }

  get currentSlide() {
    if (!this.slides.length) return;
    if (!this.currentId) return this.slides[0];

    return this.slides[this.currentSlideIndex]
  }

  get currentSlideIndex() {
    if (!this.slides.length) return;
    if (!this.currentId) return 0;

    return this.slideIds.findIndex((id) => id === this.currentId);
  }

  get fullscreen() {
    return document.fullscreen;
  }

  get hasMultipleFigures() {
    return this.slides.length > 1;
  }

  next() {
    if (!this.slides.length) return;

    const nextIndex = this.currentSlideIndex + 1;
    const nextId = this.slideIds[nextIndex % this.slides.length]
    this.currentId = nextId;
  }

  previous() {
    if (!this.slides.length) return;

    const previousIndex = this.currentSlideIndex - 1;
    const previousId = this.slideIds.slice(previousIndex)[0];
    this.currentId = previousId;
  }

  setCurrentSlideElement() {
    this.slides.forEach((slide) => {
      if (slide.dataset.lightboxId !== this.currentId)
        delete slide.dataset.lightboxCurrent;
    })
    this.currentSlide.dataset.lightboxCurrent = true
  }

  setupKeyboardControls() {
    document.addEventListener('keyup', ({ code }) => {
      if (this.isInsideOpenModal && this.hasMultipleFigures) {
        switch(code) {
            default:
              break;
            case 'ArrowRight':
              this.next();
              break;
            case 'ArrowLeft':
              this.previous();
              break;
        }
      }
    });
  }

  toggleFullscreen() {
    const lightbox = this.renderRoot.firstElementChild;
    if (this.fullscreen) {
      document.exitFullscreen();
    } else {
      lightbox.requestFullscreen();
    }
  }

  render() {
    if (!this.slides.length) return ''
    this.currentId = this.slideIds[this.currentSlideIndex]
    this.setCurrentSlideElement()

    // TODO implement zoom buttons
    const zoomButtons = () => {
      const zoomInAriaLabel = 'Zoom In';
      const zoomOutAriaLabel = 'Zoom Out';
      // TODO determine how to programattically zoom with `image-service`/`canvas-panel`
      const displayZoomButtons = false
      return displayZoomButtons
        ? html`
          <button class="q-lightbox__zoom-button q-lightbox__zoom-button--in" title="${zoomInAriaLabel}" aria-label="${zoomInAriaLabel}">+</button>
          <button class="q-lightbox__zoom-button q-lightbox__zoom-button--out" title="${zoomOutAriaLabel}" aria-label="${zoomOutAriaLabel}">-</button>
        `
        : '';
    }

    const fullscreenButton = () => {
      const ariaLabel = 'View Fullscreen';
      return html`
        <button @click="${this.toggleFullscreen}" class="q-lightbox__fullscreen-button ${this.fullscreen ? 'q-lightbox__fullscreen-button--active' : ''}" title="${ariaLabel}" aria-label="${ariaLabel}"></button>
      `;
    }

    // TODO implement download button for figure entries
    const downloadButton = () => {
      return this.isInsideOpenModal
        ? html``
        : '';
    };

    const counter = () => {
      const counter = this.currentSlideIndex + 1;
      const slideCount = this.slides.length;
      return this.hasMultipleFigures
        ? html`<span class="q-lightbox__counter">${counter} of ${slideCount}</span>`
        : '';
    };

    const navigationButtons = () => {
      const previousAriaLabel = 'Previous (left arrow key)';
      const nextAriaLabel = 'Next (right arrow key)';
      return this.hasMultipleFigures
        ? html`
          <button @click="${this.previous}" class="q-lightbox__navigation-button q-lightbox__navigation-button--previous" title="${previousAriaLabel}" aria-label="${previousAriaLabel}"></button>
          <button @click="${this.next}" class="q-lightbox__navigation-button q-lightbox__navigation-button--next" title="${nextAriaLabel}" aria-label="${nextAriaLabel}"></button>
        `
        : '';
    };

    return html`
      <div class="q-lightbox">
        <slot name="slides"></slot>
        <div class="q-lightbox__zoom-and-fullscreen">
          ${zoomButtons()}
          ${fullscreenButton()}
        </div>
        <div class="q-lightbox__download-and-counter ${this.isInsideOpenModal && 'q-lightbox__download-and-counter--modal'}">
          ${downloadButton()}
          ${counter()}
        </div>
        ${navigationButtons()}
      </div>
    `;
  }
}

customElements.define('q-lightbox', Lightbox);
