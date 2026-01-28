/**
 * Data files validation for Quire projects
 *
 * Validates YAML files in content/_data/ directory:
 * - Required files exist (publication.yaml)
 * - YAML syntax is correct
 * - Files conform to their JSON schemas (when schema exists)
 * - No duplicate IDs in arrays
 *
 * @module validators/validate-data-files
 */
import fs from 'node:fs'
import path from 'node:path'
import yaml from 'js-yaml'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import { DATA_DIR, REQUIRED_DATA_FILES } from '#lib/project/index.js'
import { getSchemaForDocument, checkForDuplicateIds } from './utils.js'

/**
 * Validation result for a single file
 * @typedef {Object} FileValidationResult
 * @property {string} file - Filename
 * @property {boolean} valid - Whether the file is valid
 * @property {string[]} errors - List of error messages
 */

/**
 * Validation result for all data files
 * @typedef {Object} DataFilesValidationResult
 * @property {boolean} valid - Whether all files are valid
 * @property {string[]} errors - All error messages across all files
 * @property {number} fileCount - Number of YAML files found
 * @property {FileValidationResult[]} files - Per-file validation results
 */

/**
 * Validate a single YAML file
 *
 * @param {string} filePath - Absolute path to the YAML file
 * @returns {FileValidationResult} Validation result
 */
export function validateYamlFile(filePath) {
  const errors = []
  const filename = path.basename(filePath)

  // Check file exists
  if (!fs.existsSync(filePath)) {
    return { file: filename, valid: false, errors: [`File not found: ${filename}`] }
  }

  // Read and parse YAML
  let doc
  try {
    const content = fs.readFileSync(filePath, 'utf8')
    doc = yaml.load(content)
  } catch (error) {
    const loc = error.mark ? ` at line ${error.mark.line + 1}` : ''
    errors.push(`${filename}: YAML syntax error${loc} - ${error.reason || error.message}`)
    return { file: filename, valid: false, errors }
  }

  // Validate against schema if one exists
  const schema = getSchemaForDocument(filePath)
  if (schema) {
    const ajv = new Ajv({ allErrors: true })
    addFormats(ajv)
    const validate = ajv.compile(schema)
    const valid = validate(doc)

    if (!valid) {
      for (const err of validate.errors) {
        const errPath = err.instancePath || '(root)'
        errors.push(`${filename}: ${errPath} ${err.message}`)
      }
    }
  }

  // Check for duplicate IDs using the existing utility
  // Note: checkForDuplicateIds throws, so we need to catch
  try {
    checkForDuplicateIds(doc, filePath)
  } catch (error) {
    // Extract the duplicate ID info from the error
    const match = error.reason?.match(/Duplicate IDs found: (.+)/)
    if (match) {
      errors.push(`${filename}: duplicate IDs found: ${match[1]}`)
    } else {
      errors.push(`${filename}: ${error.reason || error.message}`)
    }
  }

  return { file: filename, valid: errors.length === 0, errors }
}

/**
 * Validate all data files in content/_data/
 *
 * @returns {DataFilesValidationResult} Validation result
 */
export function validateDataFiles() {
  const allErrors = []
  const fileResults = []

  // Check if data directory exists
  if (!fs.existsSync(DATA_DIR)) {
    return {
      valid: true,
      errors: [],
      fileCount: 0,
      files: [],
      notInProject: true,
    }
  }

  // Check required files exist
  for (const required of REQUIRED_DATA_FILES) {
    const filePath = path.join(DATA_DIR, required)
    if (!fs.existsSync(filePath)) {
      allErrors.push(`Required file missing: ${required}`)
    }
  }

  // Find all YAML files
  let yamlFiles = []
  try {
    yamlFiles = fs.readdirSync(DATA_DIR)
      .filter((file) => file.endsWith('.yaml') || file.endsWith('.yml'))
      .map((file) => path.join(DATA_DIR, file))
  } catch (error) {
    return {
      valid: false,
      errors: [`Cannot read ${DATA_DIR}: ${error.message}`],
      fileCount: 0,
      files: [],
    }
  }

  // Validate each file
  for (const filePath of yamlFiles) {
    const result = validateYamlFile(filePath)
    fileResults.push(result)
    allErrors.push(...result.errors)
  }

  return {
    valid: allErrors.length === 0,
    errors: allErrors,
    fileCount: yamlFiles.length,
    files: fileResults,
  }
}

export default validateDataFiles
