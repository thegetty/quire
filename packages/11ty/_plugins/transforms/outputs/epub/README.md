# EPUB Transform

The `epub` transform prepares the Eleventy build output for conversion to an EPUB by a separate library.

This transform is run at the end of the Eleventy build before individual page HTML files are written. For each template the [`epub/tranform`](transform.js) function is called with the HTML output from the build and the file output path.

The transform intercepts the HTML content and creates a `JSDOM` instance to replace the [`base` layout](_layouts/base.11ty.js) with the [`epub/layout`](transforms/outputs/epub/layout.js) and remove `html-only` or `pdf-only` elements before writing each file to the output directory with a sequence indentifier pattern: `_site/epub/<sequence>_<filename>`.

