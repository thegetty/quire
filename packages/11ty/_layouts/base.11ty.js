const { html } = require('common-tags')
const pdfInfo = require ('../_includes/pdf/info.js')

module.exports = function(data) {
  const { content, publication } = data

  return this.renderTemplate(`
    <!doctype html>
    <html lang="${ publication.language }">
      ${this.head(data)}
      <body>
        ${this.icons(data)}

        ${this.iconscc(data)}

        ${pdfInfo(data)}

        <div class="quire no-js" id="container">
          <div
            class="quire__secondary remove-from-epub"
            id="site-menu"
            aria-expanded="false"
            role="contentinfo"
          >
            ${this.menu(data)}
          </div>

          <div class="quire__primary" id="{{ section }}">
            ${this.nav(data)}
            ${ content }
          </div>
          {% render 'search' %}
        </div>
        ${this.scripts(data)}
      </body>
    </html>
  `, 
  'liquid'
  )
}
