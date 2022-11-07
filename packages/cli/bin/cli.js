#!/usr/bin/env node --experimental-json-modules
import cli from '#src/main.js'
import packageConfig from '#root/package.json' assert { type: 'json' }
import updateNotifier from 'update-notifier'

const INTERVAL = Object.freeze({
  MINUTE: 1000 * 60,
  HOURLY: 1000 * 60 * 60,
  DAILY: 1000 * 60 * 60 * 24,
  WEEKLY: 1000 * 60 * 60 * 24 * 7
})

/**
 * Check for quire-cli updates
 * @see https://github.com/yeoman/update-notifier#usage
 */
const notifier = updateNotifier({
  distTag: 'latest',
  pkg: packageConfig,
  updateCheckInterval: INTERVAL.DAILY,
})

notifier.notify()

/**
 * Run the cli program
 */
cli.parse()
