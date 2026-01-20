/**
 * ProcessManager - Centralized subprocess lifecycle management
 *
 * Provides graceful shutdown for CLI subprocesses (eleventy, pagedjs, prince).
 *
 * @example Register a cleanup handler
 * processManager.onShutdown('eleventy', () => eleventy.close())
 *
 * @example Use shared abort signal for execa
 * execa('prince', args, { cancelSignal: processManager.signal })
 *
 * @module lib/process/manager
 */

import { logger } from '#lib/logger/index.js'

const LOG_PREFIX = '[CLI:process]'

/**
 * Timeout for individual cleanup handlers (ms)
 */
const CLEANUP_TIMEOUT = 5000

/**
 * Cleanup handlers registry
 * @type {Map<string, Function>}
 */
const cleanupHandlers = new Map()

/**
 * Shared AbortController for subprocess cancellation
 */
const abortController = new AbortController()

/**
 * Flag to prevent multiple shutdown calls
 */
let isShuttingDown = false

/**
 * Wrap a cleanup function with a timeout
 * @param {Function} fn - Cleanup function
 * @param {string} name - Handler name for logging
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<void>}
 */
const withTimeout = (fn, name, timeout) => {
  return Promise.race([
    fn(),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`timeout after ${timeout}ms`)), timeout)
    ),
  ])
}

/**
 * Graceful shutdown - aborts subprocesses and runs cleanup handlers
 * @param {string} signal - SIGINT or SIGTERM
 */
const shutdown = async (signal) => {
  if (isShuttingDown) {
    // Second signal = force exit
    logger.info(`${LOG_PREFIX} force exit`)
    process.exit(1)
  }
  isShuttingDown = true

  logger.info(`\n${LOG_PREFIX} ${signal} received, shutting down...`)

  abortController.abort()

  for (const [name, cleanup] of cleanupHandlers) {
    try {
      logger.debug(`${LOG_PREFIX} cleanup: ${name}`)
      await withTimeout(cleanup, name, CLEANUP_TIMEOUT)
    } catch (error) {
      logger.warn(`${LOG_PREFIX} cleanup error (${name}): ${error.message}`)
    }
  }

  process.exit(signal === 'SIGINT' ? 130 : 143)
}

// Register signal handlers
process.on('SIGINT', () => shutdown('SIGINT'))
process.on('SIGTERM', () => shutdown('SIGTERM'))

export default {
  /**
   * Shared abort signal for execa subprocesses
   */
  signal: abortController.signal,

  /**
   * Register a cleanup handler
   * @param {string} name - Handler name (for logging)
   * @param {Function} fn - Cleanup function
   */
  onShutdown(name, fn) {
    cleanupHandlers.set(name, fn)
  },

  /**
   * Remove a cleanup handler (call when operation completes normally)
   * @param {string} name - Handler name
   */
  onShutdownComplete(name) {
    cleanupHandlers.delete(name)
  },
}
