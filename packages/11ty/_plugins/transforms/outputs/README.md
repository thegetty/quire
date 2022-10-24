## Outputs
Quire's multiple publication formats HTML, EPUB and PDF are managed by the `outputs` plugin, allowing separate publication outputs to be generated during a single build process.

During the `transform` the parsed content for each page is intercepted, copied, and modified before being written to the `public` directory for PDF and EPUB outputs and then returned by the `transform` function for the site HTML output. This allows the three separate publication output types to be created during one build process.

### Filters
Elements in the markup can be included or excluded using the data properties `data-include-in-output` and `data-exclude-from-output` respectively, with a value of the output types. Elements without either of these tags will be included in all outputs.

#### Examples
An image that will be included in `html` and `pdf` output, but excluded from `epub`:
```html
<img src="image.jpg" data-outputs-include="html,pdf" />
```

An image that will be included in `pdf` and `epub`, but excluded from `html`:
```html
<img src="image.jpg" data-outputs-exclude="html" />
```

### Conditional Rendering
For components that should render different markup for different output formats, a shortcode directory can include modules for each output format: `html.js`, `epub.js`, `pdf.js`. If the output for `epub` and `pdf` are the same, you can create a `print.js` module, which will be used to generate the markup for both `epub` and `pdf`. The shortcode should then also include an `index.js` that calls the `renderOutputs` function (see example below).

Example directory structures for a `video` shortcode with conditional rendering:

```
- video/
  - index.js
  - pdf.js
  - epub.js
  - html.js
```

or

```
- video/
  - index.js
  - print.js
  - html.js
```

```javascript
// shortcode/video/index.js

/**
 * Render all `video` outputs
 */
module.exports = function(eleventyConfig) {
  const renderOutputs = eleventyConfig.getFilter('renderOutputs')
  return function(params) {
    return renderOutputs(__dirname, params)
  }
}
````
