import { LitElement, css, html } from 'lit';

const stringifyData = (jsObject) => {
  return encodeURIComponent(JSON.stringify(jsObject));
}

class Modal extends LitElement {
  static properties = {
    active: { type: Boolean },
    current: { type: String },
    figures: {
      converter: ((value) => JSON.parse(decodeURIComponent(value)))
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
      height: 200vh;
      background: rgb(0,0,0);
      background: linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%);
      overflow: hidden;
      transform: translateY(-200%);
      opacity: 0;
      transition: transform 0.1s ease-in-out, opacity 0.2s linear;
    }

    .q-modal__button {

    }

    .active {
      transition: transform 0.2s ease-in-out, opacity 0.1s linear;
      transform: translateY(0);
      opacity: 1;
    }
  `;

  constructor() {
    super();
    this.setupModalTriggers();
  }

  close() {
    this.active = false;
    this.enableScrolling();
    // this.requestUpdate();
  }

  disableScrolling() {
    document.querySelector('html').style.overflow = 'hidden';
    // not sure if this stuff works, just pulled it from helpers
    // this.renderRoot.onwheel = preventDefault; // modern standard
    // this.renderRoot.element.onmousewheel = element.onmousewheel = preventDefault; // older browsers, IE
    // this.renderRoot.ontouchmove = preventDefault; // mobile
    // this.renderRoot.onkeydown = preventDefaultForScrollKeys;
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
    // this.requestUpdate();
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
    const closeButton = html`<button @click="${this.close}" id='q-modal__close'>X</button>`;
    return html`
      <div class="q-modal ${this.active ? 'active' : ''}">
        ${closeButton}
        <q-lightbox current="${this.current}" debug figures="${figures}" image-dir=${this.imageDir}></q-lightbox>
      </div>
    `;
  }
}

customElements.define('q-modal', Modal);
