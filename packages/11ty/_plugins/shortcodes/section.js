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
  const { controls, copyButton } = eleventyConfig.globalData.config.accordion
  const controlsClass = `accordion-section__controls--${controls}`
  
  return (content, heading, id, open) => {
    const slug = slugify(heading)
    const sectionId = id || `section-${slug}`
    return oneLine`
      <details class="accordion-section" id="${sectionId}" ${open ? 'open' : ''}>
        <summary class="accordion-section__heading accordion-section__controls ${controlsClass}">
          <button
            aria-label="${copyButton.ariaLabel}"
            class="accordion-section__copy-link-button tooltip"
            data-text="${copyButton.copied}"
            data-outputs-exclude="pdf,epub"
            value="#${sectionId}"
          >
            ${copyButton.text}
          </button>
          ${markdownify(heading, { inline: false })}
        </summary>
        <section class="accordion-section__body">${markdownify(content, { inline: false })}</section>
      </details>
    `
  }
}
  