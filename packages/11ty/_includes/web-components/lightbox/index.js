import { LitElement, html } from 'lit';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';

/**
 * Lightbox lit-element web component
 *
 * This component renders image slides with navigation UI.
 * It provides two slots for passing markup to render:
 *
 * slot="slides" is for individual slide markup. To display an element as a
 * slide, provide it with a `data-lightbox-slide` attribute set to any value,
 * and a `data-lightbox-id` attribute set to a unique id
 *
 * slot="ui" is for lightbox navigation controls.
 * This lightbox provides access to controls with the following data attributes:
 * - `data-lightbox-fullscreen` triggers fullscreen on click and indicates status
 * - `data-lightbox-next` triggers rendering of next slide on click
 * - `data-lightbox-previous` triggers rendering of previous slide on click
 *
 * It dynamically updates the content of elements with these data attributes:
 * - `data-lightbox-counter-current` displays the current slide index
 * - `data-lightbox-counter-total` displays total number of slides
 */
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
      if (this.isInsideOpenModal && this.slides.length > 1) {
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

    this.updateFullscreenButton()
  }

  updateCounterElements() {
    if (!this.counterCurrent || !this.counterTotal) return;

    this.counterCurrent.innerText = this.currentSlideIndex + 1
    this.counterTotal.innerText = this.slides.length
  }

  updateCurrentSlideElement() {
    if (!this.currentSlide) return;

    this.slides.forEach((slide) => {
      if (slide.dataset.lightboxId !== this.currentId)
        delete slide.dataset.lightboxCurrent;
    })
    this.currentSlide.dataset.lightboxCurrent = true
  }

  updateFullscreenButton() {
    if (this.fullscreenButton) this.fullscreenButton.dataset.lightboxFullscreen = !this.fullscreen;
  }

  render() {
    if (!this.slides.length) return ''
    this.currentId = this.slideIds[this.currentSlideIndex]
    this.updateCurrentSlideElement()
    this.updateCounterElements()

    return html`
      <div class="q-lightbox">
        <slot name="slides"></slot>
        <slot name="ui"></slot>
      </div>
    `;
  }
}

customElements.define('q-lightbox', Lightbox);
