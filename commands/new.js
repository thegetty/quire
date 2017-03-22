// New command
//
// Accepts a projectName argument, required
//
const chalk = require('chalk')
const checkCmd = require('../util/check_cmd')
const exec = require('child_process').exec
const fs = require('fs')
const GIT_REPO = "https://github.com/gettypubs/quire-catalogue"

module.exports = function(projectName) {
  if (checkCmd('git')) {
    console.log('Git is installed')
  } else {
    console.log('Please install git')
  }
}
