import { execa } from 'execa'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { splitPdf } from './split.js'
import fs from 'fs-extra'

import which from '#helpers/which.js'

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
    const pageMapOutput = await execa('prince', [...pageMapOptions, publicationInput])  
    pageMap = JSON.parse(pageMapOutput.stdout)
  } catch (err) {
    console.error(`Generating the PDF page map failed with the error ${err.stderr}`)
    process.exit(1)
  }

  let coversData

  if (pdfConfig?.pagePDF?.coverPage === true && fs.existsSync(coversInput)) {

    const coversPageMapOutput = await execa('prince', [...pageMapOptions, coversInput])
    const coversMap = JSON.parse(coversPageMapOutput.stdout)

    for (const pageId of Object.keys(coversMap))  {
      if (pageId in pageMap) {
        pageMap[pageId].coverPage = coversMap[pageId].startPage       
      }
    }

    coversData = fs.readFileSync(output,null)

  }

  let stderror,stdout

  try {
    ({ stderror, stdout } = await execa('prince', [...cmdOptions, publicationInput]))
  } catch (err) {
    console.error(`Printing the PDF failed with the error ${err.stderr}`)
    process.exit(1)
  }

  const pdfData = fs.readFileSync(output,null)
  
  let files = await splitPdf(pdfData,coversData,pageMap,pdfConfig)
  Object.entries(files).forEach( async ([filePath,pagePdf]) => {
    await fs.promises.writeFile(filePath,pagePdf)
      .catch((error) => console.error(error))
  })

  return { stderror, stdout }
}
