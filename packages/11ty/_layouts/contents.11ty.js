/**
 * Contents page template for TOC and Section TOCs. 
 * Page content from the markdown will appear in the content outlet below. 
 * The Table of Contents list will appear below that. 
 * It is scoped to show the contents of the full site. 
 * Pages can be removed from the TOC indivudally by setting toc to `false` in the page yaml.
 */
const contentsItemToc = require('../_includes/contentsItemToc.11ty.js');

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

    /**
     * @todo get pages from global data
     */
    let pages;
    switch (true) {
      case config.params.pdf:
        pages = collections.all.filter(({ pdf }) => pdf);
        break;
      case config.params.epub:
        pages = collections.all.filter(({ epub }) => epub);
        break;
      default:
        pages = collections.all; // this might need to be filtered by online != 'false'
        break;
    }
    pages = pages.filter(({data}) => data.type !== 'data')

    let renderedSection
    const listItems = pages.map((page) => {
      let listItem = ''
      const currentPage = page.url === tocPage.url;
      if (page.data.layout !== 'contents' && !section && !page.data.section) {
        if (!currentPage) {
          return `
            <li class="page-item">
              ${contentsItemToc(this, data, page)}
            </li>`;
        }
      } else if (
        page.data.layout === 'contents' &&
        page.data.section !== renderedSection
      ) {
        renderedSection = page.data.section;
        if (!currentPage) {
          listItem += `<li class="section-item">${contentsItemToc(this, data, page)}`;
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
                return `<li class="page-item">${contentsItemToc(this, data, item)}</li>`;
            });
          listItem += `<ul>${subListItems.join('')}</ul>`;
        }
        listItem += '</li>';
        return listItem;
      }
    });

    return this.renderTemplate(
      `<div class="{% render 'page/class' %} quire-contents" id="main" role="main">
        {% render "page/header" %}
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
            {% render 'footer-buttons' %}
          </div>
        </section>
      </div>`,
      'liquid',
      data.argData
    );
  }
};
