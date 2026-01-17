import Command from '#src/Command.js'
import { YAMLException } from 'js-yaml'
import YamlValidationError from '../errors/validation/yaml-validation-error.js'
import fs from 'fs-extra'
import path from 'node:path'
import paths from '#lib/project/index.js'
import testcwd from '../helpers/test-cwd.js'
import yamlValidation from '../validators/validate-yaml.js'
import { ValidationError } from '#src/errors/index.js'

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
    docsLink: 'quire-commands/#get-help',
    version: '1.0.0',
    options: [
      [ '--debug', 'run validate with debug output to console' ],
    ],
  }

  constructor() {
    super(ValidateCommand.definition)
  }

  action(options, command){
    this.debug('called with options %O', options)

    const dataPath = path.join(paths.getProjectRoot(), 'content', '_data')
    const files = fs.readdirSync(dataPath)
      .filter(file => file.endsWith('.yaml') || file.endsWith('.yml'))
      .map(file => path.join(dataPath, file)
      )

    let errorList = []
    this.logger.info('Validating YAML files..')

    for (const file of files) {
      try {
        yamlValidation(file)
      } catch (error){
        errorList.push(error)
      }
    }

    if(errorList.length > 0) {
      errorList.forEach(err => { this.logger.error(`${err.reason}`) })
      throw new ValidationError(
        `Validation failed with ${errorList.length} error(s)`,
        {
          code: 'VALIDATION_FAILED',
          suggestion: 'Fix the errors listed above and run validation again'
        }
      )
    } else {
      this.logger.info('Validation complete.')
    }
  }

  preAction(options, command) {
    testcwd(command)
  }
}
