const { html } = require('~lib/common-tags')

/**
 * Base layout as a JavaScript method
 *
 * @param      {Object}  data    Final data from the Eleventy data cascade
 * @return     {Function}  Template render function
 */
module.exports = async function(data) {
  const { pageClasses, collections, content, pageData, publication } = data
  const { outputPath, url } = pageData || {}

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
              <main id="${this.slugify(url)}" class="quire-page ${pageClasses}" data-output-path="${outputPath}">
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
