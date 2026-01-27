/**
 * Per-project build status persistence
 *
 * Records command outcomes (ok/failed) for build, pdf, and epub commands
 * so that `quire doctor` can distinguish "never ran" from "ran and failed"
 * when no output files exist on disk.
 *
 * Status is stored in the global CLI config keyed by a SHA-256 hash of
 * the project's absolute path to avoid dot-notation traversal issues.
 *
 * @module lib/conf/build-status
 */
import { createHash } from 'node:crypto'
import config from '#lib/conf/config.js'
import createDebug from '#debug'

const debug = createDebug('lib:conf:build-status')

/**
 * Commands whose status is tracked
 * @type {readonly string[]}
 */
export const TRACKED_COMMANDS = Object.freeze(['build', 'pdf', 'epub'])

/**
 * Derive a fixed-length, dot-safe config key from a project path
 *
 * @param {string} projectPath - Absolute path to the project directory
 * @returns {string} First 12 hex characters of the SHA-256 hash
 */
export function projectKey(projectPath) {
  return createHash('sha256').update(projectPath).digest('hex').slice(0, 12)
}

/**
 * Record the outcome of a command for a project
 *
 * @param {string} projectPath - Absolute path to the project directory
 * @param {string} command - Command name ('build', 'pdf', or 'epub')
 * @param {'ok'|'failed'} status - Outcome of the command
 */
export function recordStatus(projectPath, command, status) {
  if (!TRACKED_COMMANDS.includes(command)) {
    debug('ignoring untracked command: %s', command)
    return
  }

  const key = projectKey(projectPath)
  const buildStatus = config.get('buildStatus') || {}

  buildStatus[key] = {
    ...buildStatus[key],
    projectPath,
    [command]: {
      status,
      timestamp: Date.now(),
    },
  }

  config.set('buildStatus', buildStatus)
  debug('recorded %s=%s for %s (key=%s)', command, status, projectPath, key)
}

/**
 * Retrieve the stored status for a command in a project
 *
 * @param {string} projectPath - Absolute path to the project directory
 * @param {string} command - Command name ('build', 'pdf', or 'epub')
 * @returns {{ status: 'ok'|'failed', timestamp: number } | undefined}
 */
export function getStatus(projectPath, command) {
  const key = projectKey(projectPath)
  const buildStatus = config.get('buildStatus') || {}
  const entry = buildStatus[key]

  if (!entry) {
    debug('no status entry for key=%s', key)
    return undefined
  }

  return entry[command]
}

/**
 * Clear all stored status for a project
 *
 * @param {string} projectPath - Absolute path to the project directory
 */
export function clearStatus(projectPath) {
  const key = projectKey(projectPath)
  const buildStatus = config.get('buildStatus') || {}

  if (key in buildStatus) {
    delete buildStatus[key]
    config.set('buildStatus', buildStatus)
    debug('cleared status for %s (key=%s)', projectPath, key)
  }
}
