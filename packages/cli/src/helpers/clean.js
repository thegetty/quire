import { deleteAsync } from 'del'
import path from 'node:path'

/**
 * Clean project paths
 *
 * @param  {String}  projectRoot
 * @param  {Array<String>}  paths to
 */
export async function clean (projectRoot, paths, options = {}) {
  const pathsToClean = [
    path.join(projectRoot, paths.output),
    path.join(projectRoot, paths.public),
  ]

  /**
   * Log progess of deleted paths
   * @see https://github.com/sindresorhus/del#onprogress
   *
   * @param  {ProgessData}  progress
   * @see https://github.com/sindresorhus/del#progressdata
   */
  const progressLogger = (progress) => {
    console.info('progress', progress)
  }

  process.cwd(projectRoot)

  const deletedPaths = await deleteAsync(pathsToClean, {
    dryRun: options.dryRun,
    force: true,
    onProgress: (options.progress || options.verbose) && progressLogger,
  })
}
