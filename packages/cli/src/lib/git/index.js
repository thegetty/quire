import { simpleGit } from 'simple-git'

/**
 * SimpleGit configuration
 * @see https://github.com/steveukx/git-js#configuration
 */
const options = {
  baseDir: process.cwd(),
  binary: 'git',
  maxConcurrentProcesses: 6,
  trimmed: false,
}

/**
 * Configured SimpleGit instance
 * @see https://github.com/steveukx/git-js#api
 *
 * @type  {SimpleGit}
 */
const git = simpleGit(options)

export default git
