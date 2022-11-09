## Quire Eleventy

The [Quire Eleventy package](https://github.com/thegetty/quire/tree/main/packages/11ty) contains configuration and modules for the [Eleventy static site generator](https://11ty.dev). This package is published to npm as [`@thegetty/quire-11ty`](https://www.npmjs.com/package/@thegetty/quire-11ty) and installed by the [`@thegetty/quire-cli`](https://www.npmjs.com/package/@thegetty/quire-cli) to build [Quire](https://quire.getty.edu) projects.

### Quire Eleventy Features

#### Components and Shortcodes

Component-driven page templates using [shortcode components](https://github.com/thegetty/quire/tree/main/packages/11ty/_includes/components) and [universal template shortcodes](https://www.11ty.dev/docs/shortcodes/#universal-shortcodes) that support [JavaScript](https://www.11ty.dev/docs/languages/javascript/), [Liquid](https://www.11ty.dev/docs/languages/liquid/), [Nunjucks](https://www.11ty.dev/docs/languages/nunjucks/), and [WebC](https://www.11ty.dev/docs/languages/webc/) templates.

#### Image Processing

Automatic processing of images as [IIIF](https://iiif.io) assets.

#### PDF Output

Generates HTML output for generation of PDF books using [`Paged.js`](https://pagedjs.org)

#### EPUB Output

Generates HTML output for generation of EPUB book using [`EPUB.js`](http://futurepress.org)
