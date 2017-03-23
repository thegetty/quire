/**
 * @fileOverview `new` command
 * @author Eric Gardner / Getty Publications
 * @license MIT
 */

const chalk = require('chalk')
const config = require('../util/config')
const path = require('path')
const util = require('../util/util')

/** @module newCmd */
module.exports = function(projectName) {
  console.log('Installing starter kit...')
  util.cloneRepo(config.STARTER_REPO, projectName)

  let themePath = path.join(projectName, 'themes', util.themeName(projectName))
  util.cloneRepo(config.THEME_REPO, themePath)
  console.log(chalk.green('Starter kit successfully installed.'))

  /** @todo remove some dependencies from template and handle them here instead */
  console.log('Installing dependencies...')
  util.installDependencies(themePath)
  console.log(chalk.green('Dependencies successfully installed.'))

  console.log(`Your new Quire project is ready!`)
  console.log('Run quire preview inside your project folder to preview changes locally.')
}

