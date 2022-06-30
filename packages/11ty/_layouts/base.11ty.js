const { html } = require('common-tags')

/**
 * Base layout as a JavaScript method
 *
 * @param      {Object}  data    Final data from the Eleventy data cascade
 * @return     {Function}  Template render function
 */
module.exports = function(data) {
  const { collections, content, pageData, publication } = data
  const { outputPath } = pageData || {}

  return this.renderTemplate(
    html`
      <!doctype html>
      <html lang="${publication.language}">
        ${this.head(data)}
        <body>
          ${this.icons(data)}
          ${this.iconscc(data)}
          <div class="quire no-js">
            ${this.menu({ collections, pageData })}
            <main class="quire__primary">
              ${this.navigation(data)}
              <section data-output-path="${outputPath}">
                ${content}
              </section>
            </main>
            {% render 'search' %}
          </div>
          ${this.scripts()}
        </body>
      </html>
    `,
    'liquid'
  )
}
