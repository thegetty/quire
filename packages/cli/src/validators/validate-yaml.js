import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import { validateImagePaths ,getSchemaForDocument, checkForDuplicateIds } from './utils.js'
import YamlValidationError from '../errors/validation/yaml-validation-error.js'
import fs from 'fs'
import yaml from 'js-yaml'

export default function yamlValidation(file) {

  const fileContent = fs.readFileSync(file, 'utf8')

  let doc
  try {
    doc = yaml.load(fileContent)
  } catch (error) {
    const message = `Error in ${file}: ${error.reason} at line ${error.mark.line} column ${error.mark.column}`
    throw new YamlValidationError(file, `${message}`)
  }


  const schema = getSchemaForDocument(file)
  if(!schema){
    console.warn(`No schema found for file ${file}`)
    return 
  } 
  const ajv = new Ajv({allErrors:true})
  addFormats(ajv)
  const validate = ajv.compile(schema)
  const valid = validate(doc)
  if(!valid) {
    const messages = validate.errors
      .map(err => `${err.instancePath || '(root)'} ${err.message}`)
      .join('\n')

    const fullMessage = `Error in ${file}:\n${messages}`
    throw new YamlValidationError(file, fullMessage)
  }

  validateImagePaths(doc)
  checkForDuplicateIds(doc, file)
}
