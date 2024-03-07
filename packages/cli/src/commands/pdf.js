import Command from '#src/Command.js'
import { paths, projectRoot  } from '#lib/11ty/index.js'
import fs from 'fs-extra'
import libPdf from '#lib/pdf/index.js'
import open from 'open'
import path from 'node:path'
import yaml from 'js-yaml'

/**
 * @function loadConfig(path) - loads and validates quire config 
 * @param {path} string - file path to config file
 */
function loadConfig(path) {
  const data = fs.readFileSync(path)
  const config = yaml.load(data)

  return config
}

const quireConfig = loadConfig(path.join(projectRoot,'content','_data','config.yaml'))

/**
 * Quire CLI `pdf` Command
 *
 * Generate PDF from Eleventy `build` output.
 *
 * @class      PDFCommand
 * @extends    {Command}
 */
export default class PDFCommand extends Command {
  static definition = {
    name: 'pdf',
    description: 'Generate publication PDF',
    summary: 'run build pdf',
    version: '1.0.0',
    args: [
    ],
    options: [
      [
        '--lib <module>', 'use the specified pdf module', 'pagedjs',
        { choices: ['pagedjs', 'prince'], default: 'pagedjs' }
      ],
      [ '--page-pdfs', 'Produce PDFs for each quire page enabled with `paged-pdf`'],
      [ '--websafe', 'Make the PDF websafe (no crop marks+margins, downsample images)'],
      [ '--output-dir', 'Output the PDF to this directory'],
      [ '--filename <string>', 'Use this as the prefix for PDF ouptuts', {default: quireConfig.pdf.filename}],
      [ '--open', 'open PDF in default application' ],
      [ '--debug', 'run build with debug output to console' ],
    ],
  }

  constructor() {
    super(PDFCommand.definition)
  }

  async action(options, command) {
    if (options.debug) {
      console.debug('[CLI] Command \'%s\' called with options %o', this.name(), options)
    }

    const input = path.join(projectRoot, paths.output, 'pdf.html')

    if (!fs.existsSync(input)) {
      console.error(`Unable to find PDF input at ${input}\nPlease first run the 'quire build' command.`)
      return
    }

    const output = path.join(paths.output, quireConfig.pdf.outputDir, `${quireConfig.pdf.filename}.pdf`)

    const pdfLib = await libPdf(options.lib, { ...options, pdfConfig: quireConfig.pdf })
    await pdfLib(input, output)

    try {
      if (fs.existsSync(output) && options.open) open(output)
    } catch (error) {
      console.error(error)
      process.exit(1)
    }
  }

  /**
   * @todo test if build has already be run and output can be reused
   */
  preAction(command) {
    // testcwd(command)
  }
}
