const { globalVault } = require('@iiif/vault')
const vault = globalVault()

/**
 * Very simplified method to get choices
 * Expects a valid manifest where choices all have identifiers
 * @todo replace with vault helper
 */

const getChoices = (annotations=[]) => {
  return annotations.flatMap(({ id, type }) => {
    const annotation = vault.get(id)
    if (annotation.motivation.includes('painting')) {
      const bodies = vault.get(annotation.body)
      for (const body of bodies) {
        const { items, type } = body
        return type === 'Choice' ? items.map(({ id }) => vault.get(id)) : []
      }
    }
  })
}

module.exports = (canvas) => {
  let choices = getChoices(canvas.annotations)
  if (!choices.length && canvas.items.length) {
    canvas.items.map(({ id, type }) => {
      if (type === 'AnnotationPage') {
        const annotationPage = vault.get(id)
        choices = getChoices(annotationPage.items)
      }
    })
  }
  return choices
}
