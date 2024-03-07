import { execa } from 'execa'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { PDFDocument } from 'pdf-lib'

import { splitPdf } from './common.js';
import fs from 'fs-extra';

import which from '#helpers/which.js'
import { projectRoot  } from '#lib/11ty/index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * A façade module for interacting with the Prince CLI.
 * @see https://www.princexml.com/doc/command-line/
 */
export default async (input, output, options = {}) => {
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
  
  let pageMapOutput = await execa('prince', [...pageMapOptions, input])
  // FIXME: check for errors here
  const pageMap = JSON.parse(pageMapOutput.stdout)

  const { stderror, stdout } = await execa('prince', [...cmdOptions, input])
  const pdfData = fs.readFileSync(output,null)

  splitPdf(pdfData,pageMap,options.pdfConfig)

  return { stderror, stdout }
}
