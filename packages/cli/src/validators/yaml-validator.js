import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import { validateImagePaths ,getSchemaForDocument } from './helpers/yaml-validators.js'
import YamlValidationError from '../errors/yaml-validation-error.js'
import fs from 'fs'
import yaml from 'js-yaml'

export default function yamlValidation(file) {
  const fileContent = fs.readFileSync(file, 'utf8')
  const doc = yaml.load(fileContent)
  const ajv = new Ajv({allErrors:true})
  addFormats(ajv)

  const schema = getSchemaForDocument(file)
  const validate = ajv.compile(schema)
  const valid = validate(doc)

  if(!valid) {
    throw new YamlValidationError(file, validate.errors)
  }

  // TODO:
  // Check project specific rules
  // Handle lint errors
  // This might be breaking where you check the path before checking if valid
  validateImagePaths(doc)
}