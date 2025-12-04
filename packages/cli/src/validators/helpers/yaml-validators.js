import { exists } from '../../helpers/exists.js'
import { fileURLToPath } from 'url'
import fs from 'fs'
import { normalizeImagePath } from '../../helpers/normalize.js'
import path from 'path'

const schemaCache = new Map()
const allowedImageExtensions = new Set([
  '.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.tiff'
])

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

// TODO check media type before source
// Check deeply nested image paths
function validateImage(label, src) {
  if(!src) return

  if(!allowedImageExtensions.has(path.extname(src).toLowerCase())) {
    throw new Error(`${label} has an invalid file extension: ${src}`)
  }
  
  const imagePath = normalizeImagePath(src)
  if(!exists(imagePath)) {
    throw new Error(`${label} does not exist at path: ${imagePath}`)
  }
}

export function validateImagePaths(doc) {
  validateImage('Cover image', doc?.epub?.defaultCoverImage)
  validateImage('Promo image', doc?.promo_image)

  for (const figure of doc?.figure_list || []) {
    validateImage('Figure', figure?.src)
  }

  for (const publisher of doc?.publisher || []) {
    validateImage('Logo', publisher?.logo)
  }

  for (const contributor of doc?.contributor || []) {
    validateImage('Contributor', contributor?.image)
  }
}