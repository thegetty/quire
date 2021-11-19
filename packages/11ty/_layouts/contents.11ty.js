/**
 * Contents page template for TOC and Section TOCs. 
 * Page content from the markdown will appear in the content outlet below. 
 * The Table of Contents list will appear below that. 
 * It is scoped to show the contents of the full site. 
 * Pages can be removed from the TOC indivudally by setting toc to `false` in the page yaml.
 */

module.exports = class Contents {
  data() {
    return {
      layout: 'base'
    }
  }

  render(data) {
    const {
      class: className,
      collections,
      config,
      content,
      page: tocPage,
      pages,
      pagination,
      section
    } = data;

    const contentElement = content
      ? `
        <div class="container">
          <div class="content">
            ${content}
          </div>
        </div>
        `
      : '';
    const containerClass = className === 'grid' ? 'is-fullhd' : '';
    const contentsListClass = ['abstract', 'brief', 'grid'].includes(className)
      ? className
      : 'list';

    let renderedSection

    const listItems = pages
      .filter((page) => page.data.type !== 'data' && page.data.toc !== false)
      .map((page) => {
        let listItem = ''
        const currentPage = page.url === tocPage.url;
        if (page.data.layout !== 'contents' && !section && !page.data.section) {
          if (!currentPage) {
            return `
              <li class="page-item">
                ${this.contentsItem(data, page)}
              </li>`;
          }
        } else if (
          page.data.layout === 'contents' &&
          page.data.section !== renderedSection
        ) {
          renderedSection = page.data.section;
          if (!currentPage) {
            listItem += `<li class="section-item">${this.contentsItem(data, page)}`;
          } else {
            const sectionPage = pages.find(
              (item) => page.data.section === item.data.section && item.data.layout === 'contents'
            );
            listItem += `<li class="section-item no-landing">`
            listItem += `<div class="list-header">${sectionPage.data.title}</div>`;
          }
          if (config.params.tocType === 'full') {
            const subListItems = pages
              .filter((item) => item.data.section === page.data.section && item.data.layout !== 'contents')
              .map((item) => {
                if (page.fileSlug !== item.fileSlug)
                  return `<li class="page-item">${this.contentsItem(data, item)}</li>`;
              });
            listItem += `<ul>${subListItems.join('')}</ul>`;
          }
          listItem += '</li>';
          return listItem;
        }
      });

    return this.renderTemplate(
      `<div class="{% render 'page/class' %} quire-contents" id="main" role="main">
        {% render "page/header", data: data %}
        <section class="section quire-page__content" id="content">
          ${contentElement}
          <div class="container ${containerClass}">
            <div class="quire-contents-list ${contentsListClass}">
              <div class="menu-list">
                <ul>
                  ${listItems.join('')}
                </ul>
              </div>
              <div class="content">
                {% render 'page/bibliography' %}
              </div>
            </div>
            ${this.pageButtons(pagination)}
          </div>
        </section>
      </div>`,
      'liquid',
      data
    );
  }
};
