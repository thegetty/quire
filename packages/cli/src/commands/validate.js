import Command from '#src/Command.js'
import { YAMLException } from 'js-yaml'
import { YamlValidationError } from '../errors/yaml-validation-error.js'
import fs from 'fs-extra'
import path from 'node:path'
import { projectRoot  } from '#lib/11ty/index.js'
import testcwd from '../helpers/test-cwd.js'
import yamlValidation from '../validators/validate-yaml.js'


/**
 * Quire CLI `validate` Command
 * 
 * Validates user configuration files such as TODO.
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
      console.debug('[CLI] Command \'%s\' called with options %o', this.name(), options)
    }
    
    const dataPath = path.join(projectRoot, 'content', '_data')
    const files = fs.readdirSync(dataPath)
      .filter(file => file.endsWith('.yaml') || file.endsWith('.yml'))
      .map(file => path.join(dataPath, file)
      )

    let errorList = []
    console.log('Validating YAML files..')
    for (const file of files) {
      try {
        yamlValidation(file)
      } catch (error){
        const err = error instanceof YAMLException ? new YamlValidationError(file, `${error.message} in ${file}`) : error
        errorList.push(err)
      }
    }

    if(errorList.length > 0) {
      console.error(`Found ${errorList.length} validation errors:`)
      errorList.forEach(err => { console.error(`${err.reason}`) })
    } else {
      console.log('All files validated successfully.')
    }
  }

  preAction(options, command) {
    testcwd(command)
  }
}
