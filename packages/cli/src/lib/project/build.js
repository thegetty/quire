/**
 * Build detection module
 *
 * Detects if build output exists and provides build status information.
 *
 * @module lib/project/build
 */
import fs from 'node:fs'
import path from 'node:path'
import paths from './paths.js'

/**
 * Get build output information
 *
 * @param {string} [projectRoot] - Project root directory (defaults to cwd)
 * @returns {Object} Build status information
 */
export function getBuildInfo(projectRoot = paths.getProjectRoot()) {
  const sitePath = path.join(projectRoot, '_site')
  const epubPath = path.join(projectRoot, '_epub')

  const info = {
    site: {
      exists: fs.existsSync(sitePath),
      path: sitePath,
      mtime: null,
    },
    epub: {
      exists: fs.existsSync(epubPath),
      path: epubPath,
      mtime: null,
    },
  }

  // Get modification times if directories exist
  if (info.site.exists) {
    info.site.mtime = fs.statSync(sitePath).mtime
  }
  if (info.epub.exists) {
    info.epub.mtime = fs.statSync(epubPath).mtime
  }

  return info
}

/**
 * Check if site build output exists
 *
 * @param {string} [projectRoot] - Project root directory (defaults to cwd)
 * @returns {boolean} True if _site directory exists
 */
export function hasSiteOutput(projectRoot = paths.getProjectRoot()) {
  const sitePath = path.join(projectRoot, '_site')
  return fs.existsSync(sitePath)
}

/**
 * Check if epub build output exists
 *
 * @param {string} [projectRoot] - Project root directory (defaults to cwd)
 * @returns {boolean} True if _epub directory exists
 */
export function hasEpubOutput(projectRoot = paths.getProjectRoot()) {
  const epubPath = path.join(projectRoot, '_epub')
  return fs.existsSync(epubPath)
}

/**
 * Check if PDF output exists
 *
 * Checks for PDF output at common locations:
 * - Default library outputs: pagedjs.pdf, prince.pdf
 * - Specific library output when lib option provided
 *
 * @param {Object} [options]
 * @param {string} [options.lib] - Specific library to check ('pagedjs' or 'prince')
 * @param {string} [options.projectRoot] - Project root directory
 * @returns {boolean} True if PDF output exists
 */
export function hasPdfOutput(options = {}) {
  const { lib, projectRoot = paths.getProjectRoot() } = options

  if (lib) {
    const pdfPath = path.join(projectRoot, `${lib}.pdf`)
    return fs.existsSync(pdfPath)
  }

  // Check for any common PDF output
  const pdfFiles = ['pagedjs.pdf', 'prince.pdf']
  return pdfFiles.some((file) => fs.existsSync(path.join(projectRoot, file)))
}

/**
 * Require build output to exist, throwing an error if missing
 *
 * @param {Object} options
 * @param {string} [options.type='site'] - Output type to check ('site' or 'epub')
 * @param {string} [options.projectRoot] - Project root directory
 * @throws {Error} If required build output does not exist
 */
export function requireBuildOutput(options = {}) {
  const { type = 'site', projectRoot = paths.getProjectRoot() } = options

  if (type === 'site' && !hasSiteOutput(projectRoot)) {
    const error = new Error('Build output not found. Run "quire build" first.')
    error.code = 'ENOBUILD'
    throw error
  }

  if (type === 'epub' && !hasEpubOutput(projectRoot)) {
    const error = new Error('EPUB output not found. Run "quire build" first.')
    error.code = 'ENOBUILD'
    throw error
  }
}

export default {
  getBuildInfo,
  hasEpubOutput,
  hasPdfOutput,
  hasSiteOutput,
  requireBuildOutput,
}
