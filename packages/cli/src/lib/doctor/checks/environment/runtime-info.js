/**
 * Node.js runtime info check
 *
 * Reports V8 heap limit and environment variables relevant to
 * troubleshooting (NODE_OPTIONS, shell, locale). This is an
 * informational check that always passes.
 *
 * @module lib/doctor/checks/environment/runtime-info
 */
import v8 from 'node:v8'
import createDebug from '#debug'
import { getPlatform, Platform } from '#lib/platform.js'

const debug = createDebug('lib:doctor:runtime-info')

/**
 * Report Node.js runtime information
 *
 * Surfaces the V8 heap size limit (which determines when large Quire
 * builds hit OOM errors) and environment variables that affect CLI
 * behavior: NODE_OPTIONS, shell, and locale.
 *
 * @returns {import('../../index.js').CheckResult}
 */
export function checkRuntimeInfo() {
  const heapStats = v8.getHeapStatistics()
  const heapLimitMB = Math.round(heapStats.heap_size_limit / 1024 / 1024)

  const platform = getPlatform()
  const shell = platform === Platform.WINDOWS
    ? process.env.COMSPEC || '(not set)'
    : process.env.SHELL || '(not set)'
  const nodeOptions = process.env.NODE_OPTIONS || '(not set)'
  const locale = process.env.LANG || process.env.LC_ALL || '(not set)'

  debug('Heap limit: %d MB, NODE_OPTIONS: %s, Shell: %s, Locale: %s', heapLimitMB, nodeOptions, shell, locale)

  const detailParts = [
    `NODE_OPTIONS: ${nodeOptions}`,
    `Shell: ${shell}`,
    `Locale: ${locale}`,
  ]

  return {
    ok: true,
    message: `Heap limit: ${heapLimitMB} MB`,
    details: detailParts.join(', '),
  }
}

export default checkRuntimeInfo
