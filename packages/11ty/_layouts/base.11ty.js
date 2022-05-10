const { html } = require('common-tags')

/**
 * Base layout as a JavaScript method
 *
 * @param      {Object}  data    Final data from the Eleventy data cascade
 * @return     {Function}  Template render function
 */
module.exports = function(data) {
  const { collections, content, pageData, publication } = data

  return this.renderTemplate(`
    <!doctype html>
    <html lang="${ publication.language }">
      ${this.head(data)}
      <body>
        ${this.icons(data)}

        ${this.iconscc(data)}

        ${this.pdfInfo(data)}

        <div class="quire no-js" id="container">
          <div
            class="quire__secondary remove-from-epub"
            id="site-menu"
            aria-expanded="false"
            role="contentinfo"
          >
            ${this.menu({ collections, pageData, publication })}
          </div>

          <div class="quire__primary" id="{{ section }}">
            ${this.navigation(data)}
            ${ content }
          </div>
          {% render 'search' %}
        </div>
        ${this.scripts()}
      </body>
    </html>
  `, 
  'liquid'
  )
}
