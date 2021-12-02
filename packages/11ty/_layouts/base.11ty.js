const { html } = require('common-tags')
const head = require('../_includes/components/head.11ty.js')
const icons = require('../_includes/components/icons.11ty.js')
const iconscc = require('../_includes/components/icons-cc.11ty.js')
const pdfInfo = require ('../_includes/pdf/info.11ty.js')
const scripts = require ('../_includes/components/scripts.11ty.js')

module.exports = function(data) {
  const { content, publication } = data

  return this.renderTemplate(`
    <!doctype html>
    <html lang="${ publication.language }">
      ${head(data)}
      <body>
        ${icons(data)}

        ${iconscc(data)}

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
        ${scripts(data)}
      </body>
    </html>
  `, 
  'liquid'
  )
}
