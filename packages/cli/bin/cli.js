#!/usr/bin/env -S node --no-warnings
import config from '#src/lib/conf/config.js'
import packageConfig from '#src/packageConfig.js'
import updateNotifier from 'update-notifier'

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
 * Dynamic import ensures env var is set before logger modules are loaded
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
