import { LitElement, css, html, render, unsafeCSS } from 'lit'
import { createRef, ref } from 'lit/directives/ref.js'

import { imageSequenceStyles } from './styles.js'


/**
 * @class ImageSequence
 * @description A reactive Lit element for showing and interacting with a sequence of images.
 *
 * @todo on fetch error raise an error message on the status-overlay component
 * and set cursor: not-allowed
 */
class ImageSequence extends LitElement {

  static styles = [ imageSequenceStyles ]

  static properties = {
    animationFrame: { 
      type: Number,
      state: true,
    },
    bufferSize: { 
      type: Number,
      state: true,
    },
    didInteract: {
      type: Boolean,
      state: true,
    },
    images: {
      type: Array,
      state: true,
    },
    imageUrls: {
      attribute: 'image-urls',
      type: String,
    },
    index: {
      type: Number,
    },
    intrinsicHeight: {
      type: Number,
      state: true,
    },
    intrinsicWidth: {
      type: Number,
      state: true,
    },
    rotateToIndex: {
      attribute: 'rotate-to-index',
      type: Number,        
    },
    transition: {
      type: Number,
    },
    visible: {
      type: Boolean,
      state: true,
    }
  }

  canvasRef = createRef()

  /**
   * @private
   * @property #bufferWindow
   * 
   * @returns an array of indexes included in `bufferSize` given `index`
   */ 
  get #bufferWindow() {
    // NB: Calculated one length higher to protect against numerical under run
    const imageCount = this.images.length
    const windowStart = imageCount + this.index - Math.round(this.bufferSize/2)
    
    return Array(this.bufferSize)
      .fill(0)
      .map((_, i) => ((windowStart + i) % imageCount))
  }

  /**
   * @private
   * @property #bufferReady
   * 
   * @returns true if the buffer is loaded ahead and behind of `index`
   */
  get #bufferReady() {
    return this.images.filter((img, j) => this.#bufferWindow.includes(j) && img !== null ).length === this.bufferSize
  }

  /**
   * @property bufferedPct
   * @returns percent of the buffer that is not-null
   */
  get bufferedPct() {
    return Math.floor( this.images.filter((img, j) => this.#bufferWindow.includes(j) && img !== null).length / this.bufferSize * 100 )
  }

  /**
   * @property someImagesLoaded
   * @returns true if there is at least one image loaded
   */
  get someImagesLoaded() {
    return this.images.some((image) => image !== null)
  }

  /**
   * @function #fetchImage
   * @param url {string} - image URL to fetch
   * @param seqIndex {Number} - index to store this image 
   * 
   * Fetches `url`, converts it into a blob and stores the image data in `seqIndex`.
   * 
   * The in-flight fetch is stored in this.requests for cancellation and request deduplication, nulled on completion.
   * 
   * @returns {Promise} fetch resposne
   */
  #fetchImage(url, seqIndex) {
    if (this.requests[seqIndex]) return

    const request = new Request(url)

    const response = fetch(request)
      .then((response) => response.blob())
      .then((blob) => window.createImageBitmap(blob))
      .then((bmp) => {
        if (this.intrinsicHeight === 0) {
          this.intrinsicHeight = bmp.height
          this.intrinsicWidth = bmp.width   
        }
        this.images[seqIndex] = bmp
      })
      .then(() => {
        this.requests[seqIndex] = null
        this.requestUpdate()
      })
      .catch((error) => {
        console.error(error)
      })

    this.requests[seqIndex] = response

    return response
  }

  /**
   * @function connectedCallback
   * 
   * `lit` lifecycle method fired the first time the element is connected to the document
   * 
   * Used to register our visibility IntersectionObserver
   */
  connectedCallback() {
    super.connectedCallback()

    const callback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.visible = true
          observer.disconnect()
        }
      })
    }

    const options = { root: null, threshold: 0.5 }

    // Observes this component against the viewport to trigger image preloads
    const io = new IntersectionObserver(callback, options)

    io.observe(this)
  }

  constructor() {
    super()

    // Passed params and config
    this.description = 'Click and drag horizontally to rotate image'
    this.imageUrls = this.getAttribute('items').split(',')
    this.posterImageSrc = this.imageUrls.length > 0 ? this.imageUrls[0] : ''
    this.isContinuous = this.getAttribute('continuous') === 'true'
    this.isInteractive = this.getAttribute('interactive') === 'true'
    this.didInteract = false
    this.isReversed = this.getAttribute('reverse') === 'true'
    this.sequenceId = this.getAttribute('sequence-id')

    // Internal state
    const pctToBuffer = 0.2
    this.bufferSize = Math.ceil(this.imageUrls.length * pctToBuffer)
    this.blitting = null // null | animationFrameRequestId
    this.images = Array(this.imageUrls.length).fill(null) // Array< null | ImageBitmap >
    this.requests = Array(this.imageUrls.length).fill(null) // Array< null | Promise >
    this.visible = false
    this.index = 0
    this.intrinsicHeight = 0
    this.intrinsicWidth = 0
    this.oldIndex = null
    this.oldX = null
    this.imageCount = this.imageUrls.length

    // Set up observable and mouse events
    if (this.isInteractive) {
      this.addEventListener('mousemove', this.handleMouseMove.bind(this))
    }
  }

  /**
   * @function debounce
   * 
   * Returns a function, that, as long as it continues to be invoked, will not
   * be triggered. The function will be called after it stops being called for
   * N milliseconds. If `immediate` is passed, trigger the function on the
   * leading edge, instead of the trailing.
   *
   * using David Waslsh's debounce
   * https://davidwalsh.name/javascript-debounce-function
   * which is take from underscore.js
   *
   * @example
   *   var myEfficientFn = debounce(function() {
   *     // All the taxing stuff you do
   *   }, 250)
   *
   * @param {function} func - the function to execute
   * @param {integer} wait - the tine to wait in milliseconds
   * @param {boolean} immediate - whether to call the function immediately or at the end of the timeout
   *
   * @returns
   */
  debounce(fn, wait = 250, immediate = false) {
    let timeout = null

    return function () {
      const context = this
      const args = arguments
      const later = function () {
        timeout = null
        if (!immediate) {
          fn.apply(context, args)
        }
      }
      const callNow = immediate && !timeout
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
      if (callNow) {
        fn.apply(context, args)
      }
    }
  }

  /**
   * @function handleMouseMove
   * 
   * @param {Event.buttons}
   * @param {Event.clientX}
   * 
   * Sets interaction flag, hides overlays, and handles reversability check
   */
  handleMouseMove({ buttons, clientX }) {
    if (buttons) {
      this.didInteract = true

      if (this.oldX) {
        const deltaX = clientX - this.oldX
        const deltaIndex = Math.floor(Math.log(Math.abs(deltaX))) || 1
        if (deltaX > 0) {
          this.isReversed
            ? this.previousImage(deltaIndex)
            : this.nextImage(deltaIndex)
        } else if (deltaX < 0) {
          this.isReversed
            ? this.nextImage(deltaIndex)
            : this.previousImage(deltaIndex)
        }
      }
      this.oldX = clientX
    } else {
      this.oldX = null
    }
  }

  /**
   * @function nextImage
   * @param {Integer} n Number of steps between start index and end index
   * 
   * Set the sequence image to the index `n` steps after the current index
   */
  nextImage(n=1) {
    const newIndex = this.index + n >= this.imageCount
      ? this.index + n - this.imageCount
      : this.index + n
    this.index = newIndex
  }

  /**
   * @function #draw
   * 
   * Performs drawing operations against `this.context`
   */
  #draw(image) {
    this.context.drawImage(image,0,0)
  }

  /**
   * @function #paintCanvas
   * @param {ImageBitmap} - image - image to paint 
   * 
   * Paints the `canvas` element with the image from this.index
   */
  #paintCanvas(image) {
    if (!this.canvasRef.value) {
      return
    }

    this.context ??= this.canvasRef.value.getContext('2d')

    if (image) {
      window.cancelAnimationFrame(this.blitting)
      this.blitting = window.requestAnimationFrame( () => this.#draw(image) )
      return
    }

    if (!this.images[this.index]) {
      this.#fetchImage(this.imageUrls[this.index],this.index)
      return
    }

    window.cancelAnimationFrame(this.blitting)
    this.blitting = window.requestAnimationFrame( () => this.#draw(this.images[this.index]) )
    
  }

  /**
   * @function willUpdate
   * @param changedProperties
   * 
   * `lit` lifecycle method for changed properties
   */
  willUpdate(changedProperties) {
    // Determine the animation indices, preload them, and then do the rotation 
    if (changedProperties.has('rotateToIndex') && this.rotateToIndex!==false) {
      const frameCount = this.rotateToIndex - this.index + this.bufferSize / 2
      const animationIndices = Array(frameCount).fill(0).map((_, i) => this.index + i + 1)
      this.#preloadImages(animationIndices).then(this.animateRotation(this.rotateToIndex))
    }

    // Draws `animationFrame` directly to canvas (for use )
    if (changedProperties.has('animationFrame')) {
      if (!this.animationFrame) { return }
      if (this.images[this.animationFrame] === null) { return }

      this.#paintCanvas(this.images[this.animationFrame])
    } 

    if (changedProperties.has('index') && this.someImagesLoaded) {
      this.#preloadImages().then(() => {
        this.animateRotation(this.index)
      })
    }

    // Load enough to prepare for interaction
    if (changedProperties.has('visible') && !this.visible) {
      this.#preloadImages().then(() => this.#paintCanvas())
    }
  }

  /**
   * @function #preloadImages
   * 
   * Loads images of this.indexesToBuffer -- ahead and behind `this.index`
   * 
   * @returns {Promise} - Promise resolution for all preloads
   */
  #preloadImages(bufferWindow) {
    if (!this.images.some(i => i === null)) return Promise.all([]);

    const indexesToLoad = bufferWindow ?? this.#bufferWindow
    const imageRequests = this.images
      .map((image, i) => {
        // Skip anything out of our range or already loaded
        if (!indexesToLoad.includes(i) || image !== null) return null;
        const url = this.imageUrls[i]
        return this.#fetchImage(url, i);
      })
      .filter((imageRequest) => imageRequest)

    return Promise.all(imageRequests)
  }

  /**
   * Animates a rotation by stepping through images from the current index to the provided `newValue`
   */
  animateRotation(untilIndex) {
    if (this.animationFrame === untilIndex) return

    this.animationFrame = this.index

    const interval = setInterval(() => {
      /**
       * Set rotateToIndex to false when rotation is done and clear the interval
       */
      if (this.animationFrame === untilIndex) {
        this.index = untilIndex
        this.rotateToIndex = false
        this.synchronizeSequenceInstances()
      }
      /**
       * Clear the interval if user has triggered another rotation
       */
      if (this.rotateToIndex !== untilIndex) {
        clearInterval(interval)
        return
      }
      /**
       * Step through images
       */
      this.animationFrame += 1
    }, this.transition)
  }

  /**
   * Set the sequence image to the index `n` indices before the current index
   * @param {Integer} n Number of steps between start index and end index
   */
  previousImage(n=1) {
    const newIndex = this.index - n < 0
      ? this.imageCount + this.index - n
      : this.index - n
    this.index = newIndex
  }

  synchronizeSequenceInstances() {
    clearTimeout(this.updateTimer)
    this.updateTimer = setTimeout(() => {
      const sequenceInstances = document.querySelectorAll(`q-image-sequence[sequence-id="${this.sequenceId}"]`)
      sequenceInstances.forEach((sequence) => {
        if (parseInt(sequence.getAttribute('index')) !== this.index) {
          sequence.setAttribute('index', this.index)
        }
      })
    }, 250)
  }

  render() {
    const descriptionOverlay = this.isInteractive ? 
      html`<div slot='overlay' class="overlay ${ this.didInteract === false ? 'visible' : '' }"><span class="description">
            <svg class="description__icon">
              <symbol id="rotation-icon" viewBox="0 0 24 24">
                <path d="M6.07426 4.68451L6.89234 4.68451L6.89234 6.34444C7.68861 5.65993 8.56396 5.09807 9.5184 4.65884C10.4728 4.21961 11.4791 4 12.5371 4C13.5952 4 14.6014 4.21106 15.5559 4.63317C16.5103 5.05528 17.3856 5.6086 18.1819 6.29311L18.1819 4.68451L19 4.68451L19 7.93593L15.8913 7.93593L15.8913 7.08029L17.7565 7.08029C16.9821 6.39578 16.1694 5.85388 15.3186 5.45458C14.4678 5.05528 13.5406 4.85564 12.5371 4.85564C11.5336 4.85564 10.6092 5.05528 9.76382 5.45458C8.91847 5.85388 8.10311 6.39578 7.31775 7.08029L9.18298 7.08029L9.18298 7.93593L6.07426 7.93593L6.07426 4.68451ZM6.09062 14.0794L7.8086 9.42473L9.05209 9.90389C9.24843 9.98375 9.42023 10.0978 9.56748 10.2461C9.71474 10.3945 9.81018 10.577 9.85381 10.7938L10.1156 12.1457L14.975 9.86966C15.3895 9.67572 15.8067 9.66431 16.2267 9.83544C16.6466 10.0066 16.9493 10.3089 17.1348 10.7424C17.3202 11.1759 17.3338 11.6123 17.1757 12.0515C17.0175 12.4908 16.7312 12.8073 16.3167 13.0013L13.7479 14.1992L13.9115 14.6099C13.9333 14.6555 13.9442 14.7069 13.9442 14.7639L13.9442 14.935L13.8461 17.7415C13.8352 18.0381 13.737 18.3005 13.5516 18.5287C13.3661 18.7569 13.1316 18.9109 12.848 18.9907L9.3466 19.9491C9.03027 20.0403 8.73031 20.009 8.4467 19.8549C8.1631 19.7009 7.95585 19.4699 7.82496 19.1619L6.12334 15.1575C6.04699 14.9864 6.00608 14.8067 6.00063 14.6184C5.99518 14.4302 6.02517 14.2505 6.09062 14.0794ZM6.97415 14.6099L8.83938 19.0079L12.848 17.9469L12.9953 14.4559L12.6189 13.6002L15.9076 12.0601C16.0931 11.9688 16.2185 11.8433 16.284 11.6836C16.3494 11.5239 16.3385 11.3471 16.2512 11.1531C16.164 10.9592 16.044 10.8308 15.8913 10.7681C15.7386 10.7053 15.5695 10.7196 15.3841 10.8109L9.41204 13.5831L8.88847 10.9478L8.38126 10.7595L6.97415 14.6099Z" />
              </symbol>
              <switch>
                <use xlink:href="#rotation-icon"></use>
              </switch>
            </svg>
            <span class="description__text">${this.description}</span>
          </span></div>` 
      : ''

    return html`<div class="image-sequence ${this.#bufferReady ? '' : 'loading'} ${this.isInteractive ? 'interactive' : ''}">
        <slot name="loading-overlay">
          <div slot="loading-overlay" class='${ this.#bufferReady ? '' : 'visible'} loading overlay'>
            <div class="buffering-indicator">Loading Image Sequence&nbsp;(${ this.bufferedPct }%)...</div>
            </div>
        </slot>
        <canvas ${ref(this.canvasRef)} height="${this.intrinsicHeight}" width="${this.intrinsicWidth}" class="${this.someImagesLoaded ? 'visible' : ''} ${this.didInteract ? '' : 'fade-in'}" slot="images"></canvas>
        <slot name="overlay">
          ${descriptionOverlay}
        </slot>
      </div>`
  }
}

customElements.define('q-image-sequence', ImageSequence)
