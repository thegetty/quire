// New command
//
// Accepts a projectName argument, required
//
const chalk = require('chalk')
const commandMissing = require('../util/cmd_missing')
const exec = require('child_process').exec
const fs = require('fs')
const path = require('path')
const spawn = require('child_process')
const spawnSync = require('child_process').spawnSync
const yaml = require('js-yaml')


// Constants
//
const STARTER_REPO = "https://github.com/gettypubs/quire-catalogue"
const THEME_REPO = "https://github.com/gettypubs/quire-catalogue-theme"
const DEFAULT_PROJECT_NAME = 'quire-project'


// Helper functions
//
function cloneRepo(url, destination) {
  if (commandMissing('git')) {
    console.log(chalk.yellow('Please install git before continuing.'))
    process.exit(1)
  }
  destination = destination || DEFAULT_PROJECT_NAME
  spawnSync('git', ['clone', url, destination], {
    stdio: 'inherit'
  }, function(err) { if (err) return console.log(err) })
}

function installDependencies(dir) {
  if (commandMissing('npm')) {
    console.log(chalk.yellow('Please install npm before continuing.'))
    process.exit(1)
  }
  spawnSync('npm', ['install'], {
    cwd: dir, stdio: 'inherit'
  }, function(err) { if (err) return console.log(err) })
}

// command body
//
module.exports = function(projectName) {
  // Clone the starter repo & theme repo
  console.log('Installing starter kit...')
  cloneRepo(STARTER_REPO, projectName)
  let themeName = yaml.safeLoad(fs.readFileSync(`${projectName}/config.yml`, 'utf8')).theme
  cloneRepo(THEME_REPO, `${projectName}/themes/${themeName}`)
  console.log(chalk.green('Starter kit successfully installed.'))

  // Install starter repo deps & theme repo deps
  // Some starter-repo dependencies can be shifted into Quire-CLI deps for faster download
  console.log('Installing dependencies...')
  installDependencies(projectName)
  installDependencies(`${projectName}/themes/${themeName}`)
  console.log(chalk.green('Dependencies successfully installed.'))

  // Provide some helpful text to the user
  console.log(`Your new Quire project is ready!`)
  console.log('Run quire preview inside your project folder to preview changes locally.')
}

