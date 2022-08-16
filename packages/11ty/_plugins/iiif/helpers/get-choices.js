const { globalVault } = require('@iiif/vault')
const vault = globalVault()

/**
 * Very simplified method to get choices - expects a valid manifest where choices all have identifiers
 * @todo replace with vault helper
 */
module.exports = (annotations = []) => {
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
