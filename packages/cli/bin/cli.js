#!/usr/bin/env -S node --no-warnings

import cli from '#src/main.js'
import config from '#src/lib/config'
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

const { updateChannel, updateIterval } = config

/**
 * Create a notifier to Check for quire-cli updates
 * @see https://github.com/yeoman/update-notifier#usage
 */
const notifiers.push(updateNotifier({
  distTag: updateChannel || 'latest',
  pkg: packageConfig,
  updateCheckInterval: INTERVAL[updateIterval] || 'DAILY',
})

notifier.notify({ defer: false })

/**
 * Run the cli program
 */
cli.parse()
