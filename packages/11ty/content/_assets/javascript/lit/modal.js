import { LitElement, css, html } from 'lit';

const stringifyData = (jsObject) => {
  return encodeURIComponent(JSON.stringify(jsObject));
}

class Modal extends LitElement {
  static properties = {
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
      transition: transform 0s, opacity 0.2s 0.2s linear;
      transform: translateY(0);
      opacity: 1;
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
  }

  close() {
    this.active = false;
    this.enableScrolling();
  }

  disableScrolling() {
    document.querySelector('html').style.overflow = 'hidden';
    // not sure if all of this is necessary, pulled it from helpers
    this.renderRoot.onwheel = preventDefault; // modern standard
    this.renderRoot.element.onmousewheel = element.onmousewheel = preventDefault; // older browsers, IE
    this.renderRoot.ontouchmove = preventDefault; // mobile
    this.renderRoot.onkeydown = preventDefaultForScrollKeys;
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
  }

  setupModalTriggers() {
    document.querySelectorAll('.q-figure__modal-link').forEach((item) => {
      item.addEventListener('click', (event) => {
        event.preventDefault();
        this.open(event);
      });
    });
  }

  render() {
    const figures = stringifyData(this.figures);
    const closeButton = html`<button @click="${this.close}" id="close-modal" class="q-modal__close-button">X</button>`;
    return html`
      <div class="q-modal ${this.active ? 'active' : ''}">
        <q-lightbox current="${this.current}" debug figures="${figures}" image-dir=${this.imageDir}></q-lightbox>
        ${closeButton}
      </div>
    `;
  }
}

customElements.define('q-modal', Modal);
