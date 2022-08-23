const path = require('path')
const { globalVault } = require('@iiif/vault')
const vault = globalVault()

/**
 * Very simplified method to get choices
 * Expects a valid manifest where choices all have identifiers
 * @todo replace with vault helper
 */
const getChoicesFromVault = (annotations=[]) => {
  return annotations.flatMap(({ id, type }) => {
    const annotation = vault.get(id)
    if (annotation.motivation.includes('painting')) {
      const bodies = vault.get(annotation.body)
      for (const body of bodies) {
        const { items, type } = body
        return type === 'Choice' ? items.map(({ id }) => {
          return { id, type: 'choice' }
        }) : []
      }
    }
  })
}

/**
 * Returns `figure.annotations` with `iiifId` and `type` attributes
 */
module.exports = (iiifConfig, figure, canvas) => {
  /**
   * Annotations defined on the `figure`
   */
  if (figure.annotations) {
    return figure.annotations.map((annotationSet) => {
      annotationSet.items = annotationSet.items.map((item) => {
        const type = item.src && !item.target ? 'choice' : 'annotation'
        let vaultItem
        if (item.id) {
          vaultItem = vault.get(item.id)
        }
        if (!vaultItem) {
          const iiifId = new URL([iiifConfig.inputDir, item.src].join('/'), process.env.URL).href
          vaultItem = vault.get(iiifId)
        }
        return {
          ...item,
          iiifId: vaultItem.id,
          type
        }
      })
      return annotationSet
    })
  }

  /**
   * If no `figure.annotations` are defined and this is an external manifest
   * Return annotations from manifest and add `type` property
   * Currently only returns "choice" annotations
   * @todo include all annotation types
   */
  let choices = getChoicesFromVault(canvas.annotations)
  if (!choices.length && canvas.items.length) {
    canvas.items.map(({ id, type }) => {
      if (type === 'AnnotationPage') {
        const annotationPage = vault.get(id)
        choices = getChoicesFromVault(annotationPage.items)
      }
    })
  }
  return choices
}
