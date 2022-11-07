import { LitElement, html } from 'lit'

class Modal extends LitElement {
  static properties = {
    active: { type: Boolean },
    currentId: { attribute: 'current-id', type: String },
  }

  get closeButton() {
    return this.querySelector('[data-modal-close]')
  }

  get lightbox() {
    return this.querySelector('q-lightbox')
  }

  constructor() {
    super()
    this.setupKeyboardControls()
    this.setupModalTriggers()
  }

  close() {
    this.active = false
    this.currentId = null
    this.updateLightboxCurrentId()
    this.enableScrolling()
  }

  disableScrolling() {
    document.querySelector('html').style.overflow = 'hidden'
  }

  enableScrolling() {
    document.querySelector('html').style.overflow = 'auto'
  }

  getCurrentFigureId(event) {
    const { target } = event
    let currentFigure = target
    while (
      !currentFigure.matches('figure') &&
      !currentFigure.getAttribute('id')
    ) {
      currentFigure = currentFigure.parentNode
    }
    return currentFigure.getAttribute('id')
  }

  open(event) {
    this.currentId = this.getCurrentFigureId(event)
    this.active = true
    this.updateLightboxCurrentId()
    this.disableScrolling()
  }

  setupCloseButton() {
    if (!this.closeButton) return

    this.closeButton.addEventListener('click', () => {
      this.close()
    })
  }

  setupKeyboardControls() {
    document.addEventListener('keyup', ({ code }) => {
      if (this.active) {
        if(code === 'Escape') {
          this.close()
        }
      }
    })
  }

  setupModalTriggers() {
    document.querySelectorAll('.q-figure__modal-link').forEach((item) => {
      item.addEventListener('click', (event) => {
        event.preventDefault()
        this.open(event)
      })
    })
  }

  updateLightboxCurrentId() {
    this.lightbox && this.lightbox.setAttribute('current-id', this.currentId)
  }

  render() {
    this.dataset.modalActive = this.active
    this.setupCloseButton()

    return html`
      <div class="q-modal">
        <slot></slot>
      </div>
    `
  }
}

customElements.define('q-modal', Modal)
