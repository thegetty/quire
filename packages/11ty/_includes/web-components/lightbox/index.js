import { LitElement, html } from 'lit';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import { styles } from './styles.js'

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

  static styles = styles

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
      const imagesWithCaptions = this.figures.map(({ caption, credit, id, iiif, isCanvas, isImageService, label, preset, src }, index) => {
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
          case isCanvas:
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
