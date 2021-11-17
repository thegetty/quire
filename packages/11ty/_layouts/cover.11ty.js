const { html, oneLine } = require('common-tags')
const pageButtons = require('../_includes/components/pageButtons.11ty.js')
const path = require('path')

exports.data = {
  layout: 'base'
};

exports.render = function(data) {
  const { config, content, publication } = data
  const coverImage = data.image || publication.promo_image
  const imagePath = path.join('/', '_assets', config.params.imageDir, coverImage)

  return html`
    <div id="main" class="quire-cover" role="main">

      <section class="quire-cover__hero hero is-fullheight">
        <div class="quire-cover__overlay" style="background-image: url('${imagePath}');"/>
        <div class="quire-cover__hero-body hero-body">
          <div class="container is-fluid">
            <h1 class="title">${this.qtitle()}</h1>
            <p class="reading-line">${this.markdownify(publication.reading_line)}</p>
            <div class="contributor">
              ${this.markdownify(publication.contributor_as_it_appears)}
              <span class="visually-hidden">Contributors:&nbsp;</span>
              ${this.contributors}
            </div>
          </div>
        </div>
      </section>

      <section class="quire-cover__more next-page">
        <div class="quire-cover__more-body hero-more">
          <a href="#content">
            ${this.qicon('down-arrow', 'Scroll down to read more')}
          </a>
        </div>
      </section>

      <section id="content" class="section quire-page__content">
        <div class="container is-fluid">
          <div class="content">
            ${content}
            <!-- {% render "page/bibliography" %} -->
          </div>
        </div>
      </section>

      <section class="quire-cover__more">
        <div class="quire-cover__more-body hero-more next-page">
          <a href="${data.pages[1].permalink}">
            ${this.qicon('down-arrow', 'Scroll down to read more')}
          </a>
        </div>
      </section>

      <!--
      {% if config.params.pdf %}
        {% render "pdf-title-pages" %}
      {% endif %}
      -->
    </div>
  `
}
