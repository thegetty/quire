import { LitElement, html } from 'lit';
import { styles } from './styles.js'

const stringifyData = (jsObject) => {
  return encodeURIComponent(JSON.stringify(jsObject));
}

class Modal extends LitElement {
  static properties = {
    _height: { state: true },
    _width: { state: true },
    active: { type: Boolean },
    currentId: { attribute: 'current-id', type: String },
    figures: {
      converter: ((value) => value ? JSON.parse(decodeURIComponent(value)) : null)
    },
    imageDir: { attribute: 'image-dir', type: String }
  }

  static styles = styles;

  constructor() {
    super();
    this.setupKeyboardControls();
    this.setupModalTriggers();
    this.setupResizeHandler();
  }

  close() {
    this.active = false;
    this.currentId = null;
    this.enableScrolling();
  }

  disableScrolling() {
    document.querySelector('html').style.overflow = 'hidden';
  }

  enableScrolling() {
    document.querySelector('html').style.overflow = 'auto';
  }

  getCurrentFigureId(event) {
    const { target } = event;
    let currentFigure = target;
    while (
      !currentFigure.matches('figure') &&
      !currentFigure.getAttribute('id')
    ) {
      currentFigure = currentFigure.parentNode;
    }
    return currentFigure.getAttribute('id');
  }

  open(event) {
    this.currentId = this.getCurrentFigureId(event);
    this.active = true;
    this.disableScrolling();
    this.setDimensions();
  }

  setDimensions() {
    const { height, width } = this.renderRoot.firstElementChild.getBoundingClientRect();
    this._height = height;
    this._width = width;
  }

  setupKeyboardControls() {
    document.addEventListener('keyup', ({ code }) => {
      if (this.active) {
        if(code === 'Escape') {
          this.close();
        }
      }
    });
  }

  setupModalTriggers() {
    document.querySelectorAll('.q-figure__modal-link').forEach((item) => {
      item.addEventListener('click', (event) => {
        event.preventDefault();
        this.open(event);
      });
    });
  }

  setupResizeHandler() {
    window.addEventListener('resize', () => {
      window.requestAnimationFrame(() => {
        this.setDimensions();
      });
    });
  }

  render() {
    const figures = stringifyData(this.figures);
    return html`
      <div class="q-modal ${this.active ? 'active' : ''}">
        <q-lightbox
          current-id="${this.currentId}"
          figures="${figures}"
          image-dir=${this.imageDir}
          is-inside-open-modal="${this.active}"
          width="${this._width}"
          height="${this._height}"
        ></q-lightbox>
        <button
          class="q-modal__close-button"
          id="close-modal"
          @click="${this.close}"
        ></button>
      </div>
    `;
  }
}

customElements.define('q-modal', Modal);
