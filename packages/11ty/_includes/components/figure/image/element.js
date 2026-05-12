/**
 * Renders an image
 *
 * @param      {Object}  eleventyConfig  eleventy configuration
 * @param      {Object}  figure          The figure object
 *
 * @return     {String}  An HTML <img> element, `<canvas-panel>` or `<image-service>` web components
 */
export default function (eleventyConfig) {
  const canvasPanel = eleventyConfig.getFilter('canvasPanel')
  const imageService = eleventyConfig.getFilter('imageService')
  const imageSequence = eleventyConfig.getFilter('figureImageSequence')
  const imageTag = eleventyConfig.getFilter('imageTag')

  return function (figure, options) {
    const {
      alt,
      transformations,
      isCanvas,
      isImageService,
      isSequence,
      staticInlineFigureImage,
      lazyLoading
    } = figure

    const { interactive, preset, lightbox } = options

    if (preset) {
      figure.preset = preset
    }

    switch (true) {
      case isSequence:
        if (!interactive && staticInlineFigureImage) {
          return imageTag({
            alt,
            height: transformations['static-inline-figure-image'].dimensions.height,
            isStatic: !interactive,
            lazyLoading,
            lightbox,
            src: staticInlineFigureImage,
            width: transformations['static-inline-figure-image'].dimensions.width
          })
        } else {
          return imageSequence(figure, options)
        }
      case isCanvas:
        if (!interactive && staticInlineFigureImage) {
          return imageTag({
            alt,
            height: transformations['static-inline-figure-image'].dimensions.height,
            isStatic: !interactive,
            lazyLoading,
            lightbox,
            src: staticInlineFigureImage,
            width: transformations['static-inline-figure-image'].dimensions.width
          })
        } else {
          return canvasPanel(figure)
        }
      case isImageService:
        if (!interactive && staticInlineFigureImage) {
          return imageTag({
            alt,
            height: transformations['static-inline-figure-image'].dimensions.height,
            isStatic: !interactive,
            lazyLoading,
            lightbox,
            src: staticInlineFigureImage,
            width: transformations['static-inline-figure-image'].dimensions.width
          })
        } else {
          return imageService(figure)
        }
      case !lightbox && Boolean(staticInlineFigureImage):
        return imageTag({
          alt,
          height: transformations['static-inline-figure-image'].dimensions.height,
          isStatic: true,
          lazyLoading,
          lightbox,
          src: staticInlineFigureImage,
          width: transformations['static-inline-figure-image'].dimensions.width
        })
      default:
        return imageTag({ ...figure, lightbox })
    }
  }
}
