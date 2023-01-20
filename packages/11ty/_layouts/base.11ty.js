const path = require('path')
const { html } = require('~lib/common-tags')

/**
 * Base layout as a JavaScript method
 *
 * @param      {Object}  data    Final data from the Eleventy data cascade
 * @return     {Function}  Template render function
 */
module.exports = async function(data) {
  const { pageClasses, collections, content, pageData, publication } = data
  const { inputPath, outputPath, url } = pageData || {}
  const pageId = this.slugify(url) || path.parse(inputPath).name

  return this.renderTemplate(
    html`
      <!doctype html>
      <html lang="${publication.language}">
        ${this.head(data)}
        <body>
          ${this.icons(data)}
          ${this.iconscc(data)}
          <div class="quire no-js" id="container">
            <div
              aria-expanded="false"
              class="quire__secondary"
              id="site-menu"
              role="contentinfo"
              data-outputs-exclude="epub,pdf"
            >
              ${this.menu({ collections, pageData })}
            </div>
            <div class="quire__primary">
              ${this.navigation(data)}
              <main class="quire-page ${pageClasses}" data-output-path="${outputPath}" data-page-id="${pageId}" >
                ${content}
              </main>
            </div>
            {% render 'search' %}
          </div>
          ${await this.modal()}
          ${this.scripts()}
        </body>
      </html>
    `,
    'liquid'
  )
}
