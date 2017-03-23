/**
 * @fileOverview `preview` command
 * @author Eric Gardner / Getty Publications
 * @license MIT
 */

const chalk = require('chalk')
const config = require('../util/config')
const cwd = require('cwd')
const path = require('path')
const spawn = require('child_process').spawn
const util = require('../util/util.js')

const WEBPACK_BIN = './node_modules/.bin/webpack'

/** @module preview */
module.exports = function() {
  // If current directory is a valid project
  if (util.dirIsValidProject(cwd())) {
    let themePath = path.join(cwd(), 'themes', util.themeName(cwd()))
    // Run the webpack theme process and the hugo process simultaneously
    spawn(WEBPACK_BIN, ['--watch'], { cwd: themePath, stdio: 'inherit' })
    spawn('hugo', ['server'], { stdio: 'inherit' })
  } else {
    console.log(chalk.yellow('No valid project exists at this location.'))
    process.exit(1)
  }
}
