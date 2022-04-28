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
    isModal: { attribute: 'is-modal', type: Boolean },
    width: { type: Number }
  }

  static styles = css`
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
      top: 50%
    }

    .q-figure__navigation-button--next {
      right: 0;
      margin-right: 10px;
      transform: translateY(-50%);
    }

    .q-figure__navigation-button--previous {
      left: 0;
      margin-left: 10px;
      transform: translateY(-50%);
    }
  `;

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

  render() {
    // TODO calculate width and height attributes for `image-service` and `canvas-panel` images
    const imageSlides = () => {
      const imagesWithCaptions = this.pageFigures.map(({ canvasId, caption, id, manifestId, preset, src }, index) => {
        const isCanvasPanel = !!canvasId && !!manifestId;
        const isImageService = src && !src.match(/.+\.(jpe?g|gif|png)$/);
        const isImg = src && src.match(/.+\.(jpe?g|gif|png)$/);
        const captionElement = caption
          ? `<div class="q-lightbox__caption">${caption}</div>`
          : '';
        const elementId = `lightbox-image-${index}`;
        const imageSrc = src && src.startsWith('http')
          ? src
          : `${this.imageDir}/${src}`;

        let imageElement;
        switch(true) {
          default:
            imageElement = `<div class="q-lightbox__missing-img">Figure '${id}' does not have a valid 'src'</div>`;
            break;
          case isCanvasPanel:
            imageElement = `<canvas-panel id="${elementId}" data-figure="${id}" canvas-id="${canvasId}" manifest-id="${manifestId}" preset="${preset}" />`;
            break;
          case isImageService:
            imageElement = `<image-service id="${elementId}" data-figure="${id}" src="${imageSrc}" />`;
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


    // TODO implement download control
    const downloadButton = html``;

    // TODO implement counter
    const counter = html``;

    // TODO implement keyboard navigation for lightbox
    const navigationButtons = () => {
      const previousAriaLabel = 'Previous (left arrow key)';
      const nextAriaLabel = 'Next (right arrow key)';
      return html`
        <button @click="${this.previous}" class="q-figure__navigation-button q-figure__navigation-button--previous" title="${previousAriaLabel}" aria-label="${previousAriaLabel}">PREVIOUS</button>
        <button @click="${this.next}" class="q-figure__navigation-button q-figure__navigation-button--next" title="${nextAriaLabel}" aria-label="${nextAriaLabel}">NEXT</button>
      `;
    };

    return html`
       <div class="q-lightbox">
         ${imageSlides()}
         <div class="q-lightbox__zoom-and-fullscreen">
           ${zoomButtons()}
           ${fullscreenButton()}
         </div>
         <div class="q-lightbox__download-and-counter">
           ${downloadButton}
           ${counter}
         </div>
         ${navigationButtons()}
       </div>
    `;
  }
}

customElements.define('q-lightbox', Lightbox);
