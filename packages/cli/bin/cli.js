#!/usr/bin/env -S node --no-warnings
import config from '#src/lib/conf/config.js'
import packageConfig from '#src/packageConfig.js'
import updateNotifier from 'update-notifier'

// Import process manager to register signal handlers for graceful shutdown
import '#lib/process/manager.js'

process.removeAllListeners('warning')

/**
 * Set log level from config before importing CLI modules
 *
 * This env var is read by the logger at module creation time.
 * Setting it here ensures all loggers (including module-level ones)
 * use the configured level.
 *
 * @see lib/logger/index.js
 */
process.env.QUIRE_LOG_LEVEL = config.get('logLevel') || 'info'

/**
 * Set REDUCED_MOTION env var from config before importing CLI modules
 *
 * The reporter reads REDUCED_MOTION to decide whether to use animated
 * spinners or static text output. Setting it here ensures the reporter
 * picks up the config value at module load time.
 * If REDUCED_MOTION is already set in the shell environment, we do not override it.
 *
 * @see lib/reporter/index.js
 */
if (process.env.REDUCED_MOTION === undefined && config.get('reducedMotion') === true) {
  process.env.REDUCED_MOTION = '1'
}

/**
 * Dynamic import ensures env vars are set before logger modules are loaded
 */
const { default: cli } = await import('#src/main.js')

/**
 * Interval constants in milliseconds
 */
const INTERVAL = Object.freeze({
  MINUTE: 1000 * 60 * 1,
  HOURLY: 1000 * 60 * 60,
  DAILY: 1000 * 60 * 60 * 24,
  WEEKLY: 1000 * 60 * 60 * 24 * 7
})

const updateChannel = config.get('updateChannel')
const updateIterval = config.get('updateIterval')

/**
 * Create a notifier to Check for quire-cli updates
 * @see https://github.com/yeoman/update-notifier#usage
 *
 * @todo refactor to check multiple channels
 */
const notifier = updateNotifier({
  distTag: updateChannel,
  pkg: packageConfig,
  updateCheckInterval: INTERVAL[updateIterval],
})

notifier.notify({ defer: false })

/**
 * Run the cli program
 */
cli.parse()
