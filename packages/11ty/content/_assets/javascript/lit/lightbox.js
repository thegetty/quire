import { LitElement, css, html } from 'lit';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';

class Lightbox extends LitElement {
  static properties = {
    currentId: { attribute: 'current-id', type: String },
    figures: {
      converter: ((value) => value ? JSON.parse(decodeURIComponent(value)) : null)
    },
    height: { type: Number },
    imageDir: { attribute: 'image-dir', type: String },
    isInsideOpenModal: { attribute: 'is-inside-open-modal', type: Boolean },
    width: { type: Number }
  }

  static styles = css`
    .q-lightbox {
      --atlas-z-index: 0;
      font-family: "IBM Plex Sans Condensed",sans-serif;
      color: white;
    }

    .q-lightbox,
    .q-lightbox__slide,
    .q-lightbox__image {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
    }

    .q-lightbox__slide {
      transform: translateY(-100%);
      opacity: 0;
      transition: transform 0s 0.4s, opacity 0.4s linear;
    }

    .current.q-lightbox__slide {
      transform: translateY(0);
      opacity: 1;
      transition: transform 0s, opacity 0.4s linear;
    }

    .q-lightbox__image img {
      position: absolute;
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .q-lightbox__fullscreen-button {
      position: absolute;
      top: 0;
      left: 0;
      width: 30px;
      height: 30px;
      margin-top: 10px;
      margin-left: 10px;
      padding: 0;
      border: 0;
      cursor: pointer;
      background-color: rgba(0, 0, 0, 0.5);
      background-repeat: no-repeat;
      background-position-x: 2px;
      background-position-y: 2px;
      background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAA0AgMAAADpgsAbAAABS2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDAgNzkuMTYwNDUxLCAyMDE3LzA1LzA2LTAxOjA4OjIxICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+LUNEtwAAAARnQU1BAACxjwv8YQUAAAABc1JHQgCuzhzpAAAACVBMVEUAAAD///////9zeKVjAAAAAnRSTlMAgJsrThgAAAAySURBVBjTY2AgFmitYFrVgERrMDAw4aMJAUL60e2jNiDaP2wrIf7hWgXRiIOGqaOufwA6TR6/lErWHQAAAABJRU5ErkJggg==);
    }

    .q-lightbox__fullscreen-button--active.q-lightbox__fullscreen-button {
      background-position-x: 2px;
      background-position-y: -24px;
    }

    .q-lightbox__navigation-button {
      position: absolute;
      top: 50%;
      width: 40px;
      height: 35%;
      padding: 0;
      border: 0;
      transform: translateY(-50%);
      cursor: pointer;
      background-color: rgba(0, 0, 0, 0);
    }

    .q-lightbox__navigation-button::before {
      content: '';
      display: block;
      position: absolute;
    }

    .q-lightbox__navigation-button--next {
      right: 0;
    }

    .q-lightbox__navigation-button--previous {
      left: 0;
    }

    .q-lightbox__navigation-button--next::before,
    .q-lightbox__navigation-button--previous::before {
      content: '';
      display: block
      position: absolute;
      top: 50%;
      width: 30px;
      height: 30px;
      transform: translateY(-50%);
      background-color: rgba(0, 0, 0, 0.5);
      background-repeat: no-repeat;
      /* TODO replace base64 encoded background image arrow icons stolen from magnific-popup library with in-repo assets */
      background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQgAAABYCAQAAACjBqE3AAAB6klEQVR4Ae3bsWpUQRTG8YkkanwCa7GzVotsI/gEgk9h4Vu4ySLYmMYgbJrc3lrwZbJwC0FMt4j7F6Y4oIZrsXtgxvx/1c0ufEX4cnbmLCmSJEmSJEmSJEmSJP3XCBPvbJU+8doWmDFwyZpLBmYlNJebz0KwzykwsuSYJSNwykEJreV2BaBMaLIQZ2xYcFgqDlmw4ayE/FwL0dDk4Qh4W37DAjgqIT+3HRbigjH+iikVdxgZStgyN0Su2sXIeTwTT+esdpcbIlfNAuZ/TxresG4zV8kYWSZNiKUTokMMSWeIwTNEn4fK2TW3gRNgVkJLuVksROA9G+bEvoATNlBCa7nZXEwdxEZxzpKRKFh+bsv8LmPFmhX1OwfIz81jIRJQ5eeqG9B+riRJkiRJkiRJkiRJkiRJkiRJUkvA/8RQoEpKlJWINFkJ62AlrEP/mNBibnv2yz/A3t7Uq3LcpoxP8COjC1T5vxoAD5VdoEqdDrd5QuW1swtUSaueh3zkiuBiqgtA2OlkeMcP/uDqugsJdbjHF65VdPMKwS0+WQc/MgKvrIOHysB9vgPwk8+85hmPbnQdvHZyDMAFD7L3EOpgMcVdvnHFS0/vlatrXvCVx0U9gt3fxvnA0/hB4nmRJEmSJEmSJEmSJGmHfgFLaDPoMu5xWwAAAABJRU5ErkJggg==);
    }

    .q-lightbox__navigation-button--next::before {
      margin-right: 10px;
      background-position-x: -95px;
      background-position-y: -44px;
    }

    .q-lightbox__navigation-button--previous::before {
      margin-left: 10px;
      background-position-x: -139px;
      background-position-y: -44px;
    }

    .q-lightbox__download-and-counter {
      position: absolute;
      top: 0;
      right: 0;
      margin-top: 10px;
      margin-right: 10px;
      padding: 0 8px;
      background: rgba(0,0,0,0.5);
      font-size: 1rem;
      font-weight: bold;
      line-height: 30px;
    }

    .q-lightbox__download-and-counter--modal.q-lightbox__download-and-counter {
      margin-right: 40px;
    }

    .q-lightbox__caption {
      position: absolute;
      left: 10px;
      right: 10px;
      bottom: 25px;
      padding: 0 8px;
      background: rgba(0,0,0,0.5);
      font-size: 0.875rem;
      line-height: 30px;
    }

    .q-lightbox__caption-label {
      margin-right: 0.5rem;
      font-weight: bold;
    }
  `;

  constructor() {
    super();
    this.setupKeyboardControls();
  }

  get currentFigureIndex() {
    if (!this.figures) return;
    if (!this.currentId) return 0;
    return this.figures.findIndex(({ id }) => id === this.currentId);
  }

  get fullscreen() {
    return document.fullscreen;
  }

  get hasMultipleFigures() {
    return this.figures.length > 1;
  }

  next() {
    const nextIndex = this.currentFigureIndex + 1;
    const nextId = this.figures[nextIndex % this.figures.length].id
    this.currentId = nextId;
  }

  previous() {
    const previousIndex = this.currentFigureIndex - 1;
    const previousId = this.figures.slice(previousIndex)[0].id;
    this.currentId = previousId;
  }

  setupKeyboardControls() {
    document.addEventListener('keyup', ({ code }) => {
      if (this.isInsideOpenModal && this.hasMultipleFigures) {
        switch(code) {
            default:
              break;
            case 'ArrowRight':
              this.next();
              break;
            case 'ArrowLeft':
              this.previous();
              break;
        }
      }
    });
  }

  toggleFullscreen() {
    const lightbox = this.renderRoot.firstElementChild;
    if (this.fullscreen) {
      document.exitFullscreen();
    } else {
      lightbox.requestFullscreen();
    }
  }

  render() {
    const imageSlides = () => {
      const imagesWithCaptions = this.figures.map(({ caption, credit, id, iiif, label, preset, src }, index) => {
        const isCanvasPanel = iiif && !!iiif.canvas && !!iiif.manifest;
        const isImageService = iiif && !!iiif.info;
        const isImg = src && !!src.match(/.+\.(jpe?g|gif|png)$/);
        const labelSpan = label
          ? `<span class="q-lightbox__caption-label">${label}</span>`
          : '';
        const captionAndCreditSpan = caption || credit
          ? `<span class="q-lightbox__caption-content">${caption ? caption : ''} ${credit ? credit : ''}</span>`
          : '';
        const captionElement = labelSpan.length || captionAndCreditSpan.length
          ? `
            <div class="q-lightbox__caption">
              ${labelSpan}
              ${captionAndCreditSpan}
            </div>
          `
          : '';
        const elementId = `lightbox-image-${index}`;
        const imageSrc = src && src.startsWith('http')
          ? src
          : `${this.imageDir}/${src}`;

        const modal = document.querySelector('q-modal');

        let imageElement;
        switch(true) {
          default:
            imageElement = `<div class="q-lightbox__missing-img">Figure '${id}' does not have a valid 'src'</div>`;
            break;
          case isCanvasPanel:
            imageElement = `<canvas-panel id="${elementId}" data-figure="${id}" canvas-id="${iiif.canvas.id}" manifest-id="${iiif.manifest.id}" preset="${preset}" width="${this.width}" height="${this.height}" />`;
            break;
          case isImageService:
            imageElement = `<image-service id="${elementId}" data-figure="${id}" src="${iiif.info}" width="${this.width}" height="${this.height}" />`;
            break;
          case isImg:
            imageElement = `<img id="${elementId}" data-figure="${id}" src="${imageSrc}" />`;
            break;
        }

        return `
          <div class="q-lightbox__slide ${this.currentFigureIndex === index ? 'current' : ''}">
            <div class="q-lightbox__image">
              ${imageElement}
            </div>
            ${captionElement}
          </div>
        `;
      });
      return unsafeHTML(`
        <div class="q-lightbox__images">
          ${imagesWithCaptions.join('')}
        </div>
      `);
    }

    // TODO implement zoom buttons
    const zoomButtons = () => {
      const zoomInAriaLabel = 'Zoom In';
      const zoomOutAriaLabel = 'Zoom Out';
      // TODO determine how to programattically zoom with `image-service`/`canvas-panel`
      const displayZoomButtons = false
      return displayZoomButtons
        ? html`
          <button class="q-lightbox__zoom-button q-lightbox__zoom-button--in" title="${zoomInAriaLabel}" aria-label="${zoomInAriaLabel}">+</button>
          <button class="q-lightbox__zoom-button q-lightbox__zoom-button--out" title="${zoomOutAriaLabel}" aria-label="${zoomOutAriaLabel}">-</button>
        `
        : '';
    }

    const fullscreenButton = () => {
      const ariaLabel = 'View Fullscreen';
      return html`
        <button @click="${this.toggleFullscreen}" class="q-lightbox__fullscreen-button ${this.fullscreen ? 'q-lightbox__fullscreen-button--active' : ''}" title="${ariaLabel}" aria-label="${ariaLabel}"></button>
      `;
    }

    // TODO implement download button for figure entries
    const downloadButton = () => {
      return this.isInsideOpenModal
        ? html``
        : '';
    };

    const counter = () => {
      const counter = this.currentFigureIndex + 1;
      const figureCount = this.figures.length;
      return this.hasMultipleFigures
        ? html`<span class="q-lightbox__counter">${counter} of ${figureCount}</span>`
        : '';
    };

    const navigationButtons = () => {
      const previousAriaLabel = 'Previous (left arrow key)';
      const nextAriaLabel = 'Next (right arrow key)';
      return this.hasMultipleFigures
        ? html`
          <button @click="${this.previous}" class="q-lightbox__navigation-button q-lightbox__navigation-button--previous" title="${previousAriaLabel}" aria-label="${previousAriaLabel}"></button>
          <button @click="${this.next}" class="q-lightbox__navigation-button q-lightbox__navigation-button--next" title="${nextAriaLabel}" aria-label="${nextAriaLabel}"></button>
        `
        : '';
    };

    return html`
      <div class="q-lightbox">
        ${imageSlides()}
        <div class="q-lightbox__zoom-and-fullscreen">
          ${zoomButtons()}
          ${fullscreenButton()}
        </div>
        <div class="q-lightbox__download-and-counter ${this.isInsideOpenModal && 'q-lightbox__download-and-counter--modal'}">
          ${downloadButton()}
          ${counter()}
        </div>
        ${navigationButtons()}
      </div>
    `;
  }
}

customElements.define('q-lightbox', Lightbox);
