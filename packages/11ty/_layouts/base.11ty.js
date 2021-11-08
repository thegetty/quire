const head = require('../_includes/head.11ty.js')
const icons = require('../_includes/icons.11ty.js')
const iconscc = require('../_includes/icons-cc.11ty.js')
const pdfInfo = require ('../_includes/pdf/info.11ty.js')

module.exports = function(data) {
  const { content, publication } = data

  return `
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
            <!-- {#% render 'menu' %#} -->
          </div>

          <div class="quire__primary" id="{{ section }}">
            <!--{#% render 'navbar' %#}-->
            ${ content }
          </div>
          <!--  {#% render 'search' %#} -->
        </div>
      </body>
    </html>
  `
}