import { LitElement, css, html } from 'lit';

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
      width: 30px;
      height: 30px;
      margin-top: 10px;
      margin-right: 10px;
      padding: 0;
      border: 0;
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQgAAABYCAQAAACjBqE3AAAB6klEQVR4Ae3bsWpUQRTG8YkkanwCa7GzVotsI/gEgk9h4Vu4ySLYmMYgbJrc3lrwZbJwC0FMt4j7F6Y4oIZrsXtgxvx/1c0ufEX4cnbmLCmSJEmSJEmSJEmSJP3XCBPvbJU+8doWmDFwyZpLBmYlNJebz0KwzykwsuSYJSNwykEJreV2BaBMaLIQZ2xYcFgqDlmw4ayE/FwL0dDk4Qh4W37DAjgqIT+3HRbigjH+iikVdxgZStgyN0Su2sXIeTwTT+esdpcbIlfNAuZ/TxresG4zV8kYWSZNiKUTokMMSWeIwTNEn4fK2TW3gRNgVkJLuVksROA9G+bEvoATNlBCa7nZXEwdxEZxzpKRKFh+bsv8LmPFmhX1OwfIz81jIRJQ5eeqG9B+riRJkiRJkiRJkiRJkiRJkiRJUkvA/8RQoEpKlJWINFkJ62AlrEP/mNBibnv2yz/A3t7Uq3LcpoxP8COjC1T5vxoAD5VdoEqdDrd5QuW1swtUSaueh3zkiuBiqgtA2OlkeMcP/uDqugsJdbjHF65VdPMKwS0+WQc/MgKvrIOHysB9vgPwk8+85hmPbnQdvHZyDMAFD7L3EOpgMcVdvnHFS0/vlatrXvCVx0U9gt3fxvnA0/hB4nmRJEmSJEmSJEmSJGmHfgFLaDPoMu5xWwAAAABJRU5ErkJggg==) no-Repeat top left rgba(0,0,0,0.5);
      background-position-x: -6px;
      background-position-y: -51px;
      cursor: pointer;
    }
  `;

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
