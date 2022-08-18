import { LitElement, html } from 'lit';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';

class Lightbox extends LitElement {
  static properties = {
    currentId: { attribute: 'current-id', type: String },
    height: { type: Number },
    isInsideOpenModal: { attribute: 'is-inside-open-modal', type: Boolean },
    width: { type: Number }
  }

  constructor() {
    super();
    this.setupFullscreen();
    this.setupNavigation();
    this.setupKeyboardControls();
  }

  get counterCurrent() {
    return this.querySelector('[data-lightbox-counter-current]')
  }

  get counterTotal() {
    return this.querySelector('[data-lightbox-counter-total]')
  }

  get fullscreenButton() {
    return this.querySelector('[data-lightbox-fullscreen]')
  }

  get nextButton() {
    return this.querySelector('[data-lightbox-next]')
  }

  get previousButton() {
    return this.querySelector('[data-lightbox-previous]')
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

  setupFullscreen() {
    if (!this.fullscreenButton) return

    this.fullscreenButton.addEventListener('click', () => {
      this.toggleFullscreen()
    })
  }

  setupNavigation() {
    if (!this.nextButton || !this.previousButton) return

    this.nextButton.addEventListener('click', () => {
      this.next()
    })
    this.previousButton.addEventListener('click', () => {
      this.previous()
    })
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
      this.fullscreenButton.dataset.lightboxFullscreen = false
      document.exitFullscreen();
    } else {
      this.fullscreenButton.dataset.lightboxFullscreen = true
      lightbox.requestFullscreen();
    }
  }

  updateCounterElements() {
    this.counterCurrent.innerText = this.currentSlideIndex + 1
    this.counterTotal.innerText = this.slides.length
  }

  updateCurrentSlideElement() {
    this.slides.forEach((slide) => {
      if (slide.dataset.lightboxId !== this.currentId)
        delete slide.dataset.lightboxCurrent;
    })
    this.currentSlide.dataset.lightboxCurrent = true
  }

  render() {
    if (!this.slides.length) return ''
    this.currentId = this.slideIds[this.currentSlideIndex]
    this.updateCurrentSlideElement()
    this.updateCounterElements()

    return html`
      <slot name="slides"></slot>
      <slot name="ui"></slot>
    `;
  }
}

customElements.define('q-lightbox', Lightbox);
