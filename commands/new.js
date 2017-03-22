// New command
//
// Accepts a projectName argument, required
//
const GIT_REPO = "https://github.com/gettypubs/quire-catalogue"

module.exports = function(projectName) {

  // If 'git' command not found, throw an error, tell user to install git
  // If not able to connect with git repo, throw an error
  // Run `git clone GIT_REPO projectName` and when finished, run a setup script

  console.log(`Cloning from ${GIT_REPO} into ${projectName}`)
}
