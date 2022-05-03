const { globalVault } = require('@iiif/vault')
const vault = globalVault()

/**
 * Very simplified method to get choices - expects a valid manifest where choices all have identifiers
 * @todo replace with vault helper
 */
const getChoices = (annotations=[]) => {
  return annotations.flatMap(({ id, type }) => {
    const annotation = vault.get(id)
    if (annotation.motivation.includes('painting')) {
      const bodies = vault.get(annotation.body)
      for (const body of bodies) {
        const { items, type } = body
        return (type === 'Choice') ? items.map(({ id }) => vault.get(id)) : []
      }
    }
  })
}

module.exports = function(eleventyConfig) {
  const figureIIIF = eleventyConfig.getFilter('figureIIIF')

  return async function(figure) {
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
    hasChoices = !!choices.length
    return choices.map((item, index) => {
      const classes = ['canvas-choice']
      if (item.id === choiceId) classes.push('canvas-choice--active')
      return `
        <button class="${classes.join(' ')}" type="button" value="${item.id}">
          ${item.label.en ? item.label.en[0] : item.label}
        </button>
      `
    }).join('')
  }
}
