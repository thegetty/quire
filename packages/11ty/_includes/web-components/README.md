## Using `lit-element`

### Composing with `canvas-panel` and other non-lit web components using `unsafeHTML`

To use `canvas-panel`, `image-service`, or other non-`lit-element` web components inside a `lit-element`, render them using `unsafeHTML`:

``` javascript
import { LitElement, html } from 'lit';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';

class MyComponent extends LitElement {
  static properties = {
    src: { type: String }
  }

  render() {
    const imageService = unsafeHTML(`<image-service src="${this.src}" />`);
    return html`
      <div class="my-component">
        ${imageService}
      </div>
    `;
  }
}
```

### Serializing object props

Because we are using `lit-element` components inside liquid templates, we have to serialize complex object props to avoid JSON parsing errors
