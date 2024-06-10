/**
 * Contents page template for TOC and Section TOCs. 
 * Page content from the markdown will appear in the content outlet below. 
 * The Table of Contents list will appear below that. 
 * It is scoped to show the contents of the full site. 
 * Pages can be removed from the TOC indivudally by setting toc to `false` in the page yaml.
 */

module.exports = class TableOfContents {
  data() {
    return {
      classes: ['quire-contents'],
      layout: 'base'
    }
  }

  async render(data) {
    const {
      collections,
      content,
      key,
      page,
      pages,
      pagination,
      presentation='list'
    } = data

    const contentElement = content
      ? `
        <div class="container">
          <div class="content">
            ${content}
          </div>
        </div>
        `
      : ''
    const containerClass = presentation === 'grid' ? 'is-fullhd' : ''

    return this.renderTemplate(
      `{% pageHeader
        byline_format=byline_format,
        image=image,
        label=label,
        pageContributors=pageContributors,
        subtitle=subtitle,
        title=title,
        key=key,
        page_pdf_output=page_pdf_output,
        outputs=outputs
      %}
      <section class="section quire-page__content">
        ${contentElement}
        <div class="container ${containerClass}">
          <div class="quire-contents-list ${presentation}">
            ${await this.tableOfContents({ collections, currentPageUrl: page.url, key, presentation })}
            <div class="content">
              {% bibliography citations outputs page_pdf_output %}
            </div>
          </div>
          ${this.pageButtons({ pagination })}
        </div>
      </section>`,
      'liquid',
      data
    )
  }
}
