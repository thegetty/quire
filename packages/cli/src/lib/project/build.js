/**
 * Build detection module
 *
 * Detects if build output exists and provides build status information.
 * Uses shared output path resolution to ensure consistency with the
 * doctor command and generation commands.
 *
 * @module lib/project/build
 */
import fs from 'node:fs'
import path from 'node:path'
import paths from './paths.js'
import { getPdfOutputPaths, getEpubOutputPaths, getEpubBuildDir } from './output-paths.js'

/**
 * Get build output information
 *
 * @param {string} [projectRoot] - Project root directory (defaults to cwd)
 * @returns {Object} Build status information
 */
export function getBuildInfo(projectRoot = paths.getProjectRoot()) {
  const sitePath = path.join(projectRoot, '_site')
  const epubBuildPath = getEpubBuildDir({ projectRoot })

  const info = {
    site: {
      exists: fs.existsSync(sitePath),
      path: sitePath,
      lastModified: null,
    },
    epub: {
      exists: false,
      paths: [],
      buildDir: epubBuildPath,
      buildDirExists: fs.existsSync(epubBuildPath),
      lastModified: null,
    },
    pdf: {
      exists: false,
      paths: [],
      lastModified: null,
    },
  }

  // Get last modified times if directories exist
  if (info.site.exists) {
    const { mtime: lastModified } = fs.statSync(sitePath)
    info.site.lastModified = lastModified
  }
  if (info.epub.buildDirExists) {
    const { mtime: lastModified } = fs.statSync(epubBuildPath)
    info.epub.lastModified = lastModified
  }

  // Check for EPUB files using shared path resolution
  const epubPaths = getEpubOutputPaths({ projectRoot })
  for (const epubPath of epubPaths) {
    if (fs.existsSync(epubPath)) {
      info.epub.exists = true
      info.epub.paths.push(epubPath)
      const { mtime: lastModified } = fs.statSync(epubPath)
      if (!info.epub.lastModified || lastModified > info.epub.lastModified) {
        info.epub.lastModified = lastModified
      }
    }
  }

  // Check for PDF files using shared path resolution
  const pdfPaths = getPdfOutputPaths({ projectRoot })
  for (const pdfPath of pdfPaths) {
    if (fs.existsSync(pdfPath)) {
      info.pdf.exists = true
      info.pdf.paths.push(pdfPath)
      const { mtime: lastModified } = fs.statSync(pdfPath)
      if (!info.pdf.lastModified || lastModified > info.pdf.lastModified) {
        info.pdf.lastModified = lastModified
      }
    }
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
 * Checks for the intermediate _epub build directory.
 *
 * @param {string} [projectRoot] - Project root directory (defaults to cwd)
 * @returns {boolean} True if _epub directory exists
 */
export function hasEpubOutput(projectRoot = paths.getProjectRoot()) {
  const epubPath = getEpubBuildDir({ projectRoot })
  return fs.existsSync(epubPath)
}

/**
 * Check if PDF output exists
 *
 * Uses shared path resolution to check all possible PDF output locations,
 * including config-aware custom paths and default engine-named paths.
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

  // Check all possible PDF output locations
  const pdfPaths = getPdfOutputPaths({ projectRoot })
  return pdfPaths.some((pdfPath) => fs.existsSync(pdfPath))
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
