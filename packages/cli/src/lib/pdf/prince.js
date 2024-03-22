import { execa } from 'execa'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { splitPdf } from './common.js'
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
  
  const pageMapOptions = [
    `--script=${ path.join(__dirname, 'princePlugin.js') }`,
    `--output=${output}`,
  ]

  const cmdOptions = [
    `--output=${output}`,
  ]

  if (options.debug) cmdOptions.push('--debug')
  if (options.verbose) cmdOptions.push('--verbose')

  const { dir } = path.parse(output)
  if (!fs.existsSync(dir)) { 
    fs.mkdirsSync(dir)
  }
  
  const pageMapOutput = await execa('prince', [...pageMapOptions, publicationInput])
  // FIXME: check for errors here
  let pageMap = JSON.parse(pageMapOutput.stdout)

  let coversData = ''
  if (options.pdfConfig.pagePDF.coverPage) {

    const coversPageMapOutput = await execa('prince', [...pageMapOptions, coversInput])
    // FIXME: check for errors here
    const coversMap = JSON.parse(coversPageMapOutput.stdout)

    for (const pageId of Object.keys(coversMap))  {
      pageMap[pageId].coverPage = coversMap[pageId].startPage 
    }
    coversData = fs.readFileSync(output,null)

  }

  const { stderror, stdout } = await execa('prince', [...cmdOptions, publicationInput])
  const pdfData = fs.readFileSync(output,null)
  
  let files = await splitPdf(pdfData,coversData,pageMap,options.pdfConfig)
  Object.entries(files).forEach( async ([filePath,pagePdf]) => {
    await fs.promises.writeFile(filePath,pagePdf)
      .catch((error) => console.error(error))
  })

  return { stderror, stdout }
}
