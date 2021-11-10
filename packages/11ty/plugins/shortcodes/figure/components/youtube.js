const { oneLine } = require('common-tags')
module.exports = function (eleventyConfig, { config }, figure) {
  const qfigurecaption = eleventyConfig.getFilter('qfigurecaption')
  const qfigureimage = eleventyConfig.getFilter('qfigureimage')
  const qfigureplaceholder = eleventyConfig.getFilter('qfigureplaceholder')
  const qfigurelabel = eleventyConfig.getFilter('qfigurelabel')

  const { aspectRatio, id, label, media_id } = figure
  const src = `https://youtu.be/${media_id}`

  if (!media_id) {
    console.warn(`Error: Cannot render youtube component without media_id. Check figures id ${ id }`)
    return ''
  }

  if (config.params.epub || config.params.pdf) {
    return oneLine`
      ${qfigureplaceholder(figure)}
      <figcaption class="quire-figure__caption caption">
        <a href="https://youtu.be/${ media_id }" target="_blank">${ src }</a>
      </figcaption>
    `
  }

  /**
   * @todo fix this, currently using image shortcode since iframe causes error
   */
  // const videoElement = `<div class="q-figure__media-wrapper--${ aspectRatio || 'widescreen' }">
  //     <iframe
  //       allowfullscreen
  //       class="q-figure__media"
  //       frameborder="0"
  //       src="https://www.youtube.com/embed/${ media_id }?rel=0&amp;showinfo=0"
  //     />
  //   </div>
  //   ${ label && config.params.figureLabelLocation === 'on-top' ? qfigurelabel(figure) : '' }
  //   ${ qfigurecaption(figure) }`
  const videoElement = qfigureimage(figure)

  return oneLine`${videoElement}`
}