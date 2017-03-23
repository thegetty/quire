/**
 * @fileOverview `build` command
 * @author Eric Gardner / Getty Publications
 * @license MIT
 */

const chalk = require('chalk')
const cwd = require('cwd')
const execSync = require('child_process').execSync
const path = require('path')
const util = require('../util/util')

const WEBPACK_BIN = './node_modules/.bin/webpack'

/** @module build */
module.exports = function() {
  if (util.dirIsValidProject(cwd())) {
    let themePath = path.join(cwd(), 'themes', util.themeName(cwd()))
    execSync(WEBPACK_BIN, { cwd: themePath, stdio: 'inherit' })
    execSync('hugo', { stdio: 'inherit' })
  } else {
    console.log(chalk.yellow('No valid project exists at this location.'))
    process.exit(1)
  }
}
