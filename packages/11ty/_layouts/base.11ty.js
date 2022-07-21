const { html } = require('~lib/common-tags')

/**
 * Base layout as a JavaScript method
 *
 * @param      {Object}  data    Final data from the Eleventy data cascade
 * @return     {Function}  Template render function
 */
module.exports = function(data) {
  const { pageClasses, collections, content, pageData, publication } = data
  const { outputPath } = pageData || {}

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
            <div class="quire__primary" id="{{ section }}">
              ${this.navigation(data)}
              <main id="main" class="quire-page ${pageClasses}" data-output-path="${outputPath}">
                ${content}
              </main>
            </div>
            {% render 'search' %}
          </div>
          ${this.modal()}
          ${this.scripts()}
        </body>
      </html>
    `,
    'liquid'
  )
}
