/**
 * MIME type mappings for common web assets
 *
 * Used by the static file server to set correct Content-Type headers.
 *
 * @module lib/server/mime-types
 */
import path from 'node:path'

/**
 * MIME types for common web assets
 */
export const MIME_TYPES = {
  // HTML/Text
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.json': 'application/json',
  '.xml': 'application/xml',
  '.txt': 'text/plain',

  // Images
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.avif': 'image/avif',

  // Fonts
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.eot': 'application/vnd.ms-fontobject',

  // Documents
  '.pdf': 'application/pdf',
  '.epub': 'application/epub+zip',

  // Media
  '.mp3': 'audio/mpeg',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.ogg': 'audio/ogg',
  '.wav': 'audio/wav',
}

/**
 * Default MIME type for unknown file extensions
 */
export const DEFAULT_MIME_TYPE = 'application/octet-stream'

/**
 * Get MIME type for a file based on extension
 * @param {string} filePath - Path to file
 * @returns {string} MIME type
 */
export function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase()
  return MIME_TYPES[ext] || DEFAULT_MIME_TYPE
}
