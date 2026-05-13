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
      case isSequence && interactive:
        return imageSequence(figure, options)

      case isCanvas && interactive:
        return canvasPanel(figure)

      case isImageService && interactive:
        return imageService(figure)

      case isSequence && !interactive && staticInlineFigureImage:
      case isCanvas && !interactive && staticInlineFigureImage:
      case isImageService && !interactive && staticInlineFigureImage:
      case !lightbox && Boolean(staticInlineFigureImage): {
        const { paths, dimensions } = transformations.staticInlineFigureImage
        const { height, width } = dimensions

        // Choose media path based on whether path will be loaded as-is or processed by 11ty
        const src = lightbox ? paths.absolute : paths.internal

        return imageTag({
          alt,
          height,
          isStatic: lightbox ? !interactive : true,
          lazyLoading,
          lightbox,
          src,
          width
        })
      }

      default: {
        const { full } = transformations
        const { paths } = full

        return imageTag({ ...figure, lightbox, src: paths.absolute })
      }
    }
  }
}
