#!/usr/bin/env -S node --no-warnings

import cli from '#src/main.js'
import config from '#src/lib/conf/config.js'
import packageConfig from '#root/package.json' assert { type: 'json' }
import updateNotifier from 'update-notifier'

process.removeAllListeners('warning')

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
