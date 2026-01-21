import { execa } from 'execa'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { splitPdf } from './split.js'
import fs from 'fs-extra'

import processManager from '#lib/process/manager.js'
import reporter from '#lib/reporter/index.js'
import { PdfGenerationError } from '#src/errors/index.js'
import createDebug from '#debug'
import ENGINES from './engines.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const debug = createDebug('lib:pdf:prince')

/** Re-export engine metadata from central registry */
export const metadata = ENGINES.prince

/**
 * A façade module for interacting with the Prince CLI.
 * @see https://www.princexml.com/doc/command-line/
 *
 * Prince availability is checked by the parent façade (lib/pdf/index.js)
 * before this module is loaded, so we can assume prince is in PATH.
 *
 * @param {string} publicationInput - Path to the publication HTML file
 * @param {string} coversInput - Path to the covers HTML file
 * @param {string} pdfPath - Path where the PDF should be written
 * @param {Object} [options={}] - Generation options
 * @returns {Promise<string>} Path to the generated PDF file
 */
export default async (publicationInput, coversInput, pdfPath, options = {}) => {
  debug('input: %s', publicationInput)
  debug('covers: %s', coversInput)
  debug('output: %s', pdfPath)

  /**
   * @see https://www.princexml.com/doc/command-line/#options
   */

  const { pdfConfig } = options

  // These options run once to get the map pages to essays
  const pageMapOptions = [
    `--script=${ path.join(__dirname, 'princePlugin.js') }`,
    `--output=${pdfPath}`,
  ]

  // These options are for the actual user-facing PDF
  const cmdOptions = [
    `--output=${pdfPath}`,
    `--pdf-profile=PDF/UA-1`,
  ]

  if (options.debug) {
    pageMapOptions.push('--debug')
    cmdOptions.push('--debug')
  }

  if (options.verbose) {
    pageMapOptions.push('--verbose')
    cmdOptions.push('--verbose')
  }

  debug('page map options: %O', pageMapOptions)
  debug('cmd options: %O', cmdOptions)

  try {
    const { dir } = path.parse(pdfPath)
    if (!fs.existsSync(dir)) {
      fs.mkdirsSync(dir)
    }
  } catch (error) {
    throw new PdfGenerationError('Prince', 'output directory creation', error.message)
  }

  // Execute page map extraction (renders PDF with script to extract page info, then discards it)
  debug('analyzing document structure')
  reporter.update('Analyzing document structure...')
  let pageMap = {}
  try {
    const pageMapOutput = await execa('prince', [...pageMapOptions, publicationInput], {
      cancelSignal: processManager.signal,
      gracefulCancel: true
    })
    pageMap = JSON.parse(pageMapOutput.stdout)
  } catch (error) {
    if (error.isCanceled) {
      debug('page map generation cancelled')
      reporter.warn('PDF generation cancelled')
      return
    }
    throw new PdfGenerationError('Prince', 'page map generation', error.stderr)
  }
  debug('page map generated: %d entries', Object.keys(pageMap).length)

  let coversData

  if (pdfConfig?.pagePDF?.coverPage === true && fs.existsSync(coversInput)) {
    debug('generating cover page map')
    reporter.update('Rendering cover pages...')
    try {
      const coversPageMapOutput = await execa('prince', [...pageMapOptions, coversInput], {
        cancelSignal: processManager.signal,
        gracefulCancel: true
      })
      const coversMap = JSON.parse(coversPageMapOutput.stdout)

      for (const pageId of Object.keys(coversMap)) {
        if (pageId in pageMap) {
          pageMap[pageId].coverPage = coversMap[pageId].startPage
        }
      }

      coversData = fs.readFileSync(pdfPath, null)
    } catch (error) {
      if (error.isCanceled) {
        debug('cover page map generation cancelled')
        reporter.warn('PDF generation cancelled')
        return
      }
      throw new PdfGenerationError('Prince', 'cover page map generation', error.stderr || error.message)
    }
    debug('cover page map merged')
  }

  debug('printing PDF')
  reporter.update('Rendering PDF...')

  try {
    await execa('prince', [...cmdOptions, publicationInput], {
      cancelSignal: processManager.signal,
      gracefulCancel: true
    })
  } catch (error) {
    if (error.isCanceled) {
      debug('PDF printing cancelled')
      reporter.warn('PDF generation cancelled')
      return
    }
    throw new PdfGenerationError('Prince', 'PDF printing', error.stderr)
  }
  debug('PDF printed')

  let pdfData
  try {
    pdfData = fs.readFileSync(pdfPath, null)
  } catch (error) {
    throw new PdfGenerationError('Prince', 'PDF file read', error.message)
  }

  debug('splitting PDF')
  reporter.update('Writing PDF files...')
  try {
    const files = await splitPdf(pdfData, coversData, pageMap, pdfConfig)

    debug('writing %d section files', Object.keys(files).length)
    await Promise.all(
      Object.entries(files).map(([filePath, pagePdf]) =>
        fs.promises.writeFile(filePath, pagePdf)
      )
    )
  } catch (error) {
    throw new PdfGenerationError('Prince', 'PDF splitting', error.message)
  }

  debug('complete')
  return pdfPath
}
