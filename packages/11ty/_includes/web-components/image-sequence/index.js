import { LitElement, css, html, render, unsafeCSS } from 'lit'

class ImageSequence extends LitElement {

  static styles = css`
      :host {
        position: relative;
        display: flex;
        justify-content: center;
        max-width: 100vw;
        max-height: 100vh;
      }

      .image-sequence.interactive {
        height: 100%;
        cursor: grab;
      }

      .overlay {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0);
        color: white;
        transition: all 0.25s linear;
      }

      .overlay.visible {
        opacity: 1;
      }

      .overlay:not(.visible) {
        opacity: 0;
      }

      .overlay:hover {
        background: rgba(0,0,0,0.6);
      }

      .overlay.loading.visible {
        animation: loading-overlay 1s infinite alternate;
      }

      @keyframes loading-overlay {
        from {
          opacity: 0.6;
        }
        to {
          opacity: 1;
        }
      }

      .description {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        opacity: 0;
        transition: opacity 0.25s linear;
      }

      .description__icon {
        fill: white;
        height: 2em;
      }

      .overlay:hover .description {
        opacity: 1;
      }

      slot[name='images'] img {
        display: block;
        pointer-events: none;
        user-select: none;
        width: 100%;
        height: 100%;
      }

      slot[name='images'] img:not(.placeholder) {
        position: absolute;
        top: 0;
        left: 0;
      }

      slot[name='images'] img.visible {
        opacity: 1;
        object-fit: contain;
      }

      slot[name='images'] img:not(.visible) {
        opacity: 0;
      }

      slot[name='images'] img.fade-in {
        animation: fade-in 0.25s 1 linear;          
      }

      @keyframes fade-in {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      slot[name='placeholder-image'] img.loading {
        opacity: 1;
        filter: brightness(0.4);
        animation: loading-image 1s linear infinite alternate;
      }

      @keyframes loading-image {
        from {
          filter: brightness(0.4);
        }
        to {
          filter: brightness(0.2);
        }
      }

      slot[name='placeholder-image'] img {
        opacity: 0;
        transition: opacity 0.25s linear;
        object-fit: cover;
      }`

  static properties = {
    index: {
      type: Number,
    },
    didInteract: {
      type: Boolean,
      state: true,
    },
    visible: {
      type: Boolean,
      state: true,
    },
    images: {
      type: Array,
      state: true,
    },
    rotateToIndex: {
      attribute: 'rotate-to-index',
      type: Number,        
    },
    transition: {
      type: Number,
    }
  }

  get allImagesLoaded() {
    return this.imagesLoaded === this.images.length
  }

  // Fires when this component is visible
  _loadImages() {
    const imageElements = this.images.map( (img,i) => {
      fetch(img).then( this.imagesLoaded++ )
    })
  }

  constructor() {
    super()

    // Passed params and config
    this.description = 'Click and drag horizontally to rotate image'
    this.images = this.getAttribute('items').split(',')
    this.isContinuous = this.getAttribute('continuous') === 'true'
    this.isInteractive = this.getAttribute('interactive') === 'true'
    this.didInteract = false
    this.isReversed = this.getAttribute('reverse') === 'true'
    this.sequenceId = this.getAttribute('sequence-id')

    // Internal state
    this.imageData = []
    this.visible = false
    this.index = 0
    this.oldIndex = null
    this.oldX = null
    this.imagesLoaded = 0
    this.totalCanvases = this.images.length

    // Set up observable and mouse events

    this._loadImages()

    // TODO: Setup observer and run isVisible() when we're at least one screen away 
    // const io = new IntersectionObserver( (entries,observer) => {
    //   entries.forEach(entry => {
    //     if (entry.intersectionRatio > 0) {
    //       this.visible = true
    //       this._isObservable()
    //     }
    //   })
    // })

    // io.observe(this)

    if (this.isInteractive) {
      this.addEventListener('mousemove', this.handleMouseMove.bind(this))
    }
  }

  /**
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
   * @returns
   */
  debounce(func, wait = 250, immediate = false) {
    let timeout = null

    return function () {
      const context = this
      const args = arguments
      const later = function () {
        timeout = null
        if (!immediate) {
          func.apply(context, args)
        }
      }
      const callNow = immediate && !timeout
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
      if (callNow) {
        func.apply(context, args)
      }
    }
  }

  // getClampedIndex(index) {
  //   if (!this.images) return 0
  //   return Math.max(Math.min(index, this.images.length - 1), 0)
  // }

  handleMouseMove({ buttons, clientX }) {
    if (buttons) {
      if (this.didInteract) {
        this.didInteract = true
      }

      this.hideOverlays()
      if (this.oldX) {
        const deltaX = clientX - this.oldX
        const deltaIndex = Math.floor(Math.log(Math.abs(deltaX))) || 1
        if (deltaX > 0) {
          this.isReversed
            ? this.previousCanvas(deltaIndex)
            : this.nextCanvas(deltaIndex)
        } else if (deltaX < 0) {
          this.isReversed
            ? this.nextCanvas(deltaIndex)
            : this.previousCanvas(deltaIndex)
        }
      }
      this.oldX = clientX
    } else {
      this.oldX = null
    }
  }

  hideAllImages() {
    this.images.forEach((element) => {
      element.classList.remove('visible')
    })

  }

  hideOverlays() {
    this.querySelectorAll('.overlay').forEach((element) => {
      element.classList.remove('visible')
    })
  }

  hideImage(imageElement) {
    imageElement.className = ''
  }

  hideLoadingOverlay() {
    this.querySelector('.overlay').classList.remove('visible')
  }

  /**
   * Set the sequence canvas to the index `n` steps after the current index
   * 
   * @param {Integer} n Number of steps between start index and end index
   */
  nextCanvas(n=1) {
    const newIndex = this.index + n >= this.totalCanvases
      ? this.index + n - this.totalCanvases
      : this.index + n
    this.index = newIndex
  }

  willUpdate(changedProperties) {
    if (changedProperties.has('rotateToIndex') && this.rotateToIndex!==false) {
      this.performRotation(this.rotateToIndex)
    }
  }

  /**
   * Animates a rotation by stepping through canvases from the current index to the provided `newValue`
   */
  performRotation(indexToMove) {
    if (this.index === indexToMove) return
    const interval = setInterval(() => {
      /**
       * Set rotateToIndex to false when rotation is done and clear the interval
       */
      // TODO: 
      console.log(this.index)
      if (this.index === indexToMove) {
        this.rotateToIndex = false
      }
      /**
       * Clear the interval if user has triggered another rotation
       */
      if (this.rotateToIndex !== indexToMove) {
        clearInterval(interval)
        return
      }
      /**
       * Step through canvases
       */
      this.nextCanvas()
    }, this.transition)
  }

  /**
   * Set the sequence canvas to the index `n` indices before the current index
   * @param {Integer} n Number of steps between start index and end index
   */
  previousCanvas(n=1) {
    const newIndex = this.index - n < 0
      ? this.totalCanvases + this.index - n
      : this.index - n
    this.index = newIndex
  }

  // TODO: Add this to the class list if no interaction
  showImage(imageElement, shouldFadeIn) {
    if (!imageElement) return
    shouldFadeIn && imageElement.classList.add('fade-in')
    imageElement.classList.add('visible')
  }

  // TODO: maybe do this in an await this.updateComplete callback? -- synchro to the on-page resources?
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

    const loadingOverlayElement = html`<div slot='loading-overlay' class='${ this.allImagesLoaded ? '' : 'visible'} loading overlay'>Loading Image Sequence...</div>` 

    const descriptionOverlay = this.isInteractive ? 
      html`<div slot='overlay' class="overlay ${ this.oldX === null ? 'visible' : '' }"><span class="description">
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

    return html`<div class="image-sequence ${ this.allImagesLoaded ? '' : 'loading' } ${ this.isInteractive ? 'interactive' : '' }">
                  <slot name="placeholder-image">
                    <img slot="placeholder-image" class="${ this.allImagesLoaded ? '' : 'loading' } placeholder" src="${ this.images.length > 0 ? this.images[0] : '' }" >
                  </slot>
                  <slot name="loading-overlay">
                    ${ loadingOverlayElement }
                  </slot>                
                  <slot name="images">
                    <img slot="images" class="${ this.allImagesLoaded ? 'visible' : '' } ${ this.didInteract ? '' : 'fade-in' } " src="${this.images[this.index]}">
                  </slot>
                  <slot name="overlay">
                    ${ descriptionOverlay }
                  </slot>
                </div>`
  }

}

customElements.define('q-image-sequence',ImageSequence)