import { exists } from '../../helpers/exists.js'
import { fileURLToPath } from 'url'
import fs from 'fs'
import { normalizeImagePath } from '../../helpers/normalize.js'
import path from 'path'

const schemaCache = new Map()

export function getSchemaForDocument(file) {
  const schemaName = path.basename(file, path.extname(file))
  const __dirname = path.dirname(fileURLToPath(import.meta.url))
  const schemaPath = path.join(__dirname, '..', 'schemas', `${schemaName}.schema.json`)

  // Prevent from loading schema multiple times when checking for multiple files
  if (!schemaCache.has(schemaPath)) {
    schemaCache.set(schemaPath, JSON.parse(fs.readFileSync(schemaPath, 'utf8')))
  }

  return schemaCache.get(schemaPath)
}

// TODO check all image paths in respective documents
export function checkIfImagesExist(doc) {
  let errors = []
  const promoImagePath = normalizeImagePath(doc['promo_image'])
  if(!exists(promoImagePath)) {
    errors.push(`Promo image does not exist at path: ${promoImagePath}`)
  }

  // TODO Check all contributor images
  const contributorImagePath = normalizeImagePath(doc.contributor[0].image)
  if(!exists(contributorImagePath)) {
    errors.push(`Contributor image does not exist at path: ${contributorImagePath}`)
  }
  
  return errors
}
