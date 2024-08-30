import { LitElement, html } from 'lit'
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js'

/**
 * Lightbox lit-element web component
 *
 * This component renders image slides with navigation UI.
 * It provides a default slot for passing markup to render:
 *
 * To display an element as a slide, provide it with a
 * `data-lightbox-slide` attribute set to any value
 * `data-lightbox-slide-id` attribute set to a unique id string
 *
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
    preloadNextId: { attribute: 'preload-next-id', type: String },
    preloadPrevId: { attribute: 'preload-prev-id', type: String },
  }

  constructor() {
    super()
    this.setupFullscreenButton()
    this.setupNavigationButtons()
    this.setupKeyboardControls()
    this.setupFiguresData()
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
      .map((slide) => slide.dataset.lightboxSlideId)
  }

  get currentSlide() {
    if (!this.slides.length) return
    if (!this.currentId) return this.slides[0]

    return this.slides[this.currentSlideIndex]
  }

  get currentSlideIndex() {
    if (!this.slides.length) return
    if (!this.currentId) return 0

    return this.slideIds.findIndex((id) => id === this.currentId)
  }

  get fullscreen() {
    return document.fullscreen || this.wrapper.classList.contains('quire-entry__lightbox--fullscreen')
  }

  get wrapper() {
    return document.querySelector('.quire-entry__lightbox')
  }

  enterFullscreen() {
    const lightbox = this.renderRoot.firstElementChild
    if (lightbox.requestFullscreen) {
      lightbox.requestFullscreen()
    } else {
      this.wrapper.classList.add('quire-entry__lightbox--fullscreen')
      document.body.style.position = 'fixed'
      document.body.style.top = `-${window.scrollY}px`
    }
  }

  exitFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    } else {
      this.wrapper.classList.remove('quire-entry__lightbox--fullscreen')
      document.body.style.position = ''
      document.body.style.top = ''
    }
  }

  next() {
    if (!this.slides.length) return

    const nextIndex = this.currentSlideIndex + 1
    const nextId = this.slideIds[nextIndex % this.slides.length]
    this.currentId = nextId
  }

  previous() {
    if (!this.slides.length) return

    const previousIndex = this.currentSlideIndex - 1
    const previousId = this.slideIds.slice(previousIndex)[0]
    this.currentId = previousId
  }

  setupFiguresData() {
    const figuresData = this.querySelector('script[type="application/json"]')
    const figures = JSON.parse(figuresData.innerHTML)
    this.figures = figures
  }

  setupFullscreenButton() {
    if (!this.fullscreenButton) return

    this.fullscreenButton.addEventListener('click', () => {
      this.toggleFullscreen()
    })
  }

  setupNavigationButtons() {
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
      if (this.slides.length > 1) {
        switch(code) {
          default:
            break
          case 'ArrowRight':
            this.next()
            break
          case 'ArrowLeft':
            this.previous()
            break
        }
      }
    })
  }

  toggleFullscreen() {
    this.updateFullscreenButton()

    if (this.fullscreen) {
      this.exitFullscreen()
    } else {
      this.enterFullscreen()
    }
  }

  updateCounterElements() {
    if (!this.counterCurrent || !this.counterTotal) return

    this.counterCurrent.innerText = this.currentSlideIndex + 1
    this.counterTotal.innerText = this.slides.length
  }

  updateCurrentSlideElement() {
    if (!this.currentSlide) return

    // TODO: Change this so we're modding the slides' next/cur/prev markup (so no load bounce) and then reset the next/prev IDs
    this.slides.forEach((slide) => {
      if (slide.dataset.lightboxSlideId !== this.currentId) {
        delete slide.dataset.lightboxCurrent
      }

      if ([this.preloadNextId,this.preloadPrevId].includes(slide.dataset.lightboxSlideId)) {
        slide.dataset.lightboxPreload = true
      } else {
        delete slide.dataset.lightboxPreload
      }

    })

    this.currentSlide.dataset.lightboxCurrent = true
  }

  updateFullscreenButton() {
    if (this.fullscreenButton) this.fullscreenButton.dataset.lightboxFullscreen = !this.fullscreen
  }

  render() {
    if (!this.slides.length) return ''
    this.currentId = this.slideIds[this.currentSlideIndex]
    this.preloadNextId = this.currentSlideIndex + 1 < this.slideIds.length ? this.slideIds[this.currentSlideIndex + 1] : undefined
    this.preloadPrevId = this.currentSlideIndex - 1 >= 0 ? this.slideIds[this.currentSlideIndex - 1] : undefined
    this.updateCurrentSlideElement()
    this.updateCounterElements()
    // console.log(this.figures)

    // TODO: Add figureElement, captionElement, and Annotations element markup
    // TODO: Add prev-slide, cur-slide, next-slide data
    return html`
      <div class="q-lightbox">
        <slot name="data"></slot>
        <div class="q-lightbox-slides">
          <slot name="slides"></slot>
        </div>
        <slot name="ui"></slot>
      </div>
    `
  }
}

customElements.define('q-lightbox', Lightbox)
