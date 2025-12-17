import YamlDuplicateIdError from '../errors/validation/yaml-duplicate-error.js'
import { fileURLToPath } from 'url'
import fs from 'node:fs'
import path from 'path'
import { projectRoot  } from '#lib/11ty/index.js'

const IMAGE_KEYS = new Set(['src', 'image', 'logo'])

export function getSchemaForDocument(file) {
  const schemaName = path.basename(file, path.extname(file))
  const __dirname = path.dirname(fileURLToPath(import.meta.url))
  const schemaPath = path.join(__dirname,'..','..','schemas', `${schemaName}.schema.json`)

  try {
    return JSON.parse(fs.readFileSync(schemaPath, 'utf8'))
  } catch (error) {
    console.warn(`Warning: No schema found for document ${schemaName} at path: ${schemaPath}.`)
    return null
  }
}

// Recursive helper to check image paths in nested figure list structures
function collectImagePaths(node, paths=[]) {
  if(!node || typeof node !== 'object') return

  for (const key in node) {
    const value = node[key]
    if (IMAGE_KEYS.has(key) && typeof value === 'string') {
      paths.push(value)
    }
    collectImagePaths(value, paths)
  }

  return paths
}

function validateImage(label, src) {
  if(!src) return

  let assetPath = ''
  if(src.endsWith('.html')) {
    assetPath = path.join(projectRoot, 'content', '_assets', src)
  } else {
    assetPath = path.join(projectRoot, 'content', '_assets', 'images', src)
  }

  if(!fs.existsSync(assetPath)) {
    console.warn(`Warning: ${label} source not found at path: ${assetPath}`)
  }
}

export function validateImagePaths(doc) {
  validateImage('Cover image', doc?.epub?.defaultCoverImage)
  validateImage('Promo image', doc?.promo_image)

  for (const figure of doc?.figure_list || []) {
    let paths = []
    const imagePaths = collectImagePaths(figure, paths)
    for (const imgPath of imagePaths) {
      validateImage(`Figure id ${figure.id}`, imgPath)
    }
  }

  for (const publisher of doc?.publisher || []) {
    validateImage('Logo', publisher.logo)
  }

  for (const contributor of doc?.contributor || []) {
    validateImage('Contributor', contributor.image)
  }
}

/**
 * Lifted from packages/11ty/_plugins/globalData
 * Throws an error if data contains duplicate ids
 * @param  {Object|Array} data
 */
export const checkForDuplicateIds = function (data, file) {
  if (!data) return

  if (Array.isArray(data)) {
    if (data.every((item) => Object.hasOwn(item, 'id'))) {
      const duplicates = data.filter((a, index) => {
        return index !== data.findIndex((b) => b.id === a.id)
      })
      if (duplicates.length) {
        const ids = duplicates.map(({ id }) => id)
        throw new YamlDuplicateIdError(file, `Error in ${file}: Duplicate IDs found: ${ids.join(', ')}`)
      }
    }
  }

  if (typeof data === 'object') {
    Object.keys(data).forEach((key) => {
      checkForDuplicateIds(data[key], file)
    })
  }
}
