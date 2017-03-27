/**
 * @fileOverview `preview` command
 * @author Eric Gardner / Getty Publications
 * @license MIT
 */

const chalk = require('chalk')
const cwd = require('cwd')
const path = require('path')
const spawn = require('child_process').spawn
const util = require('../util/util.js')
const WEBPACK_BIN = './node_modules/.bin/webpack'

function lauchWebpackProcess(themePath) {
  spawn(WEBPACK_BIN, ['--watch'], { cwd: themePath, stdio: 'inherit' })
}

function launchHugoProcess() {
  spawn('hugo', ['server'], { stdio: 'inherit' })
}

/** @module preview */
module.exports = function() {
  if (util.dirIsValidProject()) {
    let themeName = util.themeName()
    let themePath = path.join(cwd(), 'themes', themeName)

    if (util.isWebpackTheme(themePath)) {
      lauchWebpackProcess(themePath)
      launchHugoProcess()
    } else {
      launchHugoProcess()
    }
  } else {
    console.log(chalk.yellow('No valid project exists at this location.'))
  }
}
