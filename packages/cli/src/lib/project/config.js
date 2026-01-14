/**
 * Project configuration module
 *
 * Loads and validates Quire project configuration files.
 *
 * @module lib/project/config
 */
import fs from 'fs-extra'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import yaml from 'js-yaml'
import paths from './paths.js'
import logger from '#src/lib/logger.js'

/**
 * Load and validate Quire project configuration
 *
 * @param {string} [projectRoot] - project root directory (defaults to cwd)
 * @returns {Promise<Object>} validated configuration object
 *
 * @todo consider hardcoding a version check against .quire / project's package.json ver
 */
export async function loadProjectConfig(projectRoot) {
  const root = projectRoot || paths.getProjectRoot()
  const configPath = path.join(root, 'content', '_data', 'config.yaml')

  if (!fs.existsSync(configPath)) {
    logger.error(
      `Unable to find configuration file at '${configPath}'\n` +
      `Is the command being run in a Quire project?`
    )
    process.exit(1)
  }

  const data = fs.readFileSync(configPath)
  let config = yaml.load(data)

  // NB: Schemas and validators are specific to the 11ty version of the project being built
  const schemaPath = path.join(root, '_plugins', 'schemas', 'config.json')
  const validatorPath = path.join(root, '_plugins', 'globalData', 'validator.js')

  if (fs.existsSync(schemaPath) && fs.existsSync(validatorPath)) {
    const { validateUserConfig } = await import(pathToFileURL(validatorPath))

    const schemaJSON = fs.readFileSync(schemaPath)
    const schema = JSON.parse(schemaJSON)

    try {
      config = validateUserConfig('config', config, { config: schema })
    } catch (error) {
      logger.error(error)
      process.exit(1)
    }
  }

  return config
}
