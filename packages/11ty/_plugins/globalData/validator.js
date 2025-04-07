import Ajv from 'ajv'
import fs from 'fs-extra'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const configSchema = fs.readJSONSync(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../schemas/config.json'))
/**
 *
 * @function validateUserConfig - throws error if user config data is not structured as expected
 * @throws {Error}
 *
 * @param {string} type - User configuration type to validate
 * @param {Object} data - Deserialized config data from `config.yaml`, `publication.yaml`, etc
 * @param {Object} schemas - Object of schemas to use for validation `config`, `publication`, etc. Schemas should be deserialized JSONSchema objects.
 *
 * NB: This is also imported by CLI commands
 *
 */
export const validateUserConfig = (type, data, schemas = { config: configSchema }) => {
  const { config: configSchema } = schemas

  switch (type) {
    case 'publication':
      try {
        const { url } = data
        data.url = url.endsWith('/') ? url : url + '/'
        data.pathname = new URL(data.url).pathname
      } catch (errorMessage) {
        console.error(
          `Publication.yaml url property must be a valid url. Current url value: "${data.url}"`
        )
        throw new Error(errorMessage)
      }
      break
    case 'config':

      if ('pdf' in data) {
        // NB: `ajv` silently uses jsonschema defaults so manually check these keys so we can warn
        const defaults = {
          outputDir: './',
          filename: 'pagedjs'
        }

        for (const [prop, defaultValue] of Object.entries(defaults)) {
          if (!(prop in data.pdf)) {
            console.warn(`config.yaml should have a value for pdf.${prop}, using default of ${defaultValue}`)
            data.pdf[prop] = defaultValue
          }
        }

        const ajv = new Ajv()
        const validate = ajv.compile(configSchema)

        const valid = validate(data)

        if (!valid) {
          const formatted = validate.errors.map(e => `${e.instancePath ?? ''}: ${e.message}`).join(', ')

          throw new Error('config.yaml does not match the expected format:', formatted)
        }
      }
      break
    default:
      break
  }

  return data
}
