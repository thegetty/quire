import { LitElement, css, html } from 'lit';

const stringifyData = (jsObject) => {
  return encodeURIComponent(JSON.stringify(jsObject));
}

class Modal extends LitElement {
  static properties = {
    _height: { state: true },
    _width: { state: true },
    active: { type: Boolean },
    current: { type: String },
    figures: {
      converter: ((value) => value ? JSON.parse(decodeURIComponent(value)) : null)
    },
    imageDir: { attribute: 'image-dir', type: String }
  }

  static styles = css`
    .q-modal {
      position: fixed;
      z-index: 1;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: black;
      overflow: hidden;
      transform: translateY(-100%);
      opacity: 0;
      transition: transform 0s 0.2s, opacity 0.2s linear;
    }

    .active.q-modal {
      transform: translateY(0);
      opacity: 1;
      transition: transform 0s, opacity 0.2s 0.2s linear;
    }

    .q-modal__close-button {
      position: absolute;
      top: 0;
      right: 0;
      margin-top: 10px;
      margin-right: 10px;
    }
  `;

  constructor() {
    super();
    this.setupModalTriggers();
    this.setupResizeHandler();
  }

  close() {
    this.active = false;
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
    this.current = this.getCurrentFigureId(event);
    this.active = true;
    this.disableScrolling();
    this.setDimensions();
  }

  setDimensions() {
    const { height, width } = this.renderRoot.firstElementChild.getBoundingClientRect();
    this._height = height;
    this._width = width;
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
    const closeButton = html`<button @click="${this.close}" id="close-modal" class="q-modal__close-button"></button>`;
    return html`
      <div class="q-modal ${this.active ? 'active' : ''}">
        <q-lightbox current="${this.current}" figures="${figures}" image-dir=${this.imageDir} is-modal="true" width="${this._width}" height="${this._height}"></q-lightbox>
        ${closeButton}
      </div>
    `;
  }
}

customElements.define('q-modal', Modal);
