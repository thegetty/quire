const { globalVault } = require('@iiif/vault')
const vault = globalVault()

/**
 * Fetches IIIF data needed to render canvas panel tags from vault and adds it to figures.yaml
 * @param  {Object} eleventyConfig
 */
module.exports = (eleventyConfig) => {
  const figureIIIF = eleventyConfig.getFilter('figureIIIF')
  const hasCanvasPanelProps = eleventyConfig.getFilter('hasCanvasPanelProps')
  const { figures } = eleventyConfig.globalData

  figures.figure_list
    .forEach(async (figure, index) => {
      if (!hasCanvasPanelProps(figure)) return

      /**
       * Add choices to globalData
       */
      const getChoices = (annotations = []) => {
        return annotations.flatMap(({ id, type }) => {
          const annotation = vault.get(id)
          if (annotation.motivation.includes('painting')) {
            const bodies = vault.get(annotation.body)
            for (const body of bodies) {
              const { items, type } = body
              return type === 'Choice'
                ? items.map(({ id }) => vault.get(id))
                : []
            }
          }
        })
      }

      const { canvas, choiceId, manifest } = await figureIIIF(figure)

      let choices = getChoices(canvas.annotations)
      if (!choices.length && canvas.items.length) {
        canvas.items.map(({ id, type }) => {
          if (type === 'AnnotationPage') {
            const annotationPage = vault.get(id)
            choices = getChoices(annotationPage.items)
          }
        })
      }
      eleventyConfig.globalData.figures.figure_list[index] = {
        ...eleventyConfig.globalData.figures.figure_list[index],
        canvas,
        choices,
        choiceId,
        manifest
      }
      // console.warn('adding global data to ', figure.id, eleventyConfig.globalData.figures.figure_list[index])
      // console.warn(eleventyConfig.globalData.figures.figure_list[index])
    })
}
