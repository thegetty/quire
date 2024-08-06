import { paths, projectRoot  } from '#lib/11ty/index.js'
import Command from '#src/Command.js'
import fs from 'fs-extra'
import libPdf from '#lib/pdf/index.js'
import open from 'open'
import path from 'node:path'
import yaml from 'js-yaml'

/**
 * @function loadConfig(path) - loads and validates quire config, returns an empty object if not found
 *  
 * @param {path} string - file path to config file
 * 
 * @return {Object|undefined} User configuration object or undefined
 * 
 * @todo consider hardcoding a version check against .quire / project's package.json ver
 */
async function loadConfig(configPath) {
  if (!fs.existsSync(configPath)) {
    return undefined
  }

  const data = fs.readFileSync(configPath)
  let config = yaml.load(data)

  // NB: Schemas may be project specific so the CLI must loads from project root rather than package root
  const schemaPath = path.join(projectRoot,'_plugins','schemas','config.json')
  const validatorPlugin = path.join(projectRoot, '_plugins', 'globalData', 'validator.js')

  const { validateUserConfig } = await import(validatorPlugin)

  if (fs.existsSync(schemaPath) && fs.existsSync(validatorPlugin)) {
    const schemaJSON = fs.readFileSync(schemaPath)
    const schema = JSON.parse(schemaJSON)

    try {
      config = validateUserConfig('config', config, { config: schema })
    } catch (error) {
      console.error(error)
      process.exit(1)
    }
  }

  return config
}

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

    const publicationInput = path.join(projectRoot, paths.output, 'pdf.html')
    const coversInput = path.join(projectRoot, paths.output, 'pdf-covers.html')

    const quireConfig = await loadConfig(path.join(projectRoot,'content','_data','config.yaml'))

    if (quireConfig === undefined) {
      console.error(`[quire pdf]: ERROR Unable to find a configuration file at ${path.join(projectRoot,'content','_data','config.yaml')}\nIs the command being run in a quire project?`)
      process.exit(1)
    }

    if (!fs.existsSync(publicationInput)) {
      console.error(`[quire pdf]: ERROR Unable to find PDF input at ${publicationInput}\nPlease first run the 'quire build' command.`)
      process.exit(1)
    }

    const output = quireConfig.pdf !== undefined
      ? path.join(paths.output, quireConfig.pdf.outputDir, `${quireConfig.pdf.filename}.pdf`)
      : path.join(projectRoot, `${options.lib}.pdf`);

    const pdfLib = await libPdf(options.lib, { ...options, pdfConfig: quireConfig.pdf })
    await pdfLib(publicationInput, coversInput, output)

    try {
      if (fs.existsSync(output) && options.open) open(output)
    } catch (error) {
      console.error(`[quire pdf]: ERROR`,error)
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
