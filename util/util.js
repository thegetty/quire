// Utility functions

const cwd = require('cwd')
const config = require('./config')
const chalk = require('chalk')
const exists = require('command-exists').sync
const fs = require('fs')
const path = require('path')
const spawnSync = require('child_process').spawnSync
const yaml = require('js-yaml')

/**
 * Checks if the given command is missing
 *
 * @param {String} command
 * @return {Boolean}
 */
exports.commandMissing = function(command) {
  return !exists(command)
}

/**
 * Clones a repository in a given location using Git shell commands
 *
 * @param {String} url (for desired repo)
 * @param {String} destination
 */
exports.cloneRepo = function(url, destination) {
  if (exports.commandMissing('git')) {
    console.log(chalk.yellow('Please install git before continuing.'))
    process.exit(1)
  }
  destination = destination || config.DEFAULT_PROJECT_NAME
  spawnSync('git', ['clone', url, destination], {
    stdio: 'inherit'
  }, function(err) { if (err) return console.log(err) })
}

/**
 * Checks if the given directory is a valid project (has a config.yml)
 *
 * @param {String} directory
 * @return {Boolean}
 */
exports.dirIsValidProject = function(directory) {
  directory = directory || cwd()

  if (fs.existsSync(path.join(directory, 'config.yml'))) {
    return true
  } else {
    return false
  }
}

/**
 * Installs dependencies in a project folder
 *
 * @param {String} dir
 */
exports.installDependencies = function(directory) {
  directory = directory || cwd()

  if (exports.commandMissing('npm')) {
    console.log(chalk.yellow('Please install npm before continuing.'))
    process.exit(1)
  }
  spawnSync('npm', ['install'], {
    cwd: directory, stdio: 'inherit'
  }, function(err) { if (err) return console.log(err) })
}

/**
 * Extracts the theme name from the config.yml file in project root
 *
 * @param {String} projectName
 * @return {String} themeName
 */
exports.themeName = function(projectName) {
  projectName = projectName || cwd()
  return yaml.safeLoad(fs.readFileSync(path.join(projectName, 'config.yml'), 'utf8')).theme
}

