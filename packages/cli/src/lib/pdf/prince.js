import { execa } from 'execa'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { splitPdf } from './split.js'
import fs from 'fs-extra'

import processManager from '#lib/process/manager.js'
import which from '#helpers/which.js'
import { PdfGenerationError } from '#src/errors/index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * A façade module for interacting with the Prince CLI.
 * @see https://www.princexml.com/doc/command-line/
 */
export default async (publicationInput, coversInput, output, options = {}) => {
  which('prince')

  /**
   * @see https://www.princexml.com/doc/command-line/#options
   */

  const { pdfConfig } = options

  // These options run once to get the map pages to essays
  const pageMapOptions = [
    `--script=${ path.join(__dirname, 'princePlugin.js') }`,
    `--output=${output}`,
  ]

  // These options are for the actual user-facing PDF
  const cmdOptions = [
    `--output=${output}`,
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

  const { dir } = path.parse(output)
  if (!fs.existsSync(dir)) {
    fs.mkdirsSync(dir)
  }

  // Execute the page mapping PDF build
  let pageMap = {}
  try {
    const pageMapOutput = await execa('prince', [...pageMapOptions, publicationInput], {
      cancelSignal: processManager.signal,
      gracefulCancel: true
    })
    pageMap = JSON.parse(pageMapOutput.stdout)
  } catch (error) {
    if (error.isCanceled) {
      console.info('[CLI:lib/pdf/prince] PDF generation cancelled')
      return
    }
    throw new PdfGenerationError('Prince', 'page map generation', error.stderr)
  }

  let coversData

  if (pdfConfig?.pagePDF?.coverPage === true && fs.existsSync(coversInput)) {

    const coversPageMapOutput = await execa('prince', [...pageMapOptions, coversInput], {
      cancelSignal: processManager.signal,
      gracefulCancel: true
    })
    const coversMap = JSON.parse(coversPageMapOutput.stdout)

    for (const pageId of Object.keys(coversMap))  {
      if (pageId in pageMap) {
        pageMap[pageId].coverPage = coversMap[pageId].startPage
      }
    }

    coversData = fs.readFileSync(output,null)

  }

  let stderror, stdout

  try {
    ({ stderror, stdout } = await execa('prince', [...cmdOptions, publicationInput], {
      cancelSignal: processManager.signal,
      gracefulCancel: true
    }))
  } catch (error) {
    if (error.isCanceled) {
      console.info('[CLI:lib/pdf/prince] PDF generation cancelled')
      return
    }
    throw new PdfGenerationError('Prince', 'PDF printing', error.stderr)
  }

  const pdfData = fs.readFileSync(output,null)

  let files = await splitPdf(pdfData,coversData,pageMap,pdfConfig)
  Object.entries(files).forEach( async ([filePath,pagePdf]) => {
    await fs.promises.writeFile(filePath,pagePdf)
      .catch((error) => console.error(error))
  })

  return { stderror, stdout }
}
