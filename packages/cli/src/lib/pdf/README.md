## CLI lib/PDF Module

This module provides an abstraction to ease PDF generation across PrinceXML and Paged.js. The exported module dynamically loads a wrapper to align the libraries' JS APIs by exporting a single method that accepts a `lib` option and returns an async function that takes input, output, and option params.

The module also provides plugins for Prince and Paged.js to map quire webpages to PDF pages. In both cases this is achieved after PDF rendering by querying the HTML document that was printed for `.quire-page` elements and using the PDF generator's APIs to determine content page ids, page data like titles and contributors, and first / last pages. They then use a simple stripping algorithm with `pdf-lib` to split the pages for `--page-pdf` flagged runs.

### Paged.js Façade

We use [`pagedjs-cli`](https://gitlab.coko.foundation/pagedjs/pagedjs-cli), which adds a headless to paged.js to facilitate serializing to PDF files.

For more details on the PDF generating API see the [`Paged.js` documentation](https://gitlab.coko.foundation/pagedjs/). See paged.js's [hooks documentation](https://pagedjs.org/documentation/10-handlers-hooks-and-custom-javascript/) for details on the `afterRendered` hook that quire uses to generate the PDF page map.

### Prince XML Façade

The Prince abstraction wraps the command line execution of the Prince executable. 

See the [Prince Command-line Reference](https://www.princexml.com/doc/command-line/). Prince's [scripting documentation](https://www.princexml.com/doc/javascript/) has details on its runtime Javascript implementation, *which is only compatible up to ES5*.

The Prince plugin passes page map data as JSON to STDOUT.
