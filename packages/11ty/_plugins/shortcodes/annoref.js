const chalkFactory = require('~lib/chalk')
const { oneLine } = require('~lib/common-tags')
const logger = chalkFactory(`Shortcodes:Annoref`)
/**
 * Style wrapped `content` as "backmatter"
 *
 * @param      {String}  content  content between shortcode tags
 *
 * @return     {boolean}  A styled HTML <div> element with the content
 */
module.exports = function (eleventyConfig) {
  const getAnnotation = eleventyConfig.getFilter('getAnnotation')
  const markdownify = eleventyConfig.getFilter('markdownify')
  return ({ anno='', fig, region='', text='' }) => {
    const annoIds = anno.split(',').map((id) => id.trim())
    const annotationUrls = annoIds.flatMap((id) => {
      const annotation = getAnnotation(fig, id)
      return annotation ? annotation.url : []
    })
    return oneLine`
      <a 
        class="annoref"
        data-annotation-ids="${annotationUrls.join(',')}"
        data-figure-id="${fig}"
        data-region="${region}"
      >${markdownify(text)}</a>
    `
  }
}
