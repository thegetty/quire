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
      layout: 'base'
    }
  }

  render(data) {
    const {
      collections,
      content,
      page,
      pages,
      pagination,
      section,
      type
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
    const containerClass = type === 'grid' ? 'is-fullhd' : ''
    const contentsListClass = ['abstract', 'brief', 'grid'].includes(type)
      ? type
      : 'list'

    /**
     * The pages to include in the table of contents
     * Either the project or a project section
     */
    const currentNavigationItem = this.eleventyNavigation(collections.tableOfContents).find(
      ({ url }) => url === page.url
    )
    const navigation = currentNavigationItem.children && currentNavigationItem.children.length
      ? currentNavigationItem.children
      : this.eleventyNavigation(collections.tableOfContents)

    return this.renderTemplate(
      `<div class="{% pageClass pages=pages, pagination=pagination %} quire-contents" id="main" role="main">
        {% pageHeader
          contributor=contributor,
          contributor_as_it_appears=contributor_as_it_appears,
          contributor_byline=contributor_byline,
          image=image,
          label=label,
          subtitle=subtitle,
          title=title
        %}
        <section class="section quire-page__content" id="content">
          ${contentElement}
          <div class="container ${containerClass}">
            <div class="quire-contents-list ${contentsListClass}">
              ${this.tableOfContentsList({ navigation, type })}
              <div class="content">
                {% bibliography %}
              </div>
            </div>
            ${this.pageButtons({ pagination })}
          </div>
        </section>
      </div>`,
      'liquid',
      data
    )
  }
}
