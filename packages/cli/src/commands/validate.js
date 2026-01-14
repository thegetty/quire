import Command from '#src/Command.js'
import logger from '#src/lib/logger.js'
import { YAMLException } from 'js-yaml'
import YamlValidationError from '../errors/validation/yaml-validation-error.js'
import fs from 'fs-extra'
import path from 'node:path'
import paths from '#lib/project/index.js'
import testcwd from '../helpers/test-cwd.js'
import yamlValidation from '../validators/validate-yaml.js'


/**
 * Quire CLI `validate` Command
 *  
 * @class     ValidateCommand
 * @extends   {Command}
 */
export default class ValidateCommand extends Command {
  static definition = {
    name: 'validate',
    description: 'Validate configuration files',
    summary: 'run validation',
    version: '1.0.0',
    options: [
      [ '--debug', 'run validate with debug output to console' ],
    ],
  }

  constructor() {
    super(ValidateCommand.definition)
  }

  action(options, command){
    if(options.debug) {
      logger.debug('[CLI] Command \'%s\' called with options %o', this.name(), options)
    }
    
    const dataPath = path.join(paths.getProjectRoot(), 'content', '_data')
    const files = fs.readdirSync(dataPath)
      .filter(file => file.endsWith('.yaml') || file.endsWith('.yml'))
      .map(file => path.join(dataPath, file)
      )

    let errorList = []
    logger.log('Validating YAML files..')

    for (const file of files) {
      try {
        yamlValidation(file)
      } catch (error){
        errorList.push(error)
      }
    }

    if(errorList.length > 0) {
      errorList.forEach(err => { logger.error(`${err.reason}`) })
    } else {
      logger.log('Validation complete.')
    }
  }

  preAction(options, command) {
    testcwd(command)
  }
}
