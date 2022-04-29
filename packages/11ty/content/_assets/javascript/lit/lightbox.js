import { LitElement, css, html } from 'lit';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';

class Lightbox extends LitElement {
  static properties = {
    current: { type: String },
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

    .q-figure__navigation-button {
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

    .q-figure__navigation-button::before {
      content: '';
      display: block;
      position: absolute;
    }

    .q-figure__navigation-button--next {
      right: 0;
    }

    .q-figure__navigation-button--previous {
      left: 0;
    }

    .q-figure__navigation-button--next::before,
    .q-figure__navigation-button--previous::before {
      content: '';
      display: block
      position: absolute;
      top: 50%;
      width: 30px;
      height: 30px;
      transform: translateY(-50%);
    }

    .q-figure__navigation-button--next::before {
      margin-right: 10px;
      /* TODO replace base64 encoded background image arrow icons stolen from magnific-popup library with in-repo assets */
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQgAAABYCAQAAACjBqE3AAAB6klEQVR4Ae3bsWpUQRTG8YkkanwCa7GzVotsI/gEgk9h4Vu4ySLYmMYgbJrc3lrwZbJwC0FMt4j7F6Y4oIZrsXtgxvx/1c0ufEX4cnbmLCmSJEmSJEmSJEmSJP3XCBPvbJU+8doWmDFwyZpLBmYlNJebz0KwzykwsuSYJSNwykEJreV2BaBMaLIQZ2xYcFgqDlmw4ayE/FwL0dDk4Qh4W37DAjgqIT+3HRbigjH+iikVdxgZStgyN0Su2sXIeTwTT+esdpcbIlfNAuZ/TxresG4zV8kYWSZNiKUTokMMSWeIwTNEn4fK2TW3gRNgVkJLuVksROA9G+bEvoATNlBCa7nZXEwdxEZxzpKRKFh+bsv8LmPFmhX1OwfIz81jIRJQ5eeqG9B+riRJkiRJkiRJkiRJkiRJkiRJUkvA/8RQoEpKlJWINFkJ62AlrEP/mNBibnv2yz/A3t7Uq3LcpoxP8COjC1T5vxoAD5VdoEqdDrd5QuW1swtUSaueh3zkiuBiqgtA2OlkeMcP/uDqugsJdbjHF65VdPMKwS0+WQc/MgKvrIOHysB9vgPwk8+85hmPbnQdvHZyDMAFD7L3EOpgMcVdvnHFS0/vlatrXvCVx0U9gt3fxvnA0/hB4nmRJEmSJEmSJEmSJGmHfgFLaDPoMu5xWwAAAABJRU5ErkJggg==) no-Repeat top right rgba(0,0,0,0.5);
      background-position-x: -95px;
      background-position-y: -44px;
    }

    .q-figure__navigation-button--previous::before {
      margin-left: 10px;
      /* TODO replace base64 encoded background image arrow icons stolen from magnific-popup library with in-repo assets */
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQgAAABYCAQAAACjBqE3AAAB6klEQVR4Ae3bsWpUQRTG8YkkanwCa7GzVotsI/gEgk9h4Vu4ySLYmMYgbJrc3lrwZbJwC0FMt4j7F6Y4oIZrsXtgxvx/1c0ufEX4cnbmLCmSJEmSJEmSJEmSJP3XCBPvbJU+8doWmDFwyZpLBmYlNJebz0KwzykwsuSYJSNwykEJreV2BaBMaLIQZ2xYcFgqDlmw4ayE/FwL0dDk4Qh4W37DAjgqIT+3HRbigjH+iikVdxgZStgyN0Su2sXIeTwTT+esdpcbIlfNAuZ/TxresG4zV8kYWSZNiKUTokMMSWeIwTNEn4fK2TW3gRNgVkJLuVksROA9G+bEvoATNlBCa7nZXEwdxEZxzpKRKFh+bsv8LmPFmhX1OwfIz81jIRJQ5eeqG9B+riRJkiRJkiRJkiRJkiRJkiRJUkvA/8RQoEpKlJWINFkJ62AlrEP/mNBibnv2yz/A3t7Uq3LcpoxP8COjC1T5vxoAD5VdoEqdDrd5QuW1swtUSaueh3zkiuBiqgtA2OlkeMcP/uDqugsJdbjHF65VdPMKwS0+WQc/MgKvrIOHysB9vgPwk8+85hmPbnQdvHZyDMAFD7L3EOpgMcVdvnHFS0/vlatrXvCVx0U9gt3fxvnA0/hB4nmRJEmSJEmSJEmSJGmHfgFLaDPoMu5xWwAAAABJRU5ErkJggg==) no-Repeat top left rgba(0,0,0,0.5);
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
      left: 0;
      bottom: 0;
      width: 100%;
      margin: 0 10px 25px;
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

  get pageFigures() {
    if (!this.figures) return;
    const figureIds = Array
      .from(document.querySelectorAll('.q-figure'))
      .reduce((ids, figure) => {
        if (figure.hasAttribute('id')) {
          ids.push(figure.getAttribute('id'));
        }
        return ids;
      }, []);
    return this.figures.filter(({ id }) => {
      return figureIds.includes(id)
    });
  }

  get currentFigureIndex() {
    if (!this.current || !this.pageFigures) return;
    return this.pageFigures.findIndex(({ id }) => id === this.current);
  }

  next() {
    const nextIndex = this.currentFigureIndex + 1;
    const nextId = this.pageFigures[nextIndex % this.pageFigures.length].id
    this.current = nextId;
  }

  previous() {
    const previousIndex = this.currentFigureIndex - 1;
    const previousId = this.pageFigures.slice(previousIndex)[0].id;
    this.current = previousId;
  }

  setupKeyboardControls() {
    document.addEventListener('keyup', ({ code }) => {
      if (this.isInsideOpenModal) {
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

  render() {
    const imageSlides = () => {
      const imagesWithCaptions = this.pageFigures.map(({ canvasId, caption, id, label, manifestId, preset, src }, index) => {
        const isCanvasPanel = !!canvasId && !!manifestId;
        const isImageService = src && !src.match(/.+\.(jpe?g|gif|png)$/);
        const isImg = src && src.match(/.+\.(jpe?g|gif|png)$/);
        const captionElement = caption
          ? `
            <div class="q-lightbox__caption">
              <span class="q-lightbox__caption-label">${label}</span>
              <span class="q-lightbox__caption-content">${caption}</span>
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
            imageElement = `<canvas-panel id="${elementId}" data-figure="${id}" canvas-id="${canvasId}" manifest-id="${manifestId}" preset="${preset}" width="${this.width}" height="${this.height}" />`;
            break;
          case isImageService:
            imageElement = `<image-service id="${elementId}" data-figure="${id}" src="${imageSrc}" width="${this.width}" height="${this.height}" />`;
            break;
          case isImg:
            imageElement = `<img id="${elementId}" data-figure="${id}" src="${imageSrc}" />`;
            break;
        }

        return `
          <div class="q-lightbox__slide ${this.current === id ? 'current' : ''}">
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
      return html`
        <button class="q-figure__zoom-button q-figure__zoom-button--in" title="${zoomInAriaLabel}" aria-label="${zoomInAriaLabel}">+</button>
        <button class="q-figure__zoom-button q-figure__zoom-button--out" title="${zoomOutAriaLabel}" aria-label="${zoomOutAriaLabel}">-</button>
      `;
    }

    // TODO implement fullscreen button
    const fullscreenButton = () => {
      const ariaLabel = 'View Fullscreen';
      return html`
        <button class="q-figure__fullscreen-button" title="${ariaLabel}" aria-label="${ariaLabel}"></button>
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
      const figureCount = this.pageFigures.length;
      return html`<span class="q-lightbox__counter">${counter} of ${figureCount}</span>`;
    };

    const navigationButtons = () => {
      const previousAriaLabel = 'Previous (left arrow key)';
      const nextAriaLabel = 'Next (right arrow key)';
      return html`
        <button @click="${this.previous}" class="q-figure__navigation-button q-figure__navigation-button--previous" title="${previousAriaLabel}" aria-label="${previousAriaLabel}"></button>
        <button @click="${this.next}" class="q-figure__navigation-button q-figure__navigation-button--next" title="${nextAriaLabel}" aria-label="${nextAriaLabel}"></button>
      `;
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
