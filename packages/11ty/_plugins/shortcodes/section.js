const { oneLine } = require('~lib/common-tags')
/**
 * Accordion component
 *
 * @param      {String}  content  content to render in the accordion body
 * @param      {String}  heading  content to render in the accordion heading
 * @param      {String}  open  accordion initial state
 *
 * @return     {String}  An HTML <details> element with <summary> and <section>
 */
module.exports = function (eleventyConfig) {
    const markdownify = eleventyConfig.getFilter('markdownify')
    const slugify = eleventyConfig.getFilter('slugify')
    const { button, controls } = eleventyConfig.globalData.config.accordion
    const controlsClass = `accordion-section__controls--${controls}`
    
    return (content, heading, open) => {
      const id = `section-${slugify(heading)}`
      return oneLine`
        <details class="accordion-section" id="${id}" ${open ? 'open' : ''}>
            <summary class="accordion-section__heading ${controlsClass}">
              <a href="#${id}" class="accordion-section__heading-link">
                <span class="accordion-section__heading-link-content">${button}</span>
              </a>
              ${markdownify(heading, { inline: false })}
            </summary>
            <section class="accordion-section__body">${markdownify(content, { inline: false })}</section>
        </details>
      `
    }
  }
  