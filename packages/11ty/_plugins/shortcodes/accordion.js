const { oneLine } = require('~lib/common-tags')
const chalkFactory = require('~lib/chalk')

const logger = chalkFactory('shortcodes: accordion')

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
module.exports = function (eleventyConfig, { page }) {
  const markdownify = eleventyConfig.getFilter('markdownify')
  const slugify = eleventyConfig.getFilter('slugify')
  let { controls, copyButton } = eleventyConfig.globalData.config.accordion
  if (!controls || !['arrow', 'plus-minus'].includes(controls)) {
    logger.warn(`Accordion controls have been set to "${controls}" but only "arrow" (default) or "plus-minus" are allowed. The default value has been used.`)
    controls = 'arrow'
  }

  return (content, heading, id, open) => {
    if (!content || !heading) {
      logger.warn(`An accordion section on "${page.url}" does not include the required heading parameter, no accordion was created`)
      return ''
    }

    // Define slug
    const slug = slugify(heading)
    const sectionId = id ? id.toLowerCase() : `section-${slug}`

    // Determine class names
    const pattern = /^(#+)[^\s\w]/g
    const headingLevel = heading.match(pattern) && heading.match(pattern)[0].split('').length
    const headingLevelClass = `accordion-section__heading-level-${headingLevel}`
    const controlsClass = `accordion-section__controls--${controls}`
    const summaryClasses = [
      'accordion-section__heading', headingLevelClass, 'accordion-section__controls', controlsClass
    ].filter((x) => x)

    const printComponent = `
      <section id="${sectionId}" class="accordion-section" data-outputs-include="epub,pdf">
        ${markdownify(heading, { inline: false })}
        ${markdownify(content, { inline: false })}
      </section>
    `

    const htmlComponent = `
      <details class="accordion-section" id="${sectionId}" ${open ? 'open' : ''} data-outputs-include="html">
        <summary class="${summaryClasses.join(' ')}" tabindex="1">
          <button
            aria-label="${copyButton.ariaLabel}"
            class="accordion-section__copy-link-button"
            data-outputs-exclude="pdf,epub"
            value="#${sectionId}"
            tabindex="2"
          >
            ${copyButton.symbol}
          </button>
          <span
            aria-hidden="true"
            class="accordion-tooltip"
            data-outputs-exclude="pdf,epub"
          >
            ${copyButton.successText}
          </span>
          ${markdownify(heading, { inline: false })}
        </summary>
        <section class="accordion-section__body">${markdownify(content, { inline: false })}</section>
      </details>
    ` 

    return oneLine`
      ${printComponent}
      ${htmlComponent}
    `
  }
}
