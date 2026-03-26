import Command from '#src/Command.js'
import { withOutputModes } from '#lib/commander/index.js'
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
  static definition = withOutputModes({
    name: 'validate',
    description: 'Validate configuration files',
    summary: 'check YAML files for errors',
    docsLink: 'quire-commands/#get-help',
    helpText: `
Examples:
  quire validate               Check YAML syntax in content/_data/
  quire validate --verbose     Validate with detailed file listing
  quire validate --json        Output validation results as JSON

Validates YAML files in content/_data/ directory.
`,
    version: '1.0.0',
    options: [
      ['--json', 'output validation results as JSON'],
    ],
  })

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

    const results = []
    if (!options.json) {
      this.logger.info('Validating YAML files..')
    }

    for (const file of files) {
      try {
        yamlValidation(file)
        results.push({ file, status: 'passed' })
      } catch (error){
        results.push({ file, status: 'failed', error: error.reason })
      }
    }

    const errors = results.filter((r) => r.status === 'failed')

    if (options.json) {
      const output = {
        summary: {
          files: results.length,
          passed: results.length - errors.length,
          failed: errors.length,
        },
        files: results,
      }
      console.log(JSON.stringify(output, null, 2))

      // Still throw so exit code reflects failure
      if (errors.length > 0) {
        throw new ValidationError(
          `Validation failed with ${errors.length} error(s)`,
          {
            code: 'VALIDATION_FAILED',
            suggestion: 'Fix the errors listed above and run validation again'
          }
        )
      }
      return
    }

    if (errors.length > 0) {
      errors.forEach((r) => { this.logger.error(`${r.error}`) })
      throw new ValidationError(
        `Validation failed with ${errors.length} error(s)`,
        {
          code: 'VALIDATION_FAILED',
          suggestion: 'Fix the errors listed above and run validation again'
        }
      )
    } else {
      this.logger.info('Validation complete.')
    }
  }

  preAction(thisCommand, actionCommand) {
    testcwd(thisCommand)
  }
}
