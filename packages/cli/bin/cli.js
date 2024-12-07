#!/usr/bin/env -S node --no-warnings

import cli from '#src/main.js'
import packageConfig from '#root/package.json' with { type: 'json' }
import updateNotifier from 'update-notifier'

process.removeAllListeners('warning')

const INTERVAL = Object.freeze({
  MINUTES: 1000 * 60 * 1,
  HOURLY: 1000 * 60 * 60,
  DAILY: 1000 * 60 * 60 * 24,
  WEEKLY: 1000 * 60 * 60 * 24 * 7
})

/**
 * Check for quire-cli updates
 * @see https://github.com/yeoman/update-notifier#usage
 *
 * @todo user configuration of choosen update interval
 */
const notifier = updateNotifier({
  distTag: 'latest',
  pkg: packageConfig,
  updateCheckInterval: INTERVAL.DAILY,
})

notifier.notify({ defer: false })

/**
 * Run the cli program
 */
cli.parse()
