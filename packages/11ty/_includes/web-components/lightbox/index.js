import { LitElement, html, render, unsafeCSS } from 'lit'
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js'

/**
 * Lightbox lit-element web component markup and browser runtime
 *
 * This component renders a custom element (q-lightbox) with slots for 
 * figures data, styles, and ui. On startup it loads its data, inserts its
 * slides' markup, and manages a few internal properties and attributes during
 * the component lifecycle.
 *
 * Each slide (see `_lightboxSlide`) carries a
 * `q-lightbox-slides__slide` class
 * `id` attribute set to the figure's id
 * `data-lightbox-current` (optional, any value) attribute lays out and displays the slide 
 * `data-lightbox-preload` (optional, any value) attribute lays out the slide without display
 *
 * This lightbox expects its UI slot to have elements for a few controls:
 * - `data-lightbox-fullscreen` triggers fullscreen on click and indicates status
 * - `data-lightbox-next` triggers rendering of next slide on click
 * - `data-lightbox-previous` triggers rendering of previous slide on click
 *
 * It dynamically updates the content of its UI labels with these data attributes:
 * - `data-lightbox-counter-current` displays the current slide index
 * - `data-lightbox-counter-total` displays total number of slides
 * 
 * For each figure's data:
 * - Aligned to an internal data representation that eases slide logic and markup
 * - Inserted into slide markup with the appropriate slot and added to the lightbox
 */
class Lightbox extends LitElement {

  static properties = {
    currentId: { attribute: 'current-id', type: String },
    preloadNextId: { attribute: 'preload-next-id', type: String },
    preloadPrevId: { attribute: 'preload-prev-id', type: String },
  }

  setupStyles() {
    let styleElement = this.querySelector('style[slot="lightbox-styles"]')

    if (styleElement && styleElement.sheet) {
      this.adoptedStyleSheets = [ styleElement.sheet ]    
    }

  }

  constructor() {
    super()

    // NB: UI controls check this.slides so load figures first
    this.setupStyles()
    this.setupFiguresData()
    this.setupFullscreenButton()
    this.setupNavigationButtons()
    this.setupKeyboardControls()
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
    return this.querySelectorAll('.q-lightbox-slides__slide')
  }

  get slideIds() {
    return Array
      .from(this.slides)
      .map((slide) => slide.id)
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

  /**
   * @function _alignSlideData
   * @param {Object} figure - data for a quire figure
   * @return {Object} - data w/ a few useful props added
   */
  _alignSlideData(figure) {
    const {
      aspect_ratio: aspectRatio='widescreen',
      caption,
      credit,
      id,
      isSequence,
      label,
      mediaType
    } = figure

    const isAudio = mediaType === 'soundcloud'
    const isVideo = mediaType === 'video' || mediaType === 'vimeo' || mediaType === 'youtube'

    return { ...figure, isAudio, isVideo, aspectRatio }
  }

  /**
   * @function _lightboxSlide
   * @param {Object} figure - slide data
   * @return {Lit.html} - Lit HTML component
   * 
   * Composites slide data into the slide markup and injects pre-serialized figure elements
   **/
  _lightboxSlide(figure) {
    const { id, 
      mediaType, 
      figureElementContent,
      annotationsElementContent, 
      aspectRatio, 
      isVideo,
      isAudio,
      label, 
      labelHtml, 
      caption, 
      captionHtml, 
      credit, 
      creditHtml 
    } = figure

    const slideMediaClass = `q-lightbox-slides__element--${mediaType}`
    const videoClass = isVideo ? `q-lightbox-slides__element--video q-lightbox-slides__element--${aspectRatio}` : ''
    const audioClass = isAudio ? 'q-lightbox-slides__element--audio' : ''

    return html`<div class="q-lightbox-slides__slide" slot="slides" id="${id}">
      <div class="q-lightbox-slides__element ${slideMediaClass} ${videoClass} ${audioClass}">
        ${unsafeHTML(figureElementContent)}
      </div>
      <div class="q-figure-slides__slide-ui">
        <div class="q-lightbox-slides__caption ${ label || caption || credit ? '' : 'is-hidden' }">
          <span class="q-lightbox-slides__caption-label ${ label ? '' : 'is-hidden' }">${unsafeHTML(labelHtml)}</span>
          <span class="q-lightbox-slides__caption-content ${ caption || credit ? '' : 'is-hidden' }">${captionHtml ? unsafeHTML(captionHtml) : ''} ${creditHtml ? unsafeHTML(creditHtml) : ''}</span>
        </div>
        ${unsafeHTML(annotationsElementContent ?? '')}
      </div>
    </div>`
  }

  setupFiguresData() {
    const figuresData = this.querySelector('script[type="application/json"]')
    const figures = JSON.parse(figuresData.innerHTML)
    this.figures = figures

    figures.forEach( fig => {
      console.log('Rendering',fig.id)
      const dat = this._alignSlideData(fig)
      
      // NB: This is done in lightDOM *not* shadowDOM
      let slideElement = document.createElement('template') 
      render(this._lightboxSlide(dat),slideElement.content)

      const slide = slideElement.content.cloneNode(true)
      this.appendChild(slide)
    })
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

    this.slides.forEach((slide) => {
      if (slide.id !== this.currentId) {
        delete slide.dataset.lightboxCurrent
      }

      if ([this.preloadNextId,this.preloadPrevId].includes(slide.id)) {
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

    // NB: `lightbox-styles` are dynamically loaded by the constructor
    return html`
      <div class="q-lightbox">
        <slot name="lightbox-styles"></slot>
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
