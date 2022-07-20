## Outputs
Quire's multiple publication formats HTML, EPUB and PDF are managed by the `outputs` plugin, allowing separate publication outputs to be generated during a single build process.

For EPUB and PDF generation, page content is intersected, copied, modified, and written to the `public` directory during the `transform` without modifying the content returned in the `transform`. For HTML output, the content is modified and returned in the transform, and is what will be rendered in the built site. This allows the three separate publication output types to be created during one build process.

### Filters
Elements in the markup can be included or excluded using the data properties `data-include-in-output` and `data-exclude-from-output` respectively, with a value of the output types. Elements without either of these tags will be included in all outputs.

#### Examples
An image that will be included in `html` and `pdf` output, but excluded from `epub`:
```html
<img src="image.jpg" data-include-in-output="html,pdf" />
```


An image that will be included in `pdf` and `epub`, but excluded from `html`:
```html
<img src="image.jpg" data-exclude-from-output="html" />
```
