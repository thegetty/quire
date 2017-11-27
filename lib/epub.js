/**
 * @fileOverview Epub class
 * @author Eric Gardner / Getty Publications
 * @license MIT
 *
 */
const fs = require('fs')
const path = require('path')
const nunjucks = require('nunjucks')

/* eslint-disable no-irregular-whitespace */
/* eslint-disable key-spacing */

/**
 * Epub class.
 *
 * @description The Epub class handles the logic of loading templates,
 * managing ePub data, and writing/zipping output files. The Quire CLI
 * should mainly interact with it by initializing it with appropriate
 * data and calling a write() or build() method.
 *
 * Things the Epub class needs to do:
 *
 * I. Needs to accept some info from QuireCLI instance:
 *    1. Be aware of global publication data (from publication.yml)
 *    2. Be aware of content data (an array of chapters or paths/URLs to chapters)
 *    3. Be aware of other important assets (TBD)
 * II. Needs to populate epub template with this data
 *    1. Use nunjucks and vinyl-fs to accomplish this
 *    2. Use Cheerio to scrape array of chapters in order, storing content
 *    3. This content should then be loaded in turn into the content.xhtml template
 *    4. Resulting HTML strings will be piped into vinyl-fs
 * III. Needs to write and zip files into a valid epub
 *
 * Ebook template file structure is as follows:
 *
 * ebook
 * ├── META-INF
 * │   └── container.xml
 * ├── OPS
 * │   ├── book
 * │   │   ├── content.xhtml
 * │   │   ├── cover.xhtml
 * │   │   ├── table-of-contents.ncx
 * │   │   └── table-of-contents.xhtml
 * │   ├── css
 * │   │   └── main.css
 * │   ├── fonts
 * │   │   ├── fonts.css
 * │   │   └── someawesomefont.woff
 * │   ├── images
 * │   │   └── cover.png
 * │   └── package.opf
 * └── mimetype
 *
 */
class Epub {
  constructor () {
    this.templateBasePath = path.resolve(__dirname, 'templates', 'ebook')

    // Nunjucks templates that need to be processed.
    // Initialized as file paths that need to be loaded
    this.templates = {
      'container.xml': path.join('META-INF', 'container.xml'),
      'package.opf':   path.join('OPS', 'package.opf'),
      'toc.ncx':       path.join('OPS', 'book', 'table-of-contents.ncx'),
      'toc.xhtml':     path.join('OPS', 'book', 'table-of-contents.xhtml'),
      'cover.xhtml':   path.join('OPS', 'book', 'cover.xhtml'),
      'content.xhtml': path.join('OPS', 'book', 'content.xhtml')
    }

    // Static assets that can be directly copied
    this.assets = {}
  }

  write () {
    nunjucks.configure(this.templateBasePath)
    let pkg = nunjucks.render(path.join('OPS', 'package.opf'))
    console.log(pkg)
  }
}

module.exports = Epub
