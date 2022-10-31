import { simpleGit } from 'simple-git'

/**
 * @see https://github.com/steveukx/git-js#configuration
 */
const options = {
  baseDir: process.cwd(),
  binary: 'git',
  maxConcurrentProcesses: 6,
  trimmed: false,
}

const git = simpleGit(options)

export default git
