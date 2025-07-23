import path from 'node:path'

/**
 * Test if a figure uses an image-service
 *
 * @param  {Object} figure
 * @return {Boolean}
 */
export default function (figure) {
  const { src, iiif_image } = figure
  if (iiif_image) return true
  if (!src) return false

  return path.parse(src) === 'info.json'
}
