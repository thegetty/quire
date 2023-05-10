const { oneLine } = require('~lib/common-tags')
/**
 * Accordion component
 *
 * @param      {String}  content  content to render in the accordion body
 * @param      {String}  heading  content to render in the accordion heading
 * @param      {String}  id       (optional) details id
 * @param      {String}  open     (optional) accordion initial state
 *
 * @return     {String}  An HTML <details> element with <summary> and <section>
 */
module.exports = function (eleventyConfig) {
  const markdownify = eleventyConfig.getFilter('markdownify')
  const slugify = eleventyConfig.getFilter('slugify')
  const { controls, copyButton } = eleventyConfig.globalData.config.accordion
  if (!controls || !['arrow', 'plus-minus'].includes(controls)) {
    console.error(`Controls are required for accordions. Options are "arrow" or "plus-minus". Please set this value in your config.yaml`)
    return ''
  }
  const controlsClass = `accordion-section__controls--${controls}`
  
  return (content, heading, id, open) => {
    const slug = slugify(heading)
    const sectionId = id ? id.toLowerCase() : `section-${slug}`

    return oneLine`
      <details class="accordion-section" id="${sectionId}" ${open ? 'open' : ''}>
        <summary class="accordion-section__heading accordion-section__controls ${controlsClass}">
          <button
            aria-label="${copyButton.ariaLabel}"
            class="accordion-section__copy-link-button accordion-tooltip"
            data-text="${copyButton.successText}"
            data-outputs-exclude="pdf,epub"
            value="#${sectionId}"
          >
            ${copyButton.symbol}
          </button>
          ${markdownify(heading, { inline: false })}
        </summary>
        <section class="accordion-section__body">${markdownify(content, { inline: false })}</section>
      </details>
    `
  }
}
