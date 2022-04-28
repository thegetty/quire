import { LitElement, html } from 'lit';

class Lightbox extends LitElement {
  static properties = {
    debug: { type: Boolean },
    current: { type: String },
    figures: {
      converter: ((value) => JSON.parse(decodeURIComponent(value)))
    },
    imageDir: { attribute: 'image-dir', type: String }
  }

  get pageFigures() {
    const pageFigureIds = Array
      .from(document.querySelectorAll('.q-figure'))
      .reduce((ids, element) => {
        const id = element.getAttribute('id');
        if (id) {
          ids.push(id);
        }
        return ids;
      }, []);

    return pageFigureIds.map((id) => {
      return this.figures.find((figure) => figure.id === id);
    });
  }

  get currentFigure() {
    if (!this.current) return
    return this.figures.find(({ id }) => id === this.current);
  }

  // get currentSource

  render() {
    const debug = this.debug ? html`<pre>${JSON.stringify(this.pageFigures, null, 2)}</pre>` : '';
    const src = this.currentFigure
      ? this.imageDir + this.currentFigure.src
      : null
    console.warn('RENDERING SRC', src);
    return html`
       ${debug}
       <div class="q-lightbox">
         ${src
             ? html`<image-service alt="${this.currentFigure.alt}" class="q-figure__image" src="${src}" width="500" height="500"></image-service>`
             : ''
         }
       </div>
    `;
  }
}

customElements.define('q-lightbox', Lightbox);
